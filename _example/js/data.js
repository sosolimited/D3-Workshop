// Loads the data from various API calls, in a queue.
var q = queue();

var dataUrls =  [ "http://www.omdbapi.com/?t=Akira&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Ghost In The Shell&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Power Rangers&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Caligula&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Hot Tub Time Machine&y=&plot=short&r=json&tomatoes=true" ];

dataUrls.forEach( function( d ) { q.defer( d3.json, d ); });

q.awaitAll( function( error, results ){

	if (error) {
		console.warn( "ERROR loading files", error );
	} else {

		console.log( "results:" );
		console.log( results );

		var data = {};

		// Transform the data:
		// a) make sure the properties we want are converted to numbers.
		results.forEach( function( d ){
			d.tomatoMeter = +d.tomatoMeter;
			d.tomatoUserReviews = +d.tomatoUserReviews;
		});

		// b) compile the total number of user reviews.
		var numRatingsArray = _.pluck( results, 'tomatoUserReviews' );
		console.log( "numRatingsArray: " + numRatingsArray );

		var numRatingsTotal  = _.reduce( numRatingsArray, function(previous, current){ return previous + current; }, 0);
		console.log( "numRatingsTotal: " + numRatingsTotal );

		// Package the data.
		data.movieData = results;
		data.numRatingsTotal = numRatingsTotal;

		// Draw graphs.
		view.createGraph( data );

	}

});



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