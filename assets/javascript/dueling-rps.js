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
var playersRef = theDatabase.ref("players");


var playerOneRef = playersRef.child("1");
var playerTwoRef = playersRef.child("2");


var playerOneChoiceRef = playerOneRef.child("choice");
var playerOneWinsRef = playerOneRef.child("wins");
var playerOneLossesRef = playerOneRef.child("losses");


var playerTwoChoiceRef = playerTwoRef.child("choice");
var playerTwoWinsRef = playerTwoRef.child("wins");
var playerTwoLossesRef = playerTwoRef.child("losses");


var choiceList = ["paper", "scissors", "rock"];

var playerOneChoice = 17;
var playerOneName;

var playerTwoChoice = 17;
var playerTwoName;

var thisUsersNameIsX = "";
var thisIsPlayerNumberX = 0;

var playerOneWins = 0;
var playerOneLosses = 0;
var playerTwoWins = 0;
var playerTwoLosses = 0;

// $("#player1").prop("display", "none");
// $("#player2").prop("display", "none");


// bmc: User inputs name and clicks Play Button
// bmc: This assigns the player a player number
$("#play").on("click", function (e) {
    e.preventDefault();

    // bmc: variable for the user
    thisUsersNameIsX = $("#userNameInput").val();

    // bmc: looking to see if there are players around (i.e. logged in and playing) so user can play (or be rejected)
    dbRef.once('value').then(function (snapshot) {
        areThereAnyPlayersInGame = snapshot.val();

        if (!areThereAnyPlayersInGame) {
            // bmc: create player 1
            console.log("There are no players, so you get to be player 1.");
            addPlayer(1);
            // $("#you-are-player").html("<h2>There are no players, so you get to be player 1. You" +
            //         " might have to wait to see Player 2 show up.</h2>");
            thisIsPlayerNumberX = 1;
            // showGamePlay(1);
            // disableGamePlay();
        }
        else {
            playerOne = snapshot.val().players["1"];
            playerTwo = snapshot.val().players["2"];

            if (!playerOne) {
                // bmc: create player 1
                console.log("Player 2 is in the house. You can be player 1.");
                addPlayer(1);
                // $("#you-are-player").html("Player 2 is already in the house. You are player 1.");
                thisIsPlayerNumberX = 1;
                // showGamePlay(1);
                // enableGamePlay();
            }
            else if (!playerTwo) {
                // bmc: create player 2
                console.log("Player 1 is in the house. You can be player 2.");
                addPlayer(2);
                // $("#you-are-player").html("<h2>Player 1 is already in the house. You are player" +
                //         " 2.<br>Click your choice under your player number only!</h2>");
                thisIsPlayerNumberX = 2;
                // showGamePlay(2);
                // enableGamePlay();

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
    // $(".just-the-name").text(thisUsersNameIsX);
});

// bmc: Player X finalizes choice with click
$("#done-with-choice1").on("click", function (e) {
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

$("#done-with-choice2").on("click", function (e) {
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
    if (snapshot.val() != 17 && snapshot.val() != null) {
        playerOneChoice = snapshot.val();
        console.log("player one picked " + snapshot.val());
    }
});

// bmc: when player 2 finalizes choice, set playerTwoChoice to the choice
playerTwoChoiceRef.on("value", function (snapshot) {
    if (snapshot.val() != 17 && snapshot.val() != null) {
        playerTwoChoice = snapshot.val();
        console.log("player two picked " + snapshot.val());
    }
});


// bmc: this gives us the quit button functionality; it works the same as if the user closed the browser
$("#quit").on("click", function (e) {
    e.preventDefault();
    $("#you-are-player").html("");
    $("#click-when-ready").html("");
    $("#greeting").text("See ya!");
    $(".just-the-name").text("");
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
    // disableGamePlay();
}

function pickTheWinner() {
    var winDif = playerOneChoice - playerTwoChoice;

    if (winDif === 1 || winDif === -2) {
        console.log("You win!");
        // bmc: player one wins
        $("results").html("Player 1 picked " + choiceList[playerOneChoice] + ". <br>Player 2 picked " + choiceList[playerTwoChoice] + ". <br>" + playerOneName + " is the winner!");
        playerOneIsTheWinner();
    }

    else if (winDif === -1 || winDif === 2) {
        console.log("You lose!");
        // bmc: player two wins
        $("results").html("Player 1 picked " + choiceList[playerOneChoice] + ". <br>Player 2 picked " + choiceList[playerTwoChoice] + ". <br>" + playerTwoName + " is the winner!");
        playerTwoIsTheWinner();
    }

    else {
        // bmc: there is a tie
        console.log("Hey, you tied!");
        $("results").html("Player 1 picked " + choiceList[playerOneChoice] + ". <br>Player 2 picked " + choiceList[playerTwoChoice] + ". <br>It's a tie!");
    }
}


// function showGamePlay(player) {
//     if (player === 1) {
//         $("#player1").css("display", "block");
//     }
//     if (player === 2) {
//         $("#player2").css("display", "block");
//     }
// }

// function enableGamePlay() {
//     $("input[name='choices']").prop("disabled", false);
//     $(".done-with-choice1").prop("disabled", false);
//     $(".done-with-choice2").prop("disabled", false);
// }

// function disableGamePlay() {
//     $("input[name='choices']").prop("disabled", true);
//     $("#done-with-choice1").prop("disabled", true);
//     $("#done-with-choice2").prop("disabled", true);
// }

// playerTwoRef.on("child_added", function (snapshot) {
//     // $(".done-with-choice2").prop("disabled", false);
//     $("#you-are-player").html('<h2>They\'re here! Click your choice under your player' +
//             ' number only!</h2>');
// });

// $(".player-2-ready").on("click", function (e) {
//     e.preventDefault();
//     $("#test-bit").text("it was clicked");
// });

// $("#test-bit").text("test bit");


// bmc: tally(number of player that won, number of player that lost)
function playerOneIsTheWinner() {

    playerOneWins++;
    playerTwoLosses++;

    playerOneRef.update({
        wins: playerOneWins
    });

     playerTwoRef.update({
        losses: playerTwoLosses
    });

}

function playerTwoIsTheWinner() {
    playerTwoWins++;
    playerOneLosses++;

    playerTwoRef.update({
        wins: playerTwoWins
    });

    playerOneRef.update({
        losses: playerOneLosses
    });
}

playerOneRef.on("value",function(snapshot){
    // choiceWord = choiceList[snapshot.val().choice];
    // $("#playerOneRPS").html("Player 2 picked " + choiceWord);

    $("#player-1-wins").html("Wins: " + snapshot.val().wins);
    $("#player-1-losses").html("Losses: " + snapshot.val().losses);

    $("#you-are-player").html("<h2>Player 1 is ready to play!</h2>");

    playerOneWins = snapshot.val().wins;
    playerOneLosses = snapshot.val().losses;

}, function(screwUp) {
    console.log("Arg! The read failed: " + screwUp.code);
});

playerTwoRef.on("value",function(snapshot){
    // choiceWord = choiceList[snapshot.val().choice];
    // $("#playerTwoRPS").html("Player 1 picked " + choiceWord);

    $("#player-2-wins").html("Wins: " + snapshot.val().wins);
    $("#player-2-losses").html("Losses: " + snapshot.val().losses);

    $("#you-are-player").html("<h2>Player 2 is ready to play!</h2>");

    playerTwoWins = snapshot.val().wins;
    playerTwoLosses = snapshot.val().losses;

}, function(screwUp) {
    console.log("Arg! The read failed: " + screwUp.code);
});

$("#chat-send").on("click", function() {
    // Don't refresh the page!
    event.preventDefault();

    // YOUR TASK!!!
    // Code in the logic for storing and retrieving the most recent user.
    // Don't forget to provide initial data to your Firebase database.
    chatLine = $("#chat").val().trim();

    dbRef.push({
        words: chatLine,
    });

});

// Firebase watcher + initial loader HINT: .on("value")
dbRef.on("value", function(snapshot) {

    // Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.val().words);


    // Change the HTML to reflect
    $("#chat-area").html(snapshot.val().words);


    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});