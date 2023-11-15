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

    // Extract NEOs with high kilometers per hour
    const neoArray = [];
    for (const date in neoData) {
      neoData[date].forEach((neo) => {
        const kph = parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour);
        if (kph > 20000) { // Define your threshold for "high" kilometers per hour
          neoArray.push({ neo, kph });
        }
      });
    }

    // Sort NEOs by kilometers per hour in descending order
    const sortedNeoArray = neoArray.sort((a, b) => b.kph - a.kph);

    // Create rings of circles
    const rings = [
      { numCircles: 6, radius: 100 },
      { numCircles: 12, radius: 200 },
      { numCircles: 18, radius: 300 },
    ];

    let circleIndex = 0;

    rings.forEach((ring) => {
      const { numCircles, radius } = ring;

      for (let i = 0; i < numCircles; i++) {
        if (circleIndex < sortedNeoArray.length) {
          const neo = sortedNeoArray[circleIndex].neo;
          const kph = sortedNeoArray[circleIndex].kph;

          const angle = (i / numCircles) * 2 * Math.PI;
          const cx = width / 2 + radius * Math.cos(angle);
          const cy = height / 2 + radius * Math.sin(angle);
          const circleRadius = 20;

          const circle = svg.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', circleRadius)
            .attr('fill', 'red')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)
            .on('click', () => onClick(neo));

          const text = svg.append('text')
            .text(`${kph.toFixed(2)} km/h`)
            .attr('x', cx)
            .attr('y', cy + circleRadius + 15)
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .classed('neo-text', true)
            .style('pointer-events', 'none')
            .style('user-select', 'none')
            .style('cursor', 'default')
            .attr('visibility', 'hidden');

          function handleMouseOver() {
            circle.attr('fill', 'blue');
          }

          function handleMouseOut() {
            circle.attr('fill', 'red');
          }

          function onClick(neo) {
            const visibility = text.attr('visibility');
            text.attr('visibility', visibility === 'hidden' ? 'visible' : 'hidden');
            if (visibility === 'visible') {
              // Display kilometers per hour for the clicked NEO
              alert(`Kilometers per hour: ${kph.toFixed(2)}`);
            }
          }

          circleIndex++;
        }
      }
    });
  })
  .catch((error) => console.error(error));


