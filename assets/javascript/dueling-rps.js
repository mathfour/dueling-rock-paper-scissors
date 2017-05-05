/**
 * Created by SilverDash on 5/3/17.
 */

// bmc: todo create chat (shouldn't be terribly hard, right?)
// bmc: todo prevent players from clicking choice until they are both logged in
// bmc: todo let both players know who won and what the other picked
// bmc: todo tally the winner and loser

var configThisAlready = {
    apiKey: "AIzaSyCNyA8ecM-65kxrfuwxxMQr1f0Ujoasr7I",
    authDomain: "dueling-rps.firebaseapp.com",
    databaseURL: "https://dueling-rps.firebaseio.com/",
    storageBucket: "dueling-rps.appspot.com"
};

firebase.initializeApp(configThisAlready);

var theDatabase = firebase.database();
var dbRef = theDatabase.ref();
var playerOneRef = dbRef.child("players").child("1").child("choice");
var playerTwoRef = dbRef.child("players").child("2").child("choice");

var choiceList = ["paper","scissors","rock"];
var playerOneChoice = 17;
var playerTwoChoice = 17;
var playerOneName;
var playerTwoName;
var thisUsersNameIsX = "";
var thisIsPlayerNumberX = 0;

$("#play").on("click", function(e){
    e.preventDefault();
    thisUsersNameIsX = $("#userNameInput").val();

    dbRef.once('value').then(function(snapshot){
        // bmc: looking to see if there are players around (i.e. logged in and playing)
        areThereAnyPlayersInGame = snapshot.val();

        if (!areThereAnyPlayersInGame){
            // bmc: create player 1
            console.log("there is no player 1");
            addPlayer(1);
        }
        else {
            playerOne = snapshot.val().players["1"];
            playerTwo = snapshot.val().players["2"];

            if (!playerOne) {
                // bmc: create player 1
                console.log("there is no player 1");
                addPlayer(1);
            }
            else if (!playerTwo) {
                // bmc: create player 2
                console.log("there is no player 2");
                addPlayer(2);
            }
            else {
                // bmc: display "You can't play now"
                console.log("you're the third wheel");
                $("#you-are-player").html("Two people are already playing. Please stand by.");
            }
        }

    });

    $("#theGame").css("display", "inline");
    $(".name-input").css("display", "none");
    $("#greeting").text("Hi there, " + thisUsersNameIsX + "!");
});

playerOneRef.on("value", function (snapshot) {
    if (snapshot.val() != 17 && snapshot.val() != null){
        playerOneChoice = snapshot.val();
        console.log("player one picked " + snapshot.val());
    }
});

playerTwoRef.on("value", function (snapshot) {
    if (snapshot.val() != 17 && snapshot.val() != null){
        playerTwoChoice = snapshot.val();
        console.log("player two picked " + snapshot.val());
    }
});

$("#done-with-choice").on("click", function(e){
    e.preventDefault();

    var choice = $("input[name='choices']:checked").val();
    // bmc: append the user thisIsPlayerNumberX with the value
    theDatabase.ref("players").child(thisIsPlayerNumberX).update({
        choice: choice
    });

    dbRef.on('value', function(snapshot){
        playerOneChoice = snapshot.val().players["1"].choice;
        playerTwoChoice = snapshot.val().players["2"].choice;

        playerOneName = snapshot.val().players["1"].userName;
        playerTwoName = snapshot.val().players["2"].userName;

    });

    if (playerOneChoice != 17 && playerTwoChoice != 17) {
        pickTheWinner();
    }
});

// bmc: this gives us the quit button functionality; it works the same as if the user closed the browser
$("#quit").on("click", function(e) {
    e.preventDefault();
    deleteUser();
});

// bmc: This adds a player and labels him in the database as playerNumberX
function addPlayer(playerNumberX) {
    addPlayerHere = theDatabase.ref("players").child(playerNumberX);

    addPlayerHere.set({
        userName: thisUsersNameIsX,
        wins: 0,
        losses: 0,
        choice: 17
    });
    thisIsPlayerNumberX = playerNumberX;
    $("#you-are-player").html("You are player " + thisIsPlayerNumberX);
}

// bmc: This deletes the user that is registered
function deleteUser() {
    theDatabase.ref("players").child(thisIsPlayerNumberX).remove();
}

function pickTheWinner() {
    var winDif = playerOneChoice - playerTwoChoice;

    if (winDif === 1 || winDif === -2) {
        console.log("You win!");
        // bmc: player one wins
        $("results").html("Player 1 picked " + choiceList[playerOneChoice] + ". <br>Player 2 picked " + choiceList[playerTwoChoice] + ". <br>" + playerOneName + " is the winner!");
    }

    else if (winDif === -1 || winDif === 2) {
        console.log("You lose!");
        // bmc: player two wins
        $("results").html("Player 1 picked " + choiceList[playerOneChoice] + ". <br>Player 2 picked " + choiceList[playerTwoChoice] + ". <br>" + playerTwoName + " is the winner!");
    }

    else {
        // bmc: there is a tie
        console.log("Hey, you tied!");
        $("results").html("Player 1 picked " + choiceList[playerOneChoice] + ". <br>Player 2 picked " + choiceList[playerTwoChoice] + ". <br>It's a tie!");
    }
}

function tally(winner, loser) {
    // bmc: update winner in firebase with +1
    // bmc: update loser in firebase with +1
}
