var sketch = function (p) {
var cardPictures = [];
var chipPictures = [];
var cardValues = [ //because the card names and suits are loaded in the images, I don't need  a suit and name list, only values & pictures
  11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 1
  11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 2
  11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 3
  11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 4
];
var gameOver = true, newGame = true;
var counter = 0, count = 0;
var deckSize = 52;
var sliderMax = 5;
var players = [];
var playerX = [25,500];
var playerY = [25,25];
var chipValues = [1,5,10,25,50];
var cardback, felt, chipQuintet, handSlider;

p.preload = function(){
  for (var i = 0; i < deckSize; i++){
    cardPictures.push(p.loadImage("assets/"+i+".png")); //import the cards
  }
  for (i = 0; i < chipValues.length; i++){
    chipPictures.push(p.loadImage("assets/Chip_"+i+".png"));  //import the chips
  }
  cardback = p.loadImage("assets/cardback.png");
  felt = p.loadImage("assets/green_felt.jpg");        //set the background to felt
  chipQuintet = p.loadImage("assets/quintet.png");
};

p.setup = function () {
  p.createCanvas(975, 800);
  handSlider = p.createSlider(1,sliderMax,1);
  handSlider.position(playerX[0],75);
  p.frameRate(1);

  for (var i = 0; i <= 2; i++){
    players[i] = new player(playerX[i],playerY[i],i+1)
  } //CPU1 i = 0, CPU2 i = 1, dealer = 2
};

p.draw = function () {
  p.image(felt,0,0);                //draw the background felt

  for(var i = 0; i <=1; i++){       //draw the graphs
    players[i].setNewPoint(counter++, counter);
    players[i].drawGraph();
  }

  for(i = 0; i <=2; i++){           //draw the cards and chips
    players[i].drawCards();
    players[i].drawChips();
  }
};

player = function(x, y, playerCount){
  var points = [];
  var hand = [], handVals = [];
  var chipHand = 0;
  var chipHandPics = [];
  var plot = new GPlot(p);
  var type;
  this.x = x;
  this.y = y;
  var cardX = x;
  var cardY = y + 500;
  var betX = x + 100;
  var betY = y + 400;
  var drawing = false, winningVal = false;
  var position = 0;
  switch(playerCount){
    case 2: type = "dealer"; break;
    default: type = "cpu"; break;
  }
  plot.setPos(x, y);
  plot.getXAxis().setAxisLabelText("No. Hands");
  plot.getYAxis().setAxisLabelText("Total Chips (U$D)");
  plot.setTitleText("CPU "+playerCount);

  //card functions:
  this.drawCards = function(){
    //code to draw the cards
  }
  this.drawNewCard = function(){
    //code to animate the drawing of a new card
  }
  this.calcHandSum = function(){
    //code to calculate what the hand is at
  }
  this.checkAces = function(){
    //code to check the flexible value of the ace
  }
  this.upSideDownCard = function(){//return the dealer's facedown card
    return handVals[1];
  }
  //chip functions:
  this.drawChips = function(){
    //p.image(chipQuintet, chipX, chipY);
    //code to draw how much the player has bet
  }
  this.bet = function(chipType){
    //code to bet a certain chip
  }
  //graph functions:
  this.drawGraph = function(){//draw the graph
    plot.defaultDraw();
  }

  this.setNewPoint = function(xCoor, yCoor){//set the next point in the graph
    if (points.length >= 100)//if there are more than 100 points
      points.shift();        //delete the first point
    points.push(new GPoint(xCoor,yCoor)); //push a new point onto the last index
    plot.setPoints(points);
  }
};

cpuRules = function(){
  //AI code for betting, hitting, and staying for the CPU players
};

testWinning = function(){
  //code to run when the CPU's have stayed. 
};

};

var myp5 = new p5(sketch);