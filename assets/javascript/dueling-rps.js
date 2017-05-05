/**
 * Created by SilverDash on 5/3/17.
 */


var playerOneChoice;
var playerTwoChoice;
var playerOneName;
var playerTwoName;
var userName = "";
var whoIAm = 0;
var thisUser = "";


var configThisAlready = {
    apiKey: "AIzaSyCNyA8ecM-65kxrfuwxxMQr1f0Ujoasr7I",
    authDomain: "dueling-rps.firebaseapp.com",
    databaseURL: "https://dueling-rps.firebaseio.com/",
    storageBucket: "dueling-rps.appspot.com"
};

firebase.initializeApp(configThisAlready);

// Create a variable to reference the database
var uberDatabase = firebase.database();

var useThisDatabase = uberDatabase.ref();



$("#play").on("click", function(e){
    e.preventDefault();
    userName = $("#userName").val();

    useThisDatabase.once('value').then(function(snapshot){

        playersAround = snapshot.val();

        if (!playersAround){
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

    thisUser = uberDatabase.ref("players").child(whoIAm);
    console.log("thisUser", thisUser);
    // var playersActive = uberDatabase.ref("players");
    // playersActive.on("value", function (snapshot) {
    //     console.log(snapshot.val());
    // });


    // var firstPlayer = uberDatabase.ref("players").child("1");
    // firstPlayer.on("value", function(snapshot) {
    //     console.log(snapshot.val());
    //     console.log(snapshot.val().userName); // bmc: this is the name of player
    // });


    // logThis = useThisDatabase.thisUserID;
    // console.log("useThisDatabase.val().thisUserID.wins", logThis);

    $(".name-input").css("display", "none");
    $("#theGame").css("display", "inline");
    $("#greeting").text("Hi there, " + userName + "!");
});

$("#done-with-choice").on("click", function(e){
    e.preventDefault();
    var choiceList = ["paper", "scissors", "rock"];
    var choice = $("input[name='choices']:checked").val();

    // bmc: append the user whoIAm with the value
    uberDatabase.ref("players").child(whoIAm).update({
        choice: choice
    });

    useThisDatabase.on('value', function(snapshot){
        playerOneChoice = snapshot.val().players["1"].choice;
        playerTwoChoice = snapshot.val().players["2"].choice;

        playerOneName = snapshot.val().players["1"].userName;
        playerTwoName = snapshot.val().players["2"].userName;

    });

    // var compChoice = Math.round(Math.random()*10) % 3;

    // var compChoiceA =
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



function addPlayer(number) {
    addPlayerHere = uberDatabase.ref("players").child(number);

    addPlayerHere.set({
        userName: userName,
        wins: 0,
        losses: 0
    });
    whoIAm = number;
    $("#you-are-player").html("You are player " + whoIAm);
}


// $(window).unload(function () {
//     // bmc: delete that user
//     uberDatabase.ref("players").child(whoIAm);
// });

// window.onbeforeunload = function() {
//     uberDatabase.ref("players").child(whoIAm);
// };

// window.onbeforeunload = function () {
//     alert("Do you really want to close?");
// };

console.log("whoIAm is ", whoIAm);

// useThisDatabase.onDisconnect().remove();

$("#quit").on("click", function(e) {
    e.preventDefault();
    deleteUser();
});


function deleteUser() {
    console.log("trying to delete user");
    console.log("whoIAm is ", whoIAm);

    uberDatabase.ref("players").child(whoIAm).remove();
}