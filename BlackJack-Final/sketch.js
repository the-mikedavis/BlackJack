var sketch = function (p) {
var cardPictures = [];
var chipPictures = [];
var cardValues = [ //because the card names and suits are loaded in the images, I don't need  a suit and name list, only values & pictures
  11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 1
  11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 2
  11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 3
  11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 4
];
var gameOver = true, newGame = true, reveal = false, drawBool = true;
var counter = 0, count = 0;
var deckSize = 52, sliderMax = 5, cardSpacing = 20, maxBet = 100, handCount = 1, playerInclusion = 1;
var players = [], graphs = [];
var hittingStatus = [true, true, true];
var alive = [true, true, true];
var playerX = [25,500,250];
var playerY = [25,25,25];
var chipValues = [1,5,10,25,50];
var chipTotals = [1000,1000,null];
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
    players[i] = new player(playerX[i],playerY[i], i+1, handCount);
    graphs[i] = new graph(playerX[i], playerY[i], i);
    players[i].takeCard(2);
    graphs[i].setNewPoint();
  } //CPU1 i = 1, CPU2 i = 2, dealer i = 3
};

p.draw = function () {
  //if (players[0].getAlive() && players[1].getAlive()){
  if (alive[0] && alive[1]){
    //if all players are in the game
    drawBackground();
    playTheGame(0);

    for(var i = 0; i <=1; i++){
    if (chipTotals[i] <= 0)
      alive[i] = false;
        //players[i].setAlive(false);
        
    }
  }
  //else if (!players[0].getAlive() && players[1].getAlive()){
  else if (!alive[0] && alive[1]){
    //if CPU1 has run out of chips (is out of the game)
    drawBackground();
    playTheGame(1);//play the game without player 0
    if (chipTotals[1] <= 0)
      //players[1].setAlive(false);
      alive[1] = false;
  }
  //else if (!players[1].getAlive() && players[0].getAlive()){
  else if (!alive[1] && alive[0]){
    //if CPU2 has run out of chips (is out of the game)
    drawBackground();
    playTheGame(2);
    if (chipTotals[0] <= 0)
      //players[0].setAlive(false);
      alive[0] = false;
  }
  else{
    //if both CPUs are out of chips (are out of the game)
    drawBackground();
    playTheGame(3);//just draws the graphs
  }
};

//draw simplification methods:
drawBackground = function(){//all background elements
  p.image(felt,0,0);
  p.frameRate(handSlider.value());
};
playTheGame = function(whichPlayer){//all elements of the game which are constant
  for (var i = 0; i <= 1; i++)
    graphs[i].drawGraph();

  switch(whichPlayer){
    case 0 :
    case 1 :
      for (i = whichPlayer; i <= 2; i++)
        players[i].drawCards();
      
      for (i = whichPlayer; i <= 1; i++){
        players[i].drawChips();
      }
      for (i = whichPlayer; i <= playerInclusion; i++)
        hittingStatus[i] = cpuRules(i);
      if (!hittingStatus[0] && !hittingStatus[1] && playerInclusion == 1)
        playerInclusion = 2;
      if (gameOver)//start over with a new hand
        reset();
      if (!hittingStatus[2])
        stay();
        console.log("I'm in case 0 or 1");
      break;
    case 2 :
      players[0].drawCards();
      players[2].drawCards();
      players[0].drawChips();
      for (i = 0; i <= playerInclusion; i++)//will only activate on 0 and 2
        hittingStatus[i] = cpuRules(i++);
      if (!hittingStatus[0] && playerInclusion == 1)
        playerInclusion = 2;
      if (gameOver)
        reset();
      if (!hittingStatus[2])
        stay();
        console.log("I'm in case 2")
      break;
    default : console.log("I'm in the default case"); break;
  }
}

