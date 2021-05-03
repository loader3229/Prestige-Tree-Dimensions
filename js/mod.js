let modInfo = {
	name: "The Prestige Tree: Dimensional Respecced",
	id: "ptdim",
	author: "qq1010903229 (loader3229)",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	
	offlineLimit: 10000000,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.7.1",
	name: "Same tree with different mechanics",
}

let changelog = `


<h1>Changelog:</h1><br>
	<h3>v0.7.1</h3><br>
	- Added 2 new challenges<br>
	- Endgame: e365000000 points, 1e43 Magic, 1e56 Balance Energy<br>
	<h3>v0.7</h3><br>
	- Added Enhance Dimensions, nerfed some Enhancer effects<br>
	- Endgame: e51000000 points, 1e13 Magic/Balance Energy<br>
	<h3>v0.6.1</h3><br>
	- Fixed a bug when importing v0.5.4 savefile<br>
	<h3>v0.6</h3><br>
	- Added some features of layers M and BA<br>
	- Balanced up to e26000000 points<br>
	<h3>v0.5.4</h3><br>
	- Added the 2 Row 5 Layers(M,BA) (unfinished)<br>
	- Upgraded TMT to 2.π<br>
	<h3>v0.5.3</h3><br>
	- Finished the last Row 4 challenge<br>
	- Balanced up to e8000000 points<br>
	<h3>v0.5.2</h3><br>
	- Finished the Solarity(O) layer<br>
	- Balanced up to e7200000 points<br>
	<h3>v0.5.1</h3><br>
	- Implemented the Solarity(O) layer<br>
	- Balanced up to e2670000 points<br>
	<h3>v0.5</h3><br>
	- Implemented the Subspace(SS) layer<br>
	- Balanced up to e2130000 points<br>
	<h3>v0.4.2</h3><br>
	- Implemented the Super-Generator(SG) layer<br>
	- Balanced up to 1e477000 points<br>
	<h3>v0.4.1</h3><br>
	- Re-Implemented the Quirks(Q) layer<br>
	- Balanced up to 1e235000 points<br>
	<h3>v0.4</h3><br>
	- Rewrited the entire game<br>
	- Balanced up to 1e89000 points<br>
	<h3>v0.3.1</h3><br>
	- Implemented the Quirks(Q) layer<br>
	- Balanced up to 1e192000 points<br>
	<h3>v0.3</h3><br>
	- Rebalanced the Hindrance(H) layer<br>
	- Balanced up to 1e96000 points<br>
	<h3>v0.2.4</h3><br>
	- Speeded up the game until early-row 2(B,G)<br>
	- Added Hotkeys<br>
	<h3>v0.2.3</h3><br>
	- Implemented the Hindrance(H) layer (unbalanced)<br>
	<h3>v0.2.2</h3><br>
	- Rebalanced the Time Capsule(T) layer<br>
	- Implemented the Super-Booster(SB) layer<br>
	- Balanced up to 1e19000 points<br>
	<h3>v0.2.1</h3><br>
	- Implemented the Enhance(E) layer<br>
	- Balanced up to 1e6000 points<br>
	<h3>v0.2</h3><br>
	- Implemented the Space Energy(S) layer<br>
	- Balanced up to 1e1600 points<br>
	<h3>v0.1</h3><br>
	- Implemented all row 1 & 2 prestige layers(P,B,G) and the Time Capsule(T) layer<br>
	- Balanced up to 1e280 points
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain = gain.mul(player.p.dim1)
	gain = gain.mul(Decimal.pow(tmp.p.dimensionalBase,player.p.buyables[11]));
	if(hasUpgrade("p",11))gain = gain.mul(upgradeEffect("p",11))
	if(hasUpgrade("p",12))gain = gain.mul(upgradeEffect("p",12))	
	if(hasUpgrade("p",21))gain = gain.mul(upgradeEffect("p",21))
    gain = gain.mul(tmp.b.effect)
	gain = gain.mul(tmp.g.getGenPowerEff)
	gain = gain.mul(tmp.t.getTimeEff)
	gain = gain.mul(tmp.s.buyables[12].effect);
	if(hasUpgrade("q",11))gain = gain.mul(upgradeEffect("q",11))
	gain = gain.mul(tmp.q.quirkEff)
	if(hasUpgrade("sb",21))gain = gain.mul(upgradeEffect("sb",21))
	if(player.h.activeChallenge==51||player.h.challenges[51])gain = gain.mul(tmp.p.buyables[12].effect.pow(0.05));
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	pointsTotal:new Decimal(0)
}}

function gamePercentage(p){
	if(p===undefined || p!=p)p=Decimal.log10(player.pointsTotal.add(10)).toNumber();/*
	var milestone=[1,6,13,70 ,240,1600,19300,96000];
	var power=    [1,1,1 ,0.8,0.9,0.7 ,0.8  ,0.8];
	var t=0;
	while(milestone[t] && milestone[t]<=p)t++;
	if(t==milestone.length){
		t--;
	}
	return Math.floor((t+((p-milestone[t-1])/(milestone[t]-milestone[t-1]))**power[t]-1)/(milestone.length-1)*10000)/100;
	*/
	return Math.floor(Math.log(p)/Math.log(365e6)*10000)/100;
}
// Display extra things at the top of the page
var displayThings = [
	"Mod Author: qq1010903229 (loader3229)",
	function(){return "Game Percentage: "+format(gamePercentage())+"%";}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("e365e6");
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	if(oldVersion.startsWith("0.6") || oldVersion.startsWith("0.5") || oldVersion.startsWith("0.4") || oldVersion.startsWith("0.3") || oldVersion.startsWith("0.2") || oldVersion.startsWith("0.1")){
		alert("Sorry. Your game is completely reset because of the addition of Enhance Dimensions.");
		player = null
		save();
		window.location.reload();
	}
}