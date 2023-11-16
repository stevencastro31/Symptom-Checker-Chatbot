import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { ChatEvent } from "enums/event";
import { getChatReply, getChatResponse, getSymptomKnowledge } from "@libs/database";
import { checkSymptomElicitationFlags, fullfilmentRequest, fullfilmentResponse, say, triggerEvent } from "./chatbot_functions";
import { ChatContext } from "enums/context";
import { ChatQuickReply } from "enums/quick_reply";
import { probeNextSymptom } from "./probing";

const module_name = ChatModule.SYMPTOM_ELICITATION;
const module_functions = {
    elicitation: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        await symptom_elicitation_flow(agent, response, session);

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    initial_symptom_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        if (!agent.parameters.symptom) {
            say(response, await getChatResponse(module_name, ChatIntent.INITIAL_SYMPTOM_SET, session.language));

            const quick_reply = await getChatReply(ChatQuickReply.INITIAL, session.language);
            if (quick_reply) { response.push({quickReplies: quick_reply}); }
        } 
        
        else {
            agent.context.set({name: 'INITIAL', lifespan: 0});

            session.flags.initial_flag = false;
            session.flags.initial_symptom = true;
            session.elicitation.next_subject.push(agent.parameters.symptom);

            await symptom_elicitation_flow(agent, response, session);
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    has_symptom_yes: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['has'] = true;
            agent.context.set({name: ChatContext.HAS, lifespan: 0});
        });
    },

    has_symptom_no: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['has'] = false;
            session.elicitation.current_questions = [];
            agent.context.set({name: ChatContext.HAS, lifespan: 0});
        });
    },

    duration_generic_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['duration_generic'] = agent.parameters.duration_generic;
            agent.context.set({name: ChatContext.DURATION, lifespan: 0});
        });
    },

    duration_explicit_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['duration_explicit'] = agent.parameters.sys_duration;
            agent.context.set({name: ChatContext.DURATION, lifespan: 0});
        });
    },

    weight_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['weight'] = agent.parameters.sys_unit_weight;
            agent.context.set({name: ChatContext.WEIGHT, lifespan: 0});
        });
    },

    temperature_body_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['temperature_body'] = agent.parameters.sys_temperature;
            agent.context.set({name: ChatContext.TEMPERATURE, lifespan: 0});
        });
    },

    frequency_adverbs_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['frequency_adverbs'] = agent.parameters.frequency_adverbs;
            agent.context.set({name: ChatContext.FREQUENCY, lifespan: 0});
        });
    },

    frequency_explicit_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['frequency_explicit'] = agent.parameters.sys_duration   ;
            agent.context.set({name: ChatContext.FREQUENCY, lifespan: 0});
        });
    },

    pain_adjectives_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['pain_adjectives'] = agent.parameters.pain_adjectives;
            agent.context.set({name: ChatContext.PAIN, lifespan: 0});
        });
    },

    pain_intensity_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['pain_intensity'] = agent.parameters.intensity;
            agent.context.set({name: ChatContext.PAIN, lifespan: 0});
        });
    },

    weakness_intensity_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['weakness_intensity'] = agent.parameters.intensity;
            agent.context.set({name: ChatContext.WEAKNESS, lifespan: 0});
        });
    },

    location_eyes_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['location_eyes'] = agent.parameters.location_eyes;
            agent.context.set({name: ChatContext.EYES, lifespan: 0});
        });
    }, 

    location_body_locale_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['location_body_locale'] = agent.parameters.location_body_locale;
            agent.context.set({name: ChatContext.LOCALE, lifespan: 0});
        });        
    },

    location_body_region_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['location_body_region'] = agent.parameters.location_body_region;
            agent.context.set({name: ChatContext.REGION, lifespan: 0});
        });        
    },

    color_phlegm_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['color_phlegm'] = agent.parameters.color_phlegm;
            agent.context.set({name: ChatContext.COLOR, lifespan: 0});
        }); 
    },

    difficulty_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['difficulty'] = agent.parameters.difficulty;
            agent.context.set({name: ChatContext.DIFFICULTY, lifespan: 0});
        }); 
    },

    moisture_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['moisture'] = agent.parameters.moisture;
            if (agent.parameters.moisture === 'dry') { session.elicitation.current_questions.shift(); } // Skip Phlegm
            agent.context.set({name: ChatContext.MOISTURE, lifespan: 0});
        });
    },

    physical_state_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['physical_state'] = agent.parameters.physical_state;
            agent.context.set({name: ChatContext.PHYSICAL, lifespan: 0});
        });
    },

    count_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['count'] = agent.parameters.sys_number;
            agent.context.set({name: ChatContext.COUNT, lifespan: 0});
        });
    },

    inteference_yes: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['inteference'] = true;
            agent.context.set({name: ChatContext.INTERFERENCE, lifespan: 0});
        });
    },

    inteference_no: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['inteference'] = false;
            agent.context.set({name: ChatContext.INTERFERENCE, lifespan: 0});
        });
    },

    parts_day_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['parts_day'] = agent.parameters.parts_day;
            agent.context.set({name: ChatContext.PARTS, lifespan: 0});
        });
    },

    heartrate_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['heartrate'] = agent.parameters.heartrate;
            agent.context.set({name: ChatContext.HEARTRATE, lifespan: 0});
        });
    },

    blood_pressure_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['blood_pressure'] = agent.parameters.blood_pressure;
            agent.context.set({name: ChatContext.PRESSURE, lifespan: 0});
        });
    },

    trigger_activity_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['trigger_activity'] = agent.parameters.trigger_activity;
            agent.context.set({name: ChatContext.TRIGGER, lifespan: 0});
        });
    },

    trigger_state_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['trigger_state'] = agent.parameters.trigger_state;
            agent.context.set({name: ChatContext.TRIGGER, lifespan: 0})
        });
    },

    trigger_food_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['trigger_food'] = agent.parameters.trigger_food;
            agent.context.set({name: ChatContext.TRIGGER, lifespan: 0});
        });
    },

    change_quantity_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['change_quantity'] = agent.parameters.change_quantity;
            if (session.elicitation.current_properties.change_quantity === 'none') { session.elicitation.current_questions = []; }
            agent.context.set({name: ChatContext.CHANGE, lifespan: 0});
        });
    },

    cardiovascular_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['cardiovascular'] = agent.parameters.cardiovascular;
            agent.context.set({name: ChatContext.CARDIOVASCULAR, lifespan: 0});
        });
    },

    respiratory_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['respiratory'] = agent.parameters.respiratory;
            agent.context.set({name: ChatContext.RESPIRATORY, lifespan: 0});
        });
    },    

    visibility_set: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['visibility'] = agent.parameters.visibility;
            agent.context.set({name: ChatContext.VISIBILITY, lifespan: 0});
        });
    },   

    pain_killers_yes: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['pain_killers'] = true;
            agent.context.set({name: ChatContext.PAINKILLERS, lifespan: 0});
        });
    },   

    pain_killers_no: async (agent: any) => {
        await property_intent_flow(agent, (agent: any, session: any) => {
            session.elicitation.current_properties['pain_killers'] = false;
            agent.context.set({name: ChatContext.PAINKILLERS, lifespan: 0});
        });
    },

    fallback: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        // Fallback Response
        const property_type = agent.action.replace('fallback_', '');
        const fallback_responses: any = await getChatResponse(module_name, ChatIntent.FALLBACK_SYMPTOM, session.language);
        say(response, fallback_responses[property_type] ?? ['Missing Fallback Respones :<']);

        let quick_reply = await getChatReply(property_type, session.language);
        if (quick_reply) { response.push({quickReplies: quick_reply}); }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },
};

