/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const pug = require('pug');
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require('../functions/config/awad-htmx-firebase-adminsdk-qdsp4-f3a60ae816.json');

initializeApp({
    credential: cert(serviceAccount), 
    databaseURL: 'https://apps.firebaseio.com'
});

//<!---- AYO THIS ONE WORKS ---->
exports.loadLogs = onRequest(async (request, response) => {
    let template = pug.compileFile('views/home.pug');
    const db = getFirestore();
    const appsRef = db.collection('Apps');
    const readDB = await appsRef.get();
    readDB.forEach((doc) => {
        let markup = template({
            title: doc.data().title,
            description: doc.data().description,
            company: doc.data().company,
            date: doc.data().date.toDate(),
        });
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(markup);
    });
    response.end();
});

exports.addmessage = onRequest(async (req, res) => {
    const original = req.query.text; //this string needs to be the form data
    const writeResult = await getFirestore()
        .collection("Apps")
        .add({original: original});
    res.json({result: 'Message with ID ${writeResult.id} added.'});
});

exports.addApp = onRequest((request, response) => {
    let template = pug.compileFile('views/addApp.pug');
    let markup = template();
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(markup);
    // const formData = request.form.get();
    // console.log(formData);
    response.end();
});

exports.login = onRequest((request, response) => {
    let template = pug.compileFile('views/login.pug');
    let markup = template();
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.end(markup);
});

