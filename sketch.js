var sketch = function (p) {
    //load all pictures
    p.preload = function(){
        for (var i = 0; i < Const.deckSize; i++){
            Flux.cardPictures.push(p.loadImage("/dist/blackjack/assets/"+i+".png")); //import the cards
        }
        for (i = 0; i < Const.chipValues.length; i++){
            Flux.chipPictures.push(p.loadImage("/dist/blackjack/assets/Chip_"+i+".png"));  //import the chips
        }
        Flux.cardback = p.loadImage("/dist/blackjack/assets/cardback.png");
        Flux.felt = p.loadImage("/dist/blackjack/assets/green_felt.jpg");        //set the background to Flux.felt
        Flux.chipQuintet = p.loadImage("/dist/blackjack/assets/quintet.png");
    };
    //set up with p5.js functions
    p.setup = function () {
        p.createCanvas(1920, 800);  //width of the Flux.felt image
        Flux.handSlider = p.createSlider(1,Const.sliderMax,1);
        Flux.handSlider.position(Flux.playerX[0],20);
        p.frameRate(1);

        //change the X values of the Flux.players to match the window size
        Flux.playerX[1] = (p.windowWidth > 900) ? p.windowWidth - 500 : 500;
        Flux.playerX[2] = p.windowWidth / 2 - 150;

        for (var i = 0; i <= 2; i++){
            Flux.players[i] = new player(Flux.playerX[i],Const.playerY, i, Const.playerArray[i]);
            Flux.graphs[i] = new graph(Flux.playerX[i], Const.playerY, i);
            Flux.players[i].takeCard(2);
            Flux.graphs[i].setNewPoint();
        } //CPU1 i = 0, CPU2 i = 1, dealer i = 2
    };
    //draw loop
    p.draw = function () {
        drawBackground();
        if (Flux.alive[0] && Flux.alive[1]){
            //if all Flux.players are in the game
            playTheGame(0);

            for(var i = 0; i <=1; i++){
                if (Flux.chipTotals[i] <= 0)
                    Flux.alive[i] = false;
            }
        }
        else if (!Flux.alive[0] && Flux.alive[1]){
            //if CPU1 has run out of chips (is out of the game)
            playTheGame(1);//play the game without player 0
            if (Flux.chipTotals[1] <= 0)
                Flux.alive[1] = false;
        }
        else if (!Flux.alive[1] && Flux.alive[0]){
            //if CPU2 has run out of chips (is out of the game)
            playTheGame(2);
            if (Flux.chipTotals[0] <= 0)
                Flux.alive[0] = false;
        }
        else{
            //if both CPUs are out of chips (are out of the game)
            playTheGame(3);//just draws the Flux.graphs
        }
    };

    //draw simplification methods:
    drawBackground = function(){//all background elements
        p.image(Flux.felt,0,0);
        p.frameRate(Flux.handSlider.value());
    };
    //common code between players to simplify draw loop
    playTheGame = function(whichPlayer){//all elements of the game which are constant
        for (var i = 0; i <= 1; i++)
            Flux.graphs[i].drawGraph();

        switch(whichPlayer){
            case 0 :
            case 1 :
                for (i = whichPlayer; i <= 2; i++)
                    Flux.players[i].drawCards();

                for (i = whichPlayer; i <= 1; i++){
                    Flux.players[i].drawChips();
                }
                for (i = whichPlayer; i <= Flux.playerInclusion; i++)
                    Flux.hittingStatus[i] = cpuRules(i);
                if (!Flux.hittingStatus[0] && !Flux.hittingStatus[1] && Flux.playerInclusion == 1)
                    Flux.playerInclusion = 2;
                if (Flux.gameOver)//start over with a new hand
                    reset();
                if (!Flux.hittingStatus[2])
                    stay();
                break;
            case 2 :
                Flux.players[0].drawCards();
                Flux.players[2].drawCards();
                Flux.players[0].drawChips();
                for (i = 0; i <= Flux.playerInclusion; i++)//will only activate on 0 and 2
                    Flux.hittingStatus[i] = cpuRules(i++);
                if (!Flux.hittingStatus[0] && Flux.playerInclusion == 1)
                    Flux.playerInclusion = 2;
                if (Flux.gameOver)
                    reset();
                if (!Flux.hittingStatus[2])
                    stay();
                break;
            default : break;
        }
    }

    //player object
    player = function(x, y, playerCount, type){//player object
        var hand = [], handVals = [];
        var chipHand = 0;
        var chipHandPics = [];
        var handSum;
        this.type = type;
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
        this.alive = Flux.alive[playerCount];
        switch(type){
            case "Dealer" :
                cardY += 200;
                break;
            default : break;
        }


        //card functions:
        this.takeCard = function(noCardsTaken){      //take a number of new cards
            for (var count = noCardsTaken; count >= 1; count--){
                cardNo = Math.floor(Math.random()* Const.cardValues.length);//pick a random card no.
                handVals.push( Const.cardValues[cardNo]);
                hand.push(Flux.cardPictures[cardNo]);
            }
        }

        this.drawCards = function(){      //code to draw the cards
            for (count = 0; count < hand.length; count++){ //for all cards in the hand

                if (count === 0 && type == "Dealer" && !Flux.reveal){
                    //the dealer's first card is flipped over until the player stays
                    p.image(Flux.cardback, cardX + count*Const.cardSpacing, cardY);
                    count++;  //move onto the next card
                }

                p.image(hand[count], cardX + count*Const.cardSpacing, cardY);  //draw all the other cards
            }
        }

        this.calcHandSum = function(){      //code to calculate what the hand is at
            var recalculate = false;
            var handSum = 0;
            for (count = 0; count < handVals.length; count++){
                handSum += handVals[count];
            }
            if (handSum > 21)   //check the flexible vale of the aces
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
            p.image(Flux.chipQuintet, chipX, chipY);

            for (count = 0; count < chipHandPics.length; count++){
                p.image(chipHandPics[count], betX +Const.cardSpacing*count, betY);  //draw the current bet
            }
        }

        this.bet = function(chipType){    //code to bet a certain chip
            if (chipHand + Const.chipValues[chipType] <= Const.maxBet){
                chipHandPics.push(Flux.chipPictures[chipType]);   //add to the picture array to be printed
                chipHand += Const.chipValues[chipType];        //add to the integer of current bet amount
            }
        }

        //misc functions:
        this.winning = function(status){
            if (this.alive === true){
                Flux.chipTotals[playerCount] += (status) ? chipHand : 0-chipHand;
                Flux.graphs[playerCount].setNewPoint();
            }
        }
        this.handLength = function(){
            return hand.length;
        }
        this.getType = function(){
            return type;
        }
    };

    stay = function(){//code for staying:
        Flux.reveal = true;
        Flux.gameOver = true;

        Flux.handCount++;
        dealersSum = Flux.players[2].calcHandSum();
        for (count = 0; count <= 1; count++){   //test the other player's cards
            handSum = Flux.players[count].calcHandSum();
            if (handSum > 21) //if they busted, they lost
                Flux.players[count].winning(false);
            else if (Flux.players[count].handLength() >= 5)
                Flux.players[count].winning(true); //if they have >= 5 cards, they win by 5 card Charlie
            else if (dealersSum > 21)
                Flux.players[count].winning(true);
            else if (handSum > dealersSum && dealersSum < 21)
                Flux.players[count].winning(true); //if they beat the dealer, they win
            else
                Flux.players[count].winning(false);
        }
    };
    //graph object
    graph = function(x, y, playerNumber){//graph object
        this.x = x;
        this.y = y;
        var points = [];
        var plot = new GPlot(p);
        plot.setPos(x, y);
        plot.getXAxis().setAxisLabelText("No. Hands");
        plot.getYAxis().setAxisLabelText("Total Chips (U$D)");
        plot.setTitleText(Flux.players[playerNumber].getType());

        //graph functions:
        this.drawGraph = function(){      //draw the graph
            plot.defaultDraw();
        }

        this.setNewPoint = function(){//set the next point in the graph
            if (points.length >= 100)       //if there are more than 100 points
                points.shift();               //delete the first point
            points.push(new GPoint(Flux.handCount,Flux.chipTotals[playerNumber]));
            //push a new point onto the last index
            plot.setPoints(points);
        }

        this.setX = function(x){
            plot.setPos(x,this.y);
        }
    };
    //function to reset the card game
    reset = function(){
        Flux.playerX[1] = (p.windowWidth > 900) ? p.windowWidth - 500 : 500;
        Flux.graphs[1].setX(Flux.playerX[1]);
        Flux.playerX[2] = p.windowWidth / 2 - 150;
        for (var i = 0; i <= 2; i++){
            Flux.players[i] = new player(Flux.playerX[i],Const.playerY,i, Const.playerArray[i]);
            Flux.players[i].takeCard(2);
            Flux.players[i].bet(1);
            Flux.hittingStatus[i] = true;
        }
        Flux.gameOver = false;
        Flux.reveal = false;
        Flux.playerInclusion = 2;
    };
    //function for the CPUs to decide whether to bet and how much
    cpuRules = function(count){
        var dealersCard = Flux.players[2].upSideDownCard();
        var sum = Flux.players[count].calcHandSum();
        if (count == 0){//active fund
            if (sum < 17){
                Flux.players[count].bet(mapSums(sum, dealersCard));
                seed = p.floor(Math.random()*Const.humanElement);
                if (seed == 0)
                    Flux.players[count].bet(mapSums(sum, dealersCard))
                Flux.players[count].takeCard(1);
                return true;
            }
        }
        else if (count == 1){//passive fund
            if (sum < 17){
                //AI for the passive fund
                switch (dealersCard){
                    case 2  : Flux.players[count].bet(2);      break;
                    case 3  :
                    case 4  :
                    case 5  :
                    case 6  : Flux.players[count].bet(1);       break;
                    case 7  :
                    case 8  :
                    case 9  :
                    case 10 :
                    case 11 :
                    default : break;
                }
                //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                Flux.players[count].takeCard(1);
                return true;
            }
        }
        if (sum >= 17 && sum <= 21)     //stay as a good value
            return false;
        else if (sum > 21)                   //player has busted
            return false;
    };
    //AI for the active firm
    mapSums = function(hand, dealer){
        var total = hand + dealer;
        //maximum is 11 + 16 = 27, minimum is 4 + 2 = 6
        if (total <= 10)
            return 4;
        else if (total <= 15)
            return 3;
        else if (total <= 20)
            return 2;
        else if (total <= 25)
            return 1;
        else
            return 0;
    };

};
//sketch p5 object
var myp5 = new p5(sketch);