// * Main Flow of the Symptom Elicitation Phase.
async function symptom_elicitation_flow(agent: any, response: any[], session: any) {
    // * Check Flags
    await checkSymptomElicitationFlags(session);
    // * Recall Action
    if (session.flags.recall_flag) {
        // Compare Previous Session Time to Current Time
        const previous_date = new Date(session.previous_session.timestamp._seconds * 1000);
        const current_date = new Date();
        const difference_in_hours = Math.round((current_date.getTime() - previous_date.getTime()) / (1000 * 3600));
        const threshold = 24; // ! Current Threshold is 24 Hours

        // if (difference_in_hours > threshold) {
        if (true) { // ! Only for Testing
            // Save Previous Symptoms the User had to Next Subject Array
            for (const symptom in session.previous_session.symptoms) {
                if (session.previous_session.symptoms[symptom].has) {
                    session.elicitation.next_subject.push(symptom);
                    session.elicitation.previous_weights[symptom] = session.previous_session.symptoms[symptom].impression_weight;
                }
            }

            // Skip Initial Symptom and Get Symptom Knowledge
            if (session.elicitation.next_subject.length) { 
                session.flags.initial_flag = false;
            }
        }
    }

    // * Initial Symptom Dialogue Action
    if (session.flags.initial_flag) {
        agent.context.set({name: 'INITIAL', lifespan: 5});
        say(response, await getChatResponse(ChatModule.GENERAL_QUESTIONS, ChatIntent.INITIAL_SYMPTOM_SET, session.language));
        
        const quick_reply = await getChatReply(ChatQuickReply.INITIAL, session.language);
        if (quick_reply) { response.push({quickReplies: quick_reply}); }
        return;
    } 

    // * Fetch Knowledge Base for Initial Symptom Set
    if (session.flags.get_knowledge_flag && !session.flags.initial_fetch_completed) {
        await fetchKnowledgeBase(session);
        session.flags.initial_fetch_completed = true;
        session.flags.recall_ended = true;
    }

    // * Fetch Knowledge Base for Initial Recall
    if (session.flags.recall_flag) {
        await fetchKnowledgeBase(session);
        session.flags.initial_fetch_completed = true;
        session.flags.recall_flag = false;
    }
    
    // * Symptom Elicitation Dialogue Action | Asks Property Questions w/ Quick Reply if Available
    if (0 < session.elicitation.current_questions.length) {
        const question_type = session.elicitation.current_questions.shift();
        agent.context.set({name: getPropertyContext(question_type), lifespan: 5});

        const property_questions: any = await getChatResponse(module_name, session.elicitation.current_subject, session.language);
        say(response, property_questions[question_type]);

        let quick_reply = await getChatReply(question_type, session.language);
        if (quick_reply) { response.push({quickReplies: quick_reply}); }
        return;
    } 
    
    else {
        // Prepare Index and Weight for Impression Probing
        let vector_index = session.elicitation.index ?? session.disease_knowledge_base.symptoms.indexOf(session.elicitation.current_subject);
        let symptom_weight = (!session.flags.recall_ended) ? session.elicitation.previous_weights[session.elicitation.current_subject] : (session.elicitation.weight ?? 1);
        symptom_weight = (session.elicitation.current_properties.has) ? symptom_weight : -1;            
        session.elicitation.vector[vector_index] = symptom_weight;

        // Log Symptom
        session.elicitation.symptoms[session.elicitation.current_subject] = session.elicitation.current_properties;
        session.elicitation.symptoms[session.elicitation.current_subject].impression_weight = symptom_weight;
        console.log('Logging', session.elicitation.symptoms);

        if (!session.elicitation.next_subject.length && !session.flags.recall_ended) { session.flags.recall_ended = true; }

        // Probe Next Symptom
        if (session.flags.recall_ended) {
            const { action, next, index, weight } = probeNextSymptom(session);
            session.elicitation.index = index;
            session.elicitation.weight = weight;

            // Set Flags & Reset
            const triage_threshold_reached = (Object.keys(session.elicitation.symptoms).length + 1) > 10; // ! Current Triage Threshold is 10
            session.flags.assessment_flag = action === 'impression' && triage_threshold_reached;
            session.elicitation.current_properties = {};
    
            if (!session.flags.assessment_flag) {
                // Handle Associations
                for (const association of session.elicitation.current_associations) {
                    if (session.elicitation.next_subject.includes(association)) continue;
                    if (session.elicitation.symptoms.hasOwnProperty(association)) continue;
                    if (!session.elicitation.symptoms[session.elicitation.current_subject].has) continue;
                    if (triage_threshold_reached) continue;
                    session.elicitation.next_subject.push(association);
                }

                // Place the Probed Symptom to the Start of the Array
                if (action !== 'impression') {
                    const misplaced_subject = session.elicitation.next_subject.indexOf(next);
                    if (misplaced_subject !== -1) { session.elicitation.next_subject.splice(misplaced_subject, 1) }
                    session.elicitation.next_subject.unshift(next);
                }
            }
            // Save Impression to Session
            if (action === 'impression') {
                if (!session.elicitation.next_subject.length) { session.flags.assessment_flag = true; }
                if (!session.elicitation.impression) { session.elicitation.impression = next; }
            }
        }
    }    

    // * Transition to Assessment Phase
    if (session.flags.assessment_flag) {
        triggerEvent(agent, ChatEvent.ASSESSMENT);
        return;
    } 

    await fetchKnowledgeBase(session);
    await symptom_elicitation_flow(agent, response, session);
};

