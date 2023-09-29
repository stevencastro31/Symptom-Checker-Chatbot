import firebase from "firebase-admin";

const credential: Object = JSON.parse(process.env.SERVICE_ACCOUNT ?? "");

firebase.initializeApp({
    credential: firebase.credential.cert(credential),
});

const database = firebase.firestore();

async function getModule(path: string) {
    const document = await database.collection('module_introduction').doc('greeting').get();
    console.log(document);
};

export { getModule }