import { Payload } from "dialogflow-fulfillment";

async function webhook(agent: any) {

    const payload = [{content_type: "text", title: '2NE1', payload: '2NE1'}, 
    {content_type: "text", title: 'BIGBANG', payload: 'BIGBANG'}, 
    {content_type: "text", title: 'PSY', payload: 'PSY'}]

    agent.add('1');
    agent.add('2');
    agent.add('3');
    agent.add(new Payload(agent.UNSPECIFIED, {text: 'What is yo fav?', quickReplies: payload}, {rawPayload: true, sendAsMessage: true}));
};

export { webhook }




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