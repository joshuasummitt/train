//initialize Firebase


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAKAnGeu9fqo0apxRyoEgCRNvV87IOD5QI",
    authDomain: "train-schedule-917e1.firebaseapp.com",
    databaseURL: "https://train-schedule-917e1.firebaseio.com",
    projectId: "train-schedule-917e1",
    storageBucket: "",
    messagingSenderId: "847851107068"
  };
  firebase.initializeApp(config);


//create a variable to reference the database
var database = firebase.database();

//Capture button click
$("#button_submit").on("click", function() {
	//create a variable to hold user input
	var name = $('#trainName').val().trim();
	var destination = $('#destination').val().trim();
	var time = $('#firstTrainTime').val().trim();
	var frequency = $('#frequency').val().trim();
	//if the input fields are not empty
		if( 
		name != "" &&
		destination != "" &&
		time != "" &&
		frequency != "" ){
	//push the data to firebase
		database.ref().push({
		name: trainName,
		destination: destination,
		time: firstTrainTime,
		frequency: frequency
	});  

    document.getElementById("#button_submit").value = '';
//otherwise don't submit
	else {
		return false;
	}

	// Don't refresh the page!
	return false;
}

// auto-refresh page every 2 mins - see corresponding code in body tag (next time do w/o "blink")
function AutoRefresh( t ) {
setTimeout("location.reload(true);" , t);
}

//Firebase watcher + initial loader .on("value")
database.ref().on("child_added", function(childSnapshot) {

	//create rows to display the database values
	var $trainBody = $('#trainRows');
	var $trainRow = $('<tr>');
	var $trainName = $('<td>').html(childSnapshot.val().trainName).appendTo($trainRow);
	var $destination = $('<td>').html(childSnapshot.val().destination).appendTo($trainRow);
	var $frequency = $('<td>').html(childSnapshot.val().frequency).appendTo($trainRow);	
	
	var frequency = childSnapshot.val().frequency;
	var startTime = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");		
	var minAway = frequency - (moment().diff(moment(startTime), "minutes") % frequency);
	
	var nextTrain = $('<td>').html(moment(moment().add(minAway, "minutes")).format("hh:mm")).appendTo($trainRow);
	var minutesAway = $('<td>').html(minAway).appendTo($trainRow);
		
	$trainRow.appendTo($trainBody);


// Handle the errors
}, function(errorObject) {

	console.log("Errors handled: " + errorObject.code);
});