
const data = [
  { date: '07-10-2015', neo: 1, kph: 72279.84},
  { date: '07-10-2015', neo: 2, kph: 97883.72},
  { date: '07-10-2015', neo: 3, kph: 138058.98},
  { date: '07-10-2015', neo: 4, kph: 66647.85},
  { date: '07-10-2015', neo: 5, kph: 48533.57},
  { date: '07-10-2015', neo: 6, kph: 47572.17},
  { date: '07-10-2015', neo: 7, kph: 25128.89},
  { date: '07-10-2015', neo: 8, kph: 9700.40},
  { date: '07-10-2015', neo: 9, kph: 26178.34},
  { date: '07-10-2015', neo: 10, kph: 12661.06},
  { date: '07-10-2015', neo: 11, kph: 29113.79},
  { date: '07-10-2015', neo: 12, kph: 31548.71},
  { date: '07-10-2015', neo: 13, kph: 4187.10}
];

const width = 1000;
const height = 400;
const margin = { top: 30, bottom: 50, left: 50, right: 50}

const svg = d3.select('#d3-container')
  .append('svg')
  .attr('height', height - margin.top - margin.bottom)
  .attr('width', width - margin.left - margin.right)
  .attr('viewBox', [0, 0, width, height]);

const x = d3.scaleBand()
  .domain(d3.range(data.length))
  .range([margin.left, width - margin.right])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, 150000])
  .range([height - margin.bottom, margin.top]);

svg
  .append('g')
  .attr('fill', 'darkblue')
  .selectAll('rect')
  .data(data.sort((a, b) => d3.descending(a.kph, b.kph)))
  .join('rect')
      .attr('x', (d, i) => x(i))
      .attr('y', (d) => y(d.kph))
      .attr('height', d => y(0) - y(d.kph))
      .attr('width', x.bandwidth())
      .attr('class', 'rectangle')

svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 20)
      .attr("text-anchor", "middle")
      .text("Date");
  
svg.append("text")
      .attr("x", -(height / 2))
      .attr("y", -margin.left)
      .attr("dy", "0.7em")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Kilometers per hour");

function xAxis(g) {
  g.attr('transform', `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(x).tickFormat(i => data[i].neo))
  .attr('font-size', '20px')
}

function yAxis(g) {
  g.attr('transform', `translate(${margin.left}, 0)`)
  .call(d3.axisLeft(y).ticks(null, data.format))
  .attr('font-size', '20px')
}

svg.append('g').call(yAxis);
svg.append('g').call(xAxis);
svg.node();



