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
var dbRef = theDatabase.ref()
var playersRef = theDatabase.ref("players");


var playerOneRef = playersRef.child("1");
var playerTwoRef = playersRef.child("2");


var playerOneChoiceRef = playerOneRef.child("choice");
var playerOneWinsRef = playerOneRef.child("wins");
var playerOneLossesRef = playerOneRef.child("losses");



var playerTwoChoiceRef = playerTwoRef.child("choice");
var playerTwoWinsRef = playerTwoRef.child("wins");
var playerTwoLossesRef = playerTwoRef.child("losses");



var choiceList = ["paper","scissors","rock"];
var playerOneChoice = 17;
var playerOneName;

var playerTwoChoice = 17;
var playerTwoName;

var thisUsersNameIsX = "";
var thisIsPlayerNumberX = 0;

// bmc: User inputs name and clicks Play Button
// bmc: This assigns the player a player number
$("#play").on("click", function(e){
    e.preventDefault();

    // bmc: variable for the user
    thisUsersNameIsX = $("#userNameInput").val();

    // bmc: looking to see if there are players around (i.e. logged in and playing) so user can play (or be rejected)
    dbRef.once('value').then(function(snapshot){
        areThereAnyPlayersInGame = snapshot.val();

        if (!areThereAnyPlayersInGame){
            // bmc: create player 1
            console.log("There are no players, so you get to be player 1.");
            addPlayer(1);
            thisIsPlayerNumberX = 1;
            showGamePlay(1);
        }
        else {
            playerOne = snapshot.val().players["1"];
            playerTwo = snapshot.val().players["2"];

            if (!playerOne) {
                // bmc: create player 1
                console.log("Player 2 is in the house. You can be player 1.");
                addPlayer(1);
                $("#you-are-player").html("Player 2 is in the house. You can be player 1.");
                thisIsPlayerNumberX = 1;
                showGamePlay(1);
            }
            else if (!playerTwo) {
                // bmc: create player 2
                console.log("Player 1 is in the house. You can be player 2.");
                addPlayer(2);
                $("#you-are-player").html("Player 1 is in the house. You can be player 2.");
                thisIsPlayerNumberX = 2;
                showGamePlay(2);
            }
            else {
                // bmc: display "You can't play now"
                console.log("Two people are already playing. Please stand by for your turn.");
                $("#you-are-player").html("Two people are already playing. Please stand by.");
            }
        }

    });

    $("#theGame").css("display", "block");
    $(".name-input").css("display", "none");
    $("#greeting").text("Hi there, " + thisUsersNameIsX + "!");
    $(".just-the-name").text(thisUsersNameIsX);
});

// bmc: Player X finalizes choice with click
$("#done-with-choice1").on("click", function(e){
    e.preventDefault();

    // bmc: set variable "choice" to be the choice user checked
    var choice = $("input[name='choices']:checked").val();

    // bmc: append the right user with his choice (r, p or s (2, 0 or 1))
    playersRef.child(1).update({
        choice: choice
    });
    if (playerOneChoice != 17 && playerTwoChoice != 17) {
        pickTheWinner();
    }
});

$("#done-with-choice2").on("click", function(e){
    e.preventDefault();

    // bmc: set variable "choice" to be the choice user checked
    var choice = $("input[name='choices']:checked").val();

    // bmc: append the right user with his choice (r, p or s (2, 0 or 1))
    playersRef.child(2).update({
        choice: choice
    });
    if (playerOneChoice != 17 && playerTwoChoice != 17) {
        pickTheWinner();
    }
});


// bmc: when player 1 finalizes choice, set playerOneChoice to the choice
playerOneChoiceRef.on("value", function (snapshot) {
    if (snapshot.val() != 17 && snapshot.val() != null){
        playerOneChoice = snapshot.val();
        console.log("player one picked " + snapshot.val());
    }
});

// bmc: when player 2 finalizes choice, set playerTwoChoice to the choice
playerTwoChoiceRef.on("value", function (snapshot) {
    if (snapshot.val() != 17 && snapshot.val() != null){
        playerTwoChoice = snapshot.val();
        console.log("player two picked " + snapshot.val());
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
    playersRef.child(thisIsPlayerNumberX).remove();
}

function pickTheWinner() {
    var winDif = playerOneChoice - playerTwoChoice;

    if (winDif === 1 || winDif === -2) {
        console.log("You win!");
        // bmc: player one wins
        $("results").html("Player 1 picked " + choiceList[playerOneChoice] + ". <br>Player 2 picked " + choiceList[playerTwoChoice] + ". <br>" + playerOneName + " is the winner!");
        winner(1);
    }

    else if (winDif === -1 || winDif === 2) {
        console.log("You lose!");
        // bmc: player two wins
        $("results").html("Player 1 picked " + choiceList[playerOneChoice] + ". <br>Player 2 picked " + choiceList[playerTwoChoice] + ". <br>" + playerTwoName + " is the winner!");
        winner(2);
    }

    else {
        // bmc: there is a tie
        console.log("Hey, you tied!");
        $("results").html("Player 1 picked " + choiceList[playerOneChoice] + ". <br>Player 2 picked " + choiceList[playerTwoChoice] + ". <br>It's a tie!");
    }
}


// bmc: tally(number of player that won, number of player that lost)
function winner(player) {
    // bmc: update winner in firebase with +1
    // bmc: update loser in firebase with +1
    if (player = 1){
        playerOneWinsRef.once("value").then (function (snapshot) {
            playerOneWins = snapshot.val().wins + 1;
        });

        playerTwoLossesRef.once("value").then (function(snapshot){
            playerTwoLosses = snapshot.val().losses + 1;
        });
    }
    else {
        playerTwoWinsRef.once("value").then (function (snapshot) {
            playerTwoWins = snapshot.val().wins + 1;
        });

        playerOneLossesRef.once("value").then (function(snapshot){
            playerOneLosses = snapshot.val().losses + 1;
        });
       }


}

function showGamePlay(player) {
    idToChange = "#player" + player;
    $(idToChange).css("display", "block");
}
