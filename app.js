var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv",function(data) {
//  console.log(data);
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(csvData) {
        csvData.smokes = +csvData.smokes;
        csvData.age = +csvData.age;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.age-4), d3.max(data, d => d.age+2)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.smokes-2), d3.max(data, d => d.smokes+2)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  
        // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Smokes: ${d.smokes}<br>Age: ${d.age}`);
    });
    
    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    
    // Create Circles
    // ==============================
    var circlesGroup = svg.selectAll("g").data(data).enter();
    circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("class","stateCircle")
    .attr("r", "20")
    // .attr("fill", "light blue")
    // .attr("opacity", ".5")

  //  Create event listeners to display and hide the tooltip
  // onmouseout event
    .on("mouseover", function(w){toolTip.show(w,this)})
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
      });
    



circlesGroup.append('text')
.text(function(csv){
  return csv.abbr;
})
.attr("dx", function(l){
  return xLinearScale (l.age)
})
  .attr("dy", function(y){
    return yLinearScale (y.smokes);
  })
  .attr("class","stateText")

  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age");
  });
