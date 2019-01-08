//-----------------------------  UTILS

var rgbToHex = function (rgb) { 
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
  };

var fullColorHex = function(r,g,b) {   
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red+green+blue;
  };

//-----------------------------  VARIABLES

var globalStatus = '';
var globalRow = 10; 

//-----------------------------  CANVAS



//SVG sizes and margins
var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
},
width = 1000-margin.right-margin.left;
height = 1000-margin.top-margin.right;

//The number of columns and rows of the heatmap
var MapColumns = 10,
    MapRows = 10;

//The maximum radius the hexagons can have to still fit the screen
var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
    height/((MapRows + 1/3) * 1.5)]);

//Create SVG element
var svg = d3.select("#canvas")
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    //class to make it responsive
    .call(d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform)
 }))
    .append("g")
    .attr("transform", "translate(" + width/((MapColumns + 0.5) * Math.sqrt(3)) + "," + height/((MapRows + 1/3) * 1.5) + ")")
    .classed("svg-content-responsive", true)

    // d3.select("div#chartId")
    // .append("div")
    // .classed("svg-container", true) //container class to make it responsive
    // .append("svg")
    // //responsive SVG needs these 2 attributes and no width and height attr
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 600 400")
    // //class to make it responsive
    // .classed("svg-content-responsive", true); 
 
    
//Set the hexagon radius
var hexbin = d3.hexbin().radius(hexRadius);



//-----------------------------  DATA

let color = [];
var points = [];

//Colores
// for (var i = 0; i < workspaces.length; i++) {
//       color[i]= statusColors[workspaces[i].state];
// }

for (var i = 0; i < workspaces.length/MapColumns; i++) {
    for (var j = 0; j < MapColumns; j++) {
        if(i*MapRows+j < workspaces.length){
        points.push([hexRadius * j * 1.75, hexRadius * i * 1.5, workspaces[i*MapRows+j].state]);}
    }//for j
}//for i

//-----------------------------  HEXAGONS

//Draw the hexagons
svg.append("g")
    .selectAll(".hexagon")
    .data(hexbin(points))
    .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", function (d) {
        return "M" + d.x + "," + d.y + hexbin.hexagon();
    })
    .attr("stroke", "white")
    .attr("stroke-width", "2px")
    .style("fill", 'black' )
    .on("mouseover", mover)
    .on("mouseout", mout)
    .on("click", mclick)
    
var t = d3.transition()
    .duration(2000)
    .ease(d3.easeLinear);

// d3.selectAll(".hexagon").transition(t)
//     .style("fill", "red");

//-----------------------------  RECAMBIO


// d3.shuffle(points)
//Actualizar datos
var hexagonos = d3.selectAll(".hexagon")
// .data(hexbin(points));
    
hexagonos
    .transition(t)   
    .style("fill", function (d,i) { return statusColors[d[0][2]]; })
    // .attr("d", function (d) {
    //     return "M" + d.x + "," + d.y + hexbin.hexagon();
    // })

//-----------------------------  FILTRAR

var filtrar = function (status){
    hexagonos.filter(function(d, i) { return d[0][2] !== status })
    .transition(t)   
    .style("fill", "gray")

    hexagonos.filter(function(d, i) { return d[0][2] === status })
    .transition(t)   
    .style("fill", function (d,i) { return statusColors[d[0][2]]; })
}

//-----------------------------  RESET COLORS

var resetColors = function (){
    hexagonos
    .transition(t)   
    .style("fill", function (d,i) { return statusColors[d[0][2]]; })
}

//-----------------------------  RESET

var reset= function(){
  update1()
}

//-----------------------------  MOUSE OVER

function mover(d) {
    globalStatus=d[0][2];
   
    var el = d3.select(this)
          .transition()
          .duration(10)		  
          .style("fill-opacity", 0.3)
    
          var span = d3.select('span')
      .text(globalStatus)

}

//-----------------------------  MOUSE OUT

//Mouseout function
function mout(d) { 
	var el = d3.select(this)
	   .transition()
	   .duration(1000)
	   .style("fill-opacity", 1)
	   ;
};

//-----------------------------  MOUSE CLIC

//Mouse clic
function mclick(d) { 
  console.log(this)
	var el = d3.select(this)
	   .transition()
	   .duration(1000)

};

