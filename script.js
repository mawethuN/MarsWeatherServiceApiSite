const apiUrl = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=aaqtBaH7Gw2RbSt35Xqb3C1E9hOybUGiYsIZEak5&feedtype=json&ver=1.0';

const chartContainer = d3.select("#chart-container");


function processData(data) {
  const nearEarthObjects = data.near_earth_objects;
  const dates = Object.keys(nearEarthObjects).sort(); 
  const asteroidCounts = dates.map(date => ({
    date: new Date(date), 
    count: nearEarthObjects[date].length,
  }));
  return asteroidCounts;
}


function createBarGraph(data) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = chartContainer.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .nice()
    .range([height, 0]);

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.date))
    .attr("width", width / data.length - 1)
    .attr("y", d => y(d.count))
    .attr("height", d => height - y(d.count));
    

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(data.length));

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 20)
    .attr("text-anchor", "middle")
    .text("Date");

  svg.append("text")
    .attr("x", -(height / 2))
    .attr("y", -margin.left)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Number of NEOs");

  const maxNEODate = data.reduce((maxDate, d) => (d.count > maxDate.count ? d : maxDate), { count: 0 });
  chartContainer.append("p")
    .text(`Date ${maxNEODate.date.toDateString()} had the highest number of NEOs (${maxNEODate.count} NEOs).`);
}

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    
    const processedData = processData(data);
    createBarGraph(processedData);
  })
  .catch(error => console.error("Error fetching data:", error));

function processData(data) {
  const neos = data.near_earth_objects;
  const neoCounts = Object.keys(neos).map(key => ({
    name: key,
    count: neos[key].length,
  }));
  return neoCounts;
}

function createLineGraph(data) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = chartContainer.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .nice()
    .range([height, 0]);

  const line = d3.line()
    .x(d => x(d.name) + x.bandwidth() / 2)
    .y(d => y(d.count));

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.name) + x.bandwidth() / 2)
    .attr("cy", d => y(d.count))
    .attr("r", 4);

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 20)
    .attr("text-anchor", "middle")
    .text("Near-Earth Object (NEO) Name");

  svg.append("text")
    .attr("x", -(height / 2))
    .attr("y", -margin.left)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Number of NEOs");
}

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const processedData = processData(data);
    createLineGraph(processedData);
  })
  .catch(error => console.error("Error fetching data:", error));




//Bar Graph2

function processData(data) {
  const nearEarthObjects = data.near_earth_objects;
  const dates = Object.keys(nearEarthObjects).sort();
  const asteroidCounts = dates.map(date => ({
    date: new Date(date), 
    count: nearEarthObjects[date].length,
  }));
  return asteroidCounts;
}


function createRedBarGraph(data) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = chartContainer.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .nice()
    .range([height, 0]);

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.date))
    .attr("width", width / data.length - 1) 
    .attr("y", d => y(d.count))
    .attr("height", d => height - y(d.count))
    .style("fill", "red"); 

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 20)
    .attr("text-anchor", "middle")
    .text("Date");

  svg.append("text")
    .attr("x", -(height / 2))
    .attr("y", -margin.left)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Number of NEOs");
}

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const processedData = processData(data);
    createRedBarGraph(processedData);
  })
  .catch(error => console.error("Error fetching data:", error));

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
