var view = (function(){

	var that = {};

	var createGraph = function( iData ) {

    console.log( "view.js- createGraph- iData:" );
    console.log( iData );

		var graphData = iData.movieData;
		var totalCount = iData.numRatingsTotal;

		var margin = {top: 50, right: 50, bottom: 100, left: 50},
		    width = 1100 - margin.left - margin.right,
		    height = 300 - margin.top - margin.bottom;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	  // BARCHART
	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Uses tomatoMeter rating for barchart.

    var barchartWidth = width * 6/10;

		var y = d3.scale.linear()
			.domain( [ 0, d3.max( graphData, function(d){ return d.tomatoMeter; } ) ] )
			.range( [ height, 0 ] );

  	var x = d3.scale.ordinal()
			.domain( graphData.map(function(d) { return d.Title; }))
	    .rangeRoundBands( [ 0, barchartWidth ], 0.5 );

    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(10)
		    .tickFormat(d3.format("d"));

    // Use a pre-built color array for our charts, instead of CSS like the originals.
    var colorScale = d3.scale.category10();

		var svg = d3.select("#graph-container").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom);

	  var barchartSvg = svg.append("g")
		    .attr("class", "barchart")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  barchartSvg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  barchartSvg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis);

	  barchartSvg.append("g")
      		.attr("class", "bars")
  		.selectAll(".bar")
	      .data(graphData)
	    .enter().append("rect")
	      .attr("x", function(d,i) { return x( d.Title ) })
	      .attr("width", x.rangeBand() )
	      .attr("y", function(d) { return y( d.tomatoMeter ); })
	      .attr("height", function(d) { return height - y( d.tomatoMeter ); })
        .style("fill", function(d) { return colorScale( d.Title ); });

    barchartSvg.selectAll("bar-stats")
        .data(graphData)
      .enter().append("foreignObject")
          .attr("class", "bar-stats")
          .attr("width", x.rangeBand())
          .attr("height", 20)
          .attr("transform", function(d) { return "translate(" + (x(d.Title)) +", "+ (y(d.tomatoMeter) - 20) + ")"; })
        .append("xhtml:p")
          .attr("class", "text-content")
          .html(function(d) {
            return "<p>"+ d.tomatoMeter +"</p>";
          });

    barchartSvg.append("text")
    	.attr("transform", "translate(-30, -30)")
    	.text("# tomatoMeter:")
    	.style("font-size", "14px")
    	.style("font-style", "italic")
    	.style("font-weight", "bold");

  	barchartSvg.selectAll("bar-logos")
  	    .data(graphData)
  	  .enter().append("foreignObject")
  	      .attr("class", "bar-logos")
  	      .attr("width", x.rangeBand())
  	      .attr("height", x.rangeBand())
  	      .attr("transform", function(d) { return "translate(" + (x(d.Title)) +", "+ (height+30) + ")"; })
  	    .append("xhtml:p")
  	      .attr("class", "content")
  	      .html(function(d) {
  	      	var width = x.rangeBand() * 0.6;
  	      	var src = d.Poster;
  	        return "<img class='center-block' src='"+ src +"' width='"+ width +"'>";
  	      });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	  // PIECHART
	  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Uses # of tomatoUserReviews for piechart.

	  var pieWidth = width * 2/10,
	      pieHeight = pieWidth,
	      r = Math.min(pieWidth, pieHeight) / 2,
	      labelr = r + 20,
	      pie = d3.layout.pie().value( function(d){ return d.tomatoUserReviews } ),
	      arc = d3.svg.arc().innerRadius(0).outerRadius(r);

    var pieSvg = svg.append("g")
  	    .attr("class", "piechart")
  	    .attr("transform", "translate(" + (margin.left + barchartWidth + (width * 1/10) + r) + "," + (margin.top + r) + ")");

    var arcs = pieSvg.selectAll(".arc")
        .data( pie(graphData) )
      .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return colorScale( d.data.Title ); });

    arcs.append("text")
        .attr("transform", function(d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                h = Math.sqrt(x*x + y*y);
            return "translate(" + (x/h * labelr) +  ',' +
               (y/h * labelr) +  ")";
        })
        .attr("text-anchor", function(d) {
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })
        .text(function(d, i) {
          var percentage = Math.round(d.data.tomatoUserReviews/totalCount*100);
        	if ( percentage > 0 ) {
        		if ( percentage > 9 ) { percentage = percentage.toString() + "%"; }
        		return percentage;
        	} else {
        		return "";
        	}
      	})
      	.style("font-size", "12px");

  	pieSvg.append("text")
  		.attr("transform", "translate("+ (-r-40) +", "+ (-r-30) +")")
  		.text("tomatoUserReviews %:")
  		.style("font-size", "14px")
  		.style("font-style", "italic")
  		.style("font-weight", "bold");

		arcs.on("mouseover", function(d) {
			showPopover.call(this,
				"<div class='piechart-popover-content'>"+
					"<p><strong>Movie:<br><span style='color:"+ colorScale(d.data.Title) +"'>" + d.data.Title + "</span></strong></p>"+
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
