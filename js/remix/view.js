var view = (function(){

	var that = {};

	// Creates a "graph" composed of 2 parts: a barchart and a piechart.
	var createGraph = function( iData ) {

    // console.log( "view.js- createGraph- iData:" );
    // console.log( iData );

		// Setup variables.
		var graphData = iData;

		// Graph dimensions.
		var margin = {top: 50, right: 50, bottom: 200, left: 50},
		    width = 1600 - margin.left - margin.right,
		    height = 600 - margin.top - margin.bottom;

    // Clean the data.
	  graphData.forEach( function(d) {
	  	d.rotten = +d.rotten;
	  });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	  // BARCHART
	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // The barchart width is only a part of the total graph width.
    var barchartWidth = width * 6/10;

    // Here we create a scale to map count values to positions along the barchart height.
		// https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear
		// http://chimera.labs.oreilly.com/books/1230000000345/ch07.html#_domains_and_ranges
		var y = d3.scale.linear()
			.domain( [ 0, d3.max( graphData, function(d){ return d.rotten; } ) ] )
			.range( [ height, 0 ] );

// console.log( "y.domain(): " + y.domain() );
// console.log( "y.range(): " + y.range() );

  	// Here we create a scale to map teams to positions along the barchart width.
  	// RangeRoundBands determines the ideal width of the bands (ie. bars) and their positions.
    // https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeRoundBands
  	var x = d3.scale.ordinal()
			.domain( graphData.map(function(d) { return d.title; }))
	    .rangeRoundBands( [ 0, barchartWidth ], 0.5 );

// console.log( "x.domain(): " + x.domain() );
// console.log( "x.range(): " + x.range() );
// console.log( "x.rangeBand(): " + x.rangeBand() );
// console.log( "x.rangeExtent(): " + x.rangeExtent() );

    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

		var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10)
	    .tickFormat(d3.format("d"));		// Display as integers.

		var svg = d3.select("#graph-container").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	  var barchartSvg = svg.append("g")
	    .attr("class", "barchart")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  // Draw the axes.
	  barchartSvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

	  barchartSvg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

		// Draw the bars.
		// DATA-JOIN: ENTER
	  barchartSvg.append("g")
      		.attr("class", "bars")
  		.selectAll(".bar")
	      .data(graphData)
	    .enter().append("g")
	      .attr("class", function(d,i){
          return ("bar "+ d.title); })
	      .attr("x", function(d) { return x( d.title ) })
	      .attr("width", x.rangeBand() )
	      .attr("y", function(d) { return y( d.rotten ); })
	      .attr("height", function(d) { return height - y( d.rotten ); })
      .each(function(d, i) {
        for (var j=0; j < d.rotten; ++j ) {
          var g = d3.select(this); // That's the svg:g we've just created
          g.append('circle')
          .attr('cy', y(7 + j) + 30)
          .attr('cx', x(d.title) + x.rangeBand()/2)
          .attr('r', 5)
          .attr('class', 'tomato');
        }
      });


    // Add statistics to top of each bar.
    // DATA-JOIN: ENTER
    barchartSvg.selectAll("bar-stats")

        .data(graphData)
      .enter().append("foreignObject")
          .attr("class", "bar-stats")
          .attr("width", x.rangeBand())
          .attr("height", 20)
          .attr("transform", function(d) { return "translate(" + (x(d.title)) +", "+ (y(d.rotten) - 20) + ")"; })
        .append("xhtml:p")
          .attr("class", "text-content")
          .html(function(d) {
            return "<p>"+ d.rotten +"</p>";
          });

    // Label to indicate the numbers in barchart are # of votes.
    // NO DATA-JOIN: just appending.
    barchartSvg.append("text")
    	.attr("transform", "translate(-30, -30)")
    	.text("# Rotten:")
    	.style("font-size", "14px")
    	.style("font-style", "italic")
    	.style("font-weight", "bold");

  	// Add team logos under each bar.
  	// DATA-JOIN: ENTER
  	barchartSvg.selectAll("bar-logos")
  	    .data(graphData)
  	  .enter().append("foreignObject")
  	      .attr("class", "bar-logos")
  	      .attr("width", x.rangeBand())
  	      .attr("height", 116)
  	      .attr("transform", function(d) { return "translate(" + (x(d.title)) +", "+ (height+30) + ")"; })
  	    .append("xhtml:p")
  	      .attr("class", "content")
  	      .html(function(d) {
  	      	var width = x.rangeBand();

  	        return "<img class='center-block' src='"+ d.image +"' width='"+ width +" height='116px'>";
  	      });


	// Creates a Bootstrap popover for the element on which is it called.
	var showPopover = function( iContent ) {
	  $(this).popover({
	    placement: 'auto top',
	    container: 'body',
	    trigger: 'manual',
	    html : true,
	    content: function() {
	      return iContent }
	  });
	  $(this).popover('show')
	}

	// Removes all popovers.
	var removePopovers = function() {
	  $('.popover').each(function() {
	    $(this).remove();
	  });
	}

}
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Public Interface.
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	that.createGraph = createGraph;

	return that;

})();
