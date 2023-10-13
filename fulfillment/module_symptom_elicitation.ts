import { getChatResponse, updateField } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { checkSymptomElicitationFlags, fullfilmentRequest, fullfilmentResponse, triggerEvent } from "./chatbot_functions";
import { ChatEvent } from "enums/event";

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

            // TODO: STORE INITIAL AND START PROBING

            triggerEvent(agent, ChatEvent.ELICITATION);
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    has_symptom_yes: async (agent: any) => {
        agent.add('X');
    },

    has_symptom_no: async (agent: any) => {
        agent.add('X');
    },

    duration_generic_set: async (agent: any) => {
        agent.add('X');
    },

    duration_explicit_set: async (agent: any) => {
        agent.add('X');
    },

    weight_set: async (agent: any) => {
        agent.add('X');
    },

    temperature_body_set: async (agent: any) => {
        agent.add('X');
    },

    frequency_adverbs_set: async (agent: any) => {
        agent.add('X');
    },

    frequency_explicit_set: async (agent: any) => {
        agent.add('X');
    },

    pain_adjectives_set: async (agent: any) => {
        agent.add('X');
    },

    pain_intensity_set: async (agent: any) => {
        agent.add('X');
    },

    weakness_intensity_set: async (agent: any) => {
        agent.add('X');
    },

    location_eyes_set: async (agent: any) => {
        agent.add('X');
    }, 

    location_body_locale_set: async (agent: any) => {
        agent.add('X');
    },

    location_body_region_set: async (agent: any) => {
        agent.add('X');
    },

    color_phlegm_set: async (agent: any) => {
        agent.add('X');
    },

    difficulty_set: async (agent: any) => {
        agent.add('X');
    },

    moisture_set: async (agent: any) => {
        agent.add('X');
    },

    physical_state_set: async (agent: any) => {
        agent.add('X');
    },

    count_set: async (agent: any) => {
        agent.add('X');
    },

    inteference_yes: async (agent: any) => {
        agent.add('X');
    },

    inteference_no: async (agent: any) => {
        agent.add('X');
    },

    parts_day_set: async (agent: any) => {
        agent.add('X');
    },

};

async function symptom_elicitation_flow(agent: any, session: any) {
    // Fullfilment Request
    let response: any[] = [];

    await checkSymptomElicitationFlags(session);
    if (session.flags.initial_flag) {
        agent.context.set({name: 'INITIAL', lifespan: 5});
        response = response.concat(await getChatResponse(module_name, ChatIntent.INITIAL_SYMPTOM_SET, session.language));
    } else {
        // TODO: PROBING ALGO ETC

        // TODO: FETCH DB
    }

    // Fullfilment Response
    fullfilmentResponse(agent, response, session);
};

export default module_functions;