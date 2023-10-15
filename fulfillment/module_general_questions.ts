import { getChatReply, getChatResponse, updateField } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { checkGeneralQuestionFlags, fullfilmentRequest, fullfilmentResponse, triggerEvent } from "./chatbot_functions";
import { ChatEvent } from "enums/event";
import { ChatQuickReply } from "enums/quick_reply";

const module_name = ChatModule.GENERAL_QUESTIONS;
const module_functions = {
    general: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        await general_questions_flow(agent, session);
    },

    name_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        if (!agent.parameters.sys_any) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.NAME_SET, session.language));
        }

        else {
            await updateField(session.userid, {[`general.name`]: agent.parameters.sys_any});
            session.name = agent.parameters.sys_any;

            agent.context.set({name: 'NAME', lifespan: 0});
            triggerEvent(agent, ChatEvent.GENERAL);
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    age_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        if (!agent.parameters.sys_age) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.AGE_SET, session.language));
        } 
        
        else {
            await updateField(session.userid, {[`general.age`]: agent.parameters.sys_age});
            session.age = agent.parameters.sys_age;

            agent.context.set({name: 'AGE', lifespan: 0});
            triggerEvent(agent, ChatEvent.GENERAL);
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    sex_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        if (!agent.parameters.sex) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.SEX_SET, session.language));
            response = response.concat({quickReplies: await getChatReply(ChatQuickReply.SEX, session.language)});
        } 

        else {
            await updateField(session.userid, {[`general.sex`]: agent.parameters.sex});
            session.sex = agent.parameters.sex;

            agent.context.set({name: 'SEX', lifespan: 0});
            triggerEvent(agent, ChatEvent.GENERAL);
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },
};

// * Module Flow
async function general_questions_flow(agent: any, session: any) {
    // Fullfilment Request
    let response: any[] = [];

    await checkGeneralQuestionFlags(session);
    if (session.flags.name_flag) {
        agent.context.set({name: 'NAME', lifespan: 5});
        response = response.concat(await getChatResponse(module_name, ChatIntent.NAME_SET, session.language));
    } 

    else if (session.flags.age_flag) {
        agent.context.set({name: 'AGE', lifespan: 5});
        response = response.concat(await getChatResponse(module_name, ChatIntent.AGE_SET, session.language));
    }

    else if (session.flags.sex_flag) {
        agent.context.set({name: 'SEX', lifespan: 5});
        response = response.concat(await getChatResponse(module_name, ChatIntent.SEX_SET, session.language));
        response = response.concat({quickReplies: await getChatReply(ChatQuickReply.SEX, session.language)});
    }

    else {
        triggerEvent(agent, ChatEvent.ELICITATION);
    }

    // Fullfilment Response
    fullfilmentResponse(agent, response, session);
};

export default module_functions;

