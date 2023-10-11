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
        let response: any[] = [];

        await checkSymptomElicitationFlags(session);
        if (session.flags.initial_flag) {
            agent.context.set({name: 'INITIAL', lifespan: 5});
            response = response.concat(await getChatResponse(module_name, ChatIntent.INITIAL_SYMPTOM_SET, session.language));
        } 

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    initial_symptom_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        console.log(agent.parameters);

        if (!agent.parameters.symptom) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.INITIAL_SYMPTOM_SET, session.language));
        } else {
            agent.context.set({name: 'INITIAL', lifespan: 0});
            triggerEvent(agent, ChatEvent.ELICITATION);
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },
};

export default module_functions;