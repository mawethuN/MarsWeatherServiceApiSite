const apiKey = 'i0NPDzV44zM4T1aVJsEFu8aTTIOTH9cLM7QzDuGp';
const startDate = '2015-09-07';
const endDate = '2015-09-09';
const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

// Create an SVG element
const svg = d3.select('#neoCircles');
const width = window.innerWidth;
const height = window.innerHeight;

svg.attr('width', width).attr('height', height);

// Fetch NEO data from NASA API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const neoData = data.near_earth_objects;

    // Calculate the total kilometers per hour for all NEOs
    let totalKPH = 0;
    let neoCount = 0;

    for (const date in neoData) {
      neoData[date].forEach((neo) => {
        totalKPH += parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour);
        neoCount++;
      });
    }

    // Calculate the average kilometers per hour
    const avgKPH = totalKPH / neoCount;

    // Create circles with varying shades of grey
    const numCircles = neoCount;
    const circleRadius = 10;

    for (let i = 0; i < numCircles; i++) {
      const greyShade = Math.floor((i / numCircles) * 255); // Vary shades from 0 (black) to 255 (white)
      const circleColor = `rgb(${greyShade},${greyShade},${greyShade})`;
      const cx = Math.random() * width;
      const cy = Math.random() * height;

      svg.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', circleRadius)
        .attr('fill', circleColor)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    }

    // Display the average kilometers per hour as text
    svg.append('text')
      .text(`Avg KPH: ${avgKPH.toFixed(2)} km/h`)
      .attr('x', width / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .style('fill', 'white');
  })
  .catch((error) => console.error(error));





















/*const startDate = "2015-09-07";
const endDate = "2015-09-15";
const apiKey = "i0NPDzV44zM4T1aVJsEFu8aTTIOTH9cLM7QzDuGp";
const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

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
          .style('top', y(d.asteroidCount) - 100 + 'px');
      })
      .on('mouseout', function (d) {
        // Hide tooltip on mouseout
        tooltip.transition().duration(500).style('opacity', 0);
      });
  })
  .catch((error) => console.error('Error:', error));
*/