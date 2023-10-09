import { getChatResponse, updateField } from "@libs/database";
import { ChatIntent } from "enums/intent";
import { ChatModule } from "enums/module"
import { checkSymptomElicitationFlags, fullfilmentRequest, fullfilmentResponse, triggerEvent } from "./chatbot_functions";

const module_name = ChatModule.GENERAL_QUESTIONS; // ! TODO: CHANGE
const module_functions = {
    initial_symptom_set: async (agent: any) => {
        
    },
};

export default module_functions;