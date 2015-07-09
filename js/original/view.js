var view = (function(){

	var that = {};

	// Creates a "graph" composed of 2 parts: a barchart and a piechart.
	var createGraph = function( iData ) {

    // console.log( "view.js- createGraph- iData:" );
    // console.log( iData );

		// Setup variables.
		var graphData = iData.teams;
		var totalCount = iData.totalCount;

		// Graph dimensions.
		var margin = {top: 50, right: 50, bottom: 100, left: 50},
		    width = 1100 - margin.left - margin.right,
		    height = 300 - margin.top - margin.bottom;

    // Clean the data.
	  graphData.forEach( function(d) {
	  	d.count = +d.count;
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
			.domain( [ 0, d3.max( graphData, function(d){ return d.count; } ) ] )
			.range( [ height, 0 ] );

// console.log( "y.domain(): " + y.domain() );
// console.log( "y.range(): " + y.range() );

  	// Here we create a scale to map teams to positions along the barchart width.
  	// RangeRoundBands determines the ideal width of the bands (ie. bars) and their positions.
    // https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeRoundBands
  	var x = d3.scale.ordinal()
			.domain( graphData.map(function(d) { return d.team; }))
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
	    .enter().append("rect")
	      .attr("class", function(d){ return ("bar "+ d.team); })
	      .attr("x", function(d,i) { return x( d.team ) })
	      .attr("width", x.rangeBand() )
	      .attr("y", function(d) { return y( d.count ); })
	      .attr("height", function(d) { return height - y( d.count ); });

    // Add statistics to top of each bar.
    // DATA-JOIN: ENTER
    barchartSvg.selectAll("bar-stats")
        .data(graphData)
      .enter().append("foreignObject")
          .attr("class", "bar-stats")
          .attr("width", x.rangeBand())
          .attr("height", 20)
          .attr("transform", function(d) { return "translate(" + (x(d.team)) +", "+ (y(d.count) - 20) + ")"; })
        .append("xhtml:p")
          .attr("class", "text-content")
          .html(function(d) {
            return "<p>"+ d.count +"</p>";
          });

    // Label to indicate the numbers in barchart are # of votes.
    // NO DATA-JOIN: just appending.
    barchartSvg.append("text")
    	.attr("transform", "translate(-30, -30)")
    	.text("# Votes:")
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
  	      .attr("height", x.rangeBand())
  	      .attr("transform", function(d) { return "translate(" + (x(d.team)) +", "+ (height+30) + ")"; })
  	    .append("xhtml:p")
  	      .attr("class", "content")
  	      .html(function(d) {
  	      	var width = x.rangeBand();
  	      	if ( d.team == "colts" ) { width = width * 0.6; }
  	      	if ( d.team == "cowboys" ) { width = width * 0.7; }
  	        return "<img class='center-block' src='img/"+ d.team +"_logo.png' width='"+ width +"'>";
  	      });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	  // PIECHART
	  // Uses a D3 built-in graph type (aka. a D3 "layout").
	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  // https://github.com/mbostock/d3/wiki/Pie-Layout
	  var pieWidth = width * 2/10,
	      pieHeight = pieWidth,
	      r = Math.min(pieWidth, pieHeight) / 2,
	      labelr = r + 20, // radius for label anchor
	      // Use the pie layout, and tell it how to access the values in our data that we want to use.
	      pie = d3.layout.pie().value( function(d){ return d.count } ),
	      arc = d3.svg.arc().innerRadius(0).outerRadius(r);

    var pieSvg = svg.append("g")
  	    .attr("class", "piechart")
  	    .attr("transform", "translate(" + (margin.left + barchartWidth + (width * 1/10) + r) + "," + (margin.top + r) + ")");


    // Create pie arcs based on our data.
    // DATA-JOIN: ENTER
    var arcs = pieSvg.selectAll(".arc")
    		// Give the pie layout our data, which it already knows how to use, thanks to d3.layout.pie().value().
        .data( pie(graphData) )
      .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("class", function(d){
			    // d3.layout.pie took our data and automatically generated new properties to draw the arcs.
// console.log( "d:" );
// console.log( d );
        	return d.data.team; })
        // now, the arc function knows to take those properties and create the SVG path that is appended.
        .attr("d", arc);

    // Labels of percent per pie slice.
    arcs.append("text")
        .attr("transform", function(d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                // pythagorean theorem for hypotenuse
                h = Math.sqrt(x*x + y*y);
            return "translate(" + (x/h * labelr) +  ',' +
               (y/h * labelr) +  ")";
        })
        .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })
        .text(function(d, i) {
        	var percentage = Math.round(d.data.count/totalCount*100);
        	if ( percentage > 0 ) {
        		if ( percentage > 9 ) { percentage = percentage.toString() + "%"; }
        		return percentage;
        	} else {
        		return "";
        	}
      	})
      	.style("font-size", "12px");

  	// Label to indicate the numbers in piechart are percentages.
  	pieSvg.append("text")
  		.attr("transform", "translate("+ (-r-40) +", "+ (-r-30) +")")
  		.text("Percent %:")
  		.style("font-size", "14px")
  		.style("font-style", "italic")
  		.style("font-weight", "bold");

  	// Call Bootstrap's popover method with D3's mouseover method.
		arcs.on("mouseover", function(d) {
			showPopover.call(this,
				"<div class='piechart-popover-content'>"+
					"<p><strong>Team:<br><span class='"+ d.data.team +"'>" + d.data.team + "</span></strong></p>"+
				"</div>"
			);
		});
		arcs.on("mouseout", function(d) { removePopovers(); });

	}

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

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Public Interface.
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	that.createGraph = createGraph;

	return that;

})();
