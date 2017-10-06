window.Const = Object.freeze({
	deckSize : 52,
	humanElement : 4,
	sliderMax : 10,
	cardSpacing : 20,
	maxBet : 100,
	playerArray : ["Active Firm", "Passive Firm", "Dealer"],
	playerY : 25,
	chipValues : [1,5,10,25,50],
	cardValues : [
  		11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 1
  		11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 2
  		11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 3
  		11,2,3,4,5,6,7,8,9,10,10,10,10, //suit 4
	]
});

window.Flux = {
	cardPictures : [],
	chipPictures : [],
	players : [],
	graphs : [],
	playerX : [25,500,250],
	alive : [true, true, true],
	hittingStatus : [true, true, true],
	chipTotals : [1000,1000,null],
	cardback : null,
	felt : null,
	chipQuintet : null,
	handSlider : null,
	gameOver : true,
	newGame : true,
	reveal : false,
	drawBool : true,
	handCount : 1,
	playerInclusion : 1
};
