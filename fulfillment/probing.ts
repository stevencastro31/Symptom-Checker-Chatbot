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
    WEIGHTS.forEach((disease: { name: string, vector: number[] }) => {
        similarity_scores.push(cosinesim(user_vector, disease.vector));
    });

    const index = similarity_scores.indexOf(Math.max(...similarity_scores));
    return { name: WEIGHTS[index].name, score: similarity_scores[index], index: index };
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
        if (candidate) { return { action: 'probe', next: candidate, index: index, weight: weight, suspect: disease.name }; }
    }

    // Impression
    return { action: 'impression', next: disease.name };
};

// * Get the Next Action Based on Current Subject
function getNextAction(session: any) {
    // TODO: Define threshold (may be fetched from kb). Separated for easier access.
    const triage_symptoms_threshold = 5;

    let { end_flag, initial_symptom } = session.flags;
    let { current_associations, current_subject, current_properties, next_subject, symptoms } = session.elicitation;

    const threshold = triage_symptoms_threshold - (initial_symptom ? 1 : 0);

    // Format current symptoms
    const current_symptoms = symptoms.reduce((data: any, symptom: any) => {
        data[symptom.name] = symptom.property;
        return data;
    }, {});

    // const current_symptoms = symptoms.map((symptom: any) => symptom.name);
    const associations: string[] = current_associations;

    // TODO: Recall Symptoms from Previous Session
    // ? Separate Normal Symptoms Dialogue from Recall Symptoms Dialogue?
    if (session.previous_session) {
        for (const symptom of session.previous_session.symptoms) {
            // Push if the User Previously has the Symptom and Count Doesn't Exceed Threshold
            if (symptom.property.has && (symptoms.length + next_subject.length + 1 <= threshold)) {
                // TODO: Edit What Gets Pushed Here
                next_subject.push(symptom.name)
            }
        }
    }

    // * Check and Update Next Subject if Needed
    for (const association of associations) {
        if (!next_subject.includes(association) && !current_symptoms.hasOwnProperty(association)) {
            // Push if User has the Latest Symptom and Count Doesn't Exceed Threshold
            if (current_properties.has && (symptoms.length + next_subject.length + 1 <= threshold)) {

                next_subject.push(association);
            }
        }
    }

    // * Check if Threshold has been Reached
    if (Object.keys(current_symptoms).length + 1 >= threshold) {
        return { end_flag: true, next_subject: next_subject.slice(0, 2) };
    }

    // * Return Next Action
    return { end_flag, next_subject };
}
export { probeNextSymptom, getNextAction };

