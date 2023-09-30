import { getChatResponse, setUser } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { getSession, triggerEvent } from "./helper_functions";
import { getUser } from "@libs/database";

const module_name = ChatModule.GENERAL_QUESTIONS;
const module_functions = {
    general: async (agent: any) => {
        const session = getSession(agent);
        const user: any = await getUser(session.user);
        let response: string[] = [];

        if (!user.general.name) {
            agent.context.set({name: 'NAME', lifespan: 3});
            response = response.concat(await getChatResponse(module_name, ChatIntent.NAME_SET, session.language));

        } else if (!user.general.sex) {
            agent.context.set({name: 'SEX', lifespan: 3});
            response = response.concat(await getChatResponse(module_name, ChatIntent.SEX_SET, session.language));

        } else if (!user.general.age) {
            agent.context.set({name: 'AGE', lifespan: 3});
            response = response.concat(await getChatResponse(module_name, ChatIntent.AGE_SET, session.language));

        } else {
            session.name = user.general.name;
            session.age = user.general.age;
            session.sex = user.general.sex;

            response = response.concat(await getChatResponse(module_name, ChatIntent.INITIAL_SYMPTOM, session.language));
        }

        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
        response.forEach((message: string) => { agent.add(message); });
    },

    name_set: async (agent: any) => {
        const session = getSession(agent);
        const user: any = await getUser(session.user);
        let response: string[] = [];

        if (!agent.parameters.name) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.NAME_SET, session.language));

        } else {
            session.name = agent.parameters.name;
            user.general.name = agent.parameters.name;

            agent.context.set({name: 'NAME', lifespan: 0});
            triggerEvent(agent, 'GENERAL');

            await setUser(session.user, user);
        }

        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
        response.forEach((message: string) => { agent.add(message); });
    },

    age_set: async (agent: any) => {
        const session = getSession(agent);
        const user: any = await getUser(session.user);
        let response: string[] = [];

        if (!agent.parameters.age) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.AGE_SET, session.language));

        } else {
            session.age = agent.parameters.age;
            user.general.age = agent.parameters.age;

            agent.context.set({name: 'AGE', lifespan: 0});
            triggerEvent(agent, 'GENERAL');

            await setUser(session.user, user);
        }

        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
        response.forEach((message: string) => { agent.add(message); });
    },

    sex_set: async (agent: any) => {
        const session = getSession(agent);
        const user: any = await getUser(session.user);
        let response: string[] = [];

        if (!agent.parameters.sex) {
            response = response.concat(await getChatResponse(module_name, ChatIntent.SEX_SET, session.language));

        } else {
            session.sex = agent.parameters.sex;
            user.general.sex = agent.parameters.sex;

            agent.context.set({name: 'SEX', lifespan: 0});
            triggerEvent(agent, 'GENERAL');

            await setUser(session.user, user);
        }

        agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
        response.forEach((message: string) => { agent.add(message); });
    },

    initial_symptom_set: async (agent: any) => {

    },
};

export default module_functions;