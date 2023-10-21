import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { ChatEvent } from "enums/event";
import { getChatReply, getChatResponse, getSymptomKnowledge, updateField } from "@libs/database";
import { checkSymptomElicitationFlags, fullfilmentRequest, fullfilmentResponse, triggerEvent } from "./chatbot_functions";
import { ChatContext } from "enums/context";
import { ChatQuickReply } from "enums/quick_reply";

const module_name = ChatModule.SYMPTOM_ELICITATION;
const module_functions = {
    elicitation: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        await symptom_elicitation_flow(agent, session);
    },

    initial_symptom_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        if (!agent.parameters.symptom) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.INITIAL_SYMPTOM_SET, session.language));
        } else {
            agent.context.set({name: 'INITIAL', lifespan: 0});
            session.flags.initial_flag = false;
            session.elicitation.next_subject = agent.parameters.symptom;

            triggerEvent(agent, ChatEvent.ELICITATION);
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    has_symptom_yes: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.has = true;
        agent.context.set({name: ChatContext.HAS, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    has_symptom_no: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.has = false;
        session.elicitation.current_questions = [];
        agent.context.set({name: ChatContext.HAS, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    duration_generic_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        session.elicitation.current_properties.duration_generic = agent.parameters.duration_generic;
        agent.context.set({name: ChatContext.DURATION, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    duration_explicit_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.duration_explicit = agent.parameters.sys_duration;
        agent.context.set({name: ChatContext.DURATION, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    weight_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.weight = agent.parameters.sys_unit_weight;
        agent.context.set({name: ChatContext.WEIGHT, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    temperature_body_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.temperature_body = agent.parameters.sys_temperature;
        agent.context.set({name: ChatContext.TEMPERATURE, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    frequency_adverbs_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.frequency_adverbs = agent.parameters.frequency_adverbs;
        agent.context.set({name: ChatContext.FREQUENCY, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    frequency_explicit_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.frequency_explicit = agent.parameters.sys_duration   ;
        agent.context.set({name: ChatContext.FREQUENCY, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    pain_adjectives_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.pain_adjectives = agent.parameters.pain_adjectives;
        agent.context.set({name: ChatContext.PAIN, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    pain_intensity_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.pain_intensity = agent.parameters.intensity;
        agent.context.set({name: ChatContext.PAIN, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    weakness_intensity_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.weakness_intensity = agent.parameters.intensity;
        agent.context.set({name: ChatContext.WEAKNESS, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    location_eyes_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.location_eyes = agent.parameters.location_eyes;
        agent.context.set({name: ChatContext.EYES, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    }, 

    location_body_locale_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.location_body_locale = agent.parameters.location_body_locale;
        agent.context.set({name: ChatContext.LOCALE, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    location_body_region_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.location_body_region = agent.parameters.location_body_region;
        agent.context.set({name: ChatContext.REGION, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    color_phlegm_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.color_phlegm = agent.parameters.color_phlegm;
        agent.context.set({name: ChatContext.COLOR, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    difficulty_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.difficulty = agent.parameters.difficulty;
        agent.context.set({name: ChatContext.DIFFICULTY, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    moisture_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.moisture = agent.parameters.moisture;
        // Remove Phlegm Follow-up
        if (agent.parameters.moisture === 'dry') { session.elicitation.current_questions.shift(); }
        agent.context.set({name: ChatContext.MOISTURE, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    physical_state_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.physical_state = agent.parameters.physical_state;
        agent.context.set({name: ChatContext.PHYSICAL, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    count_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.count = agent.parameters.sys_number;
        agent.context.set({name: ChatContext.COUNT, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    inteference_yes: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.inteference = true;
        agent.context.set({name: ChatContext.INTERFERENCE, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    inteference_no: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.inteference = false;
        agent.context.set({name: ChatContext.INTERFERENCE, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    parts_day_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.parts_day = agent.parameters.parts_day;
        agent.context.set({name: ChatContext.PARTS, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    heartrate_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.heartrate = agent.parameters.heartrate;
        agent.context.set({name: ChatContext.HEARTRATE, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    blood_pressure_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.blood_pressure = agent.parameters.blood_pressure;
        agent.context.set({name: ChatContext.PRESSURE, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    trigger_activity_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.trigger_activity = agent.parameters.trigger_activity;
        agent.context.set({name: ChatContext.TRIGGER, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    trigger_state_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.trigger_state = agent.parameters.trigger_state;
        agent.context.set({name: ChatContext.TRIGGER, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    trigger_food_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.trigger_food = agent.parameters.trigger_food;
        agent.context.set({name: ChatContext.TRIGGER, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    change_quantity_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.change_quantity = agent.parameters.change_quantity;

        if (session.elicitation.current_properties.change_quantity === 'none') { session.elicitation.current_questions = []; }
        agent.context.set({name: ChatContext.CHANGE, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    cardiovascular_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.cardiovascular = agent.parameters.cardiovascular;
        agent.context.set({name: ChatContext.CARDIOVASCULAR, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },

    respiratory_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.respiratory = agent.parameters.respiratory;
        agent.context.set({name: ChatContext.RESPIRATORY, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },    

    visibility_set: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.visibility = agent.parameters.visibility;
        agent.context.set({name: ChatContext.VISIBILITY, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },   

    pain_killers_yes: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.pain_killers = true;
        agent.context.set({name: ChatContext.PAINKILLERS, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },   

    pain_killers_no: async (agent: any) => {
        const session = await fullfilmentRequest(agent);

        session.elicitation.current_properties.pain_killers = false;
        agent.context.set({name: ChatContext.PAINKILLERS, lifespan: 0});
        triggerEvent(agent, ChatEvent.ELICITATION);

        // Fullfilment Response
        fullfilmentResponse(agent, [], session);
    },
};


async function symptom_elicitation_flow(agent: any, session: any) {
    // Fullfilment Request
    let response: any[] = [];

    await checkSymptomElicitationFlags(session);
    if (session.flags.initial_flag) {
        agent.context.set({name: 'INITIAL', lifespan: 5});
        response = response.concat(await getChatResponse(ChatModule.GENERAL_QUESTIONS, ChatIntent.INITIAL_SYMPTOM_SET, session.language));
        let quick_replies = await getChatReply(ChatQuickReply.INITIAL, session.language);
        if (quick_replies) { response = response.concat({quickReplies: quick_replies}); }
    } 

    else if (session.flags.end_probing_flag) {
        // Final Symptom
        session.elicitation.symptoms.push({name: session.elicitation.current_subject, property: session.elicitation.current_properties});
        session.elicitation.current_properties = {};
        session.elicitation.current_subject = null;

        console.log(session.elicitation.symptoms);
        agent.add('DOING TRIAGE STUFF!');

        // TODO: TRIAGE COMPUTATION

        let totalTriageLevel: number = 0;


        
       
        console.log(totalTriageLevel);
    
        
    if (totalTriageLevel <= 10) agent.add(`The patient should seek medical attention as they are in the Low Level category based on the symptoms and severity they've reported.`);
    else if (totalTriageLevel <= 20) agent.add(`The patient should seek medical attention as they are in the Medium Urgency category based on the symptoms and severity they've reported.`);
    else if (totalTriageLevel <= 30) agent.add(`The patient should seek medical attention as they are in the High Urgency category based on the symptoms and severity they've reported.`);
        else return agent.add(`The patient should seek medical attention as they are in the Critical Urgency category based on the symptoms and severity they've reported.`);
        
    

        // TODO: SAVE SESSION?
    } 
    
    else {
        if (session.flags.get_knowledge_flag) {
            // * Save Symptom to Session
            if (session.elicitation.current_subject) {
                session.elicitation.symptoms.push({name: session.elicitation.current_subject, property: session.elicitation.current_properties});
                session.elicitation.current_properties = {};
                console.log(session.elicitation.symptoms);
            }

            // * Fetch Symptom Knowledge Base
            const knowledge: any = await getSymptomKnowledge(session.elicitation.next_subject);
            session.elicitation.current_subject = session.elicitation.next_subject;
            session.elicitation.next_subject = null;
            session.elicitation.current_questions = knowledge.questions;    
            session.elicitation.current_properties = {};
            session.elicitation.next_subject = knowledge.next ?? null;
        }

        if (0 < session.elicitation.current_questions.length) {
            // * Ask Property Questions
            const question_type = session.elicitation.current_questions.shift();
            agent.context.set({name: getPropertyContext(question_type), lifespan: 5});
            const property_questions: any = await getChatResponse(module_name, session.elicitation.current_subject, session.language);
            response = response.concat(property_questions[question_type]);

            // * Add Quick Reply if Available
            let quick_replies = await getChatReply(question_type, session.language);
            if (quick_replies) { response = response.concat({quickReplies: quick_replies}); }
        } 
        
        else {
            session.elicitation.symptoms.push({name: session.elicitation.current_subject, property: session.elicitation.current_properties});
            session.elicitation.current_properties = {};

            triggerEvent(agent, ChatEvent.ELICITATION);
        }
    }

    // Fullfilment Response
    fullfilmentResponse(agent, response, session);
};

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
        intervention: ChatContext.INTERFERENCE,
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
        weight: ChatContext.WEIGHT,
    };
    return map[property] ?? 'error';
};

export default module_functions;