import { getUser, setUser } from "@libs/database";
import { Payload } from "dialogflow-fulfillment";
import { ChatLanguage } from "enums/language";

function getUserFacebookID(agent: any) {
    const id = agent.session.split('/')[4];
    return 20 < id.length ? 'dialogflow' : id;
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

    console.log('Session: ', agent.session);
    console.log('Params: ', session);

    session.flags = session.flags ?? {};
    session.flags.start_flag = session.flags.start_flag === undefined;
    session.language = user.settings.language ?? ChatLanguage.ENGLISH;

    return session;
};

// * Repetitive Code for Response & Saving Session Data
async function fullfilmentResponse(agent: any, response: any[], session: any) {
    // Save Session
    agent.context.set({name: 'SESSION', lifespan: 99, parameters: session});

    // Create a Quick Reply in the Response (Latest)
    const payload: any = {text: 'default', quickReplies: []};
    var hasQuickReply = false;
    response.forEach((message: any) => {
        if (message instanceof Object) { 
            payload.quickReplies = createPayload(message.quickReplies); 
            hasQuickReply = true;
        };
    });

    // Build Response
    response = response.filter(msg => !(msg instanceof Object));
    response.forEach((message: any, index: number) => { 
        if (response.length - 1 === index && hasQuickReply) {
            payload.text = message;
            agent.add(new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true}));
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
};

// * Set General Question Module Flags
async function checkGeneralQuestionFlags(session: any) {
    const user: any = await getUser(session.userid);

    // Raise Flags
    session.flags.name_flag = user.general.name === null;
    session.flags.age_flag = user.general.age === null;
    session.flags.sex_flag = user.general.sex === null;
};

// * Set Symptom Elicitation Module Flags
async function checkSymptomElicitationFlags(session: any) {
    // Raise Flags
    session.flags.initial_flag = session.flags.initial_flag ?? true;
    session.elicitation = session.elicitation ?? {
        current_subject: null,
        current_properties: {},
        current_questions: [],
        next_subject: null,
        symptoms: [],
    };
    session.flags.get_knowledge_flag = 0 === session.elicitation.current_questions.length && session.elicitation.next_subject !== null;
    session.flags.end_probing_flag = 0 === session.elicitation.current_questions.length && session.elicitation.next_subject === null;
};

// * Build Quick Reply Payload
function createPayload(quickReplies: string[]) {
    const payload: Object[] = [];
    quickReplies.forEach((quickReply: string) => {
        payload.push({
            content_type: "text",
            title: quickReply,
            payload: quickReply,
            // image_url:"http://example.com/img/red.png"
        });
    });
    return payload;
};

export { checkIntroductionFlags, checkGeneralQuestionFlags, checkSymptomElicitationFlags, triggerEvent, fullfilmentRequest, fullfilmentResponse }