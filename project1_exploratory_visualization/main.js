d3.csv('Summer Songs on Chart.csv').then(data => {
  data.forEach(d => {
    d.Chart = +d.Chart;
  });
  console.log(data);
  render(data);
});
//upload
const svg=d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
  const xValue = d => d.Chart;
  const yValue = d => d.Songs;
  const margin = { top:50, right: 70, bottom: 80, left: 260};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = d3.scaleLinear()
  .domain([0, 30])
	.range([0, innerWidth]);
    
  const yScale = d3.scaleBand()
  .domain(data.map(yValue))
  .range([0, innerHeight])
  .padding(.1);
  
  
  const g = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);
  
  console.log(xScale.range());

  const xAxisTickFormat = number =>
  d3.format('')(number);

  const xAxis = d3.axisBottom(xScale)
  .tickFormat(xAxisTickFormat)
  .tickSize(-innerHeight);
  
  g.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll('.domain, .tick line')
    .remove();

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`)
    
    xAxisG.selectAll('.domain')
  	.remove();	
    
    xAxisG.append('text')
  	.attr('class', 'axis-label')
  	.attr('y', 50)
  	.attr('x', innerWidth/2)
  	.attr('fill', 'black')
  	.text('Weeks on Chart')
  
  g.selectAll('rect').data(data)
  .enter().append('rect')
  .attr('y', d => yScale(yValue(d)))
  .attr('width', d => xScale(xValue(d)))
  .attr('height', yScale.bandwidth())
  .attr("fill", "#00C2CB");

};
