const API_KEY = 'i0NPDzV44zM4T1aVJsEFu8aTTIOTH9cLM7QzDuGp';
const startDate = '2015-09-07';
const endDate = '2015-09-08';

const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;

// Fetch data from the NASA API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const asteroidCounts = [];

    for (const date in data.near_earth_objects) {
      if (data.near_earth_objects.hasOwnProperty(date)) {
        const asteroids = data.near_earth_objects[date];
        asteroidCounts.push({ date, asteroidCount: asteroids.length });
      }
    }

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select('#my_dataviz')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // X axis: scale and draw
    var x = d3
      .scaleBand()
      .domain(asteroidCounts.map((d) => d.date))
      .range([0, width])
      .padding(0.1); // Add padding between bars
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // Y axis: scale and draw
    var y = d3.scaleLinear().range([height, 0]);
    y.domain([0, d3.max(asteroidCounts, (d) => d.asteroidCount)]);
    svg.append('g').call(d3.axisLeft(y));

    // Define the tooltip
    var tooltip = d3
      .select('#my_dataviz')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // append the bar rectangles to the svg element
    svg
      .selectAll('rect')
      .data(asteroidCounts)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.date))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.asteroidCount))
      .attr('height', (d) => height - y(d.asteroidCount))
      .style('fill', 'green')
      .on('mouseover', function (d) {
        // Show tooltip on hover over the bars
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`Date: ${d.date}<br>Asteroid Count: ${d.asteroidCount}`)
          .style('left', x(d.date) + x.bandwidth() / 2 + 'px')
          .style('top', y(d.asteroidCount) - 30 + 'px');
      })
      .on('mouseout', function (d) {
        // Hide tooltip on mouseout
        tooltip.transition().duration(500).style('opacity', 0);
      });
  })
  .catch((error) => console.error('Error:', error));