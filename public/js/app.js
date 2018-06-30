let connectedUser = null;

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCSm92qE8-GdfXcZGXyLlEOTXzIHbQoF4A",
    authDomain: "gdg-20180630.firebaseapp.com",
    databaseURL: "https://gdg-20180630.firebaseio.com",
    projectId: "gdg-20180630",
    storageBucket: "gdg-20180630.appspot.com",
    messagingSenderId: "388327040349"
});


function createUserWithEmailAndPassword(email, password) {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
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
        });
}

function signInWithEmailAndPassword(email, password) {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
        });
}

document.querySelector('#login').addEventListener('click', function(evt) {
    const email = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    createUserWithEmailAndPassword(email, password);
});
document.querySelector('#logout').addEventListener('click', function(evt) {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(function(user) {
    connectedUser = user; // user is undefined if no user signed in
    if (connectedUser) {
        document.querySelector('#login-container').style.display = 'none';        
        document.querySelector('#game-container').style.display = 'inherit';        
    } else {
        document.querySelector('#login-container').style.display = 'inherit';        
        document.querySelector('#game-container').style.display = 'none';        
    }
});

document.addEventListener('touchstart', startgame, {passive: false});
document.addEventListener('mousedown', function(event) {
  if (event.button === 0) startgame();
}, {passive: false});
document.addEventListener('keydown', function(event) {
  if (event.key == ' ') startgame();
}, {passive: false});

// GAME LOGIC *******************************
let gameStarted = false;
let lightOff = false;
let startTime = null;
let jumpstart = false;
function startLight() {
    const divs = document.querySelectorAll('.light-container .light')
    divs.forEach(function(item, idx) {
        window.setTimeout(function() {
            if (!jumpstart) item.className = 'light active';
        }, 1000 * idx);
        if (divs.length === idx + 1) {
            window.setTimeout(function() {
                if (!jumpstart) gogogo();
            }, (1000 * idx) + (3000 * Math.random()));
        }
    });
}
function switchoffLights() {
    document.querySelectorAll('.light-container .light').forEach(function(item, idx) {
        item.className = 'light';
    });
}
function resetgame() {
    switchoffLights();
    gameStarted = false;
    lightOff = false;
    startTime = null;
}
function jumpStart() {
    jumpstart = true;
    document.querySelector('#score').innerHTML = "Jump start, wait for 5s";
    alert("Jump start !!!!");
    resetgame();
    window.setTimeout(function() {
        document.querySelector('#score').innerHTML = "&nbsp;";
        jumpstart = false;
    }, 5000);
}
function gogogo() {
    switchoffLights();
    lightOff = true;
    startTime = (new Date()).getTime();
}
function stopgame() {
    // Jump start
    if(startTime === null || lightOff === false) {
        jumpStart();
        return false;
    }
    const duration = (new Date()).getTime() - startTime - 25;
    document.querySelector('#score').innerHTML = duration + 'ms';
    resetgame();
    // Save on cloud
    firebase.database().ref('scores').push().set({
        username: connectedUser.email,
        uid: connectedUser.uid,
        score : duration
    });

}
function startgame() {
    if (jumpstart) return false;
    if (! connectedUser) return false;
    document.querySelector('#score').innerHTML = "&nbsp;";
    if (gameStarted === false) {
        gameStarted = true;
        startLight();
    } else {
        stopgame();
    }
}


// Realtime scores *************************
firebase.database()
    .ref('scores')
    .on('value', function(snapshot) {
        updateScores(snapshot.val(), '#top-score');
    });
function updateScores(scores, div) {
    if(gameStarted) return false;
    let str = '';
    if(scores) {
        const sortedScores = Object.values(scores);
        sortedScores.sort(function(a,b) {
            return a.score - b.score;
        });
        str = sortedScores.reduce(function(acc, item) {
            acc += `<div>${item.score}, ${item.username}</div>`;
            return acc;
        }, '');
    }
    document.querySelector(div).innerHTML = str;
}
