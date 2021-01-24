addLayer("p", {
    name: "prestige",
    symbol: "P",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		dim: new Decimal(0)
    }},
    color: "#00bfbf",
    requires: function(){
		if(player.h.activeChallenge==22)return new Decimal(Infinity);
			return new Decimal(10);
	},
    resource: "prestige points",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
		if(hasUpgrade("b",11)) mult =  mult.mul(upgradeEffect("b",11))
		if(hasUpgrade("p",13)) mult =  mult.mul(upgradeEffect("p",13))
        if(hasUpgrade("g",12)) mult =  mult.mul(upgradeEffect("g",12))
		if(hasUpgrade("p",22)) mult =  mult.mul(upgradeEffect("p",22))
        if(hasUpgrade("p",23)) mult =  mult.mul(upgradeEffect("p",23))
		mult=mult.mul(tmp.t.getTimeEff);
		mult=mult.mul(tmp.s.buyables[12].effect);
		if(player.e.best.gte(500)) mult = mult.mul(tmp.e.buyables[11].effect[1]);
		if(hasUpgrade("e",11)) mult =  mult.mul(upgradeEffect("e",11))
		if(hasUpgrade("q",11)) mult =  mult.mul(upgradeEffect("q",11))
        return mult
    },
    gainExp() {
       return new Decimal(tmp.h.challenges[22].rewardEffect);
    },
    row: 0,
	softcap: new Decimal("eeeeeeeee9"),
	softcapPower: new Decimal(1),
    hotkeys: [],
    layerShown(){return true},
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Buy a 1st Prestige Dimension and multiply Point generation by 2", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.35))
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(2, x)
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " prestige points\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Currently: Point generation is multiplied by "+format(data.effect);
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.g.best.lt(12))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player[this.layer].dim = player[this.layer].dim.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
        },
		upgrades: {
            rows: 5,
            cols: 4,
			11: {
				title: "Prestige Upgrade 11",
                description: "Point generation is faster based on your unspent Prestige Points.",
                cost: new Decimal(40),
                unlocked() { return player[this.layer].dim.gt(0) || player.b.unlocked /*|| player.g.unlocked*/ }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=3;
					if(hasUpgrade("g",21))base+=0.2;
                    let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9))
					if(ret.lt(10000))ret=ret.pow(3/4).mul(10);
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Prestige Upgrade 12",
                description: "Point generation is faster based on your Point amount.",
                cost: new Decimal(10000),
                unlocked() { return player.b.unlocked || player.g.unlocked  },
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.25;
					if(hasUpgrade("b",31))base+=0.2;
                    let ret = Decimal.pow(base,Decimal.log10(player.points.add(1)).pow(0.9))
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Prestige Upgrade 13",
                description: "Gain More Prestige Points.",
                cost: new Decimal(2e6),
                unlocked() { return player.b.unlocked || player.g.unlocked  },
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = new Decimal(2);
					if(hasUpgrade("p",14)){
						let base=new Decimal(1e100);
						ret = ret.mul(Decimal.pow(base,Decimal.log10(player.h.points.add(1)).pow(0.9)));
						return ret;
					}
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
				title: "Prestige Upgrade 21",
				description: "Point generation is faster based on your Prestige Upgrades bought.",
				cost: new Decimal(1e20),
				unlocked(){ return player.b.unlocked&&player.g.unlocked },
				effect() {
					let ret = Decimal.pow(2, player.p.upgrades.length);
					if(hasUpgrade("p",31))ret = Decimal.pow(2, ret);
					return ret;
				},
				effectDisplay() { return format(this.effect())+"x" },
			},
			22: {
				title: "Prestige Upgrade 22",
				description:  "Prestige Point gain is boosted by your Point amount.",
				cost: new Decimal(1e25),
				unlocked(){ return player.b.unlocked&&player.g.unlocked  },
				effect(){ 
					let base=1.05;
					if(hasUpgrade("g",31))base+=0.2;
					if(hasUpgrade("p",32))base+=0.2;
					if(hasUpgrade("p",42))base+=0.2;
					let ret = Decimal.pow(base,Decimal.log10(player.points.add(1)).pow(0.9))
					return ret;
				},
				effectDisplay() { return format(this.effect())+"x" },
			},
			23: {
				title: "Prestige Upgrade 23",
				description:  "Prestige Point gain is boosted by your Prestige Point amount.",
				cost: new Decimal(1e30),
				unlocked(){ return player.b.unlocked&&player.g.unlocked  },
				effect(){
					let base=1.05;
					if(hasUpgrade("p",33))base+=0.2;
					if(hasUpgrade("p",41))base+=0.2;
					if(hasUpgrade("p",43))base+=0.2;
					if(hasUpgrade("p",24))base+=0.35;
					let ret = Decimal.pow(base,Decimal.log10(player.p.points.add(1)).pow(0.9))
					return ret;
				},
				effectDisplay() { return format(this.effect())+"x" },
			},
			31: {
				title: "Prestige Upgrade 31",
				description: "The upgrade above is stronger.",
				cost: new Decimal("1e500"),
				unlocked() { return player.t.unlocked&&player.s.unlocked },
			},
			32: {
				title: "Prestige Upgrade 32",
				description: "The upgrade above is stronger.",
				cost: new Decimal("1e600"),
				unlocked() { return player.t.unlocked&&player.s.unlocked },
			},
			33: {
				title: "Prestige Upgrade 33",
				description: "The upgrade above is stronger.",
				cost: new Decimal("1e750"),
				unlocked() { return player.t.unlocked&&player.s.unlocked },
			},
			41: {
				title: "Prestige Upgrade 41",
				description: "Prestige Upgrade 23 is stronger.",
				cost: new Decimal("1e2700"),
				unlocked() { return player.e.unlocked },
			},
			42: {
				title: "Prestige Upgrade 42",
				description: "Prestige Upgrade 22 is stronger.",
				cost: new Decimal("1e5850"),
				unlocked() { return player.e.unlocked },
			},
			43: {
				title: "Prestige Upgrade 43",
				description: "Prestige Upgrade 23 is stronger.",
				cost: new Decimal("1e9350"),
				unlocked() { return player.e.unlocked },
			},
			14: {
				title: "Prestige Upgrade 14",
				description: "Boost the left upgrade based on Hindrance Spirit.",
				cost: new Decimal("1e53500"),
				unlocked() { return player.h.challenges[22]>=1 },
			},
			24: {
				title: "Prestige Upgrade 24",
				description: "Boost the left upgrade.",
				cost: new Decimal("1e200000"),
				unlocked() { return player.q.unlocked },
			},
		},
	tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					"buyables",
                    ["display-text",
                        function() {return 'You have ' + format(player.p.dim) + ' 1st Prestige Dimensions, which are producing '+format(getPointGen())+' points per second.'},
                        {}],
                   "upgrades"],
				   
		doReset(l){
			if(l=="p"){return;}
			if(l=="b" || l=="g"){
				if(player[l].best.lt(10))layerDataReset("p",[]);
				else layerDataReset("p",["upgrades"]);
				return;
			}
			if(l=="t" || l=="s" || l=="e" || l=="sb"){
				if(player[l].best.lt(2) && l!="e" && l!="sb")layerDataReset("p",[]);
				else layerDataReset("p",["upgrades"]);
				return;
			}
			if(l=="h" || l=="q"){
				layerDataReset("p",["upgrades"]);
				return;
			}
			layerDataReset("p",[]);
		},
		
		update(diff){
			if(player.g.best.gte(16)){
				var target=player.p.points.add(1).log(2).pow(1/1.35).add(1).floor();
				if(target.gt(player.p.buyables[11])){
					player.p.dim=player.p.dim.add(target.sub(player.p.buyables[11]));
					player.p.buyables[11]=target;
				}
			}
	 },
	 
	 passiveGeneration(){
		 if(player.g.best.gte(14))return 1;
		 return 0;
	 },
	 hotkeys: [
           {key: "p", description: "P: Prestige reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
})

