import cosinesim from 'compute-cosine-similarity';

// TODO: Fetch this Data from DB/KB
const disease_knowledge_base: any = {
	threshold: 0.75,
	weights: [
		{
			name: 'asthma',
			vector: [2, 2, 0, 1, 2],
		},
		{
			name: 'hypertension',
			vector: [0, 3, 2, 1, 2],
		},
	],
    symptoms: ['fever', 'cough', 'headache', 'anosmia', 'fatigue'],
}

const THRESHOLD = disease_knowledge_base.threshold;
const WEIGHTS = disease_knowledge_base.weights;
const SYMPTOMS = disease_knowledge_base.symptoms


// * Compute Similarity Scores & Return the Highest Candidate
function getDiseaseCandidate(user_vector: number[]) {
    const similarity_scores: any = []
    WEIGHTS.forEach((disease: {name: string, vector: number[]}) => {
        similarity_scores.push(cosinesim(user_vector, disease.vector));
    });

    const index = similarity_scores.indexOf(Math.max(...similarity_scores));
    return {name: WEIGHTS[index].name, score: similarity_scores[index], index: index};
};

// * Find the Next Symptom Candidate of a Disease or end w/ an impression
function probeNextSymptom(user_vector: number[]) {
    const disease = getDiseaseCandidate(user_vector);

    // Probe Symptom
    if (disease.score < THRESHOLD) {
        let candidate = null;
        let weight = 0.5;   // ! Inconsistent?
        let index = null;
        
        // * Get Unreported Symptom with the Highest Weight
        for (let i = 0; i < user_vector.length; i++) {
            if (user_vector[i] === 0 && weight < WEIGHTS[disease.index].vector[i]) {
                candidate = SYMPTOMS[i];
                weight = WEIGHTS[disease.index].vector[i];
                index = i;
            }
        }
        if (candidate) { return {action: 'probe', next: candidate, index: index, weight: weight, suspect: disease.name}; }
    }

    // Impression
    return {action: 'impression', next: disease.name};
};

export { probeNextSymptom } ;

