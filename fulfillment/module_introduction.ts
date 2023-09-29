import { getChatResponse } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatLanguage } from "enums/language";
import { ChatModule } from "enums/module"
import { getUserFacebookID } from "./helper_functions";

const module_name = ChatModule.INTRODUCTION;
const module_functions = {
    greeting: async (agent: any) => {
        // TODO: FETCH DATABASE FOR REOCCURING USERS TO SKIP THE LANGUAGE & POLICY SELECTION       
        const language = ChatLanguage.ENGLISH;
        const userid = getUserFacebookID(agent);
        
        // Context
        agent.context.set({name: 'SESSION', lifespan: 99, parameters: {user: userid}});
        agent.context.set({name: 'LANGUAGE', lifespan: 5});

        // Response
        let response: string[] = [];
        response = response.concat(await getChatResponse(module_name, ChatIntent.GREETING, language));
        response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, language));
        response.forEach((message: string) => { agent.add(message); });
    },

    checkup: async (agent: any) => {
        // TODO: FETCH DATABASE FOR REOCCURING USERS TO SKIP THE LANGUAGE & POLICY SELECTION
        const language = ChatLanguage.ENGLISH;
        const userid = getUserFacebookID(agent);
        
        // Context
        agent.context.set({name: 'SESSION', lifespan: 99, parameters: {user: userid}});
        agent.context.set({name: 'LANGUAGE', lifespan: 5});

        // Response
        let response: string[] = [];
        response = response.concat(await getChatResponse(module_name, ChatIntent.GREETING, language));
        response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, language));
        response.forEach((message: string) => { agent.add(message); });
    },

    privacy_policy_yes: async (agent: any) => {
        // TODO: UPDATE DATABASE FOR ACQUIRED POLICY SELECTION
        const session = agent.context.get('session').parameters;
        const language = session.language;
        session.privacy_policy = true;
        
        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
        agent.context.set({name: 'PRIVACY_POLICY', lifespan: 0});

        // Response
        let response: string[] = [];
        response = response.concat(await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY_YES, language));
        response.forEach((message: string) => { agent.add(message); });
    },

    privacy_policy_no: async (agent: any) => {
        // TODO: UPDATE DATABASE FOR ACQUIRED POLICY SELECTION
        const session = agent.context.get('session').parameters;
        const language = session.language;
        session.privacy_policy = false;

        // Context
        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
        agent.context.set({name: 'PRIVACY_POLICY', lifespan: 0});

        // Response
        let response: string[] = [];
        response = response.concat(await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY_NO, language));
        console.log(response);
        response.forEach((message: string) => { agent.add(message); });
    },

    language_set: async (agent: any) => {
        // TODO: UPDATE DATABASE FOR ACQUIRED LANGUAGE SELECTION
        const session = agent.context.get('session').parameters;

        if (!agent.parameters.language) {
            // TODO: ADD REQUESTION VARIANTS (SLOT FILLING)
            // Context
            agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});

            // Response
            let response: string[] = [];
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, ChatLanguage.ENGLISH));
            response.forEach((message: string) => { agent.add(message); });
        } else {
            const language = agent.parameters.language;
            session.language = language;

            // Context
            agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
            agent.context.set({name: 'PRIVACY_POLICY', lifespan: 5});
            agent.context.set({name: 'LANGUAGE', lifespan: 0});

            // Reponse
            let response: string[] = [];
            response = response.concat(await getChatResponse(module_name, ChatIntent.PRIVACY_POLICY, language));
            response.forEach((message: string) => { agent.add(message); });
        }
    },

    language_change: async (agent: any) => {
        // TODO: UPDATE DATABASE FOR ACQUIRED LANGUAGE SELECTION
        const context = agent.context.get('session');
        const session = (context === undefined) ? ({userid: getUserFacebookID(agent)}) : context.parameters;
    
        if (agent.parameters.language) {
            session.language = agent.parameters.language;

            // Context
            agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});

            // Response
            let response: string[] = [];
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_CHANGE_SUCCESS, session.language));
            response.forEach((message: string) => { agent.add(message); });
        } else {
            // Context
            agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
            agent.context.set({name: 'LANGUAGE', lifespan: 5});

            // Response
            let response: string[] = [];
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_CHANGE, session.language ?? ChatLanguage.ENGLISH));
            response = response.concat(await getChatResponse(module_name, ChatIntent.LANGUAGE_SET, session.language ?? ChatLanguage.ENGLISH));
            response.forEach((message: string) => { agent.add(message); });
        }
    },
};

export default module_functions;