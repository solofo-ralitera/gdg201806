(function() {
// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCSm92qE8-GdfXcZGXyLlEOTXzIHbQoF4A",
    authDomain: "gdg-20180630.firebaseapp.com",
    databaseURL: "https://gdg-20180630.firebaseio.com",
    projectId: "gdg-20180630",
    storageBucket: "gdg-20180630.appspot.com",
    messagingSenderId: "388327040349"
});

document.querySelector('#login').addEventListener('click', function(evt) {
    const email = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    createUserWithEmailAndPassword(email, password);
});

function createUserWithEmailAndPassword(email, password) {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
            /*
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else if (errorCode == 'auth/email-already-in-use') {
                signInWithEmailAndPassword(email, password);
            } else {
                alert(errorMessage);
            }
            */
        });
}




})();