import { getChatResponse, saveSession } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { fullfilmentRequest, fullfilmentResponse, say } from "./chatbot_functions";
import { userToSeverity } from "./triage";

const module_name = ChatModule.ASSESSMENT;
const module_functions = {
    assessment: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);
        let response: any[] = [];

        await assessments_flow(agent, response, session);

        // Fullfilment Response
        fullfilmentResponse(agent, response, session);
    },
};

// * Main Flow of the Assessment Phase.
async function assessments_flow(agent: any, response: any, session: any) {
    // Prepare for General Impression
    const impression = session.elicitation.impression;
    const { obstruction, inflammation, cardiovascular } = session.disease_knowledge_base.groups;
    console.log(`Assessment: ${impression}`)

    // Triage Computation
    const score = userToSeverity(session.elicitation.symptoms);
    const status = getStatusName(score);

    // State Preassessment Response
    say(response, await getChatResponse(ChatModule.ASSESSMENT, ChatIntent.PREASSESSMENT, session.language));

    // State Impression Response
    if (obstruction.includes(impression)) { say(response, await getChatResponse(ChatModule.ASSESSMENT, ChatIntent.OBSTRUCTION, session.language)); }

    else if (inflammation.includes(impression)) { say(response, await getChatResponse(ChatModule.ASSESSMENT, ChatIntent.INFLAMMATION, session.language)); }

    else if (cardiovascular.includes(impression)) { say(response, await getChatResponse(ChatModule.ASSESSMENT, ChatIntent.CARDIOVASCULAR, session.language)); }

    // State Triage Response
    switch (status) {
        case 'minimal': say(response, await getChatResponse(ChatModule.ASSESSMENT, ChatIntent.MINIMAL, session.language));
            break;
        case 'delayed': say(response, await getChatResponse(ChatModule.ASSESSMENT, ChatIntent.DELAYED, session.language));
            break;
        case 'immediate': say(response, await getChatResponse(ChatModule.ASSESSMENT, ChatIntent.IMMEDIATE, session.language));
            break;
        case 'expectant': say(response, await getChatResponse(ChatModule.ASSESSMENT, ChatIntent.IMMEDIATE, session.language));
    }

    // Save Session
    await saveSession(session.userid, session.elicitation.symptoms, {score, status});
    agent.context.set({name: 'SESSION', lifespan: 0, parameters: {}});
};

// * Gives official triage term based on triage score.
function getStatusName(score: number) {
    if (score <= 10) { return 'minimal'; }
    if (score <= 20) { return 'delayed'; }
    if (score <= 30) { return 'immediate'; }
    return 'expectant';
};

export default module_functions;

