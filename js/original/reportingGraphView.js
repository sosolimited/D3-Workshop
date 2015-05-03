/*
File: reportingGraphView.js
Description: function to create graphs.
Author: JC Nesci
*/

var reportingGraphView = (function(){

	var that = {};

	var createGraph = function( iGraphType, iDayData ) {

		// console.log( "reportingGraphView- createGraph- iDayData:" );
		// console.log( iDayData );

		// Setup data.
		var graphType = iGraphType;
		var graphData = iDayData.teams;
		var day = iDayData.day;
		var dayTotal = iDayData.dayTotal;
		if ( graphType == "singleDay" ) {
			var headerDayTitle = "Day";
			var containerDiv = "graph-container";
		}
	  else if ( graphType == "dateRange" ) {
	  	var headerDayTitle = "Days";
	  	var containerDiv = "graph-container-daterange";
	  }

		// Graph dimensions.
		var margin = {top: 50, right: 50, bottom: 100, left: 50},
		    width = 1100 - margin.left - margin.right,
		    height = 300 - margin.top - margin.bottom;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	  // BARCHART
	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var	parseDate = d3.time.format( "%Y-%m-%d" ).parse;

    var barchartWidth = width * 6/10;

  	var x = d3.scale.ordinal()
	    .rangeRoundBands( [ 0, barchartWidth ], 0.5 );

		var y = d3.scale.linear()
		    .range( [ height, 0 ] );

    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(10)
		    .tickFormat(d3.format("d"));		// Display as integers.

	  var domRow = $("<div class='row'></div>").appendTo( "#" + containerDiv );
	  var domCol = $("<div class='col-md-12'></div>").appendTo( domRow );
	  var domHeader = $("<h3>"+ headerDayTitle +": "+ day +" | Total Votes: "+ dayTotal +"</h3>").appendTo(domCol);

		var svg = d3.select(domCol[0]).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom);

	  var barchartSvg = svg.append("g")
		    .attr("class", "barchart")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  // Clean the data.
	  graphData.forEach( function(d) {
	  	d.count = +d.count;
	  });

	  x.domain( graphData.map(function(d) { return d.team; }));
	  y.domain( [ 0, d3.max( graphData, function(d){ return d.count; } ) ] );

	  // Draw the axes.
	  barchartSvg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  barchartSvg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis);

		// Draw the bars.
	  barchartSvg.append("g")
      		.attr("id", "bars-" + day)
  		.selectAll(".bar")
	      .data(graphData)
	    .enter().append("rect")
	      .attr("class", function(d){ return ("bar "+ d.team); })
	      .attr("x", function(d,i) { return x( d.team ) })
	      .attr("width", x.rangeBand() )
	      .attr("y", function(d) { return y( d.count ); })
	      .attr("height", function(d) { return height - y( d.count ); });

    // Add statistics to top of each bar.
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
    barchartSvg.append("text")
    	.attr("transform", "translate(-30, -30)")
    	.text("# Votes:")
    	.style("font-size", "14px")
    	.style("font-style", "italic")
    	.style("font-weight", "bold");

  	// Add team logos under each bar.
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
	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	  var pieWidth = width * 2/10,
	      pieHeight = pieWidth,
	      r = Math.min(pieWidth, pieHeight) / 2,
	      labelr = r + 20, // radius for label anchor
	      pie = d3.layout.pie().value( function(d){ return d.count } ),
	      arc = d3.svg.arc().innerRadius(0).outerRadius(r);

    var pieSvg = svg.append("g")
  	    .attr("class", "piechart")
  	    .attr("transform", "translate(" + (margin.left + barchartWidth + (width * 1/10) + r) + "," + (margin.top + r) + ")");

    var arcs = pieSvg.selectAll(".arc")
        .data( pie(graphData) )
      .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("class", function(d){
        	return d.data.team; })
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
        	var percentage = Math.round(d.data.count/dayTotal*100);
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

		arcs.on("mouseover", function(d) {
			showPopover.call(this,
				"<div class='piechart-popover-content'>"+
					"<p><strong>Team:<br><span class='"+ d.data.team +"'>" + d.data.team + "</span></strong></p>"+
				"</div>"
			);
		});
		arcs.on("mouseout", function(d) { removePopovers(); });

	}

	var removePopovers = function() {
	  $('.popover').each(function() {
	    $(this).remove();
	  });
	}

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

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Public Interface.
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	that.createGraph = createGraph;

	return that;

})();