// * Repetitive Property Intent Flow (manages extraction of input)
async function property_intent_flow(agent: any, operation: (response: any, session: any) => any) {
    // Fullfilment Request
    const session = await fullfilmentRequest(agent);
    let response: any[] = [];

    // Flows
    operation(agent, session);
    await symptom_elicitation_flow(agent, response, session);

    // Fullfilment Response
    fullfilmentResponse(agent, response, session);
}

// * Fetch symptom properties from knowledge base
async function fetchKnowledgeBase(session: any) {
    const new_subject = session.elicitation.next_subject.shift();
    if (new_subject) {
        const knowledge: any = await getSymptomKnowledge(new_subject);
        session.elicitation.current_associations = knowledge.associations;
        session.elicitation.current_subject = new_subject;
        session.elicitation.current_questions = knowledge.questions;    
        session.elicitation.current_properties = {};
    }

    // * Skips Initial Symptom Has Property
    if (session.flags.initial_symptom) {
        if (session.elicitation.current_questions[0] === 'has') {
            session.elicitation.current_questions.shift();
            session.elicitation.current_properties.has = true;
            session.elicitation.vector[session.disease_knowledge_base.symptoms.indexOf(new_subject)] = 1; 
            session.flags.initial_symptom = false;
        }
    }
};