addLayer("b", {
    name: "booster",
    symbol: "B",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		dim: new Decimal(0),
		dim2: new Decimal(0)
    }},
    color: "#415a9e",
    requires: function(){
		if(!player.b.unlocked && player.g.unlocked)return new Decimal(1e13);
		return new Decimal(1e6);
	},
    resource: "boosters",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "static",
	base: 5,
    exponent: 1.25,
    gainMult() {
        mult = new Decimal(1)
		if(hasUpgrade("b",23)) mult =  mult.div(upgradeEffect("b",23))
        mult=mult.div(tmp.s.buyables[13].effect);
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [],
    layerShown(){return hasUpgrade("p",11) || player.b.unlocked || player.g.unlocked},
	branches: ["p"],
	effect() {
			if(player.h.activeChallenge==11||player.h.activeChallenge==31)return new Decimal(1);
			let ret = player.b.points.add(2).sub(Decimal.pow(0.5,player.b.points.sub(1)));
			let base = new Decimal(2);
			if(hasUpgrade("b",12))base = base.add(upgradeEffect("b",12))
			if(hasUpgrade("b",13))base = base.add(upgradeEffect("b",13))
			if(hasUpgrade("t",12))base = base.add(upgradeEffect("t",12))
			if(hasUpgrade("t",23))base = base.add(tmp.b.dimEffect);
			base = base.add(tmp.h.challenges[11].rewardEffect);
			ret = Decimal.pow(base,ret);
			return ret;
		},
	effectDescription() { // Optional text to describe the effects
           eff = this.effect();
           return "translated to a "+format(eff)+"x multiplier to point gain"
       },
	   upgrades: {
            rows: 4,
            cols: 3,
			11: {
				title: "Booster Upgrade 11",
                description: "Boosters boost Prestige Point gain.",
                cost: new Decimal(4),
                unlocked() { return player.b.unlocked }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.b.points.add(2).pow(hasUpgrade("b",32)?3:1);
                    if(hasUpgrade("b",41))ret=ret.mul(Decimal.pow(1.1,player.b.points.mul(hasUpgrade("b",32)?3:1)));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Booster Upgrade 12",
                description: "Non-extra Generators add to the Booster effect.",
                cost: new Decimal(15),
                unlocked() { return player.b.unlocked && player.g.unlocked}, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.g.points.add(1).log10().sqrt().div(3);
					if(hasUpgrade("b",42))ret = player.g.points.sqrt();
                    return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+" to base" }, // Add formatting to the effect
            },
			13: {
				title: "Booster Upgrade 13",
				description: "Prestige Points add to the Booster effect.",
				cost: new Decimal(18),
				unlocked() { return player.b.best.gte(15) },
				effect() { 
					let ret = player.p.points.add(1).log10().add(1).log10().div(3);
					if(hasUpgrade("b",43))ret = player.p.points.add(1).log10().add(1).pow(0.45);
                    return ret;
				},
				effectDisplay() { return "+"+format(this.effect())+" to base" },
			},
			21: {
				title: "Booster Upgrade 21",
				description: "Square the Generator Power effect.",
				cost: new Decimal(24),
				unlocked() { return player.b.upgrades.includes(11) && player.b.upgrades.includes(12) },
			},
			22: {
				title: "Booster Upgrade 22",
				description: "The Generator Power effect is raised to the power of 1.2.",
				cost: new Decimal(30),
				unlocked() { return player.b.upgrades.includes(12) && player.b.upgrades.includes(13) },
			},
			23: {
				title: "Booster Upgrade 23",
				description: "Boosters are cheaper based on your points.",
				cost: new Decimal(35),
				unlocked() { return player.b.upgrades.includes(21) || player.b.upgrades.includes(22) },
				effect() { 
					let ret= player.points.add(1).log10().add(1).pow(3.2).pow(tmp.s.buyables[14].effect);
					
					return ret;
				},
				effectDisplay() { return "/"+format(this.effect()) },
			},
			31: {
				title: "Booster Upgrade 31",
				description: "Prestige Upgrade 12 uses a better formula.",
				cost: new Decimal(50),
				unlocked() { return player.t.unlocked },
			},
			32: {
				title: "Booster Upgrade 32",
				description: "Booster Upgrade 11's effect is cubed.",
				cost: new Decimal(58),
				unlocked() { return player.t.unlocked },
			},
			33: {
				title: "Booster Upgrade 33",
				description: "Boosters boost Time Energy gain.",
				cost: new Decimal(99),
				unlocked() { return player.t.unlocked },
				effect() { return player.b.points.add(2).pow(1.5) },
				effectDisplay() { return format(this.effect())+"x" },
			},
			41: {
				title: "Booster Upgrade 41",
				description: "Booster Upgrade 11 uses a better formula.",
				cost: new Decimal(6000),
				unlocked() { return player.h.challenges[11]>=1 },
			},
			42: {
				title: "Booster Upgrade 42",
				description: "Booster Upgrade 12 uses a better formula.",
				cost: new Decimal(23000),
				unlocked() { return hasUpgrade("sb",13) },
			},
			43: {
				title: "Booster Upgrade 43",
				description: "Booster Upgrade 13 uses a better formula.",
				cost: new Decimal(Infinity),
				unlocked() { return hasUpgrade("sb",13) },
			},
		},
		milestones: {
            0: {requirementDescription: "10 Boosters",
                done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
                effectDescription: "Keep Prestige Upgrades on reset",
            },
			1: {requirementDescription: "20 Boosters",
                done() {return player[this.layer].best.gte(20)},
                effectDescription: "You can buy max Boosters",
            },
		},
		canBuyMax() {return player[this.layer].best.gte(20)},
	doReset(l){
			if(l=="b" || l=="g"){return;}
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="h" || l=="q"){
				if(player[l].best.gte(2) || l=="e" || l=="sb" || l=="h" || l=="q"){
					var b=new Decimal(player.b.best);
					if(player.t.best.gte(3))layerDataReset("b",["upgrades"]);
					else layerDataReset("b",[]);
					player.b.best=b;
				}
				else if(player.t.best.gte(3))layerDataReset("b",["upgrades"]);
				else layerDataReset("b",[]);
				return;
			}
			layerDataReset("b",[]);
		},
		milestonePopups(){
			if(player.h.best.gte(1))return false;
		 if(player.t.best.gte(2) || player.s.best.gte(2))return false;
		 return true;
	 },
	 autoPrestige(){
		 return player.t.best.gte(9);
	 },resetsNothing(){
		 return player.t.best.gte(9);
	 },dimEffect(){
		 return Decimal.log10(player.b.dim.add(1)).div(3.6).mul(tmp.sb.effect);
	 },dim2Effect(){
		 let x=new Decimal(1);
		 if(hasUpgrade("t",33))x=x.mul(upgradeEffect("t",33));
		 return x;
	 },
	 	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					["display-text",
                        function() {if(hasUpgrade("t",23))return 'You have ' + format(player.b.dim) + ' Booster Boosts, which adds Booster base by ' + format(tmp.b.dimEffect);return ""},
                        {}],
					["display-text",
                        function() {if(hasUpgrade("sb",12))return 'You have ' + format(player.b.dim2) + ' Booster Dimensions, which are generating ' + format(player.b.dim2.mul(tmp.b.dim2Effect)) + " Booster Boosts per second";return ""},
                        {}],
						"milestones",
                   "upgrades"],
	 hotkeys: [
           {key: "b", description: "B: Booster reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	 update(diff){
		 if(hasUpgrade("sb",12))player.b.dim = player.b.dim.add(player.b.dim2.mul(tmp.b.dim2Effect).times(diff)).max(0)
	 },
})


