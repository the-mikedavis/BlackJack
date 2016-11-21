var sketch = function (p) {
var counter = 0, count = 0;
var players = [];
var playerX = [25,500];
var playerY = [25,25];
var gameOver = true;

p.setup = function () {
  p.createCanvas(975, 700);

  p.frameRate(1);
  for (var i = 0; i <= 1; i++){
    players[i] = new player(playerX[i],playerY[i],i+1)
  }
};
p.draw = function () {
  p.background(p.color("green"));   //refresh the background to avoid overlapping
  
  for(var i = 0; i <=1; i++){
    players[counter].setNewPoint(i++, i);
    players[counter].drawGraph();
  }
};
player = function(x, y, playerCount){
  var points = [];
  var plot = new GPlot(p);
  plot.setPos(x, y);
  plot.getXAxis().setAxisLabelText("No. Hands");
  plot.getYAxis().setAxisLabelText("Total Chips (U$D)");
  plot.setTitleText("CPU "+playerCount);
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