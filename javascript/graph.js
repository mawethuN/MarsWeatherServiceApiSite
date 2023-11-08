const apiKey = 'i0NPDzV44zM4T1aVJsEFu8aTTIOTH9cLM7QzDuGp';
const startDate = '2015-09-07';
const endDate = '2015-09-08';
const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

// Fetch NEO data from NASA API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Extract NEO data for the 7th and 8th days
    const day7Data = data.near_earth_objects[startDate];
    const day8Data = data.near_earth_objects[endDate];

    // Create an array of data for the two days
    const dataForTwoDays = [day7Data, day8Data];

    // Set up dimensions for the chart
    const width = 600;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const arcPadding = 10;

    // Create a SVG element
    const svg = d3.select('#chart').append('svg').attr('width', width).attr('height', height);

    // Define an arc generator
    const arc = d3.arc().innerRadius(0).outerRadius(radius - arcPadding);

    // Create a group element for the pie chart
    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    // Create the pie generator
    const pie = d3.pie().value((d) => d.length);

    // Set up colors for the segments
    const colors = ['blue', 'red'];

    // Hover effect
    function handleMouseOver(d, i) {
      d3.select(this).attr('fill', d3.rgb(colors[i]).darker(1));
    }

    function handleMouseOut(d, i) {
      d3.select(this).attr('fill', colors[i]);
    }

    const onClick = function (event, d) {
      const numObjects = d.length;
      alert(`Number of Near-Earth Objects: ${numObjects}`);
    };

    // Draw the pie segments
    const arcs = g
      .selectAll('arc')
      .data(pie(dataForTwoDays))
      .enter()
      .append('g')
      .on('click', onClick)
      .attr('cursor', 'pointer');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colors[i])
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // Create a legend on the right side
    const legend = svg
      .selectAll('.legend')
      .data(dataForTwoDays)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${width - 100},${i * 20})`);

    legend
      .append('rect')
      .attr('x', 0)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', (d, i) => colors[i]);

    legend
      .append('text')
      .attr('x', 25)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text((d, i) => {
        const date = new Date(d[0].close_approach_data[0].close_approach_date);
        const color = colors[i] === 'blue' ? 'Blue' : 'Pink';
        return `${date.toDateString()} (${color})`;
      });

    // Add labels and title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 30)
      .attr('text-anchor', 'middle')
      .text('Near-Earth Objects');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .text('day 7 and 8');
  })
  .catch((error) => console.error(error));