//-----------------------------  UPDATE 2

function update2(row, status){
  console.log('update', row, status)


  for (var i = 0; i < workspaces.length; i++) {
    x = i % row;
    y = parseInt(i / row);
    points[i] = [hexRadius * x * 1.75, hexRadius * y * 1.5, workspaces[i].state]
}//for i

var hexData = d3.selectAll(".hexagon")

hexData.data(hexbin(points))
.enter()

hexData.exit().remove();

hexData
.transition()
.duration(2000)
    .attr("d", function (d) {
        return "M" + d.x + "," + d.y + hexbin.hexagon();
    })

}

//-----------------------------  UPDATE 1

function update1(row = globalRow){
  console.log('update')

  var points = [];


  for (var i = 0; i < workspaces.length / row; i++) {
    for (var j = 0; j < row; j++) {
        if(i*row+j < workspaces.length){
        points.push([hexRadius * j * 1.75, hexRadius * i * 1.5, workspaces[i*row+j].state]);}
    }//for j
}//for i
var hexData = d3.selectAll(".hexagon")

hexData.data(hexbin(points))
.enter()

hexData.exit().remove();

hexData
.transition()
.duration(2000)
    .attr("d", function (d) {
        return "M" + d.x + "," + d.y + hexbin.hexagon();
    })


}

//-----------------------------  UPDATE 3 

function update3(row = globalRow, status){
  row=globalRow;
  console.log('update', row, status)

var index = 0;
  for (var i = 0; i < workspaces.length; i++) {

    if(status == workspaces[i].state){

      x = index % row;
      y = parseInt(index / row);
      index++;
    } else {
      x = Math.random()*9999 ;
      y = Math.random()*9999;
    }

    points[i] =[hexRadius * x * 1.75, hexRadius * y * 1.5, workspaces[i].state];
}//for i

var hexData = d3.selectAll(".hexagon")

hexData.data(hexbin(points))
.enter()

hexData.exit().remove();

hexData
.transition()
.duration(2000)
    .attr("d", function (d) {
        return "M" + d.x + "," + d.y + hexbin.hexagon();
    })
}

//-----------------------------  CHANGE TAMANIO

var changeTamanio = function (tamanio) {
  
  hexRadius = tamanio;
    hexbin = d3.hexbin().radius(hexRadius);
    var cant = parseInt(1000/(tamanio*2));
    globalRow = cant;
    update1(cant)
    resetColors();
}

//-----------------------------  ZOOM

function zoomed() {
  // container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

//-----------------------------  DRAG

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}

//-----------------------------  GROUP

function group(cant = 2){
  var total = [0,0,0];
  var offset = [0,0,0];


  estados.forEach((status, sti)=>
  {
    row=globalRow/2-1;
    
    console.log('update', row, status)
  
    var index = 0;
    console.log('Offset de '+status+' = '+offset[0])

    for (var i = 0; i < workspaces.length; i++) {
      var offsetx = 0;
      if(sti%cant === 0) offsetx = globalRow/2

      if(status == workspaces[i].state){
        x = index % row;
        y = parseInt(index / row);
        index++;
        points[i] =[offsetx*hexRadius*1.75 + hexRadius * x * 1.75, offset[sti%cant]*hexRadius*1.5 + hexRadius * y * 1.5, workspaces[i].state];
        total[sti%cant]++;
      } 
    }

    offset[sti % 2] = offset[sti % 2] + parseInt(total[sti%cant]/row) +2 ;
    console.log('Totales de '+status+' = '+total[sti%cant])

     total = [0,0,0];


  })

  var hexData = d3.selectAll(".hexagon")

hexData.data(hexbin(points))
.enter()

hexData.exit().remove();

hexData
.transition()
.duration(2000)
    .attr("d", function (d) {
        return "M" + d.x + "," + d.y + hexbin.hexagon();
    })

}

//-----------------------------  CLICK ZOOM

function clicked(d, i) {
  if (d3.event.defaultPrevented) {
	return; // panning, not clicking
  }
  node = d3.select(this);
  var transform = getTransform(node, clickScale);
  container.transition().duration(1000)
     .attr("transform", "translate(" + transform.translate + ")scale(" + transform.scale + ")");
  zoom.scale(transform.scale)
      .translate(transform.translate);
  scale = transform.scale;
}
