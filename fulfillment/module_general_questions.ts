import { getChatReply, getChatResponse, updateField } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { checkGeneralQuestionFlags, fullfilmentRequest, fullfilmentResponse, say, triggerEvent } from "./chatbot_functions";
import { ChatEvent } from "enums/event";
import { ChatQuickReply } from "enums/quick_reply";
import { ChatContext } from "enums/context";

const module_name = ChatModule.GENERAL_QUESTIONS;
const module_functions = {
    general: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        await general_questions_flow(agent, response, session);

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },

    name_set: async (agent: any) => {
        await user_info_intent_flow(agent, async (agent: any, response: any, session: any) => {
            if (!agent.parameters.sys_any) {
                say(response, await getChatResponse(module_name, ChatIntent.NAME_SET, session.language));
            } else {
                await updateField(session.userid, {[`general.name`]: agent.parameters.sys_any});
                session['name'] = agent.parameters.sys_any;
                agent.context.set({name: 'NAME', lifespan: 0});
            }
        });
    },

    age_set: async (agent: any) => {
        await user_info_intent_flow(agent, async (agent: any, response: any, session: any) => {
            if (!agent.parameters.sys_age) {
                say(response, await getChatResponse(module_name, ChatIntent.AGE_SET, session.language));
            } else {
                await updateField(session.userid, {[`general.age`]: agent.parameters.sys_age});
                session['age'] = agent.parameters.sys_age;
                agent.context.set({name: 'AGE', lifespan: 0});
            }
        });
    },

    sex_set: async (agent: any) => {
        await user_info_intent_flow(agent, async (agent: any, response: any, session: any) => {
            if (!agent.parameters.sex) {
                say(response, await getChatResponse(module_name, ChatIntent.SEX_SET, session.language));
                let quick_reply = await getChatReply(ChatQuickReply.SEX, session.language);
                if (quick_reply) { response.push({quickReplies: quick_reply}); }
            } else {
                await updateField(session.userid, {[`general.sex`]: agent.parameters.sex});
                session.sex = agent.parameters.sex;
                agent.context.set({name: 'SEX', lifespan: 0});
            }
        });
    },

    fallback: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        // Fallback Response
        say(response, await getChatResponse(module_name, agent.action, session.language)); 
        let quick_reply;
        switch (agent.action) {
            case ChatIntent.FALLBACK_SEX:
                quick_reply = await getChatReply(ChatQuickReply.SEX, session.language);
                if (quick_reply) { response.push({quickReplies: quick_reply}); }
                break;
            case ChatIntent.FALLBACK_INITIAL:
                quick_reply = await getChatReply(ChatQuickReply.INITIAL, session.language);
                if (quick_reply) { response.push({quickReplies: quick_reply}); }
                break;
        }

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },
};

// * Main Flow of the General Questions Phase.
async function general_questions_flow(agent: any, response: any, session: any) {
    // Check Flags
    await checkGeneralQuestionFlags(session);

    // * Name Dialogue Action
    if (session.flags.name_flag) {
        agent.context.set({name: 'NAME', lifespan: 5});
        say(response, await getChatResponse(module_name, ChatIntent.NAME_SET, session.language));
        return;
    } 

    // * Age Dialogue Action
    if (session.flags.age_flag) {
        agent.context.set({name: 'AGE', lifespan: 5});
        say(response, await getChatResponse(module_name, ChatIntent.AGE_SET, session.language));
        return;
    }

    // * Sex Dialogue Action
    if (session.flags.sex_flag) {
        agent.context.set({name: 'SEX', lifespan: 5});
        say(response, await getChatResponse(module_name, ChatIntent.SEX_SET, session.language));
        
        let quick_reply = await getChatReply(ChatQuickReply.SEX, session.language);
        if (quick_reply) { response.push({quickReplies: quick_reply}); }
        return;
    }

    // * Transition to Symptom Elicitation Phase
    triggerEvent(agent, ChatEvent.ELICITATION);
};

async function user_info_intent_flow(agent: any,  operation: (agent: any, response: any, session: any) => any) {
    // Fullfilment Request
    const session = await fullfilmentRequest(agent);
    let response: any[] = [];

    // Flows
    await operation(agent, response, session);
    await general_questions_flow(agent, response, session);

    // Fullfilment Response
    fullfilmentResponse(agent, response, session);    
};

export default module_functions;

