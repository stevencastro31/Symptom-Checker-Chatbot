import { ChatLanguage } from "enums/language";
import { ChatModule } from "enums/module";
import { ChatIntent } from "enums/intent";
import firebase from "firebase-admin";

const credential: Object = JSON.parse(process.env.SERVICE_ACCOUNT ?? "");
firebase.initializeApp({
    credential: firebase.credential.cert(credential),
});

const database = firebase.firestore();

const new_user_obj = {
    current_session: null,
    general: {
        age: null,
        name: null,
        sex: null,
    },
    settings: {
        language: null,
        privacy_policy: false,
    },
    sessions: [],
    is_new: true,   
};

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

// * Fetches User Object (generates one if the user does not have one)
async function getUser(userid: string) {
    try {
        const doc = await database.collection('users').doc(userid).get();
        const data = doc.data();
        
        if (data) { 
            data.is_new = false;
            return data; 
        } else {
            await setUser(userid, new_user_obj);
            return new_user_obj;
        }
    } catch (err) {
        console.log(err);
    };
};

// * Updates User Object
async function setUser(userid: string, data: Object) {
    try {
        const res = await database.collection('users').doc(userid).set(data);
        // console.log(`User [${userid}]: ${res.writeTime}`);
    } catch (err) {
        console.log(err);
    };
};

export { getChatResponse, getUser, setUser }



