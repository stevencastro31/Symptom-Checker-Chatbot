import { getChatResponse, setUser } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatLanguage } from "enums/language";
import { ChatModule } from "enums/module"
import { getSession, getUserFacebookID, triggerEvent } from "./helper_functions";
import { getUser } from "@libs/database";

const module_name = ChatModule.INTRODUCTION;
const module_functions = {
    greeting: async (agent: any) => {
        const session = getSession(agent);
        const userid = getUserFacebookID(agent);    
        const user: any = await getUser(userid);
        let response: string[] = [];

        session.language = user.settings.language ?? ChatLanguage.ENGLISH;
        if (!session.user) { response = response.concat(await getChatResponse(module_name, ChatIntent.GREETING, session.language)); }
        session.user = userid;

        if (!user.settings.language) {                                 
            agent.context.set({name: 'LANGUAGE', lifespan: 5});
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language));

        } else if (!user.settings.privacy_policy) {
            agent.context.set({name: 'PRIVACY_POLICY', lifespan: 5});
            response = response.concat(await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY, session.language));

        } else {
            if (session.checkup) {
                triggerEvent(agent, 'GENERAL');
                
            } else {
                response = response.concat(await getChatResponse(module_name, ChatIntent.HELP, session.language));

            }
        }

        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
        response.forEach((message: string) => { agent.add(message); });
    },

    checkup: async (agent: any) => {
        const session = getSession(agent);
        const userid = getUserFacebookID(agent);    
        const user: any = await getUser(userid);
        let response: string[] = [];

        session.language = user.settings.language ?? ChatLanguage.ENGLISH;
        session.user = userid;

        if (!user.settings.language || !user.settings.privacy_policy) {
            session.checkup = true;
        
            triggerEvent(agent, 'GREETING');
        } else {
            triggerEvent(agent, 'GENERAL');

        }

        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
        response.forEach((message: string) => { agent.add(message); });
    },

    privacy_policy_yes: async (agent: any) => {
        const session = getSession(agent);
        const user: any = await getUser(session.user);
        let response: string[] = [];
        
        user.settings.privacy_policy = true;
        session.privacy_policy = true;
        
        agent.context.set({name: 'PRIVACY_POLICY', lifespan: 0});
        response = response.concat(await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY_YES, session.language));

        triggerEvent(agent, 'GREETING');
        await setUser(session.user, user);

        response.forEach((message: string) => { agent.add(message); });
        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
    },

    privacy_policy_no: async (agent: any) => {
        const session = getSession(agent);
        const user: any = await getUser(session.user);
        let response: string[] = [];
        
        user.settings.privacy_policy = false;
        session.privacy_policy = false;

        agent.context.set({name: 'PRIVACY_POLICY', lifespan: 0});
        response = response.concat(await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY_NO, session.language));

        triggerEvent(agent, 'GREETING');

        response.forEach((message: string) => { agent.add(message); });
        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
    },

    language_set: async (agent: any) => {
        const session = getSession(agent);
        const user: any = await getUser(session.user);
        let response: string[] = [];

        if (!agent.parameters.language) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language));
            
        } else {
            session.language = agent.parameters.language;
            user.settings.language = agent.parameters.language;

            agent.context.set({name: 'LANGUAGE', lifespan: 0});

            triggerEvent(agent, 'GREETING');
            await setUser(session.user, user);
        }

        response.forEach((message: string) => { agent.add(message); });
        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
    },

    language_change: async (agent: any) => {
        const session = getSession(agent);
        const userid = getUserFacebookID(agent);    
        const user: any = await getUser(userid);
        let response: string[] = [];

        session.language = user.settings.language ?? ChatLanguage.ENGLISH;
        session.user = userid;

        if (agent.parameters.language) {
            session.language = agent.parameters.language;
            user.settings.language = agent.parameters.language;

            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_CHANGE_SUCCESS, session.language));
            agent.context.set({name: 'LANGUAGE', lifespan: 0});

            triggerEvent(agent, 'GREETING');
            await setUser(session.user, user);
        } else {
            agent.context.set({name: 'LANGUAGE', lifespan: 5});
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_CHANGE, session.language));
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language));

        }

        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
        response.forEach((message: string) => { agent.add(message); });
    },
};

export default module_functions;