addLayer("g", {
    name: "generator",
    symbol: "G",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		power: new Decimal(0),
		dim: new Decimal(0)
    }},
    color: "#409c6e",
    requires: function(){
		if(!player.g.unlocked && player.b.unlocked)return new Decimal(1e13);
		return new Decimal(1e6);
	},
    resource: "generators",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "static",
	base: 5,
    exponent: 1.25,
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade("g",23)) mult =  mult.div(upgradeEffect("g",23))
        mult=mult.div(tmp.s.buyables[13].effect);
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [],
    layerShown(){return hasUpgrade("p",11) || player.b.unlocked || player.g.unlocked},
	branches: ["p"],
	effect() {
			if(player.h.activeChallenge==12||player.h.activeChallenge==31)return new Decimal(0);
			let ret = player.g.points;
			if(hasUpgrade("g",13))ret = ret.mul(upgradeEffect("g",13));
			if(hasUpgrade("g",22))ret = ret.mul(upgradeEffect("g",22));
			if(hasUpgrade("s",11))ret = ret.mul(upgradeEffect("s",11));
			if(hasUpgrade("s",12))ret = ret.mul(upgradeEffect("s",12));
			if(hasUpgrade("s",31))ret = ret.mul(upgradeEffect("s",31));
			if(hasUpgrade("t",31))ret = ret.mul(upgradeEffect("t",31));
			ret = ret.mul(Decimal.pow(tmp.b.effect,tmp.h.challenges[31].rewardEffect));
			ret = ret.mul(tmp.q.quirkEff)
			return ret;
		},
	effectDescription() { // Optional text to describe the effects
           eff = this.effect();
           return "which are generating "+format(eff)+" Generator Power/sec"
       },
	   	extraeffect() {
			if(player.h.activeChallenge==12||player.h.activeChallenge==31)return new Decimal(0);
			let ret = player.g.dim;
			if(hasUpgrade("g",13))ret = ret.mul(upgradeEffect("g",13));
			if(hasUpgrade("g",22))ret = ret.mul(upgradeEffect("g",22));
			if(hasUpgrade("s",11))ret = ret.mul(upgradeEffect("s",11));
			if(hasUpgrade("s",12))ret = ret.mul(upgradeEffect("s",12));
			if(hasUpgrade("s",31))ret = ret.mul(upgradeEffect("s",31));
			if(hasUpgrade("t",31))ret = ret.mul(upgradeEffect("t",31));
			ret = ret.mul(Decimal.pow(tmp.b.effect,tmp.h.challenges[31].rewardEffect));
			ret = ret.mul(tmp.q.quirkEff)
			return ret;
		},
	 update(diff){
		 player.g.power = player.g.power.add(tmp.g.effect.add(tmp.g.extraeffect).times(diff)).max(0)
		 if(hasUpgrade("g",11))player.p.dim = player.p.dim.add(upgradeEffect("g",11).times(diff)).max(0)
	 },
	getGenPowerEffExp() {
		let exp = new Decimal(1/2)
		if(hasUpgrade("b",21))exp = exp.mul(2);
		if(hasUpgrade("b",22))exp = exp.mul(1.2);
		if(hasUpgrade("e",13))exp = exp.mul(1.15);
		return exp;
	},
	getGenPowerEff() {
		let eff = player.g.power.add(1).pow(tmp.g.getGenPowerEffExp);
		return eff
	},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					"buyables",
                    ["display-text",
                        function() {return 'You have ' + format(player.g.power) + ' Generator Power, which multiplies Point gain by ' + format(tmp.g.getGenPowerEff)},
                        {}],["display-text",
                        function() {return 'You have ' + format(player.g.dim) + ' Extra Generators, which are generating '+format(tmp.g.extraeffect)+' Generator Power/sec'},
                        {}],
						"milestones",
                   "upgrades"],
	   upgrades: {
            rows: 4,
            cols: 3,
			11: {
				title: "Generator Upgrade 11",
                description: "Generators generate 1st Prestige Dimensions.",
                cost: new Decimal(4),
                unlocked() { return player.g.unlocked }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = tmp.g.effect.add(tmp.g.extraeffect);
                    return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+"/s" }, // Add formatting to the effect
            },
			12: {
				title: "Generator Upgrade 12",
                description: "Non-extra Generators boost Prestige Point gain.",
                cost: new Decimal(12),
                unlocked() { return player.b.unlocked && player.g.unlocked }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.g.points.add(2).pow(hasUpgrade("g",32)?3:1);
					if(hasUpgrade("g",41))ret=ret.mul(Decimal.pow(1.1,player.g.points.mul(hasUpgrade("g",32)?3:1)));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Generator Upgrade 13",
                description: "Non-extra Generators boost Generator Power and 1st Prestige Dimension gain.",
                cost: new Decimal(17),
                unlocked() { return player.b.unlocked && player.g.unlocked}, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=new Decimal(1.15);
					if(hasUpgrade("g",33))base=base.add(0.1);
					if(player.e.best.gte(1e100))base=base.add(tmp.e.buyables[11].effect[3]);
					base = base.add(tmp.h.challenges[12].rewardEffect);
                    let ret = Decimal.pow(base,player.g.points);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
				title: "Generator Upgrade 21",
                description: "Prestige Upgrade 11 uses a better formula.",
                cost: new Decimal(28),
                unlocked() { return player.g.best.gte(20)}, // The upgrade is only visible when this is true
            },
			22: {
				title: "Generator Upgrade 22",
                description: "Generator Power and 1st Prestige Dimension generates faster based on Generator Power amount.",
                cost: new Decimal(32),
                unlocked() { return player.g.upgrades.includes(21)},
				effect() { return Decimal.pow(1.4,Decimal.log10(player.g.power.add(1)).pow(0.9)) },
				effectDisplay() { return format(this.effect())+"x" },
            },
			23: {
				title: "Generator Upgrade 23",
				description: "Generators are cheaper based on your Prestige Points.",
				cost: new Decimal(36),
				unlocked() { return player.g.upgrades.includes(22) },
				effect() { return player.p.points.add(1).pow(0.25)},
				effectDisplay() { return "/"+format(this.effect()) },
			},
			31: {
				title: "Generator Upgrade 31",
				description: "Prestige Upgrade 22 uses a better formula.",
				cost: new Decimal(50),
				unlocked() { return player.s.unlocked },
			},
			32: {
				title: "Generator Upgrade 32",
				description: "Generator Upgrade 12's effect is cubed.",
				cost: new Decimal(58),
				unlocked() { return player.s.unlocked },
			},
			33: {
				title: "Generator Upgrade 33",
				description: "Add 0.1 to Generator Upgrade 13's base.",
				cost: new Decimal(99),
				unlocked() { return player.s.unlocked },
			},
			41: {
				title: "Generator Upgrade 41",
				description: "Generator Upgrade 12 uses a better formula.",
				cost: new Decimal(7500),
				unlocked() { return player.h.challenges[12]>=1 },
			},
		},
		milestones: {
            0: {requirementDescription: "10 Generators",
                done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
                effectDescription: "Keep Prestige Upgrades on reset",
            },
			1: {requirementDescription: "12 Generators",
                done() {return player[this.layer].best.gte(12)},
                effectDescription: "Buying Prestige Dimensions doesn't cost any prestige points",
            },
			2: {requirementDescription: "14 Generators",
                done() {return player[this.layer].best.gte(14)},
                effectDescription: "Gain 100% of Prestige Point gain every second",
            },
			3: {requirementDescription: "16 Generators",
                done() {return player[this.layer].best.gte(16)},
                effectDescription: "Automatically buying Prestige Dimensions",
            },
			4: {requirementDescription: "20 Generators",
                done() {return player[this.layer].best.gte(20)},
                effectDescription: "You can buy max Generators",
            },
		},
		canBuyMax() {return player[this.layer].best.gte(20)},
	doReset(l){
			if(l=="b" || l=="g"){return;}
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="h" || l=="q"){
				if(player[l].best.gte(2) || l=="e" || l=="sb" || l=="h" || l=="q"){
					var b=new Decimal(player.g.best);
					if(player.s.best.gte(3))layerDataReset("g",["upgrades"]);
					else layerDataReset("g",[]);
					player.g.best=b;
				}
				else if(player.s.best.gte(3))layerDataReset("g",["upgrades"]);
				else layerDataReset("g",[]);
				return;
			}
			layerDataReset("g",[]);
		},
		milestonePopups(){
			if(player.h.best.gte(1))return false;
		 if(player.t.best.gte(2) || player.s.best.gte(2))return false;
		 return true;
	 },
	 autoPrestige(){
		 return player.s.best.gte(9);
	 },resetsNothing(){
		 return player.s.best.gte(9);
	 },
	 hotkeys: [
           {key: "g", description: "G: Generator reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
})

