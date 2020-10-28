/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 10;

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;

/**
 * APPLICATION STATE
 * */
let state = {
  data: [],
  selectedYear: "All",
};

/**
 * LOAD DATA
 * */
d3.csv("TVShows-Netflix.csv", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    .domain([6, 19])
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain([7.5, 10])
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  // HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected year is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.selectedYear = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", ...Array.from(new Set(state.data.map(d => d.Year))), ]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
    .join("option")
    .attr("value", d => d.selectedYear)
    .text(d => d);

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Netflix Rating");

  // add the yAxis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("IMDb Ranking");

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // filter the data for the selectedParty
  let filteredData = state.data;
  // if there is a selectedParty, filter the data before mapping it to our elements
  if (state.selectedYear !== "All") {
    filteredData = state.data.filter(d => d.Year === state.selectedYear);
  }

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.Title) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter => enter
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("opacity", 0.5)
          .attr("fill", "rgba(178, 32, 32, 1)")
          .attr("r", radius)
          .attr("cy", d => yScale(d.IMDb))
          .attr("cx", d => margin.left) // initial value - to be transitioned
          .call(enter =>
            enter
              .transition() // initialize transition
              .delay(d => 200 * d.IMDb) // delay on each element
              .duration(500) // duration 500ms
              .attr("cx", d => xScale(d.Rating))
          ),
      update =>
        update.call(update =>
          // update selections -- all data elements that match with a `.dot` element
          update
            .transition()
            .duration(250)

            .transition()
            .duration(500)
            .attr("cx", d => xScale(d.Rating))
        ),
      exit =>
        exit.call(exit =>
          // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition()
            .delay(d => 10 * d.Rating)
            .duration(250)
            .attr("cy", height)
            .remove()
        )
    );
}