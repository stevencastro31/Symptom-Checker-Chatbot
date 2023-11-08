import { getChatReply, getChatResponse, updateField } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { checkIntroductionFlags, fullfilmentRequest, fullfilmentResponse, say, triggerEvent } from "./chatbot_functions";
import { ChatEvent } from "enums/event";
import { ChatQuickReply } from "enums/quick_reply";
import { ChatContext } from "enums/context";

const module_name = ChatModule.INTRODUCTION;
const module_functions = {
    greeting: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        await introduction_flow(agent, response, session);

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    checkup: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];
        session.flags.checkup_flag = true;

        await introduction_flow(agent,response, session);

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    privacy_policy_yes: async (agent: any) => {
        await intro_intent_flow(agent, async (agent: any, response: any, session: any) => {
            await updateField(session.userid, {['settings.privacy_policy']: true})
            session.privacy_policy = true;
            session.flags.privacy_policy_flag = false;
            
            agent.context.set({name: 'PRIVACY_POLICY', lifespan: 0});
            say(response, await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY_YES, session.language));
        });
    },

    privacy_policy_no: async (agent: any) => {
        await intro_intent_flow(agent, async (agent: any, response: any, session: any) => {
            await updateField(session.userid, {['settings.privacy_policy']: false})
            session.privacy_policy = true;
            session.flags.privacy_policy_flag = false;
            session.flags.end = true;
    
            agent.context.set({name: 'PRIVACY_POLICY', lifespan: 0});
            say(response, await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY_NO, session.language));
        });
    },

    language_set: async (agent: any) => {
        await intro_intent_flow(agent, async (agent: any, response: any, session: any) => {
            if (!agent.parameters.language) {
                say(response, await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language));
                let quick_reply = await getChatReply(ChatQuickReply.LANGUAGE, session.language);
                if (quick_reply) { response.push({quickReplies: quick_reply}); }
            } 
            
            else {
                await updateField(session.userid, {['settings.language']: agent.parameters.language});
                session.language = agent.parameters.language;
                session.flags.language_flag = false;
                agent.context.set({name: 'LANGUAGE', lifespan: 0});
            }
        });
    },

    language_change: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        if (agent.parameters.language) {
            await updateField(session.userid, {['settings.language']: agent.parameters.language});
            session.language = agent.parameters.language;

            agent.context.set({name: 'LANGUAGE', lifespan: 0});
            say(response, await getChatResponse(module_name, ChatIntent.LANGUAGE_CHANGE_SUCCESS, session.language));
        } 
        
        else {
            agent.context.set({name: 'LANGUAGE', lifespan: 5});
            say(response, await getChatResponse(module_name, ChatIntent.LANGUAGE_CHANGE, session.language));
            say(response, await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language));
            let quick_reply = await getChatReply(ChatQuickReply.LANGUAGE, session.language);
            if (quick_reply) { response.push({quickReplies: quick_reply}); }
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    fallback: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        // Fallback Response
        say(response, await getChatResponse(module_name, agent.action, session.language));
        let quick_reply;
        switch (agent.action) {
            case ChatIntent.FALLBACK_LANGUAGE:
                quick_reply = await getChatReply(ChatQuickReply.LANGUAGE, session.language);
                if (quick_reply) { response.push({quickReplies: quick_reply}); }
                break;
            case ChatIntent.FALLBACK_PRIVACY_POLICY:
                quick_reply = await getChatReply(ChatQuickReply.PRIVACY_POLICY, session.language);
                if (quick_reply) { response.push({quickReplies: quick_reply}); }
                break;
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },
};

// * Main Flow of the Introduction Phase.
async function introduction_flow(agent: any, response: any, session: any) {
    //* Initial Greeting
    if (session.flags.start_flag) { 
        say(response, await getChatResponse(module_name, ChatIntent.GREETING, session.language));
        session.flags.start_flag = false;  
    }

    // * Check Flags
    await checkIntroductionFlags(session);

    // * Language Dialogue Action
    if (session.flags.language_flag) {
        agent.context.set({name: 'LANGUAGE', lifespan: 5});
        say(response, await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language));

        let quick_reply = await getChatReply(ChatQuickReply.LANGUAGE, session.language);
        if (quick_reply) { response.push({quickReplies: quick_reply}); }
        return;
    }

    // * Privacy Policy Dialogue Action
    if (session.flags.privacy_policy_flag) {
        agent.context.set({name: 'PRIVACY_POLICY', lifespan: 5});
        say(response, await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY, session.language));

        let quick_reply = await getChatReply(ChatQuickReply.PRIVACY_POLICY, session.language);
        if (quick_reply) { response.push({quickReplies: quick_reply}); }
        return;
    }

    // * Transition to General Questions Phase
    if (session.flags.checkup_flag) {
        triggerEvent(agent, ChatEvent.GENERAL);
    }

    say(response, await getChatResponse(module_name, ChatIntent.HELP, session.language));
};

async function intro_intent_flow(agent: any,  operation: (agent: any, response: any, session: any) => any) {
    // Fullfilment Request
    const session = await fullfilmentRequest(agent);
    let response: any[] = [];

    // Flows
    await operation(agent, response, session);
    if (!session.flags.end) { await introduction_flow(agent, response, session); }
   
    // Fullfilment Response
    fullfilmentResponse(agent, response, session);
};

export default module_functions;