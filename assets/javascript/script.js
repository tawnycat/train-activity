// Initialize Firebase
var config = {
  apiKey: "AIzaSyBdGya9vD40-0pMG8J6HgsBcrstJhUfy7A",
  authDomain: "test-test-123-b7cfa.firebaseapp.com",
  databaseURL: "https://test-test-123-b7cfa.firebaseio.com",
  projectId: "test-test-123-b7cfa",
  storageBucket: "test-test-123-b7cfa.appspot.com",
  messagingSenderId: "805982091744"
};

firebase.initializeApp(config);

var database = firebase.database();

var nextArrival = "";
var minutesAway = "";

$(document).ready(function () {
  $("#submit").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainTime = $("#time-input").val().trim()
    var frequency = $("#frequency-input").val().trim();

    // Local object that holds train data
    var newTrain = {
      name: name,
      destination: destination,
      trainTime: trainTime,
      frequency: frequency
    };

    // Adds train to Firebase
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
  });

  // Allows us to refernce the info added to Firebase

  database.ref().on("child_added", function (childSnapshot) {

    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().trainTime;
    var frequency = childSnapshot.val().frequency;

    calculateTrain (frequency, trainTime);

    var tableDiv = ("<tr><td>" + name + "</td>" + "<td>" + destination + "</td>" + "<td>" + frequency + "</td>" + "<td>" + nextArrival +
      "<td>" + minutesAway + "</td>" + "</td>" + "</tr>");

    // Adds Firebase info to the table

    $("#tableBody").append(tableDiv);

  }, function (errorObject) {

    console.log("The read failed: " + errorObject.code);

  });

// Uses Moment to determine nextArrival and minutesAway

function calculateTrain (frequency, time) {

  var firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  var timeRemainder = diffTime % frequency;

  minutesAway = frequency - timeRemainder;

  nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");

}

});
