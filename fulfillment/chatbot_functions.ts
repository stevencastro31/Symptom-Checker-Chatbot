import { getUser, setUser, getSession, getDiseaseKnowledge } from "@libs/database";
import { Payload } from "dialogflow-fulfillment";
import { ChatLanguage } from "enums/language";

function getUserFacebookID(agent: any) {
    const id = agent.session.split('/')[4];
    return 20 < id.length ? 'dialogflow' : id;
};

function getSessionParameters(agent: any) {
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
    const session = getSessionParameters(agent);
    session.userid = session.userid ?? getUserFacebookID(agent);
    const user: any = await getUser(session.userid);

    // console.log('Session: ', agent.session);
    // console.log('Params: ', session);

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

    // Get Previous Session
    if (!user.sessions.length) { session.previous_session = {} }
    else { session.previous_session = await getSession(user.sessions[user.sessions.length - 1]) }

    // Get Disease Weights
    session.disease_knowledge_base = await getDiseaseKnowledge();

    // Raise Flags
    session.flags.end = session.flags.end ?? false;
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
    session.flags.recall_flag = session.flags.recall_flag ?? Object.keys(session.previous_session).length !== 0;
    session.flags.recall_ended = session.flags.recall_ended ?? false;
    session.flags.initial_flag = session.flags.initial_flag ?? true;
    session.flags.initial_fetch_completed = session.flags.initial_fetch_completed ?? false;
    session.elicitation = session.elicitation ?? {
        current_subject: null,
        current_associations: [],
        current_properties: {},
        current_questions: [],
        next_subject: [],
        symptoms: {},
        previous_weights: {},
        vector: Array(41).fill(0),
        impression: null
    };
    session.flags.get_knowledge_flag = 0 === session.elicitation.current_questions.length && 0 !== session.elicitation.next_subject.length;
    session.flags.assessment_flag = session.flags.assessment_flag ?? false;
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

// * Queues the Chatbot to speak lines of dialogue stored in an array
function say(dialogues: any[], lines: string[]) {
    lines.forEach((line: string) => { dialogues.push(line); });
};

export { checkIntroductionFlags, checkGeneralQuestionFlags, checkSymptomElicitationFlags, triggerEvent, fullfilmentRequest, fullfilmentResponse, say }