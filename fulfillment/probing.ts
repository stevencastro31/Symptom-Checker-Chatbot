import cosinesim from 'compute-cosine-similarity';

// * Compute Similarity Scores & Return the Highest Candidate
function getDiseaseCandidate(session: any) {
    const user_vector: number[] = session.elicitation.vector;
    const WEIGHTS = session.disease_knowledge_base.weights;
    const similarity_scores: any = []
    WEIGHTS.forEach((disease: { name: string, vector: number[] }) => {
        similarity_scores.push(Number(cosinesim(user_vector, disease.vector)?.toFixed(4)));
    });

    const index = similarity_scores.indexOf(Math.max(...similarity_scores));
    return { name: WEIGHTS[index].name, score: similarity_scores[index], index: index };
};

// * Find the Next Symptom Candidate of a Disease or end w/ an impression
function probeNextSymptom(session: any) {
    const user_vector: number[] = session.elicitation.vector;
    const THRESHOLD = session.disease_knowledge_base.threshold;
    const WEIGHTS = session.disease_knowledge_base.weights;
    const SYMPTOMS = session.disease_knowledge_base.symptoms;

    const disease = getDiseaseCandidate(session);

    // Probe Symptom
    if (disease.score < THRESHOLD) {
        let candidate = null;
        let weight = 0.5;   // ! Inconsistent?
        let index = null;

        // * Get Unreported Symptom with the Highest Weight
        for (let i = 0; i < user_vector.length; i++) {
            if (user_vector[i] === 0 && weight < WEIGHTS[disease.index].vector[i]) {
                console.log(WEIGHTS[disease.index].name);
                candidate = SYMPTOMS[i];
                weight = WEIGHTS[disease.index].vector[i];
                index = i;
            }
        }

        if (candidate) { 
            return { action: 'probe', next: candidate, index: index, weight: weight, suspect: disease.name }; 
        }
    }

    // Impression
    return { action: 'impression', next: disease.name };
};

export { probeNextSymptom };