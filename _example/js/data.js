// Loads the data from various API calls, in a queue.
var q = queue();
var dataUrls =  [ "http://www.omdbapi.com/?t=Akira&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Ghost In The Shell&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Power Rangers&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Caligula&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Hot Tub Time Machine&y=&plot=short&r=json&tomatoes=true" ];
dataUrls.forEach(function(d) { q.defer(d3.json, d); });
q.awaitAll(function(error, results){

	if (error) {
		console.warn( "ERROR loading files", error);
	} else {

		console.log( "results:" );
		console.log( results );

		parseData( results );

	}

});

// Parse the data into the desired format, then send it to the graph builder.
function parseData( iData ) {

	var parsedData = _.map( iData, function( d ){
		var newObj = {	title: d.Title,
										rating: +d.tomatoMeter,
										numRatings: d.tomatoUserReviews };
		return newObj;
	});

	console.log( "parsedData:" );
	console.log( parsedData );

	view.createGraph( parsedData );

}


/*
// Loads the JSON file.
d3.json("data/originalData-temp2.json", function(error, data) {

// console.log( "data.js- data:" );
// console.log( data );

	// Transform the data, adding a new attribute that we'd like to have.
	var countsOnly = _.pluck( data.teams, 'count' );
// console.log( "countsOnly: " + countsOnly );

	var totalCount  = _.reduce( countsOnly, function(previous, current){ return previous + current; }, 0);
// console.log( "totalCount: " + totalCount );

	data.totalCount = totalCount;

	// Now the data is ready, create the graphs.
	view.createGraph( data );

});
*/