addLayer("t", {
    name: "time capsule",
    symbol: "T",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		energy: new Decimal(0),
		dim: new Decimal(0)
    }},
    color: "#3f993d",
    requires: function(){
		if(!player.t.unlocked && player.s.unlocked)return new Decimal(1e240);
		return new Decimal(1e70);
	},
    resource: "time capsules",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "static",
	base: new Decimal(1e15),
    exponent: 1.85,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [],
    layerShown(){return hasUpgrade("b",23) || player.t.unlocked},
	branches: ["b"],
	 update(diff){
		 player.t.energy = player.t.energy.add(tmp.t.effect.times(diff).times(player.t.dim.plus(1))).max(0);
		 if(hasUpgrade("t",11))player.t.dim = player.t.dim.add(upgradeEffect("t",11).times(diff)).max(0);
		 if(hasUpgrade("t",23))player.b.dim = player.b.dim.add(upgradeEffect("t",23).times(diff)).max(0);
		 if(player.h.best.gte(1)){
				var target=player.b.points.div(40).sub(1).pow(1/1.2).div(0.065).add(1).floor();
				if(target.gt(player.t.buyables[11])){
					player.t.dim=player.t.dim.add(target.sub(player.t.buyables[11]));
					player.t.buyables[11]=target;
				}
			}
	 },
	effect() {
		let ret = player.t.points.mul(tmp.t.buyables[11].effect);
		if(hasUpgrade("b",33))ret = ret.mul(upgradeEffect("b",33));
		if(hasUpgrade("t",13))ret = ret.mul(upgradeEffect("t",13));
		if(hasUpgrade("t",21))ret = ret.mul(upgradeEffect("t",21));
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           eff = this.effect();
           return "which are generating "+format(eff)+" Time Energy/sec"
       },
	   
	getTimeEff() {
		let exp = 1.2;
		if (hasUpgrade("t",13)) exp = 1.75;
		let eff = player.t.energy.add(1).pow(exp);
		return eff;
	},
	tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					"buyables",
                    ["display-text",
                        function() {return 'You have ' + format(player.t.energy) + ' Time Energy, which multiplies Point gain & Prestige Point gain by ' + format(tmp.t.getTimeEff)},
                        {}],["display-text",
                        function() {return 'You have ' + format(player.t.dim) + ' Time Dimensions, which are generating '+format(tmp.t.effect.mul(player.t.dim))+' Time Energy/sec'},
                        {}],
						"milestones",
                   "upgrades"],
	milestones: {
            0: {requirementDescription: "2 time capsules",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster/Generator milestones on reset, keep Prestige Upgrades on reset and you can buy Time Dimensions",
            },
            1: {requirementDescription: "3 time capsules",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster Upgrades on all row 3 resets and unlock Time Upgrades",
            },
			2: {requirementDescription: "9 time capsules",
                done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
                effectDescription: "Automatically purchase Boosters and Booster resets nothing",
            },
			3: {requirementDescription: "25 time capsules",
                done() {return player[this.layer].best.gte(25)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Time Capsules",
            },
	},canBuyMax() {return player[this.layer].best.gte(25)},
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Buy a Time Dimension and multiply Time Energy generation by 2", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.mul(0.065).pow(1.2).add(1).mul(40).ceil()
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(2, x)
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " boosters\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Currently: Time Energy generation is multiplied by "+format(data.effect);
                },
                unlocked() { return player[this.layer].best.gte(2) }, 
                canAfford() {
                    return player.b.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					if(player.h.best.lt(1))player.b.points = player.b.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player[this.layer].dim = player[this.layer].dim.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
        },
		
	upgrades:{
		rows: 3,
		cols: 3,
		11: {
			description: "Time Capsules generate Time Dimensions.",
			cost: new Decimal(8),
			unlocked() { return player.t.best.gte(3) },
			effect() { 
				let ret=player.t.points.pow(3);
				if(hasUpgrade("t",22))ret=ret.mul(Decimal.pow(4,player.t.points));
				ret=ret.mul(tmp.h.effect);
				return ret;
			},
			effectDisplay() { return "+"+format(this.effect())+"/s" },
		},
		12: {
			description: "Time Capsules boost the Booster effect.",
			cost: new Decimal(3),
			unlocked() { return player.t.best.gte(3) },
			effect() {
				return player.t.points.pow(0.9).add(0.5)
			},
			effectDisplay() { return "+"+format(this.effect())+" to base" },
		},
		13: {
			description: "Time Energy boosts its own production, and the Time Energy effect uses a better formula.",
			cost: new Decimal(12),
			unlocked() { return player.t.best.gte(3) },
			effect() { 
					let base=new Decimal(1.15);
					if(hasUpgrade("t",32))base=base.add(0.5);
                    let ret = Decimal.pow(base,Decimal.log10(player.t.energy.add(1)).pow(0.9));
					return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		21: {
			description: "Time Energy production is boosted by your Enhance Points.",
			cost: new Decimal(14),
			unlocked() { return player.e.unlocked },
			effect() { 
				let base=20;
                let ret = Decimal.pow(base,Decimal.log10(player.e.points.add(1)).pow(0.9));
			return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		22: {
			description: "Time Upgrade 1 is better.",
			cost: new Decimal(17),
			unlocked() { return player.e.unlocked },
		},
		23: {
			description: "Time Dimensions generate booster boosts.",
			cost: new Decimal(23),
			unlocked() { return player.e.unlocked },
			effect() { 
                let ret = player.t.dim;
				return ret;
			},
			effectDisplay() { return "+"+format(this.effect())+"/s" },
		},
		31: {
			description: "Generators are stronger based on your Time Energy.",
			cost: new Decimal(55),
			unlocked() { return player.h.unlocked },
			effect() { let base=1.65;
                    let ret = Decimal.pow(base,Decimal.log10(player.t.energy.add(1)).pow(0.9));
					return ret;},
			effectDisplay() { return format(this.effect())+"x" },
		},
		32: {
			description: "Time Upgrade 3 is better.",
			cost: new Decimal(63),
			unlocked() { return player.h.unlocked },
		},
		33: {
			description: "Booster Dimensions are stronger based on your Time Energy.",
			cost: new Decimal(80),
			unlocked() { return hasUpgrade("sb",12); },
			effect() { 
					let base=new Decimal(1.1);
                    let ret = Decimal.pow(base,Decimal.log10(player.t.energy.add(1)).pow(0.9));
					return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
	},
	doReset(l){
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){return;}
			if(l=="h" || l=="q"){
					var b=new Decimal(player.t.best);
					if(player[l].best.gte(2))layerDataReset("t",["upgrades"]);
					else layerDataReset("t",[]);
					player.t.best=b;
					return;
				}
			layerDataReset("t",[]);
		},
		milestonePopups(){
			if(player.h.best.gte(1))return false;
		 return true;
	    },
	 autoPrestige(){
		 return player.h.best.gte(30);
	 },resetsNothing(){
		 return player.h.best.gte(30);
	 },
	 hotkeys: [
           {key: "t", description: "T: Time reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
})

addLayer("s", {
    name: "space energy",
    symbol: "S",
    position: 3,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		dim: new Decimal(0),
    }},
    color: "#dfdfdf",
    requires: function(){
		if(!player.s.unlocked && player.t.unlocked)return new Decimal(1e240);
		return new Decimal(1e70);
	},
    resource: "space energy",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "static",
	base: new Decimal(1e15),
    exponent: 1.85,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [],
    layerShown(){return hasUpgrade("g",23) || player.s.unlocked},
	branches: ["g"],
	milestones: {
            0: {requirementDescription: "2 space energy",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster/Generator milestones on reset, keep Prestige Upgrades on reset and unlock Space Building 2 and 3",
            },
            1: {requirementDescription: "3 space energy",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Keep Generator Upgrades on all row 3 resets and unlock Space Upgrades",
            },
			2: {requirementDescription: "9 space energy",
                done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
                effectDescription: "Automatically purchase Generators and Generator resets nothing",
            },
			3: {requirementDescription: "15 space energy",
                done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
                effectDescription: "Unlock Space Building 4",
            },
			4: {requirementDescription: "25 space energy",
                done() {return player[this.layer].best.gte(25)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Space Energy and unlock Space Building 5",
            },
	},canBuyMax() {return player[this.layer].best.gte(25)},
	tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					"buyables",["display-text",
                        function() {return "Space Building Strength: "+format(tmp.s.getStrength)+"<br>"},
                        {}],
                    ["display-text",
                        function() {return 'You have ' + format(tmp.s.getSpace) + ' Space remaining for Space Buildings.'},
                        {}],
                    ["display-text",
                        function() {return 'You have ' + format(player.g.power) + ' Generator Power'},
                        {}],
					["display-text",
                        function() {if(!hasUpgrade("s",31))return "";return 'You have ' + format(player.s.dim) + ' Space Dimensions, which are providing '+format(player.s.dim)+' addditional space'},
                        {}],
						"milestones",
                   "upgrades"],
				    
	getBaseSpace(){
		if(player.h.activeChallenge==32)return new Decimal(0);
		let baseSpace = player.s.best.pow(1.1).times(3);
		if(hasUpgrade("s",31))baseSpace=baseSpace.add(player.s.dim);
		baseSpace=baseSpace.floor();
		return baseSpace;
	},
	getSpace(){
		if(player.h.activeChallenge==32)return new Decimal(0);
		let baseSpace = tmp.s.getBaseSpace;
		return baseSpace.sub(tmp.s.getSpaceSpent);
	},
	getSpaceSpent(){
		return player[this.layer].buyables[11].add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14]).add(player[this.layer].buyables[15]);
	},
	
	buyables: {
            rows: 1,
            cols: 5,
            11: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e4,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
					if(hasUpgrade("s",32))cost=cost.div(upgradeEffect("s",32));
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x = x.add(tmp.s.buyables[15].effect);
					x=x.mul(tmp.s.getStrength);
                    let eff = x.pow(4)
					if(hasUpgrade("s",21))eff = eff.mul(Decimal.pow(1.25,x));
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 1\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + player[this.layer].buyables[this.id] + "\n"+
                    (player.e.dim.gt(1)?"Currently: Multiply Extra Generator Gain by "+format(data.effect)+".":"Currently: Gain "+format(data.effect)+" Extra Generators per second.")+
					(hasUpgrade("s",31)?" Gain "+format(data.effect)+" Space Dimensions per second.":"");
                },
                unlocked() { return true }, 
                canAfford() {
                    return player.g.power.gte(tmp[this.layer].buyables[this.id].cost) && tmp.s.getSpace.gt(0)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(3))player.g.power = player.g.power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
                
            },
			12: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e6,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
					if(hasUpgrade("s",32))cost=cost.div(upgradeEffect("s",32));
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x = x.add(tmp.s.buyables[15].effect);
					x=x.mul(tmp.s.getStrength);
                    let ret = Decimal.pow(Decimal.add(1, x.pow(2)), player.s.points).times(1).max(1)
					return ret
				},
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 2\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + player[this.layer].buyables[this.id] + "\n\
                    Currently: Space Energy boosts Point gain & Prestige Point gain ("+format(data.effect)+"x)";
                },
                unlocked() { return player[this.layer].best.gte(2) }, 
                canAfford() {
                    return player.g.power.gte(tmp[this.layer].buyables[this.id].cost) && tmp.s.getSpace.gt(0)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(3))player.g.power = player.g.power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
                
            },
			13: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e12,Decimal.pow(x.add(1),1.35))
					
					if(hasUpgrade("s",32))cost=cost.div(upgradeEffect("s",32));
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(x.eq(0))return new Decimal(1);
					x = x.add(tmp.s.buyables[15].effect);
					x=x.mul(tmp.s.getStrength);
					x = Decimal.pow(1e10, x.pow(0.9)).mul(1e20);
					if(hasUpgrade("s",22))x = x.pow(2);
					return x
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 3\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + player[this.layer].buyables[this.id] + "\n\
                    Currently: Makes Boosters/Generators cheaper by "+format(data.effect)+"x";
                },
                unlocked() { return player[this.layer].best.gte(2) }, 
                canAfford() {
                    return player.g.power.gte(tmp[this.layer].buyables[this.id].cost) && tmp.s.getSpace.gt(0)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(3))player.g.power = player.g.power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
                
            },
			14: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e24,Decimal.pow(x.add(2),1.35))
					
					if(hasUpgrade("s",32))cost=cost.div(upgradeEffect("s",32));
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(x.eq(0))return new Decimal(1);
					x = x.add(tmp.s.buyables[15].effect);
					x=x.mul(tmp.s.getStrength);
					if(hasUpgrade("s",23))x = x.mul(2);
					//if (x.gte("e3e9")) x = Decimal.pow(10, x.log10().times(9e18).cbrt())
					return x
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 4\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + player[this.layer].buyables[this.id] + "\n\
                    Currently: Booster Upgrade 23's effect is raised to the power of "+format(data.effect);
                },
                unlocked() { return player[this.layer].best.gte(15) }, 
                canAfford() {
                    return player.g.power.gte(tmp[this.layer].buyables[this.id].cost) && tmp.s.getSpace.gt(0)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(3))player.g.power = player.g.power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
                
            },
			15: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e50,Decimal.pow(x.add(3),1.35))
					if(hasUpgrade("s",32))cost=cost.div(upgradeEffect("s",32));
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x=x.mul(tmp.s.getStrength);
					//if (x.gte("e3e9")) x = Decimal.pow(10, x.log10().times(9e18).cbrt())
					return x.sqrt()
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 5\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + player[this.layer].buyables[this.id] + "\n\
                    Currently: Add "+format(data.effect)+" free levels to all previous Space Buildings";
                },
                unlocked() { return player[this.layer].best.gte(25) }, 
                canAfford() {
                    return player.g.power.gte(tmp[this.layer].buyables[this.id].cost) && tmp.s.getSpace.gt(0)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(3))player.g.power = player.g.power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
                
            },
        },
		
	update(diff){
		 player.g.dim = player.g.dim.add(tmp.s.buyables[11].effect.mul(diff)).max(0);
		 if(hasUpgrade("s",31))player.s.dim = player.s.dim.add(tmp.s.buyables[11].effect.times(diff)).max(0);
		 if(player.h.best.gte(3)){
			var pow=player.g.power;
			if(hasUpgrade("s",32))pow=pow.mul(upgradeEffect("s",32));
			var target=pow.add(1).log(1e50).pow(1/1.35).sub(2).floor();
			if(target.gte(tmp.s.getSpace.add(player.s.buyables[15])))target=tmp.s.getSpace.add(player.s.buyables[15]);
			if(target.gt(player.s.buyables[15])&&player.s.best.gte(25)){
				player.s.buyables[15]=target;
			}
			target=pow.add(1).log(1e24).pow(1/1.35).sub(1).floor();
			if(target.gte(tmp.s.getSpace.add(player.s.buyables[14])))target=tmp.s.getSpace.add(player.s.buyables[14]);
			if(target.gt(player.s.buyables[14])&&player.s.best.gte(15)){
				player.s.buyables[14]=target;
			}
			target=pow.add(1).log(1e12).pow(1/1.35).floor();
			if(target.gte(tmp.s.getSpace.add(player.s.buyables[13])))target=tmp.s.getSpace.add(player.s.buyables[13]);
			if(target.gt(player.s.buyables[13])&&player.s.best.gte(2)){
				player.s.buyables[13]=target;
			}
			target=pow.add(1).log(1e6).pow(1/1.35).add(1).floor();
			if(target.gte(tmp.s.getSpace.add(player.s.buyables[12])))target=tmp.s.getSpace.add(player.s.buyables[12]);
			if(target.gt(player.s.buyables[12])&&player.s.best.gte(2)){
				player.s.buyables[12]=target;
			}
			target=pow.add(1).log(1e4).pow(1/1.35).add(1).floor();
			if(target.gte(tmp.s.getSpace.add(player.s.buyables[11])))target=tmp.s.getSpace.add(player.s.buyables[11]);
			if(target.gt(player.s.buyables[11])){
				player.s.buyables[11]=target;
			}
		 }
	 },
	 upgrades:{
		rows: 4,
		cols: 3,
		11: {
			description: "Generator Power boosts Generator Power and 1st Prestige Dimension gain.",
			cost: new Decimal(3),
			unlocked() { return player.s.best.gte(3) },
			effect() { let ret = Decimal.pow(1.5,Decimal.log10(player.g.power.add(1)).pow(0.9));return ret; },
			effectDisplay() { return format(this.effect())+"x" },
		},
		12: {
			description: "Space Building Levels boost Generator Power and 1st Prestige Dimension gain.",
			cost: new Decimal(3),
			unlocked() { return player.s.best.gte(3) },
			effect() { return Decimal.pow(2, tmp.s !== undefined ? tmp.s.getSpaceSpent : 0) },
			effectDisplay() { return format(this.effect())+"x" },
		},
		13: {
			description: "All Space Buildings are stronger based on your Generators.",
			cost: new Decimal(4),
			unlocked() { return player.s.best.gte(3) },
			effect() { return player.g.points.add(1).log10().div(1.5).add(1) },
			effectDisplay() { return format(this.effect())+"x stronger" },
		},
		21: {
			description: "Space Building 1 uses a better formula.",
			cost: new Decimal(16),
			unlocked() { return player.e.unlocked },
		},
		22: {
			description: "Space Building 3's effect is squared.",
			cost: new Decimal(18),
			unlocked() { return player.e.unlocked },
		},
		23: {
			description: "Space Building 4's effect is doubled.",
			cost: new Decimal(28),
			unlocked() { return player.e.unlocked },
		},
		31: {
			description: "Unlock Space Dimensions, which is generated by Space Building 1. Generators are stronger based on your Total Space.",
			cost: new Decimal(52),
			unlocked() { return player.h.unlocked },
			effect() { return tmp.s.getBaseSpace.plus(10); },
			effectDisplay() { return format(this.effect())+"x" },
		},
		32: {
			description: "Total Space cheapens Space Buildings.",
			cost: new Decimal(75),
			unlocked() { return player.h.unlocked },
			effect() { return tmp.s.getBaseSpace.plus(10); },
			effectDisplay() { return "/"+format(this.effect()) },
		},
		33: {
			description: "Space Buildings are stronger based on total space.",
			cost: new Decimal(122),
			unlocked() { return player.h.challenges[32]>=1 },
			effect() { return Decimal.log10(Decimal.log10(Decimal.log10(tmp.s.getBaseSpace.plus(10)).plus(10)).plus(10)).pow(1.5); },
			effectDisplay() { return format(this.effect())+"x" },
		},
	},
		doReset(l){
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){return;}
			if(l=="h" || l=="q"){
					var b=new Decimal(player.s.best);
					if(player[l].best.gte(2))layerDataReset("s",["upgrades"]);
					else layerDataReset("s",[]);
					player.s.best=b;
					return;
				}
			layerDataReset("s",[]);
		},
		milestonePopups(){
			if(player.h.best.gte(1))return false;
		 return true;
	    },
	 autoPrestige(){
		 return player.h.best.gte(5000);
	 },resetsNothing(){
		 return player.h.best.gte(5000);
	 },
	 hotkeys: [
           {key: "s", description: "S: Space reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	getStrength(){
		if(player.h.activeChallenge==32)return new Decimal(0);
		let x=new Decimal(1);
		if(hasUpgrade("s",13))x = x.mul(upgradeEffect("s",13));
		x=x.mul(tmp.h.challenges[32].rewardEffect);
		if(hasUpgrade("s",33))x = x.mul(upgradeEffect("s",33));
		return x;
	},
})

