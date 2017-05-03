/**
 * Created by SilverDash on 5/3/17.
 */

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

    useThisDatabase.set({
        userName: userName,
        wins: 0,
        losses: 0
    });

    $(".name-input").css("display", "none");
    $("#start-play").css("display", "inline");
    $("#greeting").text(userName);
});

$(".choice").on("click", function(e){

});