player = function(x, y, playerCount){//player object
  var hand = [], handVals = [];
  var chipHand = 0;
  var chipHandPics = [];
  var type, handSum;
  var count = 0;
  this.x = x;
  this.y = y;
  var cardX = x + 100;
  var cardY = y + 350;
  var betX = x + 300;
  var betY = cardY;
  var chipX = x;
  var chipY = betY;
  var drawing = false, winningVal = false;
  var position = 0;
  this.alive = alive[playerCount-1];
  switch(playerCount){
    case 3: type = "dealer";
      cardY += 200;
      break;
    case 2:
    case 1: type = "CPU"; break;
  }
  

  //card functions:
  this.takeCard = function(noCardsTaken){      //take a number of new cards
    for (var count = noCardsTaken; count >= 1; count--){
      cardNo = Math.floor(Math.random()*cardValues.length);                            //pick a random card no.
      handVals.push(cardValues[cardNo]);
      hand.push(cardPictures[cardNo]);
    }
  }

  this.drawCards = function(){      //code to draw the cards
    for (count = 0; count < hand.length; count++){ //for all cards in the hand

      if (count === 0 && type == "dealer" && !reveal){//the dealer's first card is flipped over until the player stays
        p.image(cardback, cardX + count*cardSpacing, cardY);
        count++;  //move onto the next card
      }
      
      p.image(hand[count], cardX + count*cardSpacing, cardY);  //draw all the other cards
    }
  }

  this.calcHandSum = function(){      //code to calculate what the hand is at
    var recalculate = false;
    var handSum = 0;
    for (count = 0; count < handVals.length; count++){   //this.handVals undefined here  type error
      handSum += handVals[count];
    }
    if (handSum > 21)   //check the flexible vale of the aces when the handSum is greater than 21
      recalculate = this.checkAces(); 
    
    if(recalculate){
      handSum = 0;
      for (count = 0; count < handVals.length; count++){
        handSum += handVals[count];
      }
    }
    return handSum;
  }

  this.checkAces = function(){        //code to check the flexible value of the ace
    var carrier = false;
    for (count = 0; count < handVals.length; count++){
      if (handVals[count] == 11){     //if it's an ace
        handVals[count] = 1;          //change the value to one
        carrier = true;
      }
    }
    return carrier;
  }

  this.upSideDownCard = function(){   //return the dealer's facedown card
    return handVals[1];
  }


  //chip functions:
  this.drawChips = function(){        //code to draw how much the player has bet
    p.image(chipQuintet, chipX, chipY);
    
    for (count = 0; count < chipHandPics.length; count++){
      p.image(chipHandPics[count], betX +cardSpacing*count, betY);  //draw the current bet
    }
  }

  this.bet = function(chipType){    //code to bet a certain chip
    if (chipHand + chipValues[chipType] <= maxBet){
      chipHandPics.push(chipPictures[chipType]);   //add to the picture array to be printed
      chipHand += chipValues[chipType];        //add to the integer of current bet amount
    }
  }

  //misc functions:
  this.winning = function(status){
    if (this.alive === true){
      chipTotals[playerCount-1] += (status) ? chipHand : 0-chipHand;
      graphs[playerCount-1].setNewPoint();
    }
  }
  this.handLength = function(){
    return hand.length;
  }
};

stay = function(){//code for staying:
  reveal = true;
  gameOver = true;

  handCount++;
  dealersSum = players[2].calcHandSum();
  for (count = 0; count <= 1; count++){   //test the other player's cards
    handSum = players[count].calcHandSum();
    if (handSum > 21) //if they busted, they lost
      players[count].winning(false);
    else if (players[count].handLength() >= 5)
      players[count].winning(true); //if they have >= 5 cards, they win by 5 card Charlie
    else if (dealersSum > 21)
      players[count].winning(true);
    else if (handSum > dealersSum && dealersSum < 21)
      players[count].winning(true); //if they beat the dealer, they win
    else
      players[count].winning(false);
  }
};

graph = function(x, y, playerNumber){//graph object
  var points = [];
  var plot = new GPlot(p);
  plot.setPos(x, y);
  plot.getXAxis().setAxisLabelText("No. Hands");
  plot.getYAxis().setAxisLabelText("Total Chips (U$D)");
  plot.setTitleText("CPU "+(playerNumber+1));

  //graph functions:
  this.drawGraph = function(){      //draw the graph
    plot.defaultDraw();
  }

  this.setNewPoint = function(){//set the next point in the graph
    if (points.length >= 100)       //if there are more than 100 points
      points.shift();               //delete the first point
    points.push(new GPoint(handCount,chipTotals[playerNumber])); //push a new point onto the last index
    plot.setPoints(points);
  }

};

reset = function(){
  for (var i = 0; i <= 2; i++){
    players[i] = new player(playerX[i],playerY[i],i+1);
    players[i].takeCard(2);
    players[i].bet(1);
    hittingStatus[i] = true;
  }
  gameOver = false;
  reveal = false;
  playerInclusion = 2;
};

cpuRules = function(count){              //AI code for betting, hitting, and staying for the CPU players
  var dealersCard = players[2].upSideDownCard();
  var sum = players[count].calcHandSum();
  if (sum < 17){
    /**
    ~~~~~~~~~~~~~~AI for betting:~~~~~~~~~~~~~~~~~~~~~~~
    */
    switch (dealersCard){
      case 2  :
      case 3  : players[count].bet(4);       break;
      case 4  :
      case 5  :
      case 6  : players[count].bet(3);       break;
      case 7  :
      case 8  :
      case 9  : players[count].bet(2);       break;
      case 10 :
      case 11 : players[count].bet(1);       break;
    }
    /****
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ***/
    players[count].takeCard(1);
    return true;
  }
  else if (sum >= 17 && sum <= 21)     //stay as a good value
    return false;
  else if (sum > 21)                   //player has busted
    return false;
};

};

var myp5 = new p5(sketch);