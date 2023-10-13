import { Payload } from "dialogflow-fulfillment";
import { fullfilmentResponse, triggerEvent } from "./chatbot_functions";
import { ChatEvent } from "enums/event";
import { ChatIntent } from "enums/intent";

async function webhook(agent: any) {

    // const payload = [{content_type: "text", title: '2NE1', payload: '2NE1'}, 
    // {content_type: "text", title: 'BIGBANG', payload: 'BIGBANG'}, 
    // {content_type: "text", title: 'PSY', payload: 'PSY'}]

    // let response: any[] = ['1', '2', '3', {text: '4', quickReplies: payload}];

    // fullfilmentResponse(agent, response, {});

    // agent.add('1');
    // agent.add('2');
    // agent.add('3');
    // agent.add(new Payload(agent.UNSPECIFIED, , {rawPayload: true, sendAsMessage: true}));

    // {text: 'What is yo fav?', quickReplies: payload}

    agent.handleIntent(ChatIntent.ELICITATION);

    // triggerEvent(agent, ChatEvent.ELICITATION);
    // agent.add('COOL!');
};

async function set_context(agent: any) {
    agent.add('Context Set');
    agent.context.set({name: agent.parameters.sys_any, lifespan: 5});
};

async function jump_flow(agent: any) {
    agent.add('Jump Set');
    // TODO: JUMP TO SYMPTOM FLOW
};

export { webhook, set_context, jump_flow }

// INTENT CHAINING ONLY HAS A MAX OF 3

// {
//     "content_type":"text",
//     "title":"Red",
//     "payload":"<POSTBACK_PAYLOAD>",
//     "image_url":"http://example.com/img/red.png"
//   },{
//     "content_type":"text",
//     "title":"Green",
//     "payload":"<POSTBACK_PAYLOAD>",
//     "image_url":"http://example.com/img/green.png"
//   }