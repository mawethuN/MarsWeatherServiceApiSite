const apiKey = 'i0NPDzV44zM4T1aVJsEFu8aTTIOTH9cLM7QzDuGp';
      const startDate = '2015-09-07';
      const endDate = '2015-09-09';

      const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

      // Fetch NEO data from NASA API
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const neoData = data.near_earth_objects;

          // Extract dates and speed data for all NEOs
          const dates = Object.keys(neoData);
          const speeds = dates.map((date) =>
            neoData[date].map((neo) => parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour))
          );

          const width = 900;
          const height = 400;
          const margin = { top: 30, bottom: 50, left: 0.13, right: 50}

          // Create SVG element
          const svg = d3.select('#chart')
            .append('svg')
            .attr('height', height - margin.top - margin.bottom)
            .attr('width', width - margin.left - margin.right)
            .attr('viewBox', [0, 0, width, height]);

          const x = d3
            .scaleBand()
            .domain(dates)
            .range([margin.left, width - margin.right])
            .padding(0.8);

          const y = d3
            .scaleLinear()
            .domain([0, d3.max(speeds.flat())])
            .nice()
            .range([height - margin.bottom, margin.top]);
          
            const xAxis = (g) =>
            g
              .attr('transform', `translate(0,${height - margin.bottom})`)
              .call(d3.axisBottom(x).tickValues([]));
      
          const yAxis = (g) =>
            g
              .attr('transform', `translate(${margin.left},0)`)
              .call(d3.axisLeft(y).ticks(6))
              .call((g) => g.select('.domain').remove());
      
          svg.append('g').call(xAxis);
          svg.append('g').call(yAxis);

          // Create the line generator
          const line = d3
            .line()
            .x((d, i) => x(dates[i]) + x.bandwidth() / 2)
            .y((d) => y(d))
            .curve(d3.curveMonotoneX);

          svg
            .append('path')
            .datum(speeds[0]) // Display the first data series
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);

          // Create circles (nodes) at each data point
          svg
            .selectAll('circle')
            .data(speeds[0]) // Display the first data series
            .enter()
            .append('circle')
            .attr('cx', (d, i) => x(dates[i]) + x.bandwidth() / 2)
            .attr('cy', (d) => y(d))
            .attr('r', 5)
            .attr('fill', 'steelblue');
          
          // Add labels and title
          svg
            .append('text')
            .attr('x', width / 2)
            .attr('y', height - margin.bottom / 2)
            .attr('text-anchor', 'middle')
            .text('Dates');

          svg
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', margin.left / 2)
            .attr('dy', '40em')
            .attr('text-anchor', 'middle')
            .text('Kilometers per Hour');

           // Create the bar chart
          const barHeight = 40;
          svg
            .selectAll('rect')
            .data(speeds[0]) // Display the first data series
            .enter()
            .append('rect')
            .attr('x', (d, i) => x(dates[i]))
            .attr('y', height - margin.bottom)
            .attr('width', x.bandwidth())
            .attr('height', barHeight)
            .attr('fill', 'steelblue');
          
          svg
            .selectAll('rect')
            .attr('y', (d, i) => height - y(speeds[0][i]));

        })
        .catch((error) => console.error(error));