var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = window.innerWidth,		// canvas width
    height = window.innerHeight;		// canvas height

var scale = 1.0;

var selected= {i:-1, j:-1};

var zoom = d3.behavior.zoom()
    .scale(scale)
    .scaleExtent([1, 5])
    .on("zoom", zoomed);

    var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "outline: medium solid red;")
    .call(zoom);

var container = svg.append("g")
    .attr("id", "container")
    .attr("transform", "translate(0,0)scale(1,1)");

var bbox, viewBox, vx, vy, vw, vh, defaultView;

var clickScale = 5.0;		// scale used when circle is clicked

d3.select("button").on("click", reset);


var points = [];
var hexRadius = 50;
var hexbin = d3.hexbin().radius(hexRadius);

for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
        points.push([hexRadius * j * 1.75, hexRadius * i * 1.5, 'available', i]);
    }//for j
}//for i

console.log(hexbin(points))



  hexagon = container.append("g")
    .attr("id", "hexagons")
    .selectAll(".hexagon")
    .attr("class", "hexagon")
    
    .data(hexbin(points))
    .enter().append("path")
    .attr("d", function (d) {
        return "M" + d.x + "," + d.y + hexbin.hexagon();
    })
      .attr("r",  function(d) { return hexRadius; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .style("fill", 'gray' )
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .on("click", clicked);

  bbox = container.node().getBBox();
  vx = bbox.x;		// container x co-ordinate
  vy = bbox.y;		// container y co-ordinate
  vw = bbox.width;	// container width
  vh = bbox.height;	// container height
  defaultView = "" + vx + " " + vy + " " + vw + " " + vh;
  svg
	.attr("viewBox", defaultView)
	.attr("preserveAspectRatio", "xMidYMid meet")
        .call(zoom);


/*
getTransform(node, scale) finds the correct translation co-ordinates in order
to center the circle (node) into the Viewbox. This depends on the scale.
 - bbox is the bounding box of the circle (node)
 - vx is the top-left x-cordinate of the Viewbox
 - vy is the top-left y-cordinate of the Viewbox
 - tx is the calculated movement in the x co-ordinate 
 - ty is the calculated movement in the y co-ordinate 
 - xScale is the scale of the SVG with respect to the default Viewbox
*/
function getTransform(node, xScale) {
  bbox = node.node().getBBox();
  var bx = bbox.x;
  var by = bbox.y;
  var bw = bbox.width;
  var bh = bbox.height;
  var tx = -bx*xScale + vx + vw/2 - bw*xScale/2;
  var ty = -by*xScale + vy + vh/2 - bh*xScale/2;
  return {translate: [tx, ty], scale: xScale}
}

function clicked(d, i) {
  if (d3.event.defaultPrevented) {
	return; // panning, not clicking
  }
  console.log(d)
  console.log(d.j, selected.j, d.i, selected.i)
  if (!(selected.j === d.j && selected.i === d.i)){
    node = d3.select(this);
    var transform = getTransform(node, clickScale);
  
    container.transition().duration(1000)
       .attr("transform", "translate(" + transform.translate + ")scale(" + transform.scale + ")");
    zoom.scale(transform.scale)
        .translate(transform.translate);
    scale = transform.scale;
    selected = {j: d.j, i: d.i};
  } else {
      reset();
  }
}

function circletype(d) {
  d.x = +d.x;
  d.y = +d.y;
  d.r = +d.r;
  return d;
}

function zoomed() {
  var translateX = d3.event.translate[0];
  var translateY = d3.event.translate[1];
  var xScale = d3.event.scale;
  container.attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + xScale + ")");
}

function reset() {
  scale = 1.0;
  container
  .transition().duration(1000)
  .attr("transform", "translate(0,0)scale(1,1)");

  zoom.scale(scale)
      .translate([0,0]);
}

d3.select(self.frameElement).attr("margin", 10);