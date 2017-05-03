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

