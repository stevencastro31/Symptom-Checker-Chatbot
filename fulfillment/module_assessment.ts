import { getChatResponse } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { fullfilmentRequest, fullfilmentResponse } from "./chatbot_functions";
import { userToSeverity } from "./triage";

const module_name = ChatModule.ASSESSMENT;
const module_functions = {
    assessment: async (agent: any) => {
        // Fullfilment Request
        const session = await fullfilmentRequest(agent);

        await assessments_flow(agent, session);
    },
};

// * Module Flow
async function assessments_flow(agent: any, session: any) {
    // Fullfilment Request
    let response: any[] = [];

    // Triage Computation
    const triageScore = userToSeverity(session.elicitation.symptoms);
    response = response.concat(await getChatResponse(module_name, ChatIntent.PREASSESSMENT, session.language));

    if (triageScore <= 10) {
        response = response.concat(await getChatResponse(module_name, ChatIntent.MINIMAL, session.language));
    }
    
    else if (triageScore <= 20) {
        response = response.concat(await getChatResponse(module_name, ChatIntent.DELAYED, session.language));
    }

    else if (triageScore <= 30) {
        response = response.concat(await getChatResponse(module_name, ChatIntent.IMMEDIATE, session.language));
    }

    else {
        response = response.concat(await getChatResponse(module_name, ChatIntent.EXPECTANT, session.language));
    }

    // Save Session

    // Fullfilment Response
    fullfilmentResponse(agent, response, session);
};

export default module_functions;