addLayer("e", {
    name: "enhance",
    symbol: "E",
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		dim: new Decimal(0)
    }},
    color: "#9643a3",
    requires: function(){
		return new Decimal("1e1600");
	},
    resource: "enhance points",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.02,
    gainMult() {
        mult = new Decimal(1)
		if(hasUpgrade("e",21))mult=mult.mul(upgradeEffect("e",21));
		if(player.h.best.gte(1))mult=mult.mul(1e4);
		if(player.h.best.gte(2))mult=mult.mul(1e4);
		if(player.h.best.gte(3))mult=mult.mul(1e4);
		if(player.h.best.gte(10))mult=mult.mul(1e4);
		if(player.h.best.gte(30))mult=mult.mul(1e4);
		if(player.h.best.gte(100))mult=mult.mul(1e4);
		if(player.h.best.gte(200))mult=mult.mul(1e4);
		if(player.h.best.gte(5000))mult=mult.mul(1e4);
		if(player.h.best.gte(1.5e5))mult=mult.mul(1e4);
		if(player.h.best.gte(1e8))mult=mult.mul(1e4);
		if(player.h.best.gte(1e12))mult=mult.mul(1e4);
		if(hasUpgrade("q",11)) mult =  mult.mul(upgradeEffect("q",11))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
	softcap: new Decimal("eeeeeeeee9"),
	softcapPower: new Decimal(1),
    hotkeys: [],
    layerShown(){return hasUpgrade("p",33) || player.e.unlocked},
	branches: ["b","g"],
	milestones: {
            0: {requirementDescription: "1 enhance points",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster/Generator milestones on reset, keep Prestige upgrades on reset",
            },
			1: {requirementDescription: "500 enhance points",
                done() {return player[this.layer].best.gte(500)}, // Used to determine when to give the milestone
                effectDescription: "Unlock Enhancer Effect 2.",
            },
			2: {requirementDescription: "5e6 enhance points",
                done() {return player[this.layer].best.gte(5e6)}, // Used to determine when to give the milestone
                effectDescription: "Unlock Enhancer Effect 3.",
            },
			3: {requirementDescription: "1e100 enhance points",
                done() {return player[this.layer].best.gte(1e100)}, // Used to determine when to give the milestone
                effectDescription: "Unlock Enhancer Effect 4.",
            },
	},
	getStrength(){
		let x=new Decimal(1);
		if(hasUpgrade("e",22))x=x.mul(upgradeEffect("e",22));
		if(hasUpgrade("e",32))x=x.mul(upgradeEffect("e",32));
		if(hasUpgrade("e",33))x=x.mul(upgradeEffect("e",33));
		x=x.mul(tmp.h.challenges[21].rewardEffect);
		if(player.h.activeChallenge==21)x=new Decimal(0);
		return x;
	},
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Buy an Enhancer", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x=x.mul(tmp.e.getStrength);
					let eff = [Decimal.pow(x, 4).mul(1e4),Decimal.pow(100, x.pow(1.1)),Decimal.pow(2, x),x.sqrt().mul(0.004)];
					if(hasUpgrade("e",12))eff[0]=eff[0].mul(upgradeEffect("e",12));
					if(hasUpgrade("e",23))eff[2]=eff[2].mul(upgradeEffect("e",23));
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " Enhance Points\n\
                    Amount: " + player[this.layer].buyables[this.id];
                },
                unlocked() { return true }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(2))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
        },
		
	dimEffect(){
		let ret=player.e.dim.mul(tmp.s.buyables[11].effect);
		if(player[this.layer].best.gte(5e6))ret=ret.mul(tmp.e.buyables[11].effect[2]);
		return ret;
	},
	update(diff){
		 player.e.dim = player.e.dim.add(tmp.e.buyables[11].effect[0].mul(diff)).max(0);
		 player.g.dim = player.g.dim.add(tmp.e.dimEffect.mul(diff)).max(0);
		 if(player.h.best.gte(2)){
				var target=player.e.points.add(1).log(2).pow(1/1.5).add(1).floor();
				if(target.gt(player.e.buyables[11])){
					player.e.buyables[11]=target;
				}
			}
	 },
	tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					"buyables",
					["raw-html",function(){
						var effect="Enhancer Effect 1: Generate +"+format(tmp.e.buyables[11].effect[0])+" Enhance Dimensions per second<br>";
						if(hasUpgrade("q",21))effect="Enhancer Effect 1: Multiply Enhance Dimension gain by "+format(tmp.e.buyables[11].effect[0])+"<br>";
						if(player.e.best.gte(500))effect+="Enhancer Effect 2: Multiply Prestige Point gain by "+format(tmp.e.buyables[11].effect[1])+"<br>";
						if(player.e.best.gte(5e6))effect+="Enhancer Effect 3: Multiply Extra Generator gain from Enhance Dimensions by "+format(tmp.e.buyables[11].effect[2])+"<br>";
						if(player.e.best.gte(1e100))effect+="Enhancer Effect 4: Generator Upgrade 13's base +"+format(tmp.e.buyables[11].effect[3])+"<br>";
						return "Enhancer Strength: "+format(tmp.e.getStrength)+"<br>Your "+format(player.e.buyables[11])+" Enhancers are providing these effects:<br>"+effect}
					],["display-text",
                        function() {return 'You have ' + format(player.e.dim) + ' Enhance Dimensions, which are generating '+format(tmp.e.dimEffect)+' Extra Generators/sec'},
                        {}],
						"milestones",
                   "upgrades"],
		upgrades:{
		rows: 4,
		cols: 3,
		11: {
			description: "Unspent Enhance Points boost Prestige Point gain.",
			cost: new Decimal(1000),
			unlocked() { return true },
			effect() { 
				let base=100;
				if(hasUpgrade("e",41))base+=9900;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9))
                return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		12: {
			description: "Enhancer Effect 1 is stronger based on Unspent Enhance Points.",
			cost: new Decimal(5000),
			unlocked() { return true },
			effect() { 
				let base=100;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9))
                return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		13: {
			description: "The Generator Power effect is raised to the power of 1.15.",
			cost: new Decimal(1e12),
			unlocked() { return true },
		},
		21: {
			description: "Prestige Points boost Enhance Point gain.",
			cost: new Decimal(1e20),
			unlocked() { return true },
			effect() { 
				let base=1.005;
                let ret = Decimal.pow(base,Decimal.log10(player.p.points.add(1)).pow(0.9))
                return ret; },
			effectDisplay() { return format(this.effect())+"x" },
		},
		22: {
			description: "Enhancers are stronger based on your Space Energy & Time Capsules.",
			cost: new Decimal(1e39),
			unlocked() { return true },
			effect() { 
				let ret = player.s.points.add(player.t.points).div(100).add(1);
				return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		23: {
			description: "Enhancer Effect 3 is stronger based on your Enhance Points.",
			cost: new Decimal(1e92),
			unlocked() { return true },
			effect() { 
				let base=2.6;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9))
                return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		31: {
			description: "Effective Super-Booster Exponent +0.1",
			cost: new Decimal(1e185),
			unlocked() { return player.sb.unlocked },
		},
		32: {
			description: "Enhancers are stronger based on your Effective Super-Boosters.",
			cost: new Decimal(1e208),
			unlocked() { return player.sb.unlocked },
			effect() {
				let ret = tmp.sb.getEff.div(10).add(1);
				return ret;
			},
			effectDisplay() { return format(this.effect())+"x"  },
		},
		33: {
			description: "Enhancers are stronger based on your Enhance Points.",
			cost: new Decimal("1e348"),
			unlocked() { return player.sb.unlocked },
			effect() {
				let ret = player.e.points.add(1e10).log10().log10().div(10).add(1);
				return ret;
			},
			effectDisplay() { return format(this.effect())+"x"  },
		},
		41: {
			description: "Enhance Upgrade 1 is stronger.",
			cost: new Decimal("1e888"),
			unlocked() { return player.h.challenges[21]>=1 },
		},
	},
	doReset(l){
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){return;}
			if(l=="h" || l=="q"){
					var b=new Decimal(player.e.best);
					if(player[l].best.gte(2))layerDataReset("e",["upgrades"]);
					else layerDataReset("e",[]);
					player.e.best=b;
					return;
				}
			layerDataReset("e",[]);
		},
		
		
	 passiveGeneration(){
		 if(player.h.best.gte(10))return 1;
		 return 0;
	 },milestonePopups(){
			if(player.h.best.gte(1))return false;
		 return true;
	    },
	 hotkeys: [
           {key: "e", description: "E: Enhance reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
})

addLayer("sb", {
    name: "super-booster",
    symbol: "SB",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		dim: new Decimal(0)
    }},
    color: "#494b99",
    requires: function(){
		return new Decimal(2425);
	},
    resource: "super-boosters",
    baseResource: "boosters", 
    baseAmount() {return player.b.points},
    type: "static",
	base: 1.05,
    exponent: 1.25,
    gainMult() {
        mult = new Decimal(1)
		return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [],
    layerShown(){return hasUpgrade("p",42) || player.sb.unlocked},
	branches: ["b"],
	effect() {
			let base=new Decimal(1.5);
			if(hasUpgrade("sb",11))base=base.add(upgradeEffect("sb",11));
			let ret = Decimal.pow(base,tmp.sb.getEff);
			return ret;
		},
	 effectDescription() { // Optional text to describe the effects
           eff = this.effect();
           return "which are multiplying the Booster Boost effect by "+format(eff);
       },
	   upgrades: {
            rows: 1,
            cols: 3,
			11: {
                description: "Super-Boosters are stronger based on your Prestige Points.",
                cost: new Decimal(2),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.p.points.add(1e10).log10().log10().div(20);
					return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+" to the base" }, // Add formatting to the effect
            },
			12: {
                description: "Super-Booster generates Booster Dimensions.",
                cost: new Decimal(14),
                unlocked() { return player.h.unlocked },
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.sb.points.mul(Decimal.pow(1e9,player.sb.points.pow(0.8)));
					return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+"/s" }, // Add formatting to the effect
            },
			13: {
                description: "Unlock more Booster Upgrades.",
                cost: new Decimal(22),
                unlocked() { return player.q.unlocked },
            },
		},
		milestones: {
            0: {requirementDescription: "1 Super-Boosters",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster/Generator milestones on reset, keep Prestige upgrades on reset, you can buy max Super-Boosters",
            },
		},
		canBuyMax() {return player[this.layer].best.gte(1)},
		milestonePopups(){
			if(player.h.best.gte(1))return false;
		 return true;
	    },
	 	 tabFormat: ["main-display",
					["display-text",
                        function() {
							return 'You have '+format(tmp.sb.getEff)+' effective super-boosters.';},
                        {}],
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
						"milestones",
                   "upgrades"],
				   
	getEffExp(){
		let exponent=new Decimal(0.5);
		if(hasUpgrade("e",31))exponent=exponent.add(0.1);
		return exponent;
	},
	getEff(){
			return player.sb.points.pow(tmp.sb.getEffExp);
	},
		doReset(l){
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){return;}
			if(l=="h" || l=="q"){
					var b=new Decimal(player.sb.best);
					if(player[l].best.gte(2))layerDataReset("sb",["upgrades"]);
					else layerDataReset("sb",[]);
					player.sb.best=b;
					if(hasUpgrade("h",12))player.sb.points=new Decimal(1);
					return;
				}
			layerDataReset("sb",[]);
		},
		autoPrestige(){
		 return player.h.best.gte(100);
	 },resetsNothing(){
		 return player.h.best.gte(100);
	 },
	 hotkeys: [
           {key: "B", description: "Shift+B: Super-Booster reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	 update(diff){
		 if(hasUpgrade("sb",12))player.b.dim2=player.b.dim2.add(upgradeEffect("sb",12).mul(diff)).max(0);
	 }
})


