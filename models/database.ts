import { ChatLanguage } from "enums/language";
import { ChatModule } from "enums/module";
import { ChatIntent } from "enums/intent";
import firebase from "firebase-admin";

const credential: Object = JSON.parse(process.env.SERVICE_ACCOUNT ?? "");
firebase.initializeApp({
    credential: firebase.credential.cert(credential),
});

const database = firebase.firestore();

// * Fetches a variant of a chatbot response from Firestore.
async function getChatResponse(module: ChatModule, document: ChatIntent, language: ChatLanguage) {
    try {
        const doc = await database.collection(module).doc(document).get();
        const data = doc.data();
        const variant = Math.floor(Math.random() * 2) + 1;

        // console.log(`Using ${language}-${variant}`, data);
        if (data) { return data[`${language}-${variant}`]; }
    } catch (err) {
        console.log(err);
    };
    return ['Please notify the devs that an error has occured from the backend when retrieving a response.', ':<'];
};

export { getChatResponse }