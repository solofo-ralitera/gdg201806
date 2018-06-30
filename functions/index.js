const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.bestScore = functions.database.ref('/scores/{pushId}').onCreate((snapshot, context) => {
    const userScore = snapshot.val();
    return new Promise((resolv, reject) => {
        admin.database().ref('scores').on('value', snapscores => {
            const scores = snapscores.val();
            if (scores === null) resolv(true);
            const res = Object.keys(scores)
                .map(k => scores[k])
                .filter(function(item) {
                    return item.uid === userScore.uid;
                })
                .reduce((acc, item) => {
                    ++acc['attempts'];
                    if (acc['score'] === null) acc['score'] = parseInt(item.score);
                    else acc['score'] = Math.min(parseInt(acc['score']), parseInt(item.score));
                    acc['scores'].push(item.score);
                    return acc;
                }, {
                    'score': null,
                    'attempts': 0,
                    'username': userScore.username,
                    'scores': []
                });
            res.scores.sort();
            admin.database().ref('/best/' + userScore.uid).set(res, response => {
                resolv(response);
            });
        });
    });
});