addLayer("h", {
    name: "hindrance spirit",
    symbol: "H",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		dim: new Decimal(0)
    }},
    color: "#a14040",
    requires: function(){
		return new Decimal("1e550");
	},
    resource: "hindrance spirit",
    baseResource: "time energy", 
    baseAmount() {return player.t.energy},
    type: "normal",
    exponent: .02,
    gainMult() {
        mult = new Decimal(1)
		if(hasUpgrade("h",13))mult=mult.mul(upgradeEffect("h",13));
		return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 3,
    hotkeys: [],
    layerShown(){return hasUpgrade("e",33) || player.h.unlocked},
	branches: ["t"],
	effect() {
			return player.h.points.add(1);
		},
	effectDescription() { // Optional text to describe the effects
           eff = this.effect();
           return "which are multiplying Time Dimension production by "+format(eff);
       },
	milestones: {
            0: {requirementDescription: "1 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Keep all milestones and prestige upgrades on all 4th row resets, autobuy Time Dimensions, buying Time Dimensions doesn't cost any boosters, and gain 10000x more Enhance Points",
            },
			1: {requirementDescription: "2 Hindrance Spirit",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Keep all 3rd row upgrades on reset, autobuy Enhancers, buying Enhancers doesn't cost any Enhance Points, and gain 10000x more Enhance Points",
            },
			2: {requirementDescription: "3 Hindrance Spirit",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Space Buildings, buying Space Buildings doesn't cost any Generator Power, and gain 10000x more Enhance Points",
            },
			3: {requirementDescription: "10 Hindrance Spirit",
                done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
                effectDescription: "Gain 10000x more Enhance Points, and gain 100% of Enhance Point gain every second",
            },
			4: {requirementDescription: "30 Hindrance Spirit",
                done() {return player[this.layer].best.gte(30)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Time Capsules, Time reset does nothing, and gain 10000x more Enhance Points",
            },
			5: {requirementDescription: "100 Hindrance Spirit",
                done() {return player[this.layer].best.gte(100)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Super-Boosters, Super-Booster reset does nothing, and gain 10000x more Enhance Points",
            },
			6: {requirementDescription: "200 Hindrance Spirit",
                done() {return player[this.layer].best.gte(200)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the first challenge, and gain 10000x more Enhance Points",
            },
			7: {requirementDescription: "5000 Hindrance Spirit",
                done() {return player[this.layer].best.gte(5000)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Space Energy, Space reset does nothing, and gain 10000x more Enhance Points",
            },
			8: {requirementDescription: "1.5e5 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1.5e5)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the second challenge, and gain 10000x more Enhance Points",
            },
			9: {requirementDescription: "1e8 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e8)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the third challenge, and gain 10000x more Enhance Points",
            },
			10: {requirementDescription: "1e12 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e12)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the fourth challenge, and gain 10000x more Enhance Points",
            },
			11: {requirementDescription: "1e24 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e24)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the fifth challenge, and you can complete a challenge without exiting the challenge",
            },
			12: {requirementDescription: "1e36 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e36)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the sixth challenge, and gain 10x more Quirks",
            },
		},
		milestonePopups(){
		 return true;
	    },
		
		
		
		
		challenges: {
            rows: 3,
    		cols: 2,
		    11: {
                name: "No Boosters",
                completionLimit: Infinity,
			    challengeDescription() {return "Boosters do nothing<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player[this.layer].best.gt(200) },
                goal: function(){return Decimal.pow(10,Decimal.pow(1.1,player.h.challenges[11]).mul(4000)).div(player.h.activeChallenge==11?tmp.h.getDivider:1)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = player.h.challenges[11]*2;
                    return ret;
                },
                rewardDisplay() { return "+"+format(this.rewardEffect())+" to Booster base" },
                rewardDescription() { return "Unlock a Booster Upgrade, Boosters are stronger based on challenge completions." },
            },
			12: {
                name: "No Generators",
                completionLimit: Infinity,
			    challengeDescription() {return "Generators do nothing<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player[this.layer].best.gt(1.5e5) },
                goal: function(){return Decimal.pow(10,Decimal.pow(1.1,player.h.challenges[12]).mul(5200)).div(player.h.activeChallenge==12?tmp.h.getDivider:1)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = Math.pow(player.h.challenges[12],0.5)/20;
                    return ret;
                },
                rewardDisplay() { return "+"+format(this.rewardEffect())+" to Generator Upgrade 13 base" },
                rewardDescription() { return "Unlock a Generator Upgrade, Generator Upgrade 13 are stronger based on challenge completions." },
            },
			21: {
                name: "No Enhancers",
                completionLimit: Infinity,
			    challengeDescription() {return "Enhancers do nothing<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player[this.layer].best.gt(1e8) },
                goal: function(){return Decimal.pow(10,Decimal.pow(1.1,player.h.challenges[21]).mul(10100)).div(player.h.activeChallenge==21?tmp.h.getDivider:1)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = 1+Math.pow(player.h.challenges[21],0.5)/10;
                    return ret;
                },
                rewardDisplay() { return "Enhancers are "+format(this.rewardEffect())+"x stronger." },
                rewardDescription() { return "Unlock an Enhancer Upgrade, Enhancers are stronger based on challenge completions." },
            },
			22: {
                name: "No Prestige",
                completionLimit: Infinity,
			    challengeDescription() {return "You can't gain any prestige points<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player[this.layer].best.gt(1e12) },
                goal: function(){return Decimal.pow(10,Decimal.pow(1.1,player.h.challenges[22]).mul(8400)).div(player.h.activeChallenge==22?tmp.h.getDivider:1)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = 1+Math.pow(player.h.challenges[22],0.5)/100;
                    return ret;
                },
                rewardDisplay() { return "Prestige Points gain ^"+format(this.rewardEffect()) },
                rewardDescription() { return "Unlock a Prestige Upgrade, Gain an exponent to Prestige Points gain based on challenge completions." },
            },
			31: {
                name: "Skip the Second",
                completionLimit: Infinity,
			    challengeDescription() {return "Boosters and Generators do nothing<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player[this.layer].best.gt(1e24) },
                goal: function(){return Decimal.pow(10,Decimal.pow(1.1,player.h.challenges[31]).mul(5650)).div(player.h.activeChallenge==31?tmp.h.getDivider:1)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = Math.pow(player.h.challenges[31],0.5)/100;
                    return ret;
                },
                rewardDisplay() { return "Generator Power gain is multiplied by Booster multiplier^"+format(this.rewardEffect()) },
                rewardDescription() { return "Unlock a new layer. Generator Power gain is boosted based on Booster multiplier and challenge completions." },
            },
			32: {
                name: "No Space",
                completionLimit: Infinity,
			    challengeDescription() {return "Space is always 0, Space Buildings do nothing<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player[this.layer].best.gt(1e36) },
                goal: function(){return Decimal.pow(10,Decimal.pow(1.1,player.h.challenges[32]).mul(25000)).div(player.h.activeChallenge==32?tmp.h.getDivider:1)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = 1+Math.pow(player.h.challenges[32],0.5)/10;
                    return ret;
                },
                rewardDisplay() { return "Space Buildings are "+format(this.rewardEffect())+"x stronger." },
                rewardDescription() { return "Unlock a Space Upgrade, Space Buildings are stronger based on challenge completions." },
            },
			
        },
	 hotkeys: [
           {key: "h", description: "H: Hindrance reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
		
	   upgrades: {
            rows: 2,
            cols: 3,
			11: {
                description: "Gain Generator Power based on Hindrance Spirit.",
                cost: new Decimal(2e13),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=2;
                    let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+"/s" }, // Add formatting to the effect
            },
			12: {
                description: "Gain a Super-Booster on Hindrance reset.",
                cost: new Decimal(4e18),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
			13: {
                description: "Hindrance Spirit gain is boosted based on Quirks.",
                cost: new Decimal(2e35),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=2;
                    let ret = Decimal.pow(base,Decimal.log10(player.q.points.add(1)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
                description: "Divide challenge goals based on Prestige Points",
                cost: new Decimal(2e59),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=1.2;
                    let ret = Decimal.pow(base,Decimal.log10(player.p.points.add(1)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			22: {
                description: "Unlock a new challenge.",
                cost: new Decimal(1e84),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
		},
		
		update(diff){
			if(hasUpgrade("h",11))player.g.power=player.g.power.add(upgradeEffect("h",11).mul(diff)).max(0);
			if(player.h.best.gte(1e24)){
				if(player.h.activeChallenge){
					if(player.points.gte(tmp.h.challenges[player.h.activeChallenge].goal)){
						player.h.challenges[player.h.activeChallenge]++;
					}
				}
			}
		},
	softcap: new Decimal("eeeeeeeee9"),
	softcapPower: new Decimal(1),
	getDivider(){
		let m=new Decimal(1);
		if(hasUpgrade("h",21))m=m.mul(upgradeEffect("h",21));
		return m;
	}
})


addLayer("q", {
    name: "quirks",
    symbol: "Q",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		dim: new Decimal(0),
		energy: new Decimal(0)
    }},
    color: "#ff2bf2",
    requires: function(){
		return new Decimal("1e9000");
	},
    resource: "quirks",
    baseResource: "generator power", 
    baseAmount() {return player.g.power},
    type: "normal",
    exponent: .0075,
    gainMult() {
        mult = new Decimal(1)
		if(player.h.best.gte(1e36))mult=mult.mul(10);
		if(hasUpgrade("q",13))mult=mult.mul(upgradeEffect("q",13));
		return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 3,
    hotkeys: [],
    layerShown(){return player.h.challenges[31]>=1 || player.q.unlocked},
	branches: ["e"],
	softcap: new Decimal("eeeeeeeee9"),
	softcapPower: new Decimal(1),
		milestones: {
            0: {requirementDescription: "2 Quirks",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Keep all 3rd row upgrades on reset",
            },
		},
		
		
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Buy a Quirk Layer", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x=x.mul(tmp.q.getStrength);
					let eff = x.mul(Decimal.pow(3,x));
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " Quirks\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Currently: Generate "+format(data.effect)+" Quirk Energy/sec";
                },
                unlocked() { return hasUpgrade("q",12) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
        },
		upgrades: {
            rows: 2,
            cols: 3,
			11: {
                description: "Quirks & Hindrance Spirit boost Point, Prestige Point, and Enhance Point gain.",
                cost: new Decimal(5),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=3;
                    let ret = Decimal.pow(base,Decimal.log10(player.q.points.add(1).times(player.h.points.add(1))).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
                description: "Unlock Quirk Layers.",
                cost: new Decimal(1e10),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
			13: {
                description: "Quirk gain is boosted based on Hindrance Spirit.",
                cost: new Decimal(1e36),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=1.5;
                    let ret = Decimal.pow(base,Decimal.log10(player.h.points.add(1)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
                description: "Quirk Layers generates Enhance Dimensions.",
                cost: new Decimal(1e43),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    return tmp.e.buyables[11].effect[0].mul(tmp.q.buyables[11].effect.pow(2));
                },
                effectDisplay() { return "+"+format(this.effect())+"/s" }, // Add formatting to the effect
            }
		},
		getStrength() {
			return new Decimal(1);
		},
		
		update(diff){
			if(hasUpgrade("q",12))player.q.energy=player.q.energy.add(tmp.q.buyables[11].effect.mul(diff)).max(0);
			if(hasUpgrade("q",21))player.e.dim=player.e.dim.add(upgradeEffect("q",21).mul(diff)).max(0);
		},
		
	tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					"buyables",
                    ["display-text",
                        function() {return 'You have ' + format(player.q.energy) + ' Quirk Energy (generated by Quirk Layers), which multiplies Point, Generator Power and 1st Prestige Dimension gain by '+ format(tmp.q.quirkEff) },
                        {}],
                   "upgrades"],
				   
				   quirkEff(){
					   let x=player.q.energy.add(1);
					   return x;
				   },
	 hotkeys: [
           {key: "q", description: "Q: Quirk reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
})