import { getChatReply, getChatResponse, updateField } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { checkIntroductionFlags, fullfilmentRequest, fullfilmentResponse, triggerEvent } from "./chatbot_functions";
import { ChatEvent } from "enums/event";
import { ChatQuickReply } from "enums/quick_reply";

const module_name = ChatModule.INTRODUCTION;
const module_functions = {
    greeting: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        await introduction_flow(agent, session);
    },

    checkup: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        session.flags.checkup_flag = true;

        await introduction_flow(agent, session);
    },

    privacy_policy_yes: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];
        
        await updateField(session.userid, {['settings.privacy_policy']: true})
        session.privacy_policy = true;
        session.flags.privacy_policy_flag = false;
        
        agent.context.set({name: 'PRIVACY_POLICY', lifespan: 0});
        response = response.concat(await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY_YES, session.language));

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
        triggerEvent(agent, ChatEvent.GREETING);
    },

    privacy_policy_no: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];
        
        await updateField(session.userid, {['settings.privacy_policy']: false})
        session.privacy_policy = true;
        session.flags.privacy_policy_flag = false;

        agent.context.set({name: 'PRIVACY_POLICY', lifespan: 0});
        response = response.concat(await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY_NO, session.language));

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    language_set: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        if (!agent.parameters.language) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language));
            response = response.concat({quickReplies: await getChatReply(ChatQuickReply.LANGUAGE, session.language)});
        } 
        
        else {
            await updateField(session.userid, {['settings.language']: agent.parameters.language});
            session.language = agent.parameters.language;
            session.flags.language_flag = false;

            agent.context.set({name: 'LANGUAGE', lifespan: 0});
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
        triggerEvent(agent, ChatEvent.GREETING);
    },

    language_change: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        if (agent.parameters.language) {
            await updateField(session.userid, {['settings.language']: agent.parameters.language});
            session.language = agent.parameters.language;

            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_CHANGE_SUCCESS, session.language));
            agent.context.set({name: 'LANGUAGE', lifespan: 0});
        } 
        
        else {
            agent.context.set({name: 'LANGUAGE', lifespan: 5});
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_CHANGE, session.language));
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language));
            response = response.concat({quickReplies: await getChatReply(ChatQuickReply.LANGUAGE, session.language)});
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },
};

// * Module Flow
async function introduction_flow(agent: any, session: any) {
    // Fullfilment Request
    let response: any[] = [];

    // Initial Greeting
    if (session.flags.start_flag) { 
        response = response.concat(await getChatResponse(module_name, ChatIntent.GREETING, session.language));
        session.flags.start_flag = false;  
    }

    // Check Flags
    await checkIntroductionFlags(session);
    if (session.flags.language_flag) {
        agent.context.set({name: 'LANGUAGE', lifespan: 5});
        response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language));
        response = response.concat({quickReplies: await getChatReply(ChatQuickReply.LANGUAGE, session.language)});
    }

    else if (session.flags.privacy_policy_flag) {
        agent.context.set({name: 'PRIVACY_POLICY', lifespan: 5});
        response = response.concat(await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY, session.language));
        response = response.concat({quickReplies: await getChatReply(ChatQuickReply.PRIVACY_POLICY, session.language)});
    }

    else if (session.flags.checkup_flag) {
        triggerEvent(agent, ChatEvent.GENERAL);
    }

    else {
        response = response.concat(await getChatResponse(module_name, ChatIntent.HELP, session.language));
    }

    // Fullfilment Response
    fullfilmentResponse(agent, response, session);
};

export default module_functions;