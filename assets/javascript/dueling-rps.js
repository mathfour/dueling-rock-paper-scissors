/**
 * Created by SilverDash on 5/3/17.
 */


var playerOneChoice;
var playerTwoChoice;
var playerOneName;
var playerTwoName;
var thisUsersNameIsX = "";
var thisIsPlayerNumberX = 0;

// bmc: todo create chat (shouldn't be terribly hard, right?)

var configThisAlready = {
    apiKey: "AIzaSyCNyA8ecM-65kxrfuwxxMQr1f0Ujoasr7I",
    authDomain: "dueling-rps.firebaseapp.com",
    databaseURL: "https://dueling-rps.firebaseio.com/",
    storageBucket: "dueling-rps.appspot.com"
};

firebase.initializeApp(configThisAlready);

// Create a variable to reference the database
var theDatabase = firebase.database();

// bmc: variable so I don't have to keep writing "ref" for the whole thing
var dbRef = theDatabase.ref();



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

    $(".name-input").css("display", "none");
    $("#greeting").text("Hi there, " + thisUsersNameIsX + "!");
});

// bmc: todo move the winner logic to right after the 2nd player chooses

// bmc: turn taking

// bmc: todo show choices to playerOne and wait for him to choose

// bmc: todo send choice to firebase

// bmc: todo dbRef.on("child added" with params) <- will indicate that playerOne has entered his choice and it's playerTwo's turn

// bmc: show choices to playerTwo and wait for him to choose

// bmc: send choice to firebase

// bmc: dbRef.on("child added" with params) <- will indicate that playerTwo has entered his choice and we can determine the winner

function takeTurn(playerNum) {
    // bmc: $("#id-for-info-for-the it's your turn thing").text("It's player"+ playerNum + "'s turn");
    $("#player-x-turn").html("It's player " + playerNum + "'s turn!");
    if (playerNum === thisIsPlayerNumberX){
        $("#theGame").css("display", "inline");
    }
    // bmc: LEFT OFF HERE LEFT OFF HERE todo LEFT OFF HERE
}

$("#done-with-choice").on("click", function(e){
    e.preventDefault();
    var choiceList = ["paper", "scissors", "rock"];
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

    console.log("2 is rock, 0 is paper and 1 is scissors:", choice);

    // bmc: on competitor choice, access it and then do arithmetic
    // var winDif = choice - compChoice;
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
        losses: 0
    });
    thisIsPlayerNumberX = playerNumberX;
    $("#you-are-player").html("You are player " + thisIsPlayerNumberX);
}

// bmc: This deletes the user that is registered
function deleteUser() {
    theDatabase.ref("players").child(thisIsPlayerNumberX).remove();
}