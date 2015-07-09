var movieData,
    width = 640,
    height = 480,
    svg = d3.select("#graph-container").append("svg")
      .attr("width", width)
      .attr("height", height);

function startRemix(data) {
  movieData = data;
  console.log("Movie data done gotten:", movieData);

  var ranks = movieData.map(function (movie) { return +movie.imdbRating; })
                .filter(function (rating) { return isFinite(rating); }),
      imdbScale = d3.scale.linear()
                    .domain([d3.min(d3.values(ranks)), d3.max(d3.values(ranks))])
                    .range([100, 600]);

                    console.log(ranks);
  var groups = svg.selectAll("g")
                .data(movieData)
                .enter()
                  .append("g");

  groups.append("circle")
        .attr("cx", function(data, index) { return index * 100 + 50; } )
        .attr("cy", 100)
        .attr("r", 25)
        .style("fill", "#FF0");

  groups.append("image")
    .attr("xlink:href", function (movie) { return movie.Poster; })
    .attr("width", 100)
    .attr("height", function (movie) {
      return imdbScale(+movie.imdbRating);
    } )
    .attr("x", function (movie, index) { return index * 100; })
    .attr("y", 0);
}
