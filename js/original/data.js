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
