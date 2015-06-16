// Use Queue.js (by Bostock) to load & combine data from various API calls.
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