// * Gives mapping of symptom property to a context for flow control.
function getPropertyContext(property: string) {
    const map: any = {
        blood_pressure: ChatContext.PRESSURE,
        cardiovascular: ChatContext.CARDIOVASCULAR,
        change_quantity: ChatContext.CHANGE,
        color_phlegm: ChatContext.COLOR,
        count: ChatContext.COUNT,
        difficulty: ChatContext.DIFFICULTY,
        duration_explicit: ChatContext.DURATION,
        duration_generic: ChatContext.DURATION,
        frequency_adverbs: ChatContext.FREQUENCY,
        frequency_explicit: ChatContext.FREQUENCY,
        has: ChatContext.HAS,
        heartrate: ChatContext.HEARTRATE,
        interference: ChatContext.INTERFERENCE,
        location_body_locale: ChatContext.LOCALE,
        location_body_region: ChatContext.REGION,
        location_eyes: ChatContext.EYES,
        moisture: ChatContext.MOISTURE,
        pain_adjectives: ChatContext.PAIN,
        pain_intensity: ChatContext.PAIN,
        parts_day: ChatContext.PARTS,
        physical_state: ChatContext.PHYSICAL,
        respiratory: ChatContext.RESPIRATORY,
        temperature_body: ChatContext.TEMPERATURE,
        trigger_activity: ChatContext.TRIGGER,
        trigger_food: ChatContext.TRIGGER,
        trigger_state: ChatContext.TRIGGER,
        weakness_intensity: ChatContext.WEAKNESS,
        visibility: ChatContext.VISIBILITY,
        pain_killers: ChatContext.PAINKILLERS,
        weight: ChatContext.WEIGHT,
    };
    return map[property] ?? 'error';
};

export default module_functions;