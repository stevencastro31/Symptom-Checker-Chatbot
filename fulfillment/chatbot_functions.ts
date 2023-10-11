import { getUser, setUser } from "@libs/database";
import { Payload } from "dialogflow-fulfillment";
import { ChatLanguage } from "enums/language";

function getUserFacebookID(agent: any) {
    return agent.session.split()[4] ?? 'dialogflow';
};

function getSession(agent: any) {
    const session = agent.context.get('session');
    if (!session) {
        agent.context.set({name: 'SESSION', lifespan: 99, parameters: {}});
        return {};
    } else {
        return session.parameters;
    }
};

function triggerEvent(agent: any, event: string) {
    agent.add('.');
    agent.setFollowupEvent(event);
};

// * Repetitive Code for Request & Getting Session Data
async function fullfilmentRequest(agent: any) {
    const session = getSession(agent);
    session.userid = session.userid ?? getUserFacebookID(agent);
    const user: any = await getUser(session.userid);

    session.flags = session.flags ?? {};
    session.flags.start_flag = session.flags.start_flag === undefined;
    session.language = user.settings.language ?? ChatLanguage.ENGLISH;

    return session;
};

// * Repetitive Code for Response & Saving Session Data
async function fullfilmentResponse(agent: any, response: any[], session: any) {
    agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});
    response.forEach((message: any) => { 
        if (message instanceof Object) {
            agent.add(new Payload(agent.UNSPECIFIED, message, {rawPayload: true, sendAsMessage: true}));
        } else {
            agent.add(message);
        }
    });
};

// * Set Introduction Module Flags
async function checkIntroductionFlags(session: any) {
    const user: any = await getUser(session.userid);

    // Raise Flags
    session.flags.language_flag = user.settings.language === null;
    session.flags.privacy_policy_flag = user.settings.privacy_policy === false
    // console.log('FLAGS', session.flags);
};

// * Set General Question Module Flags
async function checkGeneralQuestionFlags(session: any) {
    const user: any = await getUser(session.userid);

    session.flags.name_flag = user.general.name === null;
    session.flags.age_flag = user.general.age === null;
    session.flags.sex_flag = user.general.sex === null;
    // console.log('FLAGS', session.flags);
};

// * Set Symptom Elicitation Module Flags
// TODO: asda
async function checkSymptomElicitationFlags(session: any) {
    const user: any = await getUser(session.userid);

    session.flags.initial_flag = true;

    // console.log('FLAGS', session.flags);
};

export { checkIntroductionFlags, checkGeneralQuestionFlags, checkSymptomElicitationFlags, triggerEvent, fullfilmentRequest, fullfilmentResponse }