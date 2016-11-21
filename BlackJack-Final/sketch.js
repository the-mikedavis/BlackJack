var sketch = function (p) {
var counter = 0, count = 0;
var p1;
//var plot;
//var points = [];
p.setup = function () {
  p.createCanvas(750, 700);

  //plot = new GPlot(p);
  // plot.setPos(25, 25);

  // plot.getXAxis().setAxisLabelText("No. Hands");
  // plot.getYAxis().setAxisLabelText("Total Chips (U$D)");
  // plot.setTitleText("CPU 1 - example");

  p.frameRate(1);
  p1 = new player(25,25);
  
};
p.draw = function () {
  p.background(p.color(210));
  // plot.defaultDraw();
  // count++;
  // if (count <= 100){
  //   points.push(new GPoint(count, count+10*p.noise(0.1*count + 50)));
  //   plot.setPoints(points);
  // }
  p1.setNewPoint(count++, count);
  p1.drawGraph();
};
player = function(x, y){
  var points = [];
  var plot = new GPlot(p);
  plot.setPos(x, y);
  plot.getXAxis().setAxisLabelText("No. Hands");
  plot.getYAxis().setAxisLabelText("Total Chips (U$D)");
  plot.setTitleText("CPU 1 - example");
  this.drawCards = function(){
    //code to draw the cards
  }
  this.drawGraph = function(){
    plot.defaultDraw();
  }
  this.setNewPoint = function(xCoor, yCoor){
    points.push(new GPoint(xCoor,yCoor));
    plot.setPoints(points);
  }
};
  
};

var myp5 = new p5(sketch);