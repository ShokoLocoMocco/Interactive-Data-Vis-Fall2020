// data load
//T2
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("TVShows-Netflix_mod.csv", d3.autoType).then(data => {
  console.log(data);

  /** CONSTANTS */
  // constants help us reference the same values throughout our code
  const width = window.innerWidth * 0.8,
  height = window.innerHeight ,
  paddingInner = 0.2,
  margin = { top: 30, bottom: 50, left: 50, right: 40 };

/** SCALES */
// reference for d3.scales: https://github.com/d3/d3-scale
  const xScale = d3
  .scaleLinear()
  .domain([.1, d3.max(data, d => d.IMDb)])
  .range([20, width - margin.left]);

  const yScale = d3
  .scaleBand()
  .domain(data.map(d => d.Title))
  .range([margin.top, height - margin.bottom])
  .paddingInner(paddingInner)
  ;

// reference for d3.axis: https://github.com/d3/d3-axis
const xAxis = d3.axisBottom(xScale).ticks(data.length);
const yAxis = d3.axisLeft(yScale).ticks(data.length);

/** MAIN CODE */
const svg = d3
  .select("#d3-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("paddingInner", "50px")
  .style("background", "rgba(248, 248, 255, 1");

// append rects
const rect = svg
  .selectAll("rect")
  .data(data)
  .join("rect")
  .attr("y", d => yScale(d.Title))
  .attr("x", 20) ///d => xScale(d.count))
  .attr("width", d => xScale(d.IMDb))
  .attr("height", d => yScale.bandwidth())
  .attr("fill", "rgba(178, 32, 32, 1)");

// append text
const text = svg
  .selectAll("text")
  .data(data)
  .join("text")
  .attr("class", "label")
  // this allows us to position the text in the center of the bar
  .attr("x", d => xScale(d.IMDb))
  .attr("y", d => yScale(d.Title)+ (yScale.bandwidth() / 100))
  .text(d => d.IMDb)
  .attr("dy", "1.5em");

  // .attr("x", d => xScale(d.activity) + (xScale.bandwidth() / 2))
  // .attr("y", d => yScale(d.count))
  // .text(d => d.count)
  // .attr("dy", "1.25em");

svg
  .append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(xAxis);

  svg
  .append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0, ${width - margin.left})`)
  .call(yAxis);
  });


