// Define the API URL
const apiUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=aaqtBaH7Gw2RbSt35Xqb3C1E9hOybUGiYsIZEak5&feedtype=json&ver=1.0";

function animateBars(data) {
    var svg = d3.select(methods.el["selector"] + " .barchart");
    var barrects = d3.select(methods.el["selector"] + " .barrects");
  
    var initialHeight = 0;
  
    var bar = barrects.selectAll("rect")
      .data(data);
  
    // Enter
    var enteredBars = bar.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", initialHeight);
  
    // Update and animate the bars
    bar
      .attr("height", initialHeight)
      .transition()
      .duration(500)
      .attr("x", function (d) { return methods.x(d.letter); })
      .attr("width", methods.x.rangeBand())
      .attr("y", initialHeight) // Start with a height of 0
      .attr("height", 0) // Start with a height of 0
      .transition() // Animate the height
      .duration(1000) // Animation duration
      .attr("y", function (d) { return methods.y(d.frequency); })
      .attr("height", function (d) { return methods.height - methods.y(d.frequency); });
  
    // Add a hover option to display coordinates
    enteredBars
      .on("mouseover", function (d) {
        d3.select(this)
          .append("title")
          .text(function (d) { return "Letter: " + d.letter + "\nFrequency: " + d.frequency; });
      })
      .on("mouseout", function () {
        d3.select(this).select("title").remove();
      });
  
    // Exit and remove any bars not in the updated data
    bar.exit()
      .transition()
      .duration(250)
      .attr("y", initialHeight)
      .attr("height", initialHeight)
      .remove();
  }