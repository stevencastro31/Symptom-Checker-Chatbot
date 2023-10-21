import { Payload } from "dialogflow-fulfillment";
import { fullfilmentResponse, triggerEvent } from "./chatbot_functions";
import { ChatEvent } from "enums/event";
import { ChatIntent } from "enums/intent";
import { ChatContext } from "enums/context";

async function webhook(agent: any) {

    // const payload = [{content_type: "text", title: '2NE1', payload: '2NE1'}, 
    // {content_type: "text", title: 'BIGBANG', payload: 'BIGBANG'}, 
    // {content_type: "text", title: 'PSY', payload: 'PSY'}]

    agent.context.set({name: 'SESSION', lifespan: 0, parameters: {}});
    agent.add('SESSION DELETE');

    // let response: any[] = ['1', '2', '3', {quickReplies: ['4', '5', '6']}, '25'];
    // // let response: any[] = ['1', '2', '3', '25'];
    // fullfilmentResponse(agent, response, {});

    // agent.add('1');
    // agent.add('2');
    // agent.add('3');
    // agent.add(new Payload(agent.UNSPECIFIED, , {rawPayload: true, sendAsMessage: true}));

    // {text: 'What is yo fav?', quickReplies: payload}
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

async function reset(agent: any) {
    Object.values(ChatContext).forEach((context: string) => {
        agent.context.set({name: context, lifespan: 0, parameters: {}});
    });
    agent.context.set({name: 'SESSION', lifespan: 0, parameters: {}});
    agent.add('SESSION RESET!');
};

export { webhook, set_context, jump_flow, reset}

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