// Use Queue.js (by Bostock) to load & combine data from various API calls.
var q = queue();

var dataUrls =  [ "http://www.omdbapi.com/?t=Akira&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Ghost In The Shell&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Power Rangers&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Caligula&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?t=Hot Tub Time Machine&y=&plot=short&r=json&tomatoes=true",
									"http://www.omdbapi.com/?s=Spielberg&r=json" ];

dataUrls.forEach( function( d ) { q.defer( d3.json, d ); });

q.awaitAll( function( error, results ){

	if (error) {

		console.warn( "ERROR loading files", error );

	} else {

		console.log( "results:" );
		console.log( results );

	}

});
