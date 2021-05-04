addLayer("p", {
    name: "prestige",
    symbol: "P",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
    }},
    color: "#00bfbf",
    requires: new Decimal(10),
    exponent: 0.5,
    logExponent: 1,
	softcap: new Decimal(Infinity),
	softcapPower: new Decimal(1),
    resource: "prestige points",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "normal",
    gainMult() {
		if(inChallenge("h",22))return new Decimal(0);
        mult = new Decimal(1)
		if(hasUpgrade("b",11)) mult =  mult.mul(upgradeEffect("b",11))
		if(hasUpgrade("p",13)) mult =  mult.mul(upgradeEffect("p",13))
        if(hasUpgrade("g",12)) mult =  mult.mul(upgradeEffect("g",12))
		if(hasUpgrade("p",22)) mult =  mult.mul(upgradeEffect("p",22))
        if(hasUpgrade("p",23)) mult =  mult.mul(upgradeEffect("p",23))
		mult=mult.mul(tmp.t.getTimeEff);
		mult=mult.mul(tmp.s.buyables[12].effect);
		mult = mult.mul(tmp.e.buyables[1].effect[1]);
		if(hasUpgrade("e",11)) mult =  mult.mul(upgradeEffect("e",11))
		if(hasUpgrade("q",11)) mult =  mult.mul(upgradeEffect("q",11))
        return mult
    },
    gainExp() {
       return new Decimal(1);
    },
    row: 0,
    hotkeys: [],
    layerShown(){return true},
	dimensionalBase:function(){
		let ret=new Decimal(2);
		if(hasUpgrade("p",44))ret=ret.add(upgradeEffect("p",44));
		if(hasUpgrade("p",51))ret=ret.add(tmp.p.buyables[51].effect);
		return ret;
	},
	buyables: {
            rows: 4,
            cols: 2,
            11: {
                title: "1st Prestige Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.35))
                    return cost
                },
                effect() {
                    return getPointGen();
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.p.dim1)+" 1st Prestige Dimensions. ("+format(player.p.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" points per second.<br>"+
					"Cost for Next 1st Prestige Dimension: "+format(data.cost)+" prestige points";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.g.best.lt(12))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.p.dim1 = player.p.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Prestige Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(!hasUpgrade("g",11))return Infinity;
					let cost = Decimal.pow(100, x.pow(1.35))
                    return cost
                },
                effect() {
					if(inChallenge("h",11))return new Decimal(0);
					let gain=player.p.dim2;
					gain=gain.mul(Decimal.pow(tmp.p.dimensionalBase,player.p.buyables[12]));
					gain=gain.mul(tmp.b.effect2);
					if(hasUpgrade("g",13))gain=gain.mul(upgradeEffect("g",13));
					if(hasUpgrade("g",22))gain=gain.mul(upgradeEffect("g",22));
					if(hasUpgrade("s",11))gain=gain.mul(upgradeEffect("s",11));
					if(hasUpgrade("s",12))gain=gain.mul(upgradeEffect("s",12));
					if(hasUpgrade("p",12)&&hasUpgrade("p",24))gain = gain.mul(upgradeEffect("p",24));
					if(hasUpgrade("q",11))gain=gain.mul(upgradeEffect("q",11));
					gain = gain.mul(tmp.q.quirkEff);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(!hasUpgrade("g",11))return "Req: Generator Upgrade 11";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.p.dim2)+" 2nd Prestige Dimensions. ("+format(player.p.buyables[12])+" bought)<br>"+
                    (inChallenge("h",51)?"They are multiplying 1st Prestige Dimension by "+format(data.effect.pow(0.05).add(1))+".<br>":"They are producing "+format(data.effect)+" 1st Prestige Dimensions per second.<br>")+
					"Cost for Next 2nd Prestige Dimension: "+format(data.cost)+" prestige points";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.g.best.lt(12))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.p.dim2 = player.p.dim2.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
            21: {
                title: "3rd Prestige Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.e.best.lt(1e34))return Infinity;
					let cost = Decimal.pow(1e4, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.p.dim3;
					gain=gain.mul(Decimal.pow(tmp.p.dimensionalBase,player.p.buyables[21]));
					gain=gain.mul(tmp.b.effect2);
					if(hasUpgrade("p",12)&&hasUpgrade("p",24))gain = gain.mul(upgradeEffect("p",24));
					if(hasUpgrade("q",11))gain=gain.mul(upgradeEffect("q",11));
					gain = gain.mul(tmp.q.quirkEff);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.e.best.lt(1e34))return "Req: 1e34 Enhance Points";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.p.dim3)+" 3rd Prestige Dimensions. ("+format(player.p.buyables[21])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 1st Prestige Dimensions per second.<br>":"They are producing "+format(data.effect)+" 2nd Prestige Dimensions per second.<br>")+
					"Cost for Next 3rd Prestige Dimension: "+format(data.cost)+" prestige points";
                },
                unlocked() { return player.e.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.g.best.lt(12))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.p.dim3 = player.p.dim3.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
            22: {
                title: "4th Prestige Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[11]<1)return Infinity;
					let cost = Decimal.pow(1e8, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.p.dim4;
					gain=gain.mul(Decimal.pow(tmp.p.dimensionalBase,player.p.buyables[22]));
					gain=gain.mul(tmp.b.effect2);
					if(hasUpgrade("p",12)&&hasUpgrade("p",24))gain = gain.mul(upgradeEffect("p",24));
					if(hasUpgrade("q",11))gain=gain.mul(upgradeEffect("q",11));
					gain = gain.mul(tmp.q.quirkEff);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[11]<1)return "Req: Complete H challenge 1";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.p.dim4)+" 4th Prestige Dimensions. ("+format(player.p.buyables[22])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 2nd Prestige Dimensions per second.<br>":"They are producing "+format(data.effect)+" 3rd Prestige Dimensions per second.<br>")+
					"Cost for Next 4th Prestige Dimension: "+format(data.cost)+" prestige points";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.g.best.lt(12))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.p.dim4 = player.p.dim4.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
            31: {
                title: "5th Prestige Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[11]<2)return Infinity;
					let cost = Decimal.pow(1e16, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.p.dim5;
					gain=gain.mul(Decimal.pow(tmp.p.dimensionalBase,player.p.buyables[31]));
					gain=gain.mul(tmp.b.effect2);
					if(hasUpgrade("p",12)&&hasUpgrade("p",24))gain = gain.mul(upgradeEffect("p",24));
					if(hasUpgrade("q",11))gain=gain.mul(upgradeEffect("q",11));
					gain = gain.mul(tmp.q.quirkEff);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[11]<2)return "Req: Complete H challenge 1 2 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.p.dim5)+" 5th Prestige Dimensions. ("+format(player.p.buyables[31])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 3rd Prestige Dimensions per second.<br>":"They are producing "+format(data.effect)+" 4th Prestige Dimensions per second.<br>")+
					"Cost for Next 5th Prestige Dimension: "+format(data.cost)+" prestige points";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.g.best.lt(12))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.p.dim5 = player.p.dim5.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
            32: {
                title: "6th Prestige Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[11]<3)return Infinity;
					let cost = Decimal.pow(1e32, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.p.dim6;
					gain=gain.mul(Decimal.pow(tmp.p.dimensionalBase,player.p.buyables[32]));
					gain=gain.mul(tmp.b.effect2);
					if(hasUpgrade("p",12)&&hasUpgrade("p",24))gain = gain.mul(upgradeEffect("p",24));
					if(hasUpgrade("q",11))gain=gain.mul(upgradeEffect("q",11));
					gain = gain.mul(tmp.q.quirkEff);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[11]<3)return "Req: Complete H challenge 1 3 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.p.dim6)+" 6th Prestige Dimensions. ("+format(player.p.buyables[32])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 4th Prestige Dimensions per second.<br>":"They are producing "+format(data.effect)+" 5th Prestige Dimensions per second.<br>")+
					"Cost for Next 6th Prestige Dimension: "+format(data.cost)+" prestige points";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.g.best.lt(12))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.p.dim6 = player.p.dim6.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
            41: {
                title: "7th Prestige Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[11]<4)return Infinity;
					let cost = Decimal.pow(1e64, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.p.dim7;
					gain=gain.mul(Decimal.pow(tmp.p.dimensionalBase,player.p.buyables[41]));
					gain=gain.mul(tmp.b.effect2);
					if(hasUpgrade("p",12)&&hasUpgrade("p",24))gain = gain.mul(upgradeEffect("p",24));
					if(hasUpgrade("q",11))gain=gain.mul(upgradeEffect("q",11));
					gain = gain.mul(tmp.q.quirkEff);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[11]<4)return "Req: Complete H challenge 1 4 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.p.dim7)+" 7th Prestige Dimensions. ("+format(player.p.buyables[41])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 5th Prestige Dimensions per second.<br>":"They are producing "+format(data.effect)+" 6th Prestige Dimensions per second.<br>")+
					"Cost for Next 7th Prestige Dimension: "+format(data.cost)+" prestige points";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.g.best.lt(12))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.p.dim7 = player.p.dim7.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
            42: {
                title: "8th Prestige Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[11]<5)return Infinity;
					let cost = Decimal.pow(1e128, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.p.dim8;
					gain=gain.mul(Decimal.pow(tmp.p.dimensionalBase,player.p.buyables[42]));
					gain=gain.mul(tmp.b.effect2);
					if(hasUpgrade("p",12)&&hasUpgrade("p",24))gain = gain.mul(upgradeEffect("p",24));
					if(hasUpgrade("q",11))gain=gain.mul(upgradeEffect("q",11));
					gain = gain.mul(tmp.q.quirkEff);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[11]<5)return "Req: Complete H challenge 1 5 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.p.dim8)+" 8th Prestige Dimensions. ("+format(player.p.buyables[42])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 6th Prestige Dimensions per second.<br>":"They are producing "+format(data.effect)+" 7th Prestige Dimensions per second.<br>")+
					"Cost for Next 8th Prestige Dimension: "+format(data.cost)+" prestige points";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.g.best.lt(12))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.p.dim8 = player.p.dim8.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
            51: {
                title: "Prestige Galaxy", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost = Decimal.pow(1.1, x.pow(1.2)).mul(500)
					if(hasUpgrade("p",54))cost = Decimal.pow(1.05, x).mul(100)
                    return cost
                },
                effect() {
					let m=new Decimal(0.1);
					if(hasUpgrade("p",53))m=m.add(upgradeEffect("p",53));
					m=m.mul(player.p.buyables[51]);
					return m;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(!hasUpgrade("p",51))return "Req: Prestige Upgrade 51";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.p.buyables[51])+" Prestige Galaxies.<br>"+
                    "They are adding "+format(data.effect)+" to Dimensional Base on Prestige.<br>"+
					"Cost for Next Prestige Galaxy: "+format(data.cost)+" Bought 8th Prestige Dimensions";
                },
                unlocked() { return hasUpgrade("p",51); }, 
                canAfford() {
                    return player[this.layer].buyables[42].gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
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
                cost: new Decimal(20),
                unlocked() { return true; }, // The upgrade is only visible when this is true
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
					if(hasUpgrade("p",42))base+=0.1;
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
					let len = player.p.upgrades.length;
					let softcap=12;
					if(hasUpgrade("p",52))softcap+=3;
					if(len>softcap)len=softcap+Math.pow(len-softcap,0.1);
					let ret = Decimal.pow(2, len);
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
					if(hasUpgrade("p",42))base+=0.1;
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
					let ret = Decimal.pow(base,Decimal.log10(player.p.points.add(1)).pow(0.9))
					return ret;
				},
				effectDisplay() { return format(this.effect())+"x" },
			},
			31: {
				title: "Prestige Upgrade 31",
				description: "The upgrade above is stronger.",
				cost: new Decimal("1e560"),
				unlocked() { return player.t.unlocked&&player.s.unlocked },
			},
			32: {
				title: "Prestige Upgrade 32",
				description: "The upgrade above is stronger.",
				cost: new Decimal("1e650"),
				unlocked() { return player.t.unlocked&&player.s.unlocked },
			},
			33: {
				title: "Prestige Upgrade 33",
				description: "The upgrade above is stronger.",
				cost: new Decimal("1e840"),
				unlocked() { return player.t.unlocked&&player.s.unlocked },
			},
			41: {
				title: "Prestige Upgrade 41",
				description: "Prestige Upgrade 23 is stronger.",
				cost: new Decimal("1e2920"),
				unlocked() { return player.e.unlocked },
			},
			42: {
				title: "Prestige Upgrade 42",
				description: "Prestige Upgrade 12 and 22 are stronger.",
				cost: new Decimal("1e4300"),
				unlocked() { return player.e.unlocked },
			},
			43: {
				title: "Prestige Upgrade 43",
				description: "Prestige Upgrade 23 is stronger.",
				cost: new Decimal("1e8830"),
				unlocked() { return player.e.unlocked },
			},
			14: {
				title: "Prestige Upgrade 14",
				description: "Boost the left upgrade based on Hindrance Spirit.",
				cost: new Decimal("1e31700"),
				unlocked() { return player.h.challenges[22]>=1 },
			},
			24: {
				title: "Prestige Upgrade 24",
				description: "Prestige Upgrade 12 affects Prestige Dimensions 2-8 at a reduced rate.",
				cost: new Decimal("1e65000"),
				unlocked() { return player.h.challenges[22]>=2 },
				effect(){
					let power=new Decimal(0.05);
					if(hasUpgrade("p",34))power=power.add(0.05);
					return upgradeEffect("p",12).pow(power);
				},
				
				effectDisplay() { return format(this.effect())+"x" },
			},
			34: {
				title: "Prestige Upgrade 34",
				description: "The upgrade above is stronger.",
				cost: new Decimal("1e79000"),
				unlocked() { return player.h.challenges[22]>=3 },
			},
			44: {
				title: "Prestige Upgrade 44",
				description: "Dimensional base on this layer is boosted by your prestige points.",
				cost: new Decimal("1e340000"),
				unlocked() { return player.h.challenges[22]>=4 },
				effect(){
					return player.p.points.add(1).log10().add(1).log10().add(1).log10();
				},
				effectDisplay() { return "+"+format(this.effect())+" to the base" },
			},
			51: {
				title: "Prestige Upgrade 51",
				description: "Unlock Prestige Galaxy.",
				cost: new Decimal("1e2000000"),
				unlocked() { return player.h.challenges[22]>=5 },
			},
			52: {
				title: "Prestige Upgrade 52",
				description: "Autobuy Prestige Galaxy, and Prestige Upgrade 21's softcap starts 3 later.",
				cost: new Decimal("1e2300000"),
				unlocked() { return player.h.challenges[22]>=6 },
			},
			53: {
				title: "Prestige Upgrade 53",
				description: "Prestige Galaxies are stronger based on your prestige points.",
				cost: new Decimal("1e25000000"),
				unlocked() { return player.h.challenges[22]>=7 },
				effect(){
					return player.p.points.add(1).log10().add(1).log10().add(1).log10().div(10);
				},
				effectDisplay() { return "+"+format(this.effect())+" per galaxy" },
			},
			54: {
				title: "Prestige Upgrade 54",
				description: "Prestige Galaxies are cheaper.",
				cost: new Decimal("1e600000000"),
				unlocked() { return player.h.challenges[22]>=8 },
			},
		},
	tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					["display-text",function(){return "Dimensional Base: "+format(tmp.p.dimensionalBase)}],
					"buyables",
					["buyable",51],
                   "upgrades"],
				   
		doReset(l){
			if(l=="p"){return;}
			if(l=="b" || l=="g"){
				if(player[l].best.lt(10))layerDataReset("p",[]);
				else layerDataReset("p",["upgrades"]);
				return;
			}
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){
				if(player[l].best.lt(2) && l!="e" && l!="sb" && l!="sg")layerDataReset("p",[]);
				else layerDataReset("p",["upgrades"]);
				return;
			}
			layerDataReset("p",["upgrades"]);
			return;
		},
		
		update(diff){
			if(player.g.best.gte(16)){
				var target=player.p.points.add(1).log(2).pow(1/1.35).add(1).floor();
				if(target.gt(player.p.buyables[11])){
					player.p.dim1=player.p.dim1.add(target.sub(player.p.buyables[11]));
					player.p.buyables[11]=target;
				}
				
				if(hasUpgrade("g",11)){
					target=player.p.points.add(1).log(100).pow(1/1.35).add(1).floor();
					if(target.gt(player.p.buyables[12])){
						player.p.dim2=player.p.dim2.add(target.sub(player.p.buyables[12]));
						player.p.buyables[12]=target;
					}
				}
				
				if(player.e.best.gte(1e34)){
					target=player.p.points.add(1).log(1e4).pow(1/1.35).add(1).floor();
					if(target.gt(player.p.buyables[21])){
						player.p.dim3=player.p.dim3.add(target.sub(player.p.buyables[21]));
						player.p.buyables[21]=target;
					}
				}
				
				if(player.h.challenges[11]>=1){
					target=player.p.points.add(1).log(1e8).pow(1/1.35).add(1).floor();
					if(target.gt(player.p.buyables[22])){
						player.p.dim4=player.p.dim4.add(target.sub(player.p.buyables[22]));
						player.p.buyables[22]=target;
					}
				}
				
				if(player.h.challenges[11]>=2){
					target=player.p.points.add(1).log(1e16).pow(1/1.35).add(1).floor();
					if(target.gt(player.p.buyables[31])){
						player.p.dim5=player.p.dim5.add(target.sub(player.p.buyables[31]));
						player.p.buyables[31]=target;
					}
				}
				
				if(player.h.challenges[11]>=3){
					target=player.p.points.add(1).log(1e32).pow(1/1.35).add(1).floor();
					if(target.gt(player.p.buyables[32])){
						player.p.dim6=player.p.dim6.add(target.sub(player.p.buyables[32]));
						player.p.buyables[32]=target;
					}
				}
				
				if(player.h.challenges[11]>=4){
					target=player.p.points.add(1).log(1e64).pow(1/1.35).add(1).floor();
					if(target.gt(player.p.buyables[41])){
						player.p.dim7=player.p.dim7.add(target.sub(player.p.buyables[41]));
						player.p.buyables[41]=target;
					}
				}
				
				if(player.h.challenges[11]>=5){
					target=player.p.points.add(1).log(1e128).pow(1/1.35).add(1).floor();
					if(target.gt(player.p.buyables[42])){
						player.p.dim8=player.p.dim8.add(target.sub(player.p.buyables[42]));
						player.p.buyables[42]=target;
					}
				}
			}
		if(inChallenge("h",51)){
			if(player.e.best.gte(1e34))player.p.dim1=player.p.dim1.add(tmp.p.buyables[21].effect.mul(diff));
			if(player.h.challenges[11]>=1)player.p.dim2=player.p.dim2.add(tmp.p.buyables[22].effect.mul(diff));
			if(player.h.challenges[11]>=2)player.p.dim3=player.p.dim3.add(tmp.p.buyables[31].effect.mul(diff));
			if(player.h.challenges[11]>=3)player.p.dim4=player.p.dim4.add(tmp.p.buyables[32].effect.mul(diff));
			if(player.h.challenges[11]>=4)player.p.dim5=player.p.dim5.add(tmp.p.buyables[41].effect.mul(diff));
			if(player.h.challenges[11]>=5)player.p.dim6=player.p.dim6.add(tmp.p.buyables[42].effect.mul(diff));
		}else{
			if(hasUpgrade("g",11))player.p.dim1=player.p.dim1.add(tmp.p.buyables[12].effect.mul(diff));
			if(player.e.best.gte(1e34))player.p.dim2=player.p.dim2.add(tmp.p.buyables[21].effect.mul(diff));
			if(player.h.challenges[11]>=1)player.p.dim3=player.p.dim3.add(tmp.p.buyables[22].effect.mul(diff));
			if(player.h.challenges[11]>=2)player.p.dim4=player.p.dim4.add(tmp.p.buyables[31].effect.mul(diff));
			if(player.h.challenges[11]>=3)player.p.dim5=player.p.dim5.add(tmp.p.buyables[32].effect.mul(diff));
			if(player.h.challenges[11]>=4)player.p.dim6=player.p.dim6.add(tmp.p.buyables[41].effect.mul(diff));
			if(player.h.challenges[11]>=5)player.p.dim7=player.p.dim7.add(tmp.p.buyables[42].effect.mul(diff));
		}
			if(hasUpgrade("p",51) && hasUpgrade("p",52) && player.p.buyables[42].gte(500)){
				target=player.p.buyables[42].div(500).log(1.1).pow(1/1.2).add(1).floor();
				if(hasUpgrade("p",54))target=player.p.buyables[42].div(100).log(1.05).add(1).floor();
				if(target.gt(player.p.buyables[51])){
					player.p.buyables[51]=target;
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
		boost: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
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
			if(inChallenge("h",31))return new Decimal(1);
			let ret = player.b.points.add(2).sub(Decimal.pow(0.5,player.b.points.sub(1)));
			let base = new Decimal(2);
			if(hasUpgrade("b",12))base = base.add(upgradeEffect("b",12))
			if(hasUpgrade("b",13))base = base.add(upgradeEffect("b",13))
			if(hasUpgrade("t",12))base = base.add(upgradeEffect("t",12))
			if(player.e.best.gte(100))base = base.add(tmp.e.buyables[1].effect[2])
			if(hasUpgrade("t",23))base = base.add(tmp.b.boostEffect);
			ret = Decimal.pow(base,ret);
			return ret;
		},
	effect2() {
		let base=0.99;
		if(hasUpgrade("b",24))base=base-0.012;
		let power=Decimal.sub(1,Decimal.pow(base,player.b.points.add(1).log10().sub(5).max(0)));
		return layers.b.effect().pow(power);
		},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();let eff2 = this.effect2();
		   if(player.b.best.gte(1e5)){
			   return "translated to a "+format(eff)+"x multiplier to 1st Prestige Dimension, and a "+format(eff2)+"x multiplier to 2nd-8th Prestige Dimension";
		   }
           return "translated to a "+format(eff)+"x multiplier to 1st Prestige Dimension"
       },
	   upgrades: {
            rows: 5,
            cols: 4,
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
				description: "Prestige Upgrade 12 is boosted.",
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
				effect() { 
					let ret=player.b.points.add(2).pow(1.5);
					if(hasUpgrade("b",42))ret=ret.mul(Decimal.pow(1.0201,player.b.points));
					return ret;
				},
				effectDisplay() { return format(this.effect())+"x" },
			},
			41: {
				title: "Booster Upgrade 41",
				description: "Booster Upgrade 11 uses a better formula.",
				cost: new Decimal(5150),
				unlocked() { return player.h.challenges[12]>=1 },
			},
			42: {
				title: "Booster Upgrade 42",
				description: "Booster Upgrades 12 and 33 are better.",
				cost: new Decimal(6570),
				unlocked() { return player.h.challenges[12]>=2 },
			},
			43: {
				title: "Booster Upgrade 43",
				description: "Booster Boost effect is boosted by your Prestige Points.",
				cost: new Decimal(22500),
				unlocked() { return hasUpgrade("sb",13) },
				effect() { 
					let ret = player.p.points.add(1).log10().add(1).log10().div(50).add(1);
					return ret;
				},
				effectDisplay() { return format(this.effect())+"x" },
			},
			14: {
				title: "Booster Upgrade 14",
				description: "Booster Boost effect is boosted by your Boosters.",
				cost: new Decimal(49000),
				unlocked() { return hasUpgrade("sb",13) },
				effect() { 
					let ret = player.b.points.add(1).log10().pow(0.1).div(10).add(1);
					return ret;
				},
				effectDisplay() { return format(this.effect())+"x" },
			},
			24: {
				title: "Booster Upgrade 24",
				description: "Second Booster Effect is better.",
				cost: new Decimal(155000),
				unlocked() { return player.h.challenges[12]>=3 },
			},
			34: {
				title: "Booster Upgrade 34",
				description: "Multiply Solarity gain based on Boosters",
				cost: new Decimal(275000),
				unlocked() { return player.h.challenges[12]>=4 },
				effect() { 
					let ret = player.b.points.pow(0.5).add(1);
					return ret;
				},
				effectDisplay() { return format(this.effect())+"x" },
			},
			44: {
				title: "Booster Upgrade 44",
				description: "Time Capsule is cheaper based on your Boosters.",
				cost: new Decimal(23e5),
				unlocked() { return player.h.challenges[12]>=5 },
				effect() { 
					let ret = Decimal.pow(15,player.b.points);
					return ret;
				},
				effectDisplay() { return "/"+format(this.effect()) },
			},
			51: {
				title: "Booster Upgrade 51",
				description: "Booster Upgrade 33 boost all Time Dimensions.",
				cost: new Decimal(33e6),
				unlocked() { return player.h.challenges[12]>=6 },
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
			2: {requirementDescription: "1e5 Boosters",
                done() {return player[this.layer].best.gte(1e5)},
                effectDescription: "Give Boosters a new effect",
            },
		},
		canBuyMax() {return player[this.layer].best.gte(20)},
	doReset(l){
			if(l=="b" || l=="g"){return;}
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="h" || l=="q" || l=="sg" || l=="ss" || l=="o"){
				if(player[l].best.gte(2) || l=="e" || l=="sb" || l=="h" || l=="q" || l=="sg" || l=="ss" || l=="o"){
					var b=new Decimal(player.b.best);
					if(player.t.best.gte(3))layerDataReset("b",["upgrades"]);
					else layerDataReset("b",[]);
					player.b.best=b;
				}
				else if(player.t.best.gte(3))layerDataReset("b",["upgrades"]);
				else layerDataReset("b",[]);
				return;
			}
			var b=new Decimal(player.b.best);
			layerDataReset("b",["upgrades"]);
			player.b.best=b;
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
	 },boostEffect(){
		 let effect=Decimal.log10(player.b.boost.add(1)).div(3.6).mul(tmp.sb.effect);
		 if(player.e.best.gte("1e1000") && tmp.e.buyables[1].effect[2])effect=effect.mul(tmp.e.buyables[1].effect[4]);
		 if(hasUpgrade("b",43))effect=effect.mul(upgradeEffect("b",43));
		 if(hasUpgrade("b",14))effect=effect.mul(upgradeEffect("b",14));
		 effect=effect.mul(clickableEffect("m",11));
		 return effect;
	 },
	 	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					["display-text",
                        function() {if(hasUpgrade("t",23))return 'You have ' + format(player.b.boost) + ' Booster Boosts, which adds Booster base by ' + format(tmp.b.boostEffect);return ""},
                        {}],
						"buyables",
						"milestones",
                   "upgrades"],
	 hotkeys: [
           {key: "b", description: "B: Booster reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	 update(diff){
		 if(hasUpgrade("t",23))player.b.boost = player.b.boost.add(tmp.b.buyables[11].effect.times(diff)).max(0)
		if(inChallenge("h",51)){
		 if(player.h.challenges[12]>=2)player.b.dim1 = player.b.dim1.add(tmp.b.buyables[21].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=3)player.b.dim2 = player.b.dim2.add(tmp.b.buyables[22].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=4)player.b.dim3 = player.b.dim3.add(tmp.b.buyables[31].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=5)player.b.dim4 = player.b.dim4.add(tmp.b.buyables[32].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=6)player.b.dim5 = player.b.dim5.add(tmp.b.buyables[41].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=7)player.b.dim6 = player.b.dim6.add(tmp.b.buyables[42].effect.times(diff)).max(0)
		}else{
		 if(player.h.challenges[12]>=1)player.b.dim1 = player.b.dim1.add(tmp.b.buyables[12].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=2)player.b.dim2 = player.b.dim2.add(tmp.b.buyables[21].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=3)player.b.dim3 = player.b.dim3.add(tmp.b.buyables[22].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=4)player.b.dim4 = player.b.dim4.add(tmp.b.buyables[31].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=5)player.b.dim5 = player.b.dim5.add(tmp.b.buyables[32].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=6)player.b.dim6 = player.b.dim6.add(tmp.b.buyables[41].effect.times(diff)).max(0)
		 if(player.h.challenges[12]>=7)player.b.dim7 = player.b.dim7.add(tmp.b.buyables[42].effect.times(diff)).max(0)
		}
			 if(player.t.best.gte(25)){
				if(hasUpgrade("t",23)){
					var target=player.t.energy.add(1).log(100).pow(1/1.35).add(1).floor();
					if(target.gt(player.b.buyables[11])){
						player.b.dim1=player.b.dim1.add(target.sub(player.b.buyables[11]));
						player.b.buyables[11]=target;
					}
				}
				if(player.h.challenges[12]>=1){
					var target=player.t.energy.add(1).log(1e10).pow(1/1.35).add(1).floor();
					if(target.gt(player.b.buyables[12])){
						player.b.dim2=player.b.dim2.add(target.sub(player.b.buyables[12]));
						player.b.buyables[12]=target;
					}
				}
				if(player.h.challenges[12]>=2){
					var target=player.t.energy.add(1).log(1e50).pow(1/1.35).add(1).floor();
					if(target.gt(player.b.buyables[21])){
						player.b.dim3=player.b.dim3.add(target.sub(player.b.buyables[21]));
						player.b.buyables[21]=target;
					}
				}
				if(player.h.challenges[12]>=3){
					var target=player.t.energy.add(1).log(1e250).pow(1/1.35).add(1).floor();
					if(target.gt(player.b.buyables[22])){
						player.b.dim4=player.b.dim4.add(target.sub(player.b.buyables[22]));
						player.b.buyables[22]=target;
					}
				}
				if(player.h.challenges[12]>=4){
					var target=player.t.energy.add(1).log("1e1250").pow(1/1.35).add(1).floor();
					if(target.gt(player.b.buyables[31])){
						player.b.dim5=player.b.dim5.add(target.sub(player.b.buyables[31]));
						player.b.buyables[31]=target;
					}
				}
				if(player.h.challenges[12]>=5){
					var target=player.t.energy.add(1).log("1e6250").pow(1/1.35).add(1).floor();
					if(target.gt(player.b.buyables[32])){
						player.b.dim6=player.b.dim6.add(target.sub(player.b.buyables[32]));
						player.b.buyables[32]=target;
					}
				}
				if(player.h.challenges[12]>=6){
					var target=player.t.energy.add(1).log("1e31250").pow(1/1.35).add(1).floor();
					if(target.gt(player.b.buyables[41])){
						player.b.dim7=player.b.dim7.add(target.sub(player.b.buyables[41]));
						player.b.buyables[41]=target;
					}
				}
				if(player.h.challenges[12]>=7){
					var target=player.t.energy.add(1).log("1e156250").pow(1/1.35).add(1).floor();
					if(target.gt(player.b.buyables[42])){
						player.b.dim8=player.b.dim8.add(target.sub(player.b.buyables[42]));
						player.b.buyables[42]=target;
					}
				}
			}
	 },
	buyables: {
            rows: 4,
            cols: 2,
            11: {
                title: "1st Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(!hasUpgrade("t",23))return Infinity;
					let cost = Decimal.pow(100, x.pow(1.35))
                    return cost
                },
                effect() {
					if(inChallenge("h",12))return new Decimal(0);
					let gain=player.b.dim1;
					gain=gain.mul(Decimal.pow(2,player.b.buyables[11]));
					if(hasUpgrade("sb",12))gain=gain.mul(upgradeEffect("sb",12));
					if(hasUpgrade("t",33))gain=gain.mul(upgradeEffect("t",33));
					if(inChallenge("h",51)||player.h.challenges[51])gain = gain.mul(tmp.b.buyables[12].effect.pow(0.05));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(!hasUpgrade("t",23))return "Req: Time Upgrade 23";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.b.dim1)+" 1st Booster Dimensions. ("+format(player.b.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" booster boosts per second.<br>"+
					"Cost for Next 1st Booster Dimension: "+format(data.cost)+" Time Energy";
                },
                unlocked() { return player.e.unlocked }, 
                canAfford() {
                    return player.t.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.t.points.lt(25))player.t.energy = player.t.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.b.dim1 = player.b.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[12]<1)return Infinity;
					let cost = Decimal.pow(1e10, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.b.dim2;
					gain=gain.mul(Decimal.pow(2,player.b.buyables[12]));
					if(hasUpgrade("sb",12))gain=gain.mul(upgradeEffect("sb",12));
					if(hasUpgrade("t",33))gain=gain.mul(upgradeEffect("t",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[12]<1)return "Req: Complete H challenge 2";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.b.dim2)+" 2nd Booster Dimensions. ("+format(player.b.buyables[12])+" bought)<br>"+
                    (inChallenge("h",51)?"They are multiplying 1st Booster Dimensions by "+format(data.effect.pow(0.05))+".<br>":"They are producing "+format(data.effect)+" 1st Booster Dimensions per second.<br>")+
					"Cost for Next 2nd Booster Dimension: "+format(data.cost)+" Time Energy";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player.t.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.t.points.lt(25))player.t.energy = player.t.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.b.dim2 = player.b.dim2.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "3rd Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[12]<2)return Infinity;
					let cost = Decimal.pow(1e50, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.b.dim3;
					gain=gain.mul(Decimal.pow(2,player.b.buyables[21]));
					if(hasUpgrade("sb",12))gain=gain.mul(upgradeEffect("sb",12));
					if(hasUpgrade("t",33))gain=gain.mul(upgradeEffect("t",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[12]<2)return "Req: Complete H challenge 2 2 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.b.dim3)+" 3rd Booster Dimensions. ("+format(player.b.buyables[21])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 1st Booster Dimensions per second.<br>":"They are producing "+format(data.effect)+" 2nd Booster Dimensions per second.<br>")+
					"Cost for Next 3rd Booster Dimension: "+format(data.cost)+" Time Energy";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player.t.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.t.points.lt(25))player.t.energy = player.t.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.b.dim3 = player.b.dim3.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            22: {
                title: "4th Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[12]<3)return Infinity;
					let cost = Decimal.pow(1e250, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.b.dim4;
					gain=gain.mul(Decimal.pow(2,player.b.buyables[22]));
					if(hasUpgrade("sb",12))gain=gain.mul(upgradeEffect("sb",12));
					if(hasUpgrade("t",33))gain=gain.mul(upgradeEffect("t",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[12]<3)return "Req: Complete H challenge 2 3 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.b.dim4)+" 4th Booster Dimensions. ("+format(player.b.buyables[22])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 2nd Booster Dimensions per second.<br>":"They are producing "+format(data.effect)+" 3rd Booster Dimensions per second.<br>")+
					"Cost for Next 4th Booster Dimension: "+format(data.cost)+" Time Energy";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player.t.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.t.points.lt(25))player.t.energy = player.t.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.b.dim4 = player.b.dim4.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            31: {
                title: "5th Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[12]<4)return Infinity;
					let cost = Decimal.pow("1e1250", x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.b.dim5;
					gain=gain.mul(Decimal.pow(2,player.b.buyables[31]));
					if(hasUpgrade("sb",12))gain=gain.mul(upgradeEffect("sb",12));
					if(hasUpgrade("t",33))gain=gain.mul(upgradeEffect("t",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[12]<4)return "Req: Complete H challenge 2 4 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.b.dim5)+" 5th Booster Dimensions. ("+format(player.b.buyables[31])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 3rd Booster Dimensions per second.<br>":"They are producing "+format(data.effect)+" 4th Booster Dimensions per second.<br>")+
					"Cost for Next 5th Booster Dimension: "+format(data.cost)+" Time Energy";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player.t.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.t.points.lt(25))player.t.energy = player.t.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.b.dim5 = player.b.dim5.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            32: {
                title: "6th Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[12]<5)return Infinity;
					let cost = Decimal.pow("1e6250", x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.b.dim6;
					gain=gain.mul(Decimal.pow(2,player.b.buyables[32]));
					if(hasUpgrade("sb",12))gain=gain.mul(upgradeEffect("sb",12));
					if(hasUpgrade("t",33))gain=gain.mul(upgradeEffect("t",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[12]<5)return "Req: Complete H challenge 2 5 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.b.dim6)+" 6th Booster Dimensions. ("+format(player.b.buyables[32])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 4th Booster Dimensions per second.<br>":"They are producing "+format(data.effect)+" 5th Booster Dimensions per second.<br>")+
					"Cost for Next 6th Booster Dimension: "+format(data.cost)+" Time Energy";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player.t.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.t.points.lt(25))player.t.energy = player.t.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.b.dim6 = player.b.dim6.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            41: {
                title: "7th Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[12]<6)return Infinity;
					let cost = Decimal.pow("1e31250", x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.b.dim7;
					gain=gain.mul(Decimal.pow(2,player.b.buyables[41]));
					if(hasUpgrade("sb",12))gain=gain.mul(upgradeEffect("sb",12));
					if(hasUpgrade("t",33))gain=gain.mul(upgradeEffect("t",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[12]<6)return "Req: Complete H challenge 2 6 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.b.dim7)+" 7th Booster Dimensions. ("+format(player.b.buyables[41])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 5th Booster Dimensions per second.<br>":"They are producing "+format(data.effect)+" 6th Booster Dimensions per second.<br>")+
					"Cost for Next 7th Booster Dimension: "+format(data.cost)+" Time Energy";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player.t.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.t.points.lt(25))player.t.energy = player.t.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.b.dim7 = player.b.dim7.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            42: {
                title: "8th Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[12]<7)return Infinity;
					let cost = Decimal.pow("1e156250", x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.b.dim8;
					gain=gain.mul(Decimal.pow(2,player.b.buyables[42]));
					if(hasUpgrade("sb",12))gain=gain.mul(upgradeEffect("sb",12));
					if(hasUpgrade("t",33))gain=gain.mul(upgradeEffect("t",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[12]<7)return "Req: Complete H challenge 2 7 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.b.dim8)+" 8th Booster Dimensions. ("+format(player.b.buyables[42])+" bought)<br>"+
                    (inChallenge("h",51)?"They are producing "+format(data.effect)+" 6th Booster Dimensions per second.<br>":"They are producing "+format(data.effect)+" 7th Booster Dimensions per second.<br>")+
					"Cost for Next 8th Booster Dimension: "+format(data.cost)+" Time Energy";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player.t.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.t.points.lt(25))player.t.energy = player.t.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.b.dim8 = player.b.dim8.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
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
		extra: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
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
			if(inChallenge("h",31))return new Decimal(0);
			if(inChallenge("h",41))return new Decimal(0);
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
			if(inChallenge("h",31))return new Decimal(0);
			if(inChallenge("h",41))return new Decimal(0);
			let ret = player.g.extra;
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
		 if(player.s.unlocked)player.g.extra = player.g.extra.add(tmp.g.buyables[11].effect.times(diff)).max(0)
			 if(player.h.challenges[21]>=1)player.g.dim1 = player.g.dim1.add(tmp.g.buyables[12].effect.times(diff)).max(0)
			 if(player.h.challenges[21]>=2)player.g.dim2 = player.g.dim2.add(tmp.g.buyables[21].effect.times(diff)).max(0)
			 if(player.h.challenges[21]>=3)player.g.dim3 = player.g.dim3.add(tmp.g.buyables[22].effect.times(diff)).max(0)
			 if(player.h.challenges[21]>=4)player.g.dim4 = player.g.dim4.add(tmp.g.buyables[31].effect.times(diff)).max(0)
			 if(player.h.challenges[21]>=5)player.g.dim5 = player.g.dim5.add(tmp.g.buyables[32].effect.times(diff)).max(0)
			 if(player.h.challenges[21]>=6)player.g.dim6 = player.g.dim6.add(tmp.g.buyables[41].effect.times(diff)).max(0)
			 if(player.s.best.gte(10)){
				var target=player.g.power.add(1).log(100).pow(1/1.35).add(1).floor();
				if(target.gt(player.g.buyables[11])){
					player.g.dim1=player.g.dim1.add(target.sub(player.g.buyables[11]));
					player.g.buyables[11]=target;
				}
				if(player.h.challenges[21]>=1){
					target=player.g.power.add(1).log(1e10).pow(1/1.35).add(1).floor();
					if(target.gt(player.g.buyables[12])){
						player.g.dim2=player.g.dim2.add(target.sub(player.g.buyables[12]));
						player.g.buyables[12]=target;
					}
				}
				if(player.h.challenges[21]>=2){
					target=player.g.power.add(1).log(1e50).pow(1/1.35).add(1).floor();
					if(target.gt(player.g.buyables[21])){
						player.g.dim3=player.g.dim3.add(target.sub(player.g.buyables[21]));
						player.g.buyables[21]=target;
					}
				}
				if(player.h.challenges[21]>=3){
					target=player.g.power.add(1).log(1e250).pow(1/1.35).add(1).floor();
					if(target.gt(player.g.buyables[22])){
						player.g.dim4=player.g.dim4.add(target.sub(player.g.buyables[22]));
						player.g.buyables[22]=target;
					}
				}
				if(player.h.challenges[21]>=4){
					target=player.g.power.add(1).log("1e1250").pow(1/1.35).add(1).floor();
					if(target.gt(player.g.buyables[31])){
						player.g.dim5=player.g.dim5.add(target.sub(player.g.buyables[31]));
						player.g.buyables[31]=target;
					}
				}
				if(player.h.challenges[21]>=5){
					target=player.g.power.add(1).log("1e6250").pow(1/1.35).add(1).floor();
					if(target.gt(player.g.buyables[32])){
						player.g.dim6=player.g.dim6.add(target.sub(player.g.buyables[32]));
						player.g.buyables[32]=target;
					}
				}
				if(player.h.challenges[21]>=6){
					target=player.g.power.add(1).log("1e31250").pow(1/1.35).add(1).floor();
					if(target.gt(player.g.buyables[41])){
						player.g.dim7=player.g.dim7.add(target.sub(player.g.buyables[41]));
						player.g.buyables[41]=target;
					}
				}
			}
	 },
	getGenPowerEffExp() {
		let exp = new Decimal(1/2)
		if(hasUpgrade("b",21))exp = exp.mul(2);
		if(hasUpgrade("b",22))exp = exp.mul(1.2);
		if(hasUpgrade("e",13))exp = exp.mul(1.15);
		return exp;
	},
	getGenPowerEff() {
		let power = player.g.power;
		if(power.gte("e125e6"))power=Decimal.pow(10,power.log10().div(125e6).pow(0.9).mul(125e6));
		let eff = power.add(1).pow(tmp.g.getGenPowerEffExp);
		return eff
	},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {return 'You have ' + format(player.g.power) + ' Generator Power, which multiplies Point gain by ' + format(tmp.g.getGenPowerEff)},
                        {}],["display-text",
                        function() {return 'You have ' + format(player.g.extra) + ' Extra Generators, which are generating '+format(tmp.g.extraeffect)+' Generator Power/sec'},
                        {}],
						"buyables",
						"milestones",
                   "upgrades"],
	   upgrades: {
            rows: 4,
            cols: 4,
			11: {
				title: "Generator Upgrade 11",
                description: "Unlock the 2nd Prestige Dimension.",
                cost: new Decimal(4),
                unlocked() { return player.g.unlocked }, // The upgrade is only visible when this is true
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
					if(player.e.best.gte(1e137))base=base.add(tmp.e.buyables[1].effect[3]);
					if(hasUpgrade("g",43))base=base.add(0.1);
					if(hasUpgrade("sg",23))base=base.add(upgradeEffect("sg",23));
                    let ret = Decimal.pow(base,player.g.points);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
				title: "Generator Upgrade 21",
                description: "Prestige Upgrade 11 is boosted.",
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
				cost: new Decimal(6100),
				unlocked() { return player.h.challenges[21]>=1 },
			},
			42: {
				title: "Generator Upgrade 42",
				description: "All Generator Dimensions are boosted by Generator Power.",
				cost: new Decimal(25250),
				unlocked() { return player.h.challenges[21]>=2 },
				effect() { return Decimal.pow(1.2,Decimal.log10(player.g.power.add(1)).pow(0.9)) },
				effectDisplay() { return format(this.effect())+"x" },
			},
			43: {
				title: "Generator Upgrade 43",
				description: "Add 0.1 to Generator Upgrade 13's base.",
				cost: new Decimal(138000),
				unlocked() { return player.h.challenges[21]>=3 },
			},
			14: {
				title: "Generator Upgrade 14",
				description: "Space Energy is cheaper based on your Generators.",
				cost: new Decimal(480000),
				unlocked() { return player.h.challenges[21]>=4 },
				effect() { let ret=Decimal.pow(10,player.g.points)
					if(hasUpgrade("g",24))ret=ret.pow(2);
					return ret;
				},
				effectDisplay() { return "/"+format(this.effect()) },
			},
			24: {
				title: "Generator Upgrade 24",
				description: "Generator Upgrade 14 is squared.",
				cost: new Decimal(12200000),
				unlocked() { return player.h.challenges[21]>=5 },
			},
			34: {
				title: "Generator Upgrade 34",
				description: "Generator Upgrade 13 boosts All Generator Dimensions at a reduced rate.",
				cost: new Decimal(56000000),
				unlocked() { return player.h.challenges[21]>=6 },
				effect() { 
					let power=new Decimal(0.05);
					return upgradeEffect("g",13).pow(power);
				},
				effectDisplay() { return format(this.effect())+"x" },
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
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="h" || l=="q" || l=="sg" || l=="ss" || l=="o"){
				if(player[l].best.gte(2) || l=="e" || l=="sb" || l=="h" || l=="q" || l=="sg" || l=="ss" || l=="o"){
					var b=new Decimal(player.g.best);
					if(player.s.best.gte(3))layerDataReset("g",["upgrades"]);
					else layerDataReset("g",[]);
					player.g.best=b;
				}
				else if(player.s.best.gte(3))layerDataReset("g",["upgrades"]);
				else layerDataReset("g",[]);
				return;
			}
			var b=new Decimal(player.g.best);
			layerDataReset("g",["upgrades"]);
			player.g.best=b;
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
	buyables: {
            rows: 4,
            cols: 2,
            11: {
                title: "1st Generator Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(!player.s.unlocked)return Infinity;
                    let cost = Decimal.pow(100, x.pow(1.35));
					if(x==0)return new Decimal(0);
                    return cost
                },
                effect() {
					if(inChallenge("h",21))return new Decimal(0);
                    let gain=player.g.dim1;
					gain=gain.mul(Decimal.pow(2,player.g.buyables[11]));
					gain=gain.mul(tmp.s.buyables[11].effect);
					gain=gain.mul(tmp.e.buyables[1].effect[0]);
					if(hasUpgrade("s",31))gain = gain.mul(upgradeEffect("s",31));
					if(hasUpgrade("g",42))gain = gain.mul(upgradeEffect("g",42));
					gain=gain.mul(tmp.sg.getSuperGenPowerEff);
					if(hasUpgrade("g",34))gain = gain.mul(upgradeEffect("g",34));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.g.dim1)+" 1st Generator Dimensions. ("+format(player.g.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" Extra Generators per second.<br>"+
					"Cost for Next 1st Generator Dimension: "+format(data.cost)+" Generator Power";
                },
                unlocked() { return player.s.unlocked }, 
                canAfford() {
                    return player[this.layer].power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.s.best.lt(10))player[this.layer].power = player[this.layer].power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.g.dim1 = player.g.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Generator Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[21]<1)return Infinity;
                    let cost = Decimal.pow(1e10, x.pow(1.35));
					if(x==0)return new Decimal(0);
                    return cost
                },
                effect() {
                    let gain=player.g.dim2;
					gain=gain.mul(Decimal.pow(2,player.g.buyables[12]));
					if(hasUpgrade("s",31))gain = gain.mul(upgradeEffect("s",31));
					if(hasUpgrade("g",42))gain = gain.mul(upgradeEffect("g",42));
					gain=gain.mul(tmp.sg.getSuperGenPowerEff);
					if(hasUpgrade("ss",21))gain=gain.mul(tmp.s.buyables[11].effect);
					if(hasUpgrade("g",34))gain = gain.mul(upgradeEffect("g",34));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[21]<1)return "Req: Complete H challenge 3";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.g.dim2)+" 2nd Generator Dimensions. ("+format(player.g.buyables[12])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 1st Generator Dimensions per second.<br>"+
					"Cost for Next 2nd Generator Dimension: "+format(data.cost)+" Generator Power";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.s.best.lt(10))player[this.layer].power = player[this.layer].power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.g.dim2 = player.g.dim2.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "3rd Generator Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[21]<2)return Infinity;
                    let cost = Decimal.pow(1e50, x.pow(1.35));
					if(x==0)return new Decimal(0);
                    return cost
                },
                effect() {
                    let gain=player.g.dim3;
					gain=gain.mul(Decimal.pow(2,player.g.buyables[21]));
					if(hasUpgrade("s",31))gain = gain.mul(upgradeEffect("s",31));
					if(hasUpgrade("g",42))gain = gain.mul(upgradeEffect("g",42));
					gain=gain.mul(tmp.sg.getSuperGenPowerEff);
					if(hasUpgrade("ss",21))gain=gain.mul(tmp.s.buyables[11].effect);
					if(hasUpgrade("g",34))gain = gain.mul(upgradeEffect("g",34));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[21]<2)return "Req: Complete H challenge 3 2 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.g.dim3)+" 3rd Generator Dimensions. ("+format(player.g.buyables[21])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 2nd Generator Dimensions per second.<br>"+
					"Cost for Next 3rd Generator Dimension: "+format(data.cost)+" Generator Power";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.s.best.lt(10))player[this.layer].power = player[this.layer].power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.g.dim3 = player.g.dim3.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            22: {
                title: "4th Generator Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[21]<3)return Infinity;
                    let cost = Decimal.pow(1e250, x.pow(1.35));
					if(x==0)return new Decimal(0);
                    return cost
                },
                effect() {
                    let gain=player.g.dim4;
					gain=gain.mul(Decimal.pow(2,player.g.buyables[22]));
					if(hasUpgrade("s",31))gain = gain.mul(upgradeEffect("s",31));
					if(hasUpgrade("g",42))gain = gain.mul(upgradeEffect("g",42));
					gain=gain.mul(tmp.sg.getSuperGenPowerEff);
					if(hasUpgrade("ss",21))gain=gain.mul(tmp.s.buyables[11].effect);
					if(hasUpgrade("g",34))gain = gain.mul(upgradeEffect("g",34));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[21]<3)return "Req: Complete H challenge 3 3 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.g.dim4)+" 4th Generator Dimensions. ("+format(player.g.buyables[22])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 3rd Generator Dimensions per second.<br>"+
					"Cost for Next 4th Generator Dimension: "+format(data.cost)+" Generator Power";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.s.best.lt(10))player[this.layer].power = player[this.layer].power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.g.dim4 = player.g.dim4.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            31: {
                title: "5th Generator Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[21]<4)return Infinity;
                    let cost = Decimal.pow("1e1250", x.pow(1.35));
					if(x==0)return new Decimal(0);
                    return cost
                },
                effect() {
                    let gain=player.g.dim5;
					gain=gain.mul(Decimal.pow(2,player.g.buyables[31]));
					if(hasUpgrade("s",31))gain = gain.mul(upgradeEffect("s",31));
					if(hasUpgrade("g",42))gain = gain.mul(upgradeEffect("g",42));
					gain=gain.mul(tmp.sg.getSuperGenPowerEff);
					if(hasUpgrade("ss",21))gain=gain.mul(tmp.s.buyables[11].effect);
					if(hasUpgrade("g",34))gain = gain.mul(upgradeEffect("g",34));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[21]<4)return "Req: Complete H challenge 3 4 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.g.dim5)+" 5th Generator Dimensions. ("+format(player.g.buyables[31])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 4th Generator Dimensions per second.<br>"+
					"Cost for Next 5th Generator Dimension: "+format(data.cost)+" Generator Power";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.s.best.lt(10))player[this.layer].power = player[this.layer].power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.g.dim5 = player.g.dim5.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            32: {
                title: "6th Generator Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[21]<5)return Infinity;
                    let cost = Decimal.pow("1e6250", x.pow(1.35));
					if(x==0)return new Decimal(0);
                    return cost
                },
                effect() {
                    let gain=player.g.dim6;
					gain=gain.mul(Decimal.pow(2,player.g.buyables[32]));
					if(hasUpgrade("s",31))gain = gain.mul(upgradeEffect("s",31));
					if(hasUpgrade("g",42))gain = gain.mul(upgradeEffect("g",42));
					gain=gain.mul(tmp.sg.getSuperGenPowerEff);
					if(hasUpgrade("ss",21))gain=gain.mul(tmp.s.buyables[11].effect);
					if(hasUpgrade("g",34))gain = gain.mul(upgradeEffect("g",34));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[21]<5)return "Req: Complete H challenge 3 5 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.g.dim6)+" 6th Generator Dimensions. ("+format(player.g.buyables[32])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 5th Generator Dimensions per second.<br>"+
					"Cost for Next 6th Generator Dimension: "+format(data.cost)+" Generator Power";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.s.best.lt(10))player[this.layer].power = player[this.layer].power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.g.dim6 = player.g.dim6.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            41: {
                title: "7th Generator Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[21]<6)return Infinity;
                    let cost = Decimal.pow("1e31250", x.pow(1.35));
					if(x==0)return new Decimal(0);
                    return cost
                },
                effect() {
                    let gain=player.g.dim7;
					gain=gain.mul(Decimal.pow(2,player.g.buyables[41]));
					if(hasUpgrade("s",31))gain = gain.mul(upgradeEffect("s",31));
					if(hasUpgrade("g",42))gain = gain.mul(upgradeEffect("g",42));
					gain=gain.mul(tmp.sg.getSuperGenPowerEff);
					if(hasUpgrade("ss",21))gain=gain.mul(tmp.s.buyables[11].effect);
					if(hasUpgrade("g",34))gain = gain.mul(upgradeEffect("g",34));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[21]<6)return "Req: Complete H challenge 3 6 times";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.g.dim7)+" 7th Generator Dimensions. ("+format(player.g.buyables[41])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 6th Generator Dimensions per second.<br>"+
					"Cost for Next 7th Generator Dimension: "+format(data.cost)+" Generator Power";
                },
                unlocked() { return player.h.unlocked }, 
                canAfford() {
                    return player[this.layer].power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.s.best.lt(10))player[this.layer].power = player[this.layer].power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.g.dim7 = player.g.dim7.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
        },
})

addLayer("t", {
    name: "time capsule",
    symbol: "T",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		energy: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0)
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
		if(hasUpgrade("b",44))mult=mult.div(upgradeEffect("b",44));
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
		 player.t.energy = player.t.energy.add(tmp.t.effect.times(diff));
		 player.t.energy = player.t.energy.add(tmp.t.buyables[11].effect.times(diff));
		 if(player.h.best.gte(1)){
				var target=player.b.points.div(40).sub(1).pow(1/1.2).div(0.065).add(1).floor();
				if(target.gt(player.t.buyables[11])){
					player.t.dim1=player.t.dim1.add(target.sub(player.t.buyables[11]));
					player.t.buyables[11]=target;
				}
				if(player.h.challenges[32]>=1){
					target=player.b.points.div(160).sub(1).pow(1/1.2).div(0.065).add(1).floor();
					if(target.gt(player.t.buyables[12])){
						player.t.dim2=player.t.dim2.add(target.sub(player.t.buyables[12]));
						player.t.buyables[12]=target;
					}
				}
				if(player.h.challenges[32]>=2){
					target=player.b.points.div(640).sub(1).pow(1/1.2).div(0.065).add(1).floor();
					if(target.gt(player.t.buyables[21])){
						player.t.dim3=player.t.dim3.add(target.sub(player.t.buyables[21]));
						player.t.buyables[21]=target;
					}
				}
				if(player.h.challenges[32]>=3){
					target=player.b.points.div(2560).sub(1).pow(1/1.2).div(0.065).add(1).floor();
					if(target.gt(player.t.buyables[22])){
						player.t.dim4=player.t.dim4.add(target.sub(player.t.buyables[22]));
						player.t.buyables[22]=target;
					}
				}
				if(player.h.challenges[32]>=4){
					target=player.b.points.div(10240).sub(1).pow(1/1.2).div(0.065).add(1).floor();
					if(target.gt(player.t.buyables[31])){
						player.t.dim5=player.t.dim5.add(target.sub(player.t.buyables[31]));
						player.t.buyables[31]=target;
					}
				}
			}
		if(player.h.challenges[32]>=1){
			player.t.dim1= player.t.dim1.add(tmp.t.buyables[12].effect.times(diff));
		}
		if(player.h.challenges[32]>=2){
			player.t.dim2= player.t.dim2.add(tmp.t.buyables[21].effect.times(diff));
		}
		if(player.h.challenges[32]>=3){
			player.t.dim3= player.t.dim3.add(tmp.t.buyables[22].effect.times(diff));
		}
		if(player.h.challenges[32]>=4){
			player.t.dim4= player.t.dim4.add(tmp.t.buyables[31].effect.times(diff));
		}
	 },
	effect() {
		let ret = player.t.points;
		if(hasUpgrade("b",33))ret = ret.mul(upgradeEffect("b",33));
		if(hasUpgrade("t",11))ret = ret.mul(upgradeEffect("t",11));
		if(hasUpgrade("t",13))ret = ret.mul(upgradeEffect("t",13));
		if(hasUpgrade("t",21))ret = ret.mul(upgradeEffect("t",21));
		ret=ret.mul(tmp.h.effect);
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
                    ["display-text",
                        function() {return 'You have ' + format(player.t.energy) + ' Time Energy, which multiplies Point gain & Prestige Point gain by ' + format(tmp.t.getTimeEff)},
                        {}],
					"buyables",
						"milestones",
                   "upgrades"],
	milestones: {
            0: {requirementDescription: "2 time capsules",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster/Generator milestones on reset, keep Prestige Upgrades on reset and you can buy 1st Time Dimension",
            },
            1: {requirementDescription: "3 time capsules",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster Upgrades on all row 3 resets and unlock Time Upgrades",
            },
			2: {requirementDescription: "9 time capsules",
                done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
                effectDescription: "Automatically buy Boosters and Booster resets nothing",
            },
			3: {requirementDescription: "25 time capsules",
                done() {return player[this.layer].best.gte(25)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Time Capsules, Automatically buy Booster Dimensions and Booster Dimensions costs nothing",
            },
	},canBuyMax() {return player[this.layer].best.gte(25)},
	buyables: {
            rows: 3,
            cols: 2,
            11: {
                title: "1st Time Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.mul(0.065).pow(1.2).add(1).mul(40).ceil()
                    return cost
                },
                effect() {
					if(inChallenge("h",32))return new Decimal(0);
					if(inChallenge("h",42))return new Decimal(0);
					let gain=player.t.dim1;
					gain=gain.mul(tmp.t.effect);
					gain=gain.mul(Decimal.pow(2,player.t.buyables[11]));
					gain=gain.mul(tmp.h.effect);
					gain=gain.mul(tmp.o.solEnEff2);
					gain=gain.mul(tmp.h.challenges[52].rewardEffect);
					if(hasUpgrade("t",14))gain=gain.mul(upgradeEffect("t",11));
					if(hasUpgrade("b",51))gain=gain.mul(upgradeEffect("b",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.t.dim1)+" 1st Time Dimensions. ("+format(player.t.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" Time Energy per second.<br>"+
					"Cost for Next 1st Time Dimension: "+format(data.cost)+" Boosters";
                },
                unlocked() { return player[this.layer].best.gte(2) }, 
                canAfford() {
                    return player.b.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					if(player.h.best.lt(1))player.b.points = player.b.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.t.dim1 = player.t.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Time Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[32]<1)return Infinity;
                    let cost = x.mul(0.065).pow(1.2).add(1).mul(160).ceil()
                    return cost
                },
                effect() {
					let gain=player.t.dim2;
					gain=gain.mul(Decimal.pow(2,player.t.buyables[12]));
					gain=gain.mul(tmp.h.effect);
					gain=gain.mul(tmp.o.solEnEff2);
					gain=gain.mul(tmp.h.challenges[52].rewardEffect);
					if(hasUpgrade("t",14))gain=gain.mul(upgradeEffect("t",11));
					if(hasUpgrade("b",51))gain=gain.mul(upgradeEffect("b",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[32]<1)return "Req: Complete H Challenge 6";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.t.dim2)+" 2nd Time Dimensions. ("+format(player.t.buyables[12])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 1st Time Dimensions per second.<br>"+
					"Cost for Next 2nd Time Dimension: "+format(data.cost)+" Boosters";
                },
                unlocked() { return player.q.unlocked }, 
                canAfford() {
                    return player.b.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					if(player.h.best.lt(1))player.b.points = player.b.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.t.dim1 = player.t.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "3rd Time Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[32]<2)return Infinity;
                    let cost = x.mul(0.065).pow(1.2).add(1).mul(640).ceil()
                    return cost
                },
                effect() {
					let gain=player.t.dim3;
					gain=gain.mul(Decimal.pow(2,player.t.buyables[21]));
					gain=gain.mul(tmp.h.effect);
					gain=gain.mul(tmp.o.solEnEff2);
					gain=gain.mul(tmp.h.challenges[52].rewardEffect);
					if(hasUpgrade("t",14))gain=gain.mul(upgradeEffect("t",11));
					if(hasUpgrade("b",51))gain=gain.mul(upgradeEffect("b",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[32]<2)return "Req: Complete H Challenge 6 2 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.t.dim3)+" 3rd Time Dimensions. ("+format(player.t.buyables[21])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 2nd Time Dimensions per second.<br>"+
					"Cost for Next 3rd Time Dimension: "+format(data.cost)+" Boosters";
                },
                unlocked() { return player.q.unlocked }, 
                canAfford() {
                    return player.b.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					if(player.h.best.lt(1))player.b.points = player.b.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.t.dim1 = player.t.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            22: {
                title: "4th Time Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[32]<3)return Infinity;
                    let cost = x.mul(0.065).pow(1.2).add(1).mul(2560).ceil()
                    return cost
                },
                effect() {
					let gain=player.t.dim4;
					gain=gain.mul(Decimal.pow(2,player.t.buyables[22]));
					gain=gain.mul(tmp.h.effect);
					gain=gain.mul(tmp.o.solEnEff2);
					gain=gain.mul(tmp.h.challenges[52].rewardEffect);
					if(hasUpgrade("t",14))gain=gain.mul(upgradeEffect("t",11));
					if(hasUpgrade("b",51))gain=gain.mul(upgradeEffect("b",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[32]<3)return "Req: Complete H Challenge 6 3 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.t.dim4)+" 4th Time Dimensions. ("+format(player.t.buyables[22])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 3rd Time Dimensions per second.<br>"+
					"Cost for Next 4th Time Dimension: "+format(data.cost)+" Boosters";
                },
                unlocked() { return player.q.unlocked }, 
                canAfford() {
                    return player.b.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					if(player.h.best.lt(1))player.b.points = player.b.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.t.dim1 = player.t.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            31: {
                title: "5th Time Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[32]<4)return Infinity;
                    let cost = x.mul(0.065).pow(1.2).add(1).mul(10240).ceil()
                    return cost
                },
                effect() {
					let gain=player.t.dim5;
					gain=gain.mul(Decimal.pow(2,player.t.buyables[31]));
					gain=gain.mul(tmp.h.effect);
					gain=gain.mul(tmp.o.solEnEff2);
					gain=gain.mul(tmp.h.challenges[52].rewardEffect);
					if(hasUpgrade("t",14))gain=gain.mul(upgradeEffect("t",11));
					if(hasUpgrade("b",51))gain=gain.mul(upgradeEffect("b",33));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[32]<4)return "Req: Complete H Challenge 6 4 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.t.dim5)+" 5th Time Dimensions. ("+format(player.t.buyables[31])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 4th Time Dimensions per second.<br>"+
					"Cost for Next 5th Time Dimension: "+format(data.cost)+" Boosters";
                },
                unlocked() { return player.q.unlocked }, 
                canAfford() {
                    return player.b.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					if(player.h.best.lt(1))player.b.points = player.b.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.t.dim1 = player.t.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
        },
		
	upgrades:{
		rows: 4,
		cols: 4,
		11: {
			title: "Time Upgrade 11",
            description: "Time Energy gain is boosted by your Time Capsules.",
			cost: new Decimal(11),
			unlocked() { return player.t.best.gte(3) },
			effect() { 
				let ret=player.t.points.pow(3);
				if(hasUpgrade("t",22))ret=ret.mul(Decimal.pow(4,player.t.points));
				if(hasUpgrade("t",24))ret=ret.pow(3);
				if(hasUpgrade("t",34))ret=ret.pow(3);
				return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		12: {
			title: "Time Upgrade 12",
            description: "Time Capsules boost the Booster effect.",
			cost: new Decimal(3),
			unlocked() { return player.t.best.gte(3) },
			effect() {
				if(hasUpgrade("t",41))return player.t.points.pow(1.5).add(1);
				return player.t.points.pow(0.9).add(0.5);
			},
			effectDisplay() { return "+"+format(this.effect())+" to base" },
		},
		13: {
			title: "Time Upgrade 13",
            description: "Time Energy boosts its own production, and the Time Energy effect uses a better formula.",
			cost: new Decimal(14),
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
			title: "Time Upgrade 21",
            description: "Time Energy production is boosted by your Enhance Points.",
			cost: new Decimal(15),
			unlocked() { return player.e.unlocked },
			effect() { 
				let base=20;
                let ret = Decimal.pow(base,Decimal.log10(player.e.points.add(1)).pow(0.9));
			return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		22: {
			title: "Time Upgrade 22",
            description: "Time Upgrade 11 is better.",
			cost: new Decimal(18),
			unlocked() { return player.e.unlocked },
		},
		23: {
			title: "Time Upgrade 23",
            description: "Unlock the 1st Booster Dimension.",
			cost: new Decimal(24),
			unlocked() { return player.e.unlocked },
		},
		31: {
			title: "Time Upgrade 31",
            description: "Generators are stronger based on your Time Energy.",
			cost: new Decimal(57),
			unlocked() { return player.h.unlocked },
			effect() { let base=1.65;
                    let ret = Decimal.pow(base,Decimal.log10(player.t.energy.add(1)).pow(0.9));
					return ret;},
			effectDisplay() { return format(this.effect())+"x" },
		},
		32: {
			title: "Time Upgrade 32",
            description: "Time Upgrade 13 is better.",
			cost: new Decimal(62),
			unlocked() { return player.h.unlocked },
		},
		33: {
			title: "Time Upgrade 33",
            description: "All Booster Dimensions are stronger based on your Time Energy.",
			cost: new Decimal(100),
			unlocked() { return hasUpgrade("sb",12); },
			effect() { 
					let base=new Decimal(1.01);
                    let ret = Decimal.pow(base,Decimal.log10(player.t.energy.add(1)).pow(0.9));
					return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		41: {
			title: "Time Upgrade 41",
            description: "Time Upgrade 12 is better.",
			cost: new Decimal(141),
			unlocked() { return player.h.challenges[32]>=1 },
		},
		42: {
			title: "Time Upgrade 42",
            description: "Super-Boosters are stronger based on your Time Energy.",
			cost: new Decimal(286),
			unlocked() { return player.h.challenges[32]>=2 },
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.t.energy.add(1e10).log10().log10().div(50);
				return ret;
            },
            effectDisplay() { return "+"+format(this.effect())+" to the base" }, // Add formatting to the effect
		},
		43: {
			title: "Time Upgrade 43",
            description: "Solarity gain is boosted based on your Time Energy.",
			cost: new Decimal(900),
			unlocked() { return player.h.challenges[32]>=3 },
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.t.energy.add(1e10).log10().div(10);
				return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
		},
		14: {
			title: "Time Upgrade 14",
            description: "Time Upgrade 11 boosts All Time Dimensions.",
			cost: new Decimal(3333),
			unlocked() { return player.h.challenges[32]>=4 },
		},
		24: {
			title: "Time Upgrade 24",
            description: "Time Upgrade 11 is cubed.",
			cost: new Decimal(23750),
			unlocked() { return hasUpgrade("h",42) },
		},
		34: {
			title: "Time Upgrade 34",
            description: "Time Upgrade 11 is cubed.",
			cost: new Decimal(30800),
			unlocked() { return hasUpgrade("h",42) },
		},
	},
	doReset(l){
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){return;}
			if(l=="h" || l=="q" || l=="ss" || l=="o"){
					var b=new Decimal(player.t.best);
					if(player[l].best.gte(2) || l=="ss")layerDataReset("t",["upgrades"]);
					else layerDataReset("t",[]);
					player.t.best=b;
					return;
				}
			var b=new Decimal(player.t.best);
			layerDataReset("t",["upgrades"]);
			player.t.best=b;
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
		if(hasUpgrade("g",14))mult=mult.div(upgradeEffect("g",14));
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
            0: {requirementDescription: "1 space energy",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Unlock 1st Generator Dimension.",
            },
			1: {requirementDescription: "2 space energy",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster/Generator milestones on reset, keep Prestige Upgrades on reset and unlock Space Building 2 and 3",
            },
            2: {requirementDescription: "3 space energy",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Keep Generator Upgrades on all row 3 resets and unlock Space Upgrades",
            },
			3: {requirementDescription: "9 space energy",
                done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
                effectDescription: "Automatically buy Generators and Generator resets nothing",
            },
			4: {requirementDescription: "10 space energy",
                done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
                effectDescription: "Automatically buy Generator Dimensions and buying Generator Dimensions costs nothing",
            },
			5: {requirementDescription: "16 space energy",
                done() {return player[this.layer].best.gte(16)}, // Used to determine when to give the milestone
                effectDescription: "Unlock Space Building 4",
            },
			6: {requirementDescription: "25 space energy",
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
						"milestones",
                   "upgrades"],
				    
	getBaseSpace(){
		let baseSpace = player.s.best.pow(1.1).times(3);
		if(hasUpgrade("s",31))baseSpace=baseSpace.add(player.s.dim);
		baseSpace=baseSpace.floor();
		return baseSpace;
	},
	getSpace(){
		let baseSpace = tmp.s.getBaseSpace;
		return baseSpace.sub(tmp.s.getSpaceSpent);
	},
	getSpaceSpent(){
		return player[this.layer].buyables[11].add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14]).add(player[this.layer].buyables[15]);
	},
	
	buyables: {
            rows: 2,
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
					eff=eff.add(1);
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 1\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    (hasUpgrade("ss",21)?"Currently: Multiply All Generator Dimensions by "+format(data.effect)+".":"Currently: Multiply 1st Generator Dimension by "+format(data.effect)+".");
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
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n\
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
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n\
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
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n\
                    Currently: Booster Upgrade 23's effect is raised to the power of "+format(data.effect);
                },
                unlocked() { return player[this.layer].best.gte(16) }, 
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
					x = x.add(tmp.ss.getFreeLevel);
					x=x.mul(tmp.s.getStrength);
					if(hasUpgrade("s",41))x = x.mul(2);
					if(hasUpgrade("s",42))x = x.mul(2);
					//if (x.gte("e3e9")) x = Decimal.pow(10, x.log10().times(9e18).cbrt())
					return x.sqrt()
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 5\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n\
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
			21: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e100,Decimal.pow(x.add(3),1.35))
					if(x.eq(0))return new Decimal(0)
					if(hasUpgrade("s",32))cost=cost.div(upgradeEffect("s",32));
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x = x.add(tmp.ss.getFreeLevel);
					x=x.mul(tmp.s.getStrength);
					//if (x.gte("e3e9")) x = Decimal.pow(10, x.log10().times(9e18).cbrt())
					x=Decimal.pow(3,x);
					x=x.mul(tmp.q.quirkEff);
					return x;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 6\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n\
                    Currently: Gain "+format(data.effect)+" Space per second.";
                },
                unlocked() { return hasUpgrade("s",31) }, 
                canAfford() {
                    return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)// && tmp.s.getSpace.gt(0)
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
		 if(hasUpgrade("s",31))player.s.dim = player.s.dim.add(tmp.s.buyables[21].effect.times(diff)).max(0);
		 if(player.h.best.gte(3)){
			var pow=player.g.power;
			if(hasUpgrade("s",32))pow=pow.mul(upgradeEffect("s",32));
			var target=pow.add(1).log(1e100).pow(1/1.35).sub(2).floor().max(1);
			//if(target.gte(tmp.s.getSpace.add(player.s.buyables[21])))target=tmp.s.getSpace.add(player.s.buyables[21]);
			if(target.gt(player.s.buyables[21])&&hasUpgrade("s",31)){
				player.s.buyables[21]=target;
			}
			target=pow.add(1).log(1e50).pow(1/1.35).sub(2).floor();
			if(target.gte(tmp.s.getSpace.add(player.s.buyables[15])))target=tmp.s.getSpace.add(player.s.buyables[15]);
			if(target.gt(player.s.buyables[15])&&player.s.best.gte(25)){
				player.s.buyables[15]=target;
			}
			target=pow.add(1).log(1e24).pow(1/1.35).sub(1).floor();
			if(target.gte(tmp.s.getSpace.add(player.s.buyables[14])))target=tmp.s.getSpace.add(player.s.buyables[14]);
			if(target.gt(player.s.buyables[14])&&player.s.best.gte(16)){
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
			title: "Space Upgrade 11",
            description: "Generator Power boosts Generator Power and 1st Prestige Dimension gain.",
			cost: new Decimal(3),
			unlocked() { return player.s.best.gte(3) },
			effect() { let ret = Decimal.pow(1.5,Decimal.log10(player.g.power.add(1)).pow(0.9));return ret; },
			effectDisplay() { return format(this.effect())+"x" },
		},
		12: {
			title: "Space Upgrade 12",
            description: "Space Building Levels boost Generator Power and 1st Prestige Dimension gain.",
			cost: new Decimal(3),
			unlocked() { return player.s.best.gte(3) },
			effect() { return Decimal.pow(2, tmp.s !== undefined ? tmp.s.getSpaceSpent : 0) },
			effectDisplay() { return format(this.effect())+"x" },
		},
		13: {
			title: "Space Upgrade 13",
            description: "Space Buildings are stronger based on your Generators.",
			cost: new Decimal(4),
			unlocked() { return player.s.best.gte(3) },
			effect() { return player.g.points.add(1).log10().div(1.5).add(1) },
			effectDisplay() { return format(this.effect())+"x" },
		},
		21: {
			title: "Space Upgrade 21",
            description: "Space Building 1 uses a better formula.",
			cost: new Decimal(16),
			unlocked() { return player.e.unlocked },
		},
		22: {
			title: "Space Upgrade 22",
            description: "Space Building 3's effect is squared.",
			cost: new Decimal(19),
			unlocked() { return player.e.unlocked },
		},
		23: {
			title: "Space Upgrade 23",
            description: "Space Building 4's effect is doubled.",
			cost: new Decimal(30),
			unlocked() { return player.e.unlocked },
		},
		31: {
			title: "Space Upgrade 31",
            description: "Unlock Space Building 6, it will generate Space. Generators and all Generator Dimensions are stronger based on your Total Space.",
			cost: new Decimal(47),
			unlocked() { return player.h.unlocked },
			effect() { return tmp.s.getBaseSpace.plus(10); },
			effectDisplay() { return format(this.effect())+"x" },
		},
		32: {
			title: "Space Upgrade 32",
            description: "Total Space cheapens Space Buildings.",
			cost: new Decimal(93),
			unlocked() { return player.h.unlocked },
			effect() { return tmp.s.getBaseSpace.plus(10).pow(10); },
			effectDisplay() { return "/"+format(this.effect()) },
		},
		33: {
			title: "Space Upgrade 33",
            description: "Space Buildings are stronger based on total space.",
			cost: new Decimal(126),
			unlocked() { return player.q.unlocked },
			effect() { return Decimal.log10(Decimal.log10(Decimal.log10(tmp.s.getBaseSpace.plus(10)).plus(10)).plus(10)).pow(1.5); },
			effectDisplay() { return format(this.effect())+"x" },
		},
		41: {
			title: "Space Upgrade 41",
            description: "Space Building 5's effect is doubled.",
			cost: new Decimal(700),
			unlocked() { return hasUpgrade("ss",23) },
		},
		42: {
			title: "Space Upgrade 42",
            description: "Space Building 5's effect is doubled.",
			cost: new Decimal(1024),
			unlocked() { return hasUpgrade("ss",23) },
		},
		43: {
			title: "Space Upgrade 43",
            description: "All Subspace Dimensions are boosted based on Space Energy.",
			cost: new Decimal(1230),
			unlocked() { return hasUpgrade("ss",23) },
			effect() { return Decimal.pow(1.02,player.s.points) },
			effectDisplay() { return format(this.effect())+"x" },
		},
	},
		doReset(l){
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){return;}
			if(l=="h" || l=="q" || l=="ss" || l=="o"){
					var b=new Decimal(player.s.best);
					if(player[l].best.gte(2) || l=="ss")layerDataReset("s",["upgrades"]);
					else layerDataReset("s",[]);
					player.s.best=b;
					return;
				}
			var b=new Decimal(player.s.best);
			layerDataReset("s",["upgrades"]);
			player.s.best=b;
		},
		milestonePopups(){
			if(player.h.best.gte(1))return false;
		 return true;
	    },
	 autoPrestige(){
		 return player.h.best.gte(100);
	 },resetsNothing(){
		 return player.h.best.gte(100);
	 },
	 hotkeys: [
           {key: "s", description: "S: Space reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	getStrength(){
		if(inChallenge("h",42))return new Decimal(0);
		let x=new Decimal(1);
		if(hasUpgrade("s",13))x = x.mul(upgradeEffect("s",13));
		if(hasUpgrade("s",33))x = x.mul(upgradeEffect("s",33));
		x=x.mul(tmp.ss.getAddStrength);
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
		power: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
    }},
    color: "#9643a3",
    requires: new Decimal("1e1600"),
    exponent: 0.02,
    logExponent: 0.99,
	softcap: new Decimal(Infinity),
	softcapPower: new Decimal(1),
    resource: "enhance points",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "normal",
    gainMult() {
        mult = new Decimal(1)
		if(hasUpgrade("e",21))mult=mult.mul(upgradeEffect("e",21));
		mult=mult.mul(Decimal.pow(1e4,player.h.best.pow(0.5).min(5).add(player.h.best.add(1).log10().min(5)).add(player.h.best.add(1).log10().add(1).log10().min(5))));
		if(hasUpgrade("q",11)) mult =  mult.mul(upgradeEffect("q",11))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
	softcap: new Decimal(Infinity),
	softcapPower: new Decimal(1),
    hotkeys: [],
    layerShown(){return hasUpgrade("p",33) || player.e.unlocked},
	branches: ["b","g"],
	milestones: {
            0: {requirementDescription: "1 enhance points",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster/Generator milestones on reset, keep Prestige upgrades on reset",
            },
			1: {requirementDescription: "100 enhance points",
                done() {return player[this.layer].best.gte(100)}, // Used to determine when to give the milestone
                effectDescription: "Unlock Enhancer Effect 3.",
            },
			2: {requirementDescription: "1e34 enhance points",
                done() {return player[this.layer].best.gte(1e34)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the 3rd Prestige Dimension.",
            },
			3: {requirementDescription: "1e137 enhance points",
                done() {return player[this.layer].best.gte(1e137)}, // Used to determine when to give the milestone
                effectDescription: "Unlock Enhancer Effect 4.",
            },
			4: {requirementDescription: "1e1000 enhance points",
                done() {return player[this.layer].best.gte("1e1000")}, // Used to determine when to give the milestone
                effectDescription: "Unlock Enhancer Effect 5.",
            },
	},
	getStrength(){
		if(inChallenge("h",42))return new Decimal(0);
		let x=new Decimal(1);
		if(hasUpgrade("e",22))x=x.mul(upgradeEffect("e",22));
		x=x.mul(tmp.e.getPowerEff1);
		if(hasUpgrade("e",32))x=x.mul(upgradeEffect("e",32));
		if(hasUpgrade("e",33))x=x.mul(upgradeEffect("e",33));
		if(hasUpgrade("e",24))x=x.mul(upgradeEffect("e",24));
		return x;
	},
	getPowerEff1(){
		let x=player.e.power.add(1).log10().add(1).log10().div(10).add(1);
		if(hasUpgrade("e",41))x=x.pow(2);
		x=x.pow(clickableEffect("m",21));
		return x;
	},
	getPowerEff2(){
		let power=0.25;
		if(hasUpgrade("e",43))power+=0.25;
		let x=player.e.power.add(1).log10().pow(power);
		if(hasUpgrade("e",31))x=x.mul(2);
		if(hasUpgrade("e",14))x=x.mul(3);
		return x;
	},
	buyables: {
            rows: 4,
            cols: 2,
            1: {
                title: "Enhancer", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x=x.add(tmp[this.layer].buyables[this.id].getFreeLevel).mul(tmp.e.getStrength);
					let eff = [];
					eff[0]=Decimal.pow(x, 4).mul(Decimal.pow(2, x)).mul(1e3).add(1);
					eff[1]=Decimal.pow(200,x.pow(0.92));
					eff[2]=x.sqrt().mul(0.4);
					eff[3]=x.pow(0.35).mul(0.005);
					eff[4]=x.sqrt().mul(0.3).add(2).pow(0.1);
					eff[5]=Decimal.pow(1.001,x.pow(0.9));
					eff[6]=Decimal.pow(1.001,x.pow(0.9));
					eff[7]=Decimal.pow(1.01,x.pow(0.9));
                    if(hasUpgrade("e",12))eff[0]=eff[0].mul(upgradeEffect("e",12));
					return eff;
                },
				getFreeLevel(){
					let gain=new Decimal(0);
					gain=gain.add(tmp.e.getPowerEff2);
					if(hasUpgrade("q",42))gain=gain.add(player.q.buyables[11]);
					if(hasUpgrade("q",43))gain=gain.add(tmp.q.buyables[11].getFreeLevel);
					return gain;
				},
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player[this.layer].buyables[this.id])+"+"+format(tmp[this.layer].buyables[this.id].getFreeLevel)+" Enhancers.\n\
					Cost for Next Enhancer: " + format(data.cost) + " Enhance Points";
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
			11: {
                title: "1st Enhance Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(!hasUpgrade("e",23))return Infinity;
                    let cost = Decimal.pow(10, x.pow(1.35));
                    return cost
                },
                effect() {
					if(inChallenge("h",32))return new Decimal(0);
                    let gain=player.e.dim1;
					gain=gain.mul(Decimal.pow(2,player.e.buyables[11]));
					if(hasUpgrade("e",42))gain=gain.mul(tmp.e.buyables[1].effect[7]);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(!hasUpgrade("e",23))return "Req: Enhance Upgrade 23";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.e.dim1)+" 1st Enhance Dimensions. ("+format(player.e.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" Enhance Power per second.<br>"+
					"Cost for Next 1st Enhance Dimension: "+format(data.cost)+" Enhance Points";
                },
                unlocked() { return true }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(2))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.e.dim1 = player.e.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Enhance Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[32]<1)return Infinity;
                    let cost = Decimal.pow(100, x.pow(1.35));
                    return cost
                },
                effect() {
                    let gain=player.e.dim2;
					gain=gain.mul(Decimal.pow(2,player.e.buyables[12]));
					if(hasUpgrade("e",42))gain=gain.mul(tmp.e.buyables[1].effect[7]);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[32]<1)return "Req: Complete H Challenge 6";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.e.dim2)+" 2nd Enhance Dimensions. ("+format(player.e.buyables[12])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 1st Enhance Dimensions per second.<br>"+
					"Cost for Next 2nd Enhance Dimension: "+format(data.cost)+" Enhance Points";
                },
                unlocked() { return player.q.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(2))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.e.dim2 = player.e.dim2.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "3rd Enhance Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[32]<2)return Infinity;
                    let cost = Decimal.pow(10000, x.pow(1.35));
                    return cost
                },
                effect() {
                    let gain=player.e.dim3;
					gain=gain.mul(Decimal.pow(2,player.e.buyables[21]));
					if(hasUpgrade("e",42))gain=gain.mul(tmp.e.buyables[1].effect[7]);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[32]<2)return "Req: Complete H Challenge 6 2 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.e.dim3)+" 3rd Enhance Dimensions. ("+format(player.e.buyables[21])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 2nd Enhance Dimensions per second.<br>"+
					"Cost for Next 3rd Enhance Dimension: "+format(data.cost)+" Enhance Points";
                },
                unlocked() { return player.q.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(2))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.e.dim3 = player.e.dim3.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            22: {
                title: "4th Enhance Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[32]<3)return Infinity;
                    let cost = Decimal.pow(1e8, x.pow(1.35));
                    return cost
                },
                effect() {
                    let gain=player.e.dim4;
					gain=gain.mul(Decimal.pow(2,player.e.buyables[22]));
					if(hasUpgrade("e",42))gain=gain.mul(tmp.e.buyables[1].effect[7]);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[32]<3)return "Req: Complete H Challenge 6 3 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.e.dim4)+" 4th Enhance Dimensions. ("+format(player.e.buyables[22])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 3rd Enhance Dimensions per second.<br>"+
					"Cost for Next 4th Enhance Dimension: "+format(data.cost)+" Enhance Points";
                },
                unlocked() { return player.q.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(2))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.e.dim4 = player.e.dim4.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            31: {
                title: "5th Enhance Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[32]<4)return Infinity;
                    let cost = Decimal.pow(1e16, x.pow(1.35));
                    return cost
                },
                effect() {
                    let gain=player.e.dim5;
					gain=gain.mul(Decimal.pow(2,player.e.buyables[31]));
					if(hasUpgrade("e",42))gain=gain.mul(tmp.e.buyables[1].effect[7]);
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(player.h.challenges[32]<4)return "Req: Complete H Challenge 6 4 times";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.e.dim5)+" 5th Enhance Dimensions. ("+format(player.e.buyables[31])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 4th Enhance Dimensions per second.<br>"+
					"Cost for Next 5th Enhance Dimension: "+format(data.cost)+" Enhance Points";
                },
                unlocked() { return player.q.unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.h.best.lt(2))player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.e.dim5 = player.e.dim5.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
        },
	update(diff){
		 if(player.h.best.gte(2)){
				var target=player.e.points.add(1).log(2).pow(1/1.5).add(1).floor();
				if(target.gt(player.e.buyables[1])){
					player.e.buyables[1]=target;
				}
				if(hasUpgrade("e",23)){
					target=player.e.points.add(1).log(10).pow(1/1.35).add(1).floor();
					if(target.gt(player.e.buyables[11])){
						player.e.dim1=player.e.dim1.add(target.sub(player.e.buyables[11]));
						player.e.buyables[11]=target;
					}
				}
				if(player.h.challenges[32]>=1){
					target=player.e.points.add(1).log(100).pow(1/1.35).add(1).floor();
					if(target.gt(player.e.buyables[12])){
						player.e.dim2=player.e.dim2.add(target.sub(player.e.buyables[12]));
						player.e.buyables[12]=target;
					}
				}
				if(player.h.challenges[32]>=2){
					target=player.e.points.add(1).log(10000).pow(1/1.35).add(1).floor();
					if(target.gt(player.e.buyables[21])){
						player.e.dim3=player.e.dim3.add(target.sub(player.e.buyables[21]));
						player.e.buyables[21]=target;
					}
				}
				if(player.h.challenges[32]>=3){
					target=player.e.points.add(1).log(1e8).pow(1/1.35).add(1).floor();
					if(target.gt(player.e.buyables[22])){
						player.e.dim4=player.e.dim4.add(target.sub(player.e.buyables[22]));
						player.e.buyables[22]=target;
					}
				}
				if(player.h.challenges[32]>=4){
					target=player.e.points.add(1).log(1e16).pow(1/1.35).add(1).floor();
					if(target.gt(player.e.buyables[31])){
						player.e.dim5=player.e.dim5.add(target.sub(player.e.buyables[31]));
						player.e.buyables[31]=target;
					}
				}
			}
		if(hasUpgrade("e",23))player.e.power=player.e.power.add(tmp.e.buyables[11].effect.mul(diff));
		if(player.h.challenges[32]>=1)player.e.dim1=player.e.dim1.add(tmp.e.buyables[12].effect.mul(diff));
		if(player.h.challenges[32]>=2)player.e.dim2=player.e.dim2.add(tmp.e.buyables[21].effect.mul(diff));
		if(player.h.challenges[32]>=3)player.e.dim3=player.e.dim3.add(tmp.e.buyables[22].effect.mul(diff));
		if(player.h.challenges[32]>=4)player.e.dim4=player.e.dim4.add(tmp.e.buyables[31].effect.mul(diff));
	 },
	tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					["buyable",1],
					["raw-html",function(){
						var effect="Enhancer Effect 1: Multiply 1st Generator Dimension by "+format(tmp.e.buyables[1].effect[0])+"<br>";
						effect+="Enhancer Effect 2: Multiply Prestige Point gain by "+format(tmp.e.buyables[1].effect[1])+"<br>";
						if(player.e.best.gte(100))effect+="Enhancer Effect 3: Add "+format(tmp.e.buyables[1].effect[2])+" to Booster Base<br>";
						if(player.e.best.gte(1e137))effect+="Enhancer Effect 4: Generator Upgrade 13's base +"+format(tmp.e.buyables[1].effect[3])+"<br>";
						if(player.e.best.gte("1e1000"))effect+="Enhancer Effect 5: Multiply Booster Boost effect by "+format(tmp.e.buyables[1].effect[4])+"<br>";
						if(hasUpgrade("e",42))effect+="Enhancer Effect 6: Multiply All Super-Generator Dimensions by "+format(tmp.e.buyables[1].effect[5])+"<br>";
						if(hasUpgrade("e",43))effect+="Enhancer Effect 7: Multiply Quirk Gain by "+format(tmp.e.buyables[1].effect[6])+"<br>";
						if(hasUpgrade("e",42))effect+="Enhancer Effect 8: Multiply All Enhance Dimensions by "+format(tmp.e.buyables[1].effect[7])+"<br>";
						return "Enhancer Strength: "+format(tmp.e.getStrength)+"<br>Your "+format(player.e.buyables[1].add(tmp.e.buyables[1].getFreeLevel))+" Enhancers are providing these effects:<br>"+effect}
					],
					["display-text",function() {return 'You have ' + format(player.e.power) + ' Enhance Power, which are multiplying Enhancer Strength by ' + format(tmp.e.getPowerEff1) + ', and providing '+ format(tmp.e.getPowerEff2) + ' free Enhancers'},
                        {}],"buyables",
						"milestones",
                   "upgrades"],
		upgrades:{
		rows: 4,
		cols: 4,
		11: {
			title: "Enhance Upgrade 11",
            description: "Unspent Enhance Points boost Prestige Point gain.",
			cost: new Decimal(200),
			unlocked() { return true },
			effect() { 
				let base=100;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9))
                return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		12: {
			title: "Enhance Upgrade 12",
            description: "Enhancer Effect 1 is stronger based on Unspent Enhance Points.",
			cost: new Decimal(2000),
			unlocked() { return true },
			effect() { 
				let base=100;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9))
                return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		13: {
			title: "Enhance Upgrade 13",
            description: "The Generator Power effect is raised to the power of 1.15.",
			cost: new Decimal(1e13),
			unlocked() { return true },
		},
		21: {
			title: "Enhance Upgrade 21",
            description: "Prestige Points boost Enhance Point gain.",
			cost: new Decimal(1e25),
			unlocked() { return true },
			effect() { 
				let base=1.005;
                let ret = Decimal.pow(base,Decimal.log10(player.p.points.add(1)).pow(0.9))
                return ret; },
			effectDisplay() { return format(this.effect())+"x" },
		},
		22: {
			title: "Enhance Upgrade 22",
            description: "Enhancers are stronger based on your Space Energy & Time Capsules.",
			cost: new Decimal(1e32),
			unlocked() { return true },
			effect() { 
				let ret = player.s.points.add(player.t.points).div(90).add(1).pow(0.9);
				let softcap=new Decimal(135);
				if(hasUpgrade("e",34))softcap=softcap.add(player.ps.points);
				if(ret.gte(softcap))ret=ret.div(softcap).sqrt().mul(softcap);
				return ret;
			},
			effectDisplay() { return format(this.effect())+"x" },
		},
		23: {
			title: "Enhance Upgrade 23",
            description: "Unlock the 1st Enhance Dimension.",
			cost: new Decimal(1e68),
			unlocked() { return true },
		},
		31: {
			title: "Enhance Upgrade 31",
            description: "Enhance Power's second effect is doubled.",
			cost: new Decimal(1e160),
			unlocked() { return player.sb.unlocked },
		},
		32: {
			title: "Enhance Upgrade 32",
            description: "Enhancers are stronger based on your Effective Super-Boosters.",
			cost: new Decimal(1e166),
			unlocked() { return player.sb.unlocked },
			effect() {
				let ret = tmp.sb.getEff.div(7).add(1);
				return ret;
			},
			effectDisplay() { return format(this.effect())+"x"  },
		},
		33: {
			title: "Enhance Upgrade 33",
            description: "Enhancers are stronger based on your Enhance Points.",
			cost: new Decimal("1e182"),
			unlocked() { return player.sb.unlocked },
			effect() {
				let ret = player.e.points.add(1e10).log10().log10().div(10).add(1);
				return ret;
			},
			effectDisplay() { return format(this.effect())+"x"  },
		},
		41: {
			title: "Enhance Upgrade 41",
			description: "Enhance Power's first effect is squared.",
			cost: new Decimal("1e455"),
			unlocked() { return player.h.unlocked },
		},
		42: {
			title: "Enhance Upgrade 42",
			description: "Unlock 2 new Enhancer effects.",
			cost: new Decimal("1e23200"),
			unlocked() { return player.ss.unlocked },
		},
		43: {
			title: "Enhance Upgrade 43",
			description: "Unlock Enhancer Effect 7, and Enhance Power's second effect is better.",
			cost: new Decimal("1e47000"),
			unlocked() { return player.ss.unlocked },
		},
		14: {
			title: "Enhance Upgrade 14",
			description: "Enhance Power's second effect is tripled.",
			cost: new Decimal("e2e7"),
			unlocked() { return hasUpgrade("q",43); },
		},
		24: {
			title: "Enhance Upgrade 24",
			description: "Enhancers are stronger based on your bought Enhancers.",
			cost: new Decimal("e2.19e7"),
			unlocked() { return hasUpgrade("q",43); },
			effect() {
				let ret = player.e.buyables[11].add(1).log10().pow(3).div(4e3).add(1);
				return ret;
			},
			effectDisplay() { return format(this.effect())+"x"  },
		},
		34: {
			title: "Enhance Upgrade 34",
			description: "Enhance Upgrade 22's softcap is reduced based on phantom souls.",
			cost: new Decimal("e3.64e7"),
			unlocked() { return hasUpgrade("q",43); },
		},
	},
	doReset(l){
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){return;}
			if(l=="h" || l=="q" || l=="ss" || l=="o"){
					var b=new Decimal(player.e.best);
					if(player[l].best.gte(2) || l=="ss")layerDataReset("e",["upgrades"]);
					else layerDataReset("e",[]);
					player.e.best=b;
					return;
				}
			var b=new Decimal(player.e.best);
			layerDataReset("e",["upgrades"]);
			player.e.best=b;
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
		boost: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
    }},
    color: "#494b99",
    requires: function(){
		return new Decimal(2270);
	},
    resource: "super-boosters",
    baseResource: "boosters", 
    baseAmount() {return player.b.points},
    type: "static",
	base: 1.05,
    exponent: 1.25,
	roundUpCost: true,
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
			let base=new Decimal(2);
			if(hasUpgrade("sb",11))base=base.add(upgradeEffect("sb",11));
			if(hasUpgrade("t",42))base=base.add(upgradeEffect("t",42));
			base=base.add(tmp.o.buyables[2].effect);
			if(hasUpgrade("sb",33))base=base.add(tmp.sb.boostEffect);
			let ret = Decimal.pow(base,tmp.sb.getEff);
			return ret;
		},
	 effectDescription() { // Optional text to describe the effects
           eff = this.effect();
           return "which are multiplying the Booster Boost effect by "+format(eff);
       },
	   upgrades: {
            rows: 4,
            cols: 3,
			11: {
                title: "Super-Booster Upgrade 11",
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
                title: "Super-Booster Upgrade 12",
                description: "All Booster Dimensions is boosted by Super-Boosters.",
                cost: new Decimal(15),
                unlocked() { return player.h.unlocked },
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.sb.points.mul(Decimal.pow(10,player.sb.points.pow(0.8)));
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
                title: "Super-Booster Upgrade 13",
                description: "Unlock 2 new Booster Upgrades.",
                cost: new Decimal(22),
                unlocked() { return player.q.unlocked },
            },
			21: {
                title: "Super-Booster Upgrade 21",
                description: "Point gain is boosted by your Super-Boosters.",
                cost: new Decimal(32),
                unlocked() { return player.ss.unlocked },
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = Decimal.pow(10,player.sb.points.pow(3));
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			22: {
                title: "Super-Booster Upgrade 22",
                description: "Effective Super-Boosters exponent +0.01",
                cost: new Decimal(35),
                unlocked() { return player.ss.unlocked },
            },
			23: {
                title: "Super-Booster Upgrade 23",
                description: "Unlock Solarity",
                cost: new Decimal(37),
                unlocked() { return player.ss.unlocked },
            },
			31: {
                title: "Super-Booster Upgrade 31",
                description: "Effective Super-Boosters exponent +0.01",
                cost: new Decimal(40),
                unlocked() { return hasUpgrade("o",23) },
            },
			32: {
                title: "Super-Booster Upgrade 32",
                description: "Tachoclinal Plasma's effect is multiplied by 1.5",
                cost: new Decimal(42),
                unlocked() { return hasUpgrade("o",23) },
            },
			33: {
                title: "Super-Booster Upgrade 33",
                description: "Unlock the 1st Super-Booster Dimension.",
                cost: new Decimal(43),
                unlocked() { return hasUpgrade("o",23) },
            },
			41: {
                title: "Super-Booster Upgrade 41",
                description: "Effective Super-Boosters exponent +0.01",
                cost: new Decimal(48),
                unlocked() { return player.m.unlocked },
            },
			42: {
                title: "Super-Booster Upgrade 42",
                description: "Effective Super-Boosters exponent +0.01",
                cost: new Decimal(52),
                unlocked() { return player.m.unlocked },
            },
			43: {
                title: "Super-Booster Upgrade 43",
                description: "Effective Super-Boosters exponent +0.01",
                cost: new Decimal(60),
                unlocked() { return player.m.unlocked },
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
                        ["display-text",function() {if(hasUpgrade("sb",23))return 'You have ' + format(player.sb.boost) + ' Super-Booster Boosts, which adds Super-Booster base by ' + format(tmp.sb.boostEffect);return ""},
                        {}],
						"buyables",
						"milestones",
                   "upgrades"],
				   
	getEffExp(){
		let exponent=new Decimal(0.56);
		if(hasUpgrade("sb",22))exponent=exponent.add(0.01);
		if(hasUpgrade("sb",31))exponent=exponent.add(0.01);
		if(hasUpgrade("sb",41))exponent=exponent.add(0.01);
		if(hasUpgrade("sb",42))exponent=exponent.add(0.01);
		if(hasUpgrade("sb",43))exponent=exponent.add(0.01);
		return exponent;
	},
	getEffMul(){
		let mult=new Decimal(1);
		return mult;
	},
	getEff(){
		let ret=player.sb.points.pow(tmp.sb.getEffExp).mul(tmp.sb.getEffMul);
		if(hasUpgrade("sg",13))ret=ret.add(upgradeEffect("sg",13));
		if(hasUpgrade("o",32))ret=ret.add(upgradeEffect("o",32));
		return ret;
	},
		doReset(l){
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){return;}
			if(l=="h" || l=="q" || l=="ss" || l=="o"){
					var b=new Decimal(player.sb.best);
					if(player[l].best.gte(2) || l=="ss")layerDataReset("sb",["upgrades"]);
					else layerDataReset("sb",[]);
					player.sb.best=b;
					if(hasUpgrade("h",12))player.sb.points=new Decimal(1);
					return;
				}
			var b=new Decimal(player.sb.best);
			layerDataReset("sb",["upgrades"]);
			player.sb.best=b;
		},
		autoPrestige(){
		 return player.h.best.gte(50);
	 },resetsNothing(){
		 return player.h.best.gte(50);
	 },
	 hotkeys: [
           {key: "B", description: "Shift+B: Super-Booster reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	 update(diff){
		 if(hasUpgrade("sb",23))player.sb.boost = player.sb.boost.add(tmp.sb.buyables[11].effect.times(diff)).max(0)
		 if(player.h.challenges[61]>=1)player.sb.dim1 = player.sb.dim1.add(tmp.sb.buyables[12].effect.times(diff)).max(0)
		if(player.h.challenges[51]){
			if(hasUpgrade("sb",23)){
				target=player.o.energy.add(1).log(100).pow(1/1.35).add(1).floor();
				if(target.gt(player.sb.buyables[11])){
					player.sb.dim1=player.sb.dim1.add(target.sub(player.sb.buyables[11]));
					player.sb.buyables[11]=target;
				}
			}
			if(player.h.challenges[61]>=1){
				target=player.o.energy.add(1).log(1e8).pow(1/1.35).add(1).floor();
				if(target.gt(player.sb.buyables[12])){
					player.sb.dim2=player.sb.dim2.add(target.sub(player.sb.buyables[12]));
					player.sb.buyables[12]=target;
				}
			}
		}
	 },
	 boostEffect(){
		 let effect=Decimal.log10(player.sb.boost.add(1)).div(100);
		 return effect;
	 },
	 buyables: {
		 rows: 2,
		 cols: 2,
		 
            11: {
                title: "1st Super-Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(!hasUpgrade("sb",33))return Infinity;
					let cost = Decimal.pow(100, x.pow(1.35))
                    return cost
                },
                effect() {
					if(inChallenge("h",61))return new Decimal(0);
					let gain=player.sb.dim1;
					gain=gain.mul(Decimal.pow(2,player.sb.buyables[11]));		
					if(hasUpgrade("m",11))gain=gain.mul(upgradeEffect("m",11))
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(!hasUpgrade("sb",33))return "Req: Super-Booster Upgrade 33";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.sb.dim1)+" 1st Super-Booster Dimensions. ("+format(player.sb.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" Super-Booster Boosts per second.<br>"+
					"Cost for Next 1st Super-Booster Dimension: "+format(data.cost)+" Solar Energy";
                },
                unlocked() { return player.o.unlocked }, 
                canAfford() {
                    return player.o.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.o.energy = player.o.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.sb.dim1 = player.sb.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Super-Booster Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					if(player.h.challenges[61]<1)return Infinity;
					let cost = Decimal.pow(1e8, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.sb.dim2;
					gain=gain.mul(Decimal.pow(2,player.sb.buyables[12]));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[61]<1)return "Req: Complete H Challenge 11";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.sb.dim2)+" 2nd Super-Booster Dimensions. ("+format(player.sb.buyables[12])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 1st Super-Booster Dimensions per second.<br>"+
					"Cost for Next 2nd Super-Booster Dimension: "+format(data.cost)+" Solar Energy";
                },
                unlocked() { return player.m.unlocked || player.ba.unlocked }, 
                canAfford() {
                    return player.o.energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.o.energy = player.o.energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.sb.dim2 = player.sb.dim2.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	 },
})


addLayer("h", {
    name: "hindrance spirit",
    symbol: "H",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		power: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
    }},
    color: "#a14040",
    requires: function(){
		return new Decimal("1e490");
	},
    resource: "hindrance spirit",
    baseResource: "time energy", 
    baseAmount() {return player.t.energy},
    type: "normal",
    exponent: .023,
	logExponent: 0.97,
	softcap: new Decimal(Infinity),
	softcapPower: new Decimal(1),
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
			let ret=player.h.points.add(1);
			if(hasUpgrade("h",42))ret=ret.pow(2);
			return ret;
		},
	effectDescription() { // Optional text to describe the effects
           eff = this.effect();
           return "which are multiplying All Time Dimension productions and Time Energy production by "+format(eff);
       },
	milestones: {
            0: {requirementDescription: "1 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: function(){
					return "Keep all milestones and prestige upgrades on all 4th row resets, autobuy Time Dimensions, buying Time Dimensions doesn't cost any boosters. Gain more Enhance Points based on best hindrance spirit (hardcapped at 1e60x), Curently: "+format(Decimal.pow(1e4,player.h.best.pow(0.5).min(5).add(player.h.best.add(1).log10().min(5)).add(player.h.best.add(1).log10().add(1).log10().min(5))))+"x";
				},
            },
			1: {requirementDescription: "2 Hindrance Spirit",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Keep all 3rd row upgrades on reset, autobuy Enhancers and Enhance Dimensions, buying Enhancers and Enhance Dimensions doesn't cost any Enhance Points",
            },
			2: {requirementDescription: "3 Hindrance Spirit",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Space Buildings, buying Space Buildings doesn't cost any Generator Power",
            },
			3: {requirementDescription: "10 Hindrance Spirit",
                done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
                effectDescription: "Gain 100% of Enhance Point gain every second",
            },
			4: {requirementDescription: "30 Hindrance Spirit",
                done() {return player[this.layer].best.gte(30)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Time Capsules, Time reset does nothing",
            },
			5: {requirementDescription: "50 Hindrance Spirit",
                done() {return player[this.layer].best.gte(50)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Super-Boosters, Super-Booster reset does nothing",
            },
			6: {requirementDescription: "100 Hindrance Spirit",
                done() {return player[this.layer].best.gte(100)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the first challenge, Autobuy Space Energy, Space reset does nothing",
            },
			7: {requirementDescription: "1000 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1000)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the second challenge.",
            },
			8: {requirementDescription: "1e6 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e6)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the third challenge.",
            },
			9: {requirementDescription: "1e12 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e12)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the fourth challenge.",
            },
			10: {requirementDescription: "1e24 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e24)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the fifth challenge, complete this challenge will unlock a new layer.",
            },
			11: {requirementDescription: "1e48 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e48)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the sixth challenge, and gain 100x more Quirks",
            },
			12: {requirementDescription: "1e96 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e96)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the seventh challenge, complete this challenge will unlock a new layer.",
            },
			13: {requirementDescription: "1e144 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e144)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Super-Generators, Super-Generator reset does nothing",
            },
			14: {requirementDescription: "1e192 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1e192)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the eighth challenge, complete this challenge will unlock a new layer.",
            },
		},
		milestonePopups(){
		 return !(player.m.unlocked || player.ba.unlocked);
		},
		
		
		
		
		challenges: {
            rows: 7,
    		cols: 2,
		    11: {
                name: "Dimensional Hindrance 1",
                completionLimit: 5,
			    challengeDescription() {return "2nd Prestige Dimension does nothing.<br>"+challengeCompletions(this.layer, this.id) +"/5 completions"},
                unlocked() { return player[this.layer].best.gt(100) },
                goal: function(){return [new Decimal("1e12345"),new Decimal("1e15100"),new Decimal("1e57000"),new Decimal("1e125000"),new Decimal("1e194000"),new Decimal(Infinity)][player.h.challenges[11]];},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = player.h.challenges[11];
                    return ret;
                },
                rewardDisplay() { return "Unlock "+formatWhole(this.rewardEffect())+" new tiers of Prestige Dimension." },
                rewardDescription() { return "Each completion of the challenge unlocks a new tier of Prestige Dimension." },
            },
			12: {
                name: "Dimensional Hindrance 2",
                completionLimit: 6,
			    challengeDescription() {return "1st Booster Dimension does nothing.<br>"+challengeCompletions(this.layer, this.id) +"/6 completions"},
                unlocked() { return player[this.layer].best.gt(1000) },
                goal: function(){return [new Decimal("1e13120"),new Decimal("1e16500"),new Decimal("1e750000"),new Decimal("1e1330000"),new Decimal("1e15000000"),new Decimal("e643000000"),new Decimal(Infinity)][player.h.challenges[12]];},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = player.h.challenges[12];
                    return ret;
                },
                rewardDisplay() { return "Unlock "+formatWhole(this.rewardEffect())+" new Booster Upgrades. Unlock "+formatWhole(this.rewardEffect())+" new tiers of Booster Dimension." },
                rewardDescription() { return "Each completion of the challenge unlocks a Booster Upgrade and a new tier of Booster Dimension." },
            },
			21: {
                name: "Dimensional Hindrance 3",
                completionLimit: 6,
			    challengeDescription() {return "1st Generator Dimension does nothing.<br>"+challengeCompletions(this.layer, this.id) +"/6 completions"},
                unlocked() { return player[this.layer].best.gt(1e6) },
                goal: function(){return [new Decimal("1e12750"),new Decimal("1e98000"),new Decimal("1e262000"),new Decimal("1e1530000"),new Decimal("1e16000000"),new Decimal("e290000000"),new Decimal(Infinity)][player.h.challenges[21]];},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = player.h.challenges[21];
                    return ret;
                },
                rewardDisplay() { return "Unlock "+formatWhole(this.rewardEffect())+" new Generator Upgrades. Unlock "+formatWhole(this.rewardEffect())+" new tiers of Generator Dimension." },
                rewardDescription() { return "Each completion of the challenge unlocks a Generator Upgrade and a new tier of Generator Dimension."},
            },
			22: {
                name: "No Prestige",
                completionLimit: 8,
			    challengeDescription() {return "You can't gain any prestige points<br>"+challengeCompletions(this.layer, this.id) +"/8 completions"},
                unlocked() { return player[this.layer].best.gt(1e12) },
                goal: function(){return [new Decimal("1e8500"),new Decimal("1e17400"),new Decimal("1e22400"),new Decimal("1e120000"),new Decimal("1e1100000"),new Decimal("1e1200000"),new Decimal("e13500000"),new Decimal("e475000000"),new Decimal(Infinity)][player.h.challenges[22]];},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = player.h.challenges[22];
                    return ret;
                },
                rewardDisplay() { return "Unlock "+formatWhole(this.rewardEffect())+" new Prestige Upgrades." },
                rewardDescription() { return "Each completion of the challenge unlocks a Prestige Upgrade." },
            },
			31: {
                name: "Skip the Second",
                completionLimit: Infinity,
			    challengeDescription() {return "Boosters and Generators do nothing<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player[this.layer].best.gt(1e24) },
                goal: function(){return Decimal.pow(10,Decimal.pow(1.1,Decimal.sub(player.h.challenges[31],player.h.buyables[51])).mul(6050));},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = Math.pow(player.h.challenges[31],0.5)/100;
                    return ret;
                },
                rewardDisplay() { return "Generator Power gain is multiplied by Booster multiplier^"+format(this.rewardEffect(),4)+" ("+format(tmp.b.effect.pow(this.rewardEffect()))+")" },
                rewardDescription() { return "Unlock a new layer and Hindrance upgrades. Generator Power gain is boosted based on Booster multiplier and challenge completions." },
            },
			32: {
                name: "Dimensional Hindrance 4",
                completionLimit: 4,
			    challengeDescription() {return "1st Time Dimension and 1st Enhance Dimension do nothing.<br>"+challengeCompletions(this.layer, this.id) +"/4 completions"},
                unlocked() { return player[this.layer].best.gt(1e48) },
                goal: function(){return [new Decimal("1e94000"),new Decimal("1e270000"),new Decimal("1e2777777"),new Decimal("1e27300000"),new Decimal(Infinity)][player.h.challenges[32]];},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = player.h.challenges[32];
                    return ret;
                },
                rewardDisplay() { return "Unlock "+formatWhole(this.rewardEffect())+" new Time Upgrades. Unlock "+formatWhole(this.rewardEffect())+" new tiers of Time Dimension. Unlock "+formatWhole(this.rewardEffect())+" new tiers of Enhance Dimension." },
                rewardDescription() { return "Each completion of the challenge unlocks a Time Upgrade, a new tier of Time Dimension and a new tier of Enhance Dimension." },
            },
			41: {
                name: "No Generator Power",
                completionLimit: Infinity,
			    challengeDescription() {return "You can't gain any Generator Power, Hindrance Upgrade 11 is disabled.<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player[this.layer].best.gt(1e96) },
                goal: function(){return Decimal.pow(10,Decimal.pow(1.1,Decimal.sub(player.h.challenges[41],player.h.buyables[51])).mul(45000));},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = Decimal.pow(player.h.challenges[41],player.sg.points);
					if(hasUpgrade("h",31))ret=ret.pow(2);
                    return ret;
                },
                rewardDisplay() { return "Multiply Super-Generator Dimensions by "+format(tmp.h.challenges[41].rewardEffect); },
                rewardDescription() {
					return "Unlock Super-Generators. Super-Generator Dimensions are stronger based on challenge completions and Super-Generators.";
				}
            },
			42: {
                name: "Impaired Nodes",
                completionLimit: 1,
			    challengeDescription() {return "Enhancers, 1st Time Dimension, and Space Buildings do nothing."},
                unlocked() { return player[this.layer].best.gt(1e192) },
                goal: function(){return new Decimal("1e130000");},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription: "Unlock Subspace. Gain 100% of Hindrance Spirit and Quirk gain per second. ",
            },
			51: {
                name: "A Reference to the Automatic Big Crunch",
                completionLimit: 1,
			    challengeDescription() {return "Each Dimension produces the Dimension 2 tiers before it. (Applied to layers P and B)"},
                unlocked() { return hasUpgrade("h",23) },
                goal: function(){return new Decimal("1e4950000");},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription: "Unlock Magic and Balance. Autobuy Super-Booster Dimensions. 1st tier of Dimension is boosted based on 1st tier of Dimension gain per second. (Applied to layers P and B)",
            },
			52: {
                name: "Impossible?",
                completionLimit: Infinity,
			    challengeDescription() {return "You can't start this challenge.<br>"+(challengeCompletions(this.layer, this.id) +" completions")},
                unlocked() { return player.m.unlocked || player.ba.unlocked },
                goal: function(){return new Decimal(Infinity);},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = Decimal.pow(10,Decimal.mul(player.h.challenges[52],Decimal.pow(2,player.h.buyables[51].add(10))));
                    return ret;
                },
                rewardDisplay() { return "Multiply all Time Dimensions by "+format(this.rewardEffect()) },
                rewardDescription() { return "Time Dimensions are stronger based on challenge completions and Hindrance Evolutions." },
            },
			61: {
                name: "Dimensional Hindrance 5",
                completionLimit: 1,
			    challengeDescription() {return "1st Super-Booster Dimension and 1st Super-Generator Dimension do nothing.<br>"+challengeCompletions(this.layer, this.id) +"/1 completions"},
                unlocked() { return hasUpgrade("h",33) },
                goal: function(){return [new Decimal("e76400000"),new Decimal(Infinity)][player.h.challenges[61]];},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = player.h.challenges[61];
                    return ret;
                },
                rewardDisplay() { return "Unlock "+formatWhole(this.rewardEffect())+" new tiers of Super-Booster Dimension. Unlock "+formatWhole(this.rewardEffect())+" new tiers of Super-Generator Dimension." },
                rewardDescription() { return "Each completion of the challenge unlocks a new tier of Super-Booster Dimension and a new tier of Super-Generator Dimension." },
            },
			62: {
                name: "Magical Hindrance",
                completionLimit: Infinity,
			    challengeDescription() {return "Normal Spells do nothing.<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return hasUpgrade("h",33) },
                goal: function(){return Decimal.pow(10,Decimal.pow(1.1,Decimal.sub(player.h.challenges[62],player.h.buyables[51])).mul(2865e5));},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { return "Unlock Phantom Souls. Gain 100% of Magic and Balance Energy gain per second. Spells are stronger based on challenge completions." },
            },
			71: {
                name: "Option C",
                completionLimit: 1,
			    challengeDescription() {return "First 9 challenges are applied at once."},
                unlocked() { return hasUpgrade("h",43) },
                goal: function(){return new Decimal("e223e5");},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { return "Unlock Super-Prestige." },
				countsAs: [11,12,21,22,31,32,41,42,51]
            },
			
        },
	 hotkeys: [
           {key: "h", description: "H: Hindrance reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
		
	   upgrades: {
            rows: 4,
            cols: 3,
			11: {
                title: "Hindrance Upgrade 11",
                description: "Gain Generator Power based on Hindrance Spirit.",
                cost: new Decimal(1e29),
                unlocked() { return player.h.challenges[31]>=1 }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					if(inChallenge("h",41))return new Decimal(0);
                    let base=2;
                    if(hasUpgrade("h",21))base+=3;
                    let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+"/s" }, // Add formatting to the effect
            },
			12: {
                title: "Hindrance Upgrade 12",
                description: "Gain a Super-Booster on Hindrance reset.",
                cost: new Decimal(1e34),
                unlocked() { return player.h.challenges[31]>=1 }, // The upgrade is only visible when this is true
            },
			13: {
                title: "Hindrance Upgrade 13",
                description: "Hindrance Spirit gain is boosted based on Quirks.",
                cost: new Decimal(1e45),
                unlocked() { return player.q.unlocked }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=2;
                    let ret = Decimal.pow(base,Decimal.log10(player.q.points.add(1)).pow(0.9));
					if(hasUpgrade("q",32))ret=ret.pow(tmp.q.buyables[12].effect[1]);
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret.mul(100);
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
                title: "Hindrance Upgrade 21",
                description: "Hindrance Upgrade 11 is better.",
                cost: new Decimal(1e80),
                unlocked() { return player.q.unlocked },
            },
			22: {
                title: "Hindrance Upgrade 22",
                description: "Hindrance Spirit boosts Solarity gain.",
                cost: new Decimal("8.88e888"),
		effect() { 
                    let ret = player.h.points.add(1).log10();
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return player.o.unlocked },
            },
			23: {
                title: "Hindrance Upgrade 23",
                description: "Unlock a new challenge.",
                cost: new Decimal("9.99e999"),
                unlocked() { return player.o.unlocked },
            },
			31: {
                title: "Hindrance Upgrade 31",
                description: "Effect of 'No Generator Power' ^2",
                cost: new Decimal("e6000"),
                unlocked() { return player.m.unlocked },
            },
			32: {
                title: "Hindrance Upgrade 32",
                description: "Unlock the 1st Hindrance Dimension.",
                cost: new Decimal("e6000"),
                unlocked() { return player.m.unlocked },
            },
			33: {
                title: "Hindrance Upgrade 33",
                description: "Unlock 2 new challenges.",
                cost: new Decimal("e6000"),
                unlocked() { return player.m.unlocked },
            },
			41: {
                title: "Hindrance Upgrade 41",
                description: "Unlock the 2nd Hindrance Dimension.",
                cost: new Decimal("e140000"),
                unlocked() { return hasUpgrade("ps",22) },
            },
			42: {
                title: "Hindrance Upgrade 42",
                description: "Hindrance Spirit's effect is squared, and unlock 2 new Time upgrades.",
                cost: new Decimal("e273000"),
                unlocked() { return hasUpgrade("ps",22) },
            },
			43: {
                title: "Hindrance Upgrade 43",
                description: "Unlock a new challenge.",
                cost: new Decimal("e500000"),
                unlocked() { return hasUpgrade("ps",22) },
            },
		},
		
		update(diff){
			if(hasUpgrade("h",11))player.g.power=player.g.power.add(upgradeEffect("h",11).mul(diff)).max(0);
			if(inChallenge("h",52))delete player.h.activeChallenge;
			if(hasUpgrade("h",32))player.h.power=player.h.power.add(tmp.h.buyables[11].effect.mul(diff)).max(0);
			if(hasUpgrade("h",41))player.h.dim1=player.h.dim1.add(tmp.h.buyables[12].effect.mul(diff)).max(0);
			if(player.m.best.gte(1000)){
				if(hasUpgrade("h",32)){
					target=player.h.points.add(1).log(1e10).pow(1/1.35).add(1).floor();
					if(target.gt(player.h.buyables[11])){
						player.h.dim1=player.h.dim1.add(target.sub(player.h.buyables[11]));
						player.h.buyables[11]=target;
					}
				}
				if(hasUpgrade("h",41)){
					target=player.h.points.add(1).log(1e100).pow(1/1.35).add(1).floor();
					if(target.gt(player.h.buyables[12])){
						player.h.dim2=player.h.dim2.add(target.sub(player.h.buyables[12]));
						player.h.buyables[12]=target;
					}
				}
			}
			if(hasUpgrade("h",32)){
				if(player.h.power.gte(layers.h.realC52Goal())){
					player.h.challenges[52]++;
				}
			}
		},
	 passiveGeneration(){
		 if(player.h.challenges[42]>=1)return 1;
		 return 0;
	 },
		doReset(l){
			if(l=="h" || l=="q" || l=="ss" || l=="o")return;
			var b=new Decimal(player.h.best);
			var c=new Decimal(player.h.buyables[51]);
			layerDataReset("h",["upgrades","challenges"]);
			player.h.best=b;
			player.h.buyables[51]=c;
		},
	buyables: {
            rows: 5,
            cols: 2,
            11: {
                title: "1st Hindrance Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e10, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.h.dim1;
					gain=gain.mul(Decimal.pow(2,player.h.buyables[11]));
					if(hasUpgrade("ps",12))gain=gain.mul(upgradeEffect("ps",12));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.h.dim1)+" 1st Hindrance Dimensions. ("+format(player.h.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" Hindrance Power per second.<br>"+
					"Cost for Next 1st Hindrance Dimension: "+format(data.cost)+" Hindrance Spirit";
                },
                unlocked() { return hasUpgrade("h",32) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.h.dim1 = player.h.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Hindrance Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e100, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.h.dim2;
					gain=gain.mul(Decimal.pow(2,player.h.buyables[12]));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.h.dim2)+" 2nd Hindrance Dimensions. ("+format(player.h.buyables[12])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 1st Hindrance Dimensions per second.<br>"+
					"Cost for Next 2nd Hindrance Dimension: "+format(data.cost)+" Hindrance Spirit";
                },
                unlocked() { return hasUpgrade("h",41) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.h.dim2 = player.h.dim2.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            51: {
                title: "Hindrance Evolution", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.mul(x,10).add(10);
                    return cost
                },
                effect() {
					return player.h.buyables[51];
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.h.buyables[51])+" Hindrance Evolutions.<br>"+
					"Cost for Next Hindrance Evolution: "+format(player.h.challenges[52])+"/"+format(data.cost)+" 'Impossible?' completions";
                },
                unlocked() { return player.m.unlocked || player.ba.unlocked }, 
                canAfford() {
                    return new Decimal(player[this.layer].challenges[52]).gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].challenges[52] = 0
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	
	 	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					["display-text",
                        function() {if(hasUpgrade("h",32))return 'You have ' + format(player.h.power) + ' Hindrance Power, reach ' + format(tmp.h.realC52Goal) + ' to complete \'Impossible?\' '+(player.h.challenges[52]?"one more time":"");},
                        {}],
						["display-text",
                        function() {if(player.m.unlocked || player.ba.unlocked)return "Hindrance Evolution will reset 'Impossible?' completions, increase the real goal of 'Impossible?', but it will boost the reward of 'Impossible?' and reduce the goal of repeatable challenges except 'Impossible?'.\nHindrance Evolution will be kept on all resets.";return ""},
                        {}],
						"buyables",
						"milestones",
                   "upgrades",
				   "challenges"],
	realC52Goal(){
		if(player.h.buyables[51].mul(10).add(10).lte(player.h.challenges[52]))return new Decimal(Infinity);
		var ret=new Decimal(player.h.challenges[52]).mul(Decimal.pow(1.97,player.h.buyables[51]));
		ret=ret.div(20).add(1);
		ret=new Decimal(1e36).pow(ret.pow(1.1));
		return ret;
	},
})


addLayer("q", {
    name: "quirks",
    symbol: "Q",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		dim: new Decimal(0),
		energy: new Decimal(0),
		time1: 0
    }},
    color: "#ff2bf2",
    requires: function(){
		return new Decimal("1e7000");
	},
    resource: "quirks",
    baseResource: "generator power", 
    baseAmount() {return player.g.power},
    type: "normal",
    exponent: .001,
	logExponent: 0.965,
    gainMult() {
        mult = new Decimal(1)
		if(player.h.best.gte("1e48"))mult=mult.mul(100);
		if(hasUpgrade("q",13))mult=mult.mul(upgradeEffect("q",13));
		if(hasUpgrade("e",43))mult=mult.mul(tmp.e.buyables[1].effect[6]);
		return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 3,
    hotkeys: [],
    layerShown(){return player.h.challenges[31]>=1 || player.q.unlocked},
	branches: ["e"],
	softcap: new Decimal(Infinity),
	softcapPower: new Decimal(1),
		milestones: {
            0: {requirementDescription: "2 Quirks",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Keep all 3rd row upgrades on reset",
            },
		},
		milestonePopups(){
			
		 return !(player.m.unlocked || player.ba.unlocked);
		},
		
	buyables: {
            rows: 2,
            cols: 2,
            11: {
                title: "Quirk Layer", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x=x.add(tmp[this.layer].buyables[this.id].getFreeLevel);
					let base=new Decimal(3);
					if(hasUpgrade("q",21))base=base.add(upgradeEffect("q",21));
					let eff = x.mul(Decimal.pow(base,x));
					if(hasUpgrade("q",23))eff=eff.mul(upgradeEffect("q",23));
					if(hasUpgrade("ps",11))eff=eff.mul(upgradeEffect("ps",11));
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player[this.layer].buyables[this.id])+"+"+format(data.getFreeLevel)+" Quirk Layers.<br>"+
                    "They are producing "+format(data.effect)+" Quirk Energy per second.<br>"+
					"Cost for next Quirk Layer: " + format(data.cost) + " Quirks";
                },
				getFreeLevel(){
					let gain=new Decimal(0);
					gain=gain.add(tmp.ps.buyables[11].effect);
					return gain;
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
            12: {
                title: "Synergy Improvement", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e50, Decimal.pow(1.15,x.pow(1.25)))
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					eff=new Decimal(0.1).mul(x).add(1);
                    return [eff,eff.pow(0.5)];
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " Quirk Energy\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Currently: Quirk Upgrade 13's effect ^"+format(data.effect[0])+ "\n\
                    Hindrance Upgrade 13's effect ^"+format(data.effect[1]);
                },
                unlocked() { return hasUpgrade("q",32) }, 
                canAfford() {
                    return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].energy = player[this.layer].energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
            21: {
                title: "Energy Improvement", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e100, Decimal.pow(1.15,x.pow(1.25)))
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					eff=new Decimal(0.1).mul(x).add(1);
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " Quirk Energy\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Currently: Quirk Energy effect ^"+format(data.effect);
                },
                unlocked() { return hasUpgrade("q",41) }, 
                canAfford() {
                    return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].energy = player[this.layer].energy.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
        },
		upgrades: {
            rows: 4,
            cols: 3,
			11: {
				title: "Quirk Upgrade 11",
                description: "Quirks & Hindrance Spirit boost All Prestige Dimensions, Prestige Point gain and Enhance Point gain.",
                cost: new Decimal(2),
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
				title: "Quirk Upgrade 12",
                description: "Unlock Quirk Layer.",
                cost: new Decimal(4),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Quirk Upgrade 13",
                description: "Quirk gain is boosted based on Hindrance Spirit.",
                cost: new Decimal(100),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=1.1;
                    let ret = Decimal.pow(base,Decimal.log10(player.h.points.add(1)).pow(0.9));
					if(hasUpgrade("q",32))ret=ret.pow(tmp.q.buyables[12].effect[0]);
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
				title: "Quirk Upgrade 21",
                description: "Quirk Layer's base is increasing over time.",
                cost: new Decimal(1e22),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = new Decimal(player.q.time1);
					if(hasUpgrade("q",22))ret=new Decimal(player.timePlayed);
					ret=ret.mul(tmp.ba.negEff);
                    return ret;
                },
                effectDisplay() { return "+"+format(this.effect()) }, // Add formatting to the effect
            },
			22: {
				title: "Quirk Upgrade 22",
                description: "Quirk Upgrade 21 now based on your total time played this game.",
                cost: new Decimal(1e23),
                unlocked() { return true },
            },
			23: {
				title: "Quirk Upgrade 23",
                description: "Quirk Energy gain is boosted by your quirks.",
                cost: new Decimal(1e36),
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=4;
                    let ret = Decimal.pow(base,Decimal.log10(player.q.points.add(1)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return true },
            },
			31: {
				title: "Quirk Upgrade 31",
                description: "Quirk Energy's effect is squared.",
                cost: new Decimal("1e1500"),
                unlocked() { return player.ba.unlocked },
            },
			32: {
				title: "Quirk Upgrade 32",
                description: "Unlock a quirk buyable.",
                cost: new Decimal("1e4000"),
                unlocked() { return player.ba.unlocked },
            },
			33: {
				title: "Quirk Upgrade 33",
                description: "Autobuy 2nd quirk buyable.",
                cost: new Decimal("1e5000"),
                unlocked() { return player.ba.unlocked },
            },
			41: {
				title: "Quirk Upgrade 41",
                description: "Unlock a quirk buyable and autobuy it.",
                cost: new Decimal("1e113000"),
                unlocked() { return hasUpgrade("ps",13) },
            },
			42: {
				title: "Quirk Upgrade 42",
                description: "Bought Quirk Layers provide free Enhancers.",
                cost: new Decimal("1e157000"),
                unlocked() { return hasUpgrade("ps",13) },
            },
			43: {
				title: "Quirk Upgrade 43",
                description: "Free Quirk Layers provide free Enhancers, and Unlock 4 new Enhance Upgrades.",
                cost: new Decimal("1e218000"),
                unlocked() { return hasUpgrade("ps",13) },
            },
		},
		
		update(diff){
			if(hasUpgrade("q",12))player.q.energy=player.q.energy.add(tmp.q.buyables[11].effect.mul(diff)).max(0);
			if(hasUpgrade("q",21))player.q.time1+=diff;
			if(player.ba.unlocked){
				target=player.q.points.add(1).log(2).pow(1/1.5).add(1).floor();
				if(target.gt(player.q.buyables[11])){
					player.q.buyables[11]=target;
				}
			}
			if(hasUpgrade("q",33)){
				target=player.q.energy.add(1).log(1e50).max(1).log(1.15).pow(1/1.25).add(1).floor();
				if(target.gt(player.q.buyables[12])){
					player.q.buyables[12]=target;
				}
			}
			if(hasUpgrade("q",41)){
				target=player.q.energy.add(1).log(1e100).max(1).log(1.15).pow(1/1.25).add(1).floor();
				if(target.gt(player.q.buyables[21])){
					player.q.buyables[21]=target;
				}
			}
		},
		
	tabFormat: ["main-display",
                    "prestige-button", "resource-display",
					"milestones",
                    ["blank", "5px"],
					"buyables",
                    ["display-text",
                        function() {return 'You have ' + format(player.q.energy) + ' Quirk Energy, which multiplies All Prestige Dimensions, Generator Power and Space gain by '+ format(tmp.q.quirkEff) },
                        {}],
                   "upgrades"],
				   
				   quirkEff(){
					   let x=player.q.energy.add(1);
						if(hasUpgrade("q",31))x=x.pow(2);
						if(hasUpgrade("q",41))x=x.pow(tmp.q.buyables[21].effect);
					   return x;
				   },
	 hotkeys: [
           {key: "q", description: "Q: Quirk reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	 passiveGeneration(){
		 if(player.h.challenges[42]>=1)return 1;
		 return 0;
	 },
		doReset(l){
			if(l=="h" || l=="q" || l=="ss" || l=="o")return;
			var b=new Decimal(player.q.best);
			layerDataReset("q",["upgrades"]);
			player.q.best=b;
		},
})


addLayer("sg", {
    name: "super-generator",
    symbol: "SG",
    position: 4,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		power: new Decimal(0),
		extra: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
    }},
    color: "#409c6e",
    requires: function(){
		return new Decimal(25000);
	},
    resource: "super-generators",
    baseResource: "generators", 
    baseAmount() {return player.g.points},
    type: "static",
	base: 1.039,
    exponent: 1.25,
	roundUpCost: true,
    gainMult() {
        mult = new Decimal(1)
		return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [],
    layerShown(){return player.h.challenges[41]>=1 || player.sg.unlocked},
	branches: ["g"],
	effect() {
			let ret = player.sg.points;
			if(hasUpgrade("sg",11))ret=ret.mul(upgradeEffect("sg",11));
			if(hasUpgrade("sg",12))ret=ret.mul(upgradeEffect("sg",12));
			if(hasUpgrade("ss",13))ret=ret.mul(upgradeEffect("ss",13));
			return ret;
		},
	effectDescription() { // Optional text to describe the effects
           eff = this.effect();
           return "which are generating "+format(eff)+" Super-Generator Power/sec"
       },
	 hotkeys: [
           {key: "G", description: "Shift+G: Super-Generator reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	 
	   	extraeffect() {
			let ret = player.sg.extra;
			if(hasUpgrade("sg",11))ret=ret.mul(upgradeEffect("sg",11));
			if(hasUpgrade("sg",12))ret=ret.mul(upgradeEffect("sg",12));
			if(hasUpgrade("ss",13))ret=ret.mul(upgradeEffect("ss",13));
			return ret;
		},
	 update(diff){
		 player.sg.power = player.sg.power.add(tmp.sg.effect.add(tmp.sg.extraeffect).times(diff)).max(0)
		 if(hasUpgrade("sg",21))player.sg.extra=player.sg.extra.add(tmp.sg.buyables[11].effect.times(diff)).max(0)
		 if(player.h.challenges[61]>=1)player.sg.dim1=player.sg.dim1.add(tmp.sg.buyables[12].effect.times(diff)).max(0)
			 
		 if(player.sg.best.gte(8)){
			 
				if(hasUpgrade("sg",21)){
					target=player.sg.power.add(1).log(2).pow(1/1.35).add(1).floor();
					if(target.gt(player.sg.buyables[11])){
						player.sg.dim1=player.sg.dim1.add(target.sub(player.sg.buyables[11]));
						player.sg.buyables[11]=target;
					}
				}
				if(player.h.challenges[61]>=1){
					target=player.sg.power.add(1).log(100).pow(1/1.35).add(1).floor();
					if(target.gt(player.sg.buyables[12])){
						player.sg.dim2=player.sg.dim2.add(target.sub(player.sg.buyables[12]));
						player.sg.buyables[12]=target;
					}
				}
		 }
	 },
	getSuperGenPowerEffExp() {
		let exp = new Decimal(75);
		if(hasUpgrade("sg",32))exp = exp.mul(4/3);
		return exp;
	},
	getSuperGenPowerEff() {
		let eff = player.sg.power.add(1).pow(tmp.sg.getSuperGenPowerEffExp);
		return eff
	},
		doReset(l){
			if(l=="t" || l=="s" || l=="e" || l=="sb" || l=="sg"){return;}
			if(l=="h" || l=="q" || l=="ss" || l=="o"){
					var b=new Decimal(player.sg.best);
					if(player[l].best.gte(2) || l=="ss")layerDataReset("sg",["upgrades"]);
					else layerDataReset("sg",[]);
					player.sg.best=b;
				return;
			}
			var b=new Decimal(player.sg.best);
			layerDataReset("sg",["upgrades"]);
			player.sg.best=b;
		},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {return 'You have ' + format(player.sg.power) + ' Super-Generator Power, which multiplies All Generator Dimensions by ' + format(tmp.sg.getSuperGenPowerEff)},
                        {}],["display-text",
                        function() {return 'You have ' + format(player.sg.extra) + ' Extra Super-Generators, which are generating '+format(tmp.sg.extraeffect)+' Super-Generator Power/sec'},
                        {}],
						"buyables",
						"milestones",
                   "upgrades"],
		upgrades: {
            rows: 3,
            cols: 3,
			11: {
				title: "Super-Generator Upgrade 11",
                description: "Non-extra Super-Generators boost Super-Generator Power gain.",
                cost: new Decimal(5),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=new Decimal(1.15);
                    let ret = Decimal.pow(base,player.sg.points);
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
						if(hasUpgrade("sg",31))ret=ret.pow(5);
						if(hasUpgrade("sg",33))ret=ret.pow(100);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Super-Generator Upgrade 12",
                description: "Super-Generator Power boost Super-Generator Power gain.",
                cost: new Decimal(6),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=2;
                    let ret = Decimal.pow(base,player.sg.power.add(1).log10().pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Super-Generator Upgrade 13",
                description: "Super-Generators provide effective Super-Boosters.",
                cost: new Decimal(7),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() {
					return player.sg.points.div(100).pow(0.3);
                },
                effectDisplay() { return "+"+format(this.effect())+" Effective SB" }, // Add formatting to the effect
            },
			21: {
				title: "Super-Generator Upgrade 21",
                description: "Unlock 1st Super-Generator Dimension.",
                cost: new Decimal(5),
            },
			22: {
				title: "Super-Generator Upgrade 22",
                description: "Generator Power boost All Super-Generator Dimensions.",
                cost: new Decimal(14),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=1.0005;
                    let ret = Decimal.pow(base,player.g.power.add(1).log10().pow(0.8));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			23: {
				title: "Super-Generator Upgrade 23",
                description: "Non-extra Super-Generators add to the Generator Upgrade 13's base.",
                cost: new Decimal(19),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.sg.points.add(1).log10().pow(0.11).div(7);
                    return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+" to the base" }, // Add formatting to the effect
            },
			31: {
				title: "Super-Generator Upgrade 31",
                description: "Super-Generator Upgrade 11 ^5",
                cost: new Decimal(30),
                unlocked() { return player.ba.unlocked },
            },
			32: {
				title: "Super-Generator Upgrade 32",
                description: "Super-Generator Power's effect ^4/3",
                cost: new Decimal(37),
                unlocked() { return player.ba.unlocked },
            },
			33: {
				title: "Super-Generator Upgrade 33",
                description: "Super-Generator Upgrade 11 ^100",
                cost: new Decimal(63),
                unlocked() { return player.ba.unlocked },
            },
		},
		milestones: {
            0: {requirementDescription: "1 Super-Generators",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Keep Booster/Generator milestones on reset, keep Prestige upgrades on reset, you can buy max Super-Generators",
            },
			1: {requirementDescription: "8 Super-Generators",
                done() {return player[this.layer].best.gte(8)},
                effectDescription: "Automatically buy Super-Generator Dimensions and buying Super-Generator Dimensions costs nothing",
            },
		},
		canBuyMax() {return player[this.layer].best.gte(1)},
		milestonePopups(){
			if(player.h.best.gte(1))return false;
		 return true;
	    },
	 autoPrestige(){
		 return player.h.best.gte(1e144);
	 },resetsNothing(){
		 return player.h.best.gte(1e144);
	 },
	buyables: {
            rows: 4,
            cols: 2,
            11: {
                title: "1st Super-Generator Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(!hasUpgrade("sg",21))return Infinity;
					let cost = Decimal.pow(2, x.pow(1.35))
                    return cost
                },
                effect() {
					if(inChallenge("h",61))return new Decimal(0);
					let gain=player.sg.dim1;
					gain = gain.mul(Decimal.pow(2,player.sg.buyables[11]));
					if(hasUpgrade("e",42))gain=gain.mul(tmp.e.buyables[1].effect[5]);
					if(hasUpgrade("sg",22))gain=gain.mul(upgradeEffect("sg",22));
					gain = gain.mul(layers.h.challenges[41].rewardEffect());
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(!hasUpgrade("sg",21))return "Req: Super-Generator Upgrade 21";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.sg.dim1)+" 1st Super-Generator Dimensions. ("+format(player.sg.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" Extra Super-Generators per second.<br>"+
					"Cost for Next 1st Super-Generator Dimension: "+format(data.cost)+" Super-Generator Power";
                },
                unlocked() { return true }, 
                canAfford() {
                    return player[this.layer].power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.sg.best.lt(16))player[this.layer].power = player[this.layer].power.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player[this.layer].dim1 = player[this.layer].dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Super-Generator Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player.h.challenges[61]<1)return Infinity;
					let cost = Decimal.pow(100, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.sg.dim2;
					gain = gain.mul(Decimal.pow(2,player.sg.buyables[12]));
					if(hasUpgrade("e",42))gain=gain.mul(tmp.e.buyables[1].effect[5]);
					if(hasUpgrade("sg",22))gain=gain.mul(upgradeEffect("sg",22));
					gain = gain.mul(layers.h.challenges[41].rewardEffect());
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player.h.challenges[61]<1)return "Req: Complete H Challenge 11";
					let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.sg.dim2)+" 2nd Super-Generator Dimensions. ("+format(player.sg.buyables[12])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 1st Super-Generator Dimensions per second.<br>"+
					"Cost for Next 2nd Super-Generator Dimension: "+format(data.cost)+" Super-Generator Power";
                },
                unlocked() { return player.m.unlocked || player.ba.unlocked }, 
                canAfford() {
                    return player[this.layer].power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(player.sg.best.lt(16))player[this.layer].power = player[this.layer].power.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player[this.layer].dim2 = player[this.layer].dim2.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	}
})

addLayer("ss", {
    name: "subspace",
    symbol: "SS",
    position: 5,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		subspace: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
    }},
    color: "white",
    requires: function(){
		return new Decimal(300);
	},
    resource: "subspace energy",
    baseResource: "space energy", 
    baseAmount() {return player.s.points},
    type: "static",
	base: 1.06,
    exponent: 1.15,
	roundUpCost: true,
    gainMult() {
        mult = new Decimal(1)
		return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 3,
    hotkeys: [],
    layerShown(){return player.h.challenges[42]>=1 || player.ss.unlocked},
	branches: ["s"],
	effect() {
			let ret = player.ss.points.mul(Decimal.pow(2,player.ss.points));
			if(hasUpgrade("ss",32))ret=ret.pow(5);
			return ret;
		},
	effectDescription() { // Optional text to describe the effects
           eff = this.effect();
           return "which are multiplying all Subspace Dimensions by "+format(eff)
       },
	 hotkeys: [
           {key: "S", description: "Shift+S: Subspace reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	 update(diff){
		 player.ss.subspace=player.ss.subspace.add(tmp.ss.buyables[11].effect.mul(diff));
		 if(hasUpgrade("ss",22))player.ss.dim1=player.ss.dim1.add(tmp.ss.buyables[12].effect.mul(diff));
		 if(hasUpgrade("ss",33))player.ss.dim2=player.ss.dim2.add(tmp.ss.buyables[21].effect.mul(diff));
		 if(player.ba.unlocked){
			target=player.s.dim.add(1).log(1e4).pow(1/1.35).add(1).floor();
			if(target.gt(player.ss.buyables[11])){
				player.ss.dim1=player.ss.dim1.add(target.sub(player.ss.buyables[11]));
				player.ss.buyables[11]=target;
			}
			if(hasUpgrade("ss",22)){
				target=player.s.dim.add(1).log(1e20).pow(1/1.35).add(1).floor();
				if(target.gt(player.ss.buyables[12])){
					player.ss.dim2=player.ss.dim2.add(target.sub(player.ss.buyables[12]));
					player.ss.buyables[12]=target;
				}
			}
			if(hasUpgrade("ss",33)){
				target=player.s.dim.add(1).log(1e100).pow(1/1.35).add(1).floor();
				if(target.gt(player.ss.buyables[21])){
					player.ss.dim3=player.ss.dim3.add(target.sub(player.ss.buyables[21]));
					player.ss.buyables[21]=target;
				}
			}
		}
	 },
		doReset(l){
			if(l=="h" || l=="q" || l=="ss" || l=="o")return;
			var b=new Decimal(player.ss.best);
			layerDataReset("ss",["upgrades"]);
			player.ss.best=b;
		},
		milestones: {
            0: {requirementDescription: "1 Subspace Energy",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Keep all 3rd row upgrades on reset",
            },
            1: {requirementDescription: "10 Subspace Energy",
                done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Subspace Energy",
            },
		},canBuyMax() {return player[this.layer].best.gte(10)},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {return 'You have ' + format(player.ss.subspace) + ' subspace, which are providing ' + format(tmp.ss.getFreeLevel) + ' Free Space Building 5 and 6 levels, and making space buildings ' + format(tmp.ss.getAddStrength.sub(1).mul(100)) +'% stronger'},
                        {}],
						"buyables",
						"milestones",
                   "upgrades"],
		milestonePopups(){
		 return !(player.m.unlocked || player.ba.unlocked);
	    },
		
		getFreeLevel(){
			let ret=Decimal.log10(player.ss.subspace.add(1)).pow(0.7).mul(2.5);
			if(hasUpgrade("ss",11))ret=ret.mul(upgradeEffect("ss",11));
			return ret;
		},
		getAddStrength(){
			let ret=Decimal.log10(player.ss.subspace.add(1)).add(1).log10().mul(0.1);
			if(hasUpgrade("ss",12))ret=ret.mul(upgradeEffect("ss",12));
			ret=ret.add(1);
			return ret;
		},
		upgrades: {
            rows: 3,
            cols: 3,
			11: {
				title: "Subspace Upgrade 11",
                description: "First subspace effect is boosted by your subspace energy.",
                cost: new Decimal(2),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.ss.points.pow(2).div(10).add(1);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Subspace Upgrade 12",
                description: "Second subspace effect is boosted by your subspace energy.",
                cost: new Decimal(6),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.ss.points.add(1).log10().div(3).add(1);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Subspace Upgrade 13",
                description: "Subspace boost Super-Generator Power gain.",
                cost: new Decimal(8),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let base=2;
                    let ret = Decimal.pow(base,player.ss.subspace.add(1).log10().pow(0.9));
					if(hasUpgrade("ss",31))ret=ret.pow(2);
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
				title: "Subspace Upgrade 21",
                description: "Space Building 1 boosts All Generator Dimensions.",
                cost: new Decimal(9),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
			22: {
				title: "Subspace Upgrade 22",
                description: "Unlock the 2nd Subspace Dimension.",
                cost: new Decimal(10),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
			23: {
				title: "Subspace Upgrade 23",
                description: "Unlock 3 new Space Upgrades.",
                cost: new Decimal(11),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
			31: {
				title: "Subspace Upgrade 31",
                description: "Subspace Upgrade 13 is squared.",
                cost: new Decimal(19),
                unlocked() { return player.ba.unlocked }, // The upgrade is only visible when this is true
            },
			32: {
				title: "Subspace Upgrade 32",
                description: "Subspace Energy's effect ^5",
                cost: new Decimal(20),
                unlocked() { return player.ba.unlocked }, // The upgrade is only visible when this is true
            },
			33: {
				title: "Subspace Upgrade 33",
                description: "Unlock the 3rd Subspace Dimension.",
                cost: new Decimal(24),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
		},
	buyables: {
            rows: 4,
            cols: 2,
            11: {
                title: "1st Subspace Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e4, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.ss.dim1;
					gain = gain.mul(Decimal.pow(2,player.ss.buyables[11]));
					gain = gain.mul(tmp.ss.effect);
					if(hasUpgrade("s",43))gain=gain.mul(upgradeEffect("s",43));
					gain = gain.mul(tmp.ba.posEff);
					if(hasUpgrade("m",22))gain = gain.mul(upgradeEffect("m",22));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.ss.dim1)+" 1st Subspace Dimensions. ("+format(player.ss.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" subspace per second.<br>"+
					"Cost for Next 1st Subspace Dimension: "+format(data.cost)+" Space";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return tmp.s.getSpace.min(player.s.dim).gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.s.dim = player.s.dim.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player[this.layer].dim1 = player[this.layer].dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Subspace Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(!hasUpgrade("ss",22))return Infinity;
                    let cost = Decimal.pow(1e20, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.ss.dim2;
					gain = gain.mul(Decimal.pow(2,player.ss.buyables[12]));
					gain = gain.mul(tmp.ss.effect);
					if(hasUpgrade("s",43))gain=gain.mul(upgradeEffect("s",43));
					gain = gain.mul(tmp.ba.posEff);
					if(hasUpgrade("m",22))gain = gain.mul(upgradeEffect("m",22));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(!hasUpgrade("ss",22))return "Req: Subspace Upgrade 22";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.ss.dim2)+" 2nd Subspace Dimensions. ("+format(player.ss.buyables[12])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 1st Subspace Dimensions per second.<br>"+
					"Cost for Next 2nd Subspace Dimension: "+format(data.cost)+" Space";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return tmp.s.getSpace.min(player.s.dim).gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.s.dim = player.s.dim.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player[this.layer].dim2 = player[this.layer].dim2.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "3rd Subspace Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(!hasUpgrade("ss",33))return Infinity;
                    let cost = Decimal.pow(1e100, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.ss.dim3;
					gain = gain.mul(Decimal.pow(2,player.ss.buyables[21]));
					gain = gain.mul(tmp.ss.effect);
					if(hasUpgrade("s",43))gain=gain.mul(upgradeEffect("s",43));
					gain = gain.mul(tmp.ba.posEff);
					if(hasUpgrade("m",22))gain = gain.mul(upgradeEffect("m",22));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
					if(!hasUpgrade("ss",33))return "Req: Subspace Upgrade 33";
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.ss.dim3)+" 3rd Subspace Dimensions. ("+format(player.ss.buyables[21])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 2nd Subspace Dimensions per second.<br>"+
					"Cost for Next 3rd Subspace Dimension: "+format(data.cost)+" Space";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return tmp.s.getSpace.min(player.s.dim).gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.s.dim = player.s.dim.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player[this.layer].dim3 = player[this.layer].dim3.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	 autoPrestige(){
		 return player.ba.best.gte(2);
	 },resetsNothing(){
		 return player.ba.best.gte(2);
	 },
})


addLayer("o", {
    name: "solarity",
    symbol: "O",
    position: -1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		energy: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
    }},
        color: "#ffcd00",
		nodeStyle() {return {
			"background": (player.o.unlocked||canReset("o"))?("radial-gradient(#ffcd00, #ff4300)"):"#bf8f8f" ,
        }},
		componentStyles: {
			"prestige-button"() {return { "background": (canReset("o"))?("radial-gradient(#ffcd00, #ff4300)"):"#bf8f8f" }},
		},
    requires: function(){
		return new Decimal(37-upgradeEffect("o",13)*hasUpgrade("o",13));
	},
    resource: "solarity",
    baseResource: "super-boosters", 
    baseAmount() {return player.sb.points},
    type: "normal",
	getResetGain() {
		if(player.sb.points.lt(37-upgradeEffect("o",13)*hasUpgrade("o",13)))return new Decimal(0);
		let g=player.sb.points.sub(36-upgradeEffect("o",13)*hasUpgrade("o",13));
		let gain=Decimal.pow(tmp.o.gainBase,g).mul(tmp.o.gainMult);
		return gain;
	},
	getNextAt() {
		return player.sb.points.add(1).max(37-upgradeEffect("o",13)*hasUpgrade("o",13));
	},
    gainMult() {
        mult = new Decimal(0.4)
		mult=mult.mul(tmp.o.solEnEff)
		mult=mult.mul(tmp.o.buyables[1].effect)
		if(hasUpgrade("h",22))mult=mult.mul(upgradeEffect("h",22))
		if(hasUpgrade("b",34))mult=mult.mul(upgradeEffect("b",34))
		if(hasUpgrade("t",43))mult=mult.mul(upgradeEffect("t",43))
		if(hasUpgrade("m",11))mult=mult.mul(upgradeEffect("m",11))
		return mult
    },
    gainBase() {
        return new Decimal(5)
    },
    row: 3,
    hotkeys: [],
    layerShown(){return hasUpgrade("sb",23) || player.o.unlocked},
	branches: ["sb","t"],
		milestones: {
            0: {requirementDescription: "2 Solarity",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Keep all 3rd row upgrades on reset",
            },
            1: {requirementDescription: "1e20 Solarity",
                done() {return player[this.layer].best.gte(1e20)}, // Used to determine when to give the milestone
                effectDescription: "Gain 100% of Solarity gain per second",
            },
		},
	 hotkeys: [
           {key: "o", description: "O: Solarity reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	 update(diff){
		 player.o.energy=player.o.energy.add(tmp.o.buyables[11].effect.mul(diff));
		if(hasUpgrade("o",22))player.o.buyables[1]=player.o.buyables[1].add(tmp.o.buyables[1].gain.mul(diff));
		if(hasUpgrade("o",22))player.o.buyables[2]=player.o.buyables[2].add(tmp.o.buyables[2].gain.mul(diff));
		if(hasUpgrade("o",33))player.o.dim1=player.o.dim1.add(tmp.o.buyables[12].effect.mul(diff));
		if(player.m.unlocked){
			target=player.o.points.add(1).log(2).pow(1/1.35).add(1).floor();
			if(target.gt(player.o.buyables[11])){
				player.o.dim1=player.o.dim1.add(target.sub(player.o.buyables[11]));
				player.o.buyables[11]=target;
			}
			if(hasUpgrade("o",33)){
				target=player.o.points.add(1).log(10).pow(1/1.35).add(1).floor();
				if(target.gt(player.o.buyables[12])){
					player.o.dim2=player.o.dim2.add(target.sub(player.o.buyables[12]));
					player.o.buyables[12]=target;
				}
			}
		}
	 },
		doReset(l){
			if(l=="h" || l=="q" || l=="ss" || l=="o")return;
			var b=new Decimal(player.o.best);
			layerDataReset("o",["upgrades"]);
			player.o.best=b;
		},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {return 'You have ' + format(player.o.energy) + ' Solar Energy, which is multiplying Solarity gain and All Solar Dimensions by ' + format(tmp.o.solEnEff) + ', and multiplying All Time Dimensions by ' + format(tmp.o.solEnEff2)},
                        {}],
						"buyables",
						"milestones",
                        ["display-text",function() {return 'Solar Power: '+format(tmp.o.solPow)}],
						["row",[["buyable",1],["buyable",2]]],
                   "upgrades"],
		milestonePopups(){
		 return !(player.m.unlocked || player.ba.unlocked);
	    },
		solEnEff() { return Decimal.pow(5,player.o.energy.plus(1).log10().pow(0.5)) },
		solEnEff2() { return Decimal.pow(1e25,player.o.energy.plus(1).log10().pow(0.9)) },
		solPow(){
		let ret=new Decimal(1);
		if(hasUpgrade("o",21))ret=ret.mul(upgradeEffect("o",21));
		return ret;
	},
		upgrades: {
            rows: 3,
            cols: 3,
			11: {
				title: "Solar Upgrade 11",
                description: "Unlock a solar buyable.",
                cost: new Decimal(200),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Solar Upgrade 12",
                description: "Unlock a solar buyable.",
                cost: new Decimal(5000),
                unlocked() { return true }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Solar Upgrade 13",
                description: "Solarity Requirement is reduced based on Solar Upgrades bought.",
                cost: new Decimal(50000),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() {
					let len = player.o.upgrades.length;
					if(len>36)return 36;
					return len;
				},
				effectDisplay() { return "-"+format(this.effect()) },
            },
			21: {
				title: "Solar Upgrade 21",
                description: "Solar Power is boosted based on Solar Upgrades bought.",
                cost: new Decimal(2e7),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() {
					let len = player.o.upgrades.length;
					return new Decimal(0.1).mul(len).add(1);
				},
				effectDisplay() { return format(this.effect())+"x" },
            },
			22: {
				title: "Solar Upgrade 22",
                description: "Gain 100% of Solar Core and Tachoclinal Plasma gain per second.",
                cost: new Decimal(1e13),
                unlocked() { return true },
            },
			23: {
				title: "Solar Upgrade 23",
                description: "Unlock 3 new Super-Booster Upgrades.",
                cost: new Decimal(1e22),
                unlocked() { return true },
            },
			31: {
				title: "Solar Upgrade 31",
                description: "All Solar Dimensions are stronger based on your Solarity.",
                cost: new Decimal(1e33),
                unlocked() { return player.m.unlocked }, // The upgrade is only visible when this is true
				effect() {
					let base=10
					return Decimal.pow(base,player.o.points.plus(1).log10().pow(0.9))
				},
				effectDisplay() { return format(this.effect())+"x" },
            },
			32: {
				title: "Solar Upgrade 32",
                description: "Tachoclinal Plasma provide effective Super-Boosters.",
                cost: new Decimal(1e43),
                unlocked() { return player.m.unlocked }, // The upgrade is only visible when this is true
				effect() {
					return layers.o.buyables[2].effect();
				},
				effectDisplay() { return "+"+format(this.effect()) },
            },
			33: {
				title: "Solar Upgrade 33",
                description: "Unlock the 2nd Solar Dimension.",
                cost: new Decimal(1e52),
                unlocked() { return player.m.unlocked },
            },
		},
	buyables: {
            rows: 4,
            cols: 2,
			
			1: {
                title: "Solar Cores", // Optional, displayed at the top in a larger font
				gain() { return player.o.points.pow(0.5) },
                effect() {
					let amt=player.o.buyables[1].pow(tmp.o.solPow);
					amt=Decimal.pow(3,amt.plus(1).log10().pow(0.9));
					return amt;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Sacrifice all of your Solarity for "+format(data.gain)+" Solar Cores<br>"+
					"Amount: "+format(player[this.layer].buyables[this.id])+"<br>"+
					"Effect: Multiplies Solarity gain by "+format(tmp[this.layer].buyables[this.id].effect);
                },
                unlocked() { return hasUpgrade("o",11) }, 
                canAfford() {
                    return hasUpgrade("o",11)},
                buy() {
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(tmp[this.layer].buyables[this.id].gain)
					player.o.points = new Decimal(0)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
            },
			2: {
                title: "Tachoclinal Plasma", // Optional, displayed at the top in a larger font
				gain() { return player.o.points.plus(1).pow(0.3).mul(Decimal.pow(3,player.o.energy.plus(1).log10().pow(0.9)).sub(1)); },
                effect() {
					let amt=player.o.buyables[2].pow(tmp.o.solPow);
					amt=amt.plus(1).log10();
					amt=amt.plus(1).log10();
					amt=amt.div(10);
					if(hasUpgrade("sb",32))amt=amt.mul(1.5);
					return amt;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Sacrifice all of your Solarity & Solar Energy for "+format(data.gain)+" Tachoclinal Plasma<br>"+
					"Amount: "+format(player[this.layer].buyables[this.id])+"<br>"+
					"Effect: Super Booster base +"+format(tmp[this.layer].buyables[this.id].effect);
                },
                unlocked() { return hasUpgrade("o",12) }, 
                canAfford() {
                    return hasUpgrade("o",12)},
                buy() {
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(tmp[this.layer].buyables[this.id].gain)
					player.o.points = new Decimal(0)
					player.o.energy = new Decimal(0)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
            },
			
            11: {
                title: "1st Solar Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.o.dim1;
					gain = gain.mul(Decimal.pow(2,player.o.buyables[11]));
					gain = gain.mul(tmp.o.solEnEff);
					if(hasUpgrade("o",31))gain = gain.mul(upgradeEffect("o",31));
					if(hasUpgrade("m",22))gain = gain.mul(upgradeEffect("m",22));
					
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.o.dim1)+" 1st Solar Dimensions. ("+format(player.o.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" Solar Energy per second.<br>"+
					"Cost for Next 1st Solar Dimension: "+format(data.cost)+" Solarity";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.o.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.o.points = player.o.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player[this.layer].dim1 = player[this.layer].dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "2nd Solar Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(10, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.o.dim2;
					gain = gain.mul(Decimal.pow(2,player.o.buyables[12]));
					gain = gain.mul(tmp.o.solEnEff);
					if(hasUpgrade("o",31))gain = gain.mul(upgradeEffect("o",31));
					if(hasUpgrade("m",22))gain = gain.mul(upgradeEffect("m",22));
					
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.o.dim2)+" 2nd Solar Dimensions. ("+format(player.o.buyables[12])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" 1st Solar Dimensions per second.<br>"+
					"Cost for Next 2nd Solar Dimension: "+format(data.cost)+" Solarity";
                },
                unlocked() { return hasUpgrade("o",33) }, 
                canAfford() {
                    return player.o.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.o.points = player.o.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player[this.layer].dim2 = player[this.layer].dim2.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	passiveGeneration(){
		 if(player.o.best.gte(1e20))return 1;
		 return 0;
	 },
})


addLayer("m", {
    name: "magic",
    symbol: "M",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		hexes: new Decimal(0),
		dim1: new Decimal(0),
		dim2: new Decimal(0),
		dim3: new Decimal(0),
		dim4: new Decimal(0),
		dim5: new Decimal(0),
		dim6: new Decimal(0),
		dim7: new Decimal(0),
		dim8: new Decimal(0),
			spellTimes: {
				11: new Decimal(0),
				12: new Decimal(0),
				21: new Decimal(0),
				22: new Decimal(0),
				31: new Decimal(0),
				32: new Decimal(0),
			},
    }},
        color: "#eb34c0",
    requires: new Decimal("1e2100"),
    resource: "magic",
    baseResource: "hindrance spirit", 
    baseAmount() {return player.h.points},
    type: "normal",
    exponent: 0.005,
    logExponent: 0.65,
	softcap: new Decimal(Infinity),
	softcapPower: new Decimal(1),
    gainMult() {
        mult = new Decimal(1)
		return mult
    },
    gainExp() {
       return new Decimal(1);
    },
    row: 4,
    hotkeys: [],
    layerShown(){return player.h.challenges[51] || player.m.unlocked},
	branches: ["o","h","q"],
		milestones: {
            0: {requirementDescription: "1 Magic",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Keep all previous layer upgrades/milestones/challenge completions on reset, Autobuy solar dimensions.",
            },
			1: {requirementDescription: "1000 Magic",
                done() {return player[this.layer].best.gte(1000)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy hindrance dimensions.",
            }
		},
	 hotkeys: [
           {key: "m", description: "M: Magic reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
		doReset(l){
		},
			tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					["display-text","Casting a normal spell costs 1 magic. Effect of normal spells are based on your magic and hexes."],
					"clickables",
					["display-text",function(){return "You have "+format(player.m.hexes)+" hexes"}],
					"buyables",
					"milestones",
                   "upgrades"],
		
		clickables: {
            rows: 3,
            cols: 2,
			11: {
				title: "Spell of Booster Boost",
				unlocked(){return hasUpgrade("m",12)},
				canClick(){return player.m.points.gte(1) && player.m.spellTimes[11].lte(0)},
				onClick(){
					player.m.points=player.m.points.sub(1);
					player.m.hexes=player.m.hexes.add(1);
					player.m.spellTimes[11]=new Decimal(60);
				},
				effect(){
					if(player.m.spellTimes[11].lte(0))return new Decimal(1);
					return layers.m.clickables[11].realEffect();
				},
				realEffect(){
					if(inChallenge("h",62))return new Decimal(1);
					return player.m.points.add(1).log10().add(1).log10().add(1).mul(player.m.hexes.add(1).log10().add(1).log10().add(1)).pow(0.1+Math.pow(player.h.challenges[62],0.5)*0.01).mul(1.05);
				},
				display(){
					return "Multiply Booster Boost effect by "+format(layers.m.clickables[11].realEffect(),4)+"\n\
					Time: "+formatTime(player.m.spellTimes[11].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
			12: {
				title: "Spell of Magical Dimension",
				unlocked(){return hasUpgrade("m",21)},
				canClick(){return player.m.points.gte(1) && player.m.spellTimes[12].lte(0)},
				onClick(){
					player.m.points=player.m.points.sub(1);
					player.m.hexes=player.m.hexes.add(1);
					player.m.spellTimes[12]=new Decimal(60);
				},
				effect(){
					if(player.m.spellTimes[12].lte(0))return new Decimal(1);
					return layers.m.clickables[12].realEffect();
				},
				realEffect(){
					if(inChallenge("h",62))return new Decimal(1);
					return Decimal.pow(2+player.h.challenges[62],player.m.points.add(1).log10().pow(0.9)).mul(Decimal.pow(1.5+player.h.challenges[62],player.m.hexes.add(1).log10().pow(0.9)));
				},
				display(){
					return "Multiply Magical Dimensions by "+format(layers.m.clickables[12].realEffect())+"\n\
					Time: "+formatTime(player.m.spellTimes[12].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
			21: {
				title: "Spell of Enhance Power",
				unlocked(){return hasUpgrade("m",23)},
				canClick(){return player.m.points.gte(1) && player.m.spellTimes[12].lte(0)},
				onClick(){
					player.m.points=player.m.points.sub(1);
					player.m.hexes=player.m.hexes.add(1);
					player.m.spellTimes[21]=new Decimal(60);
				},
				effect(){
					if(player.m.spellTimes[21].lte(0))return new Decimal(1);
					return layers.m.clickables[21].realEffect();
				},
				realEffect(){
					if(inChallenge("h",62))return new Decimal(1);
					return new Decimal(1.05).add(player.m.points.add(1).log10().add(1).log10().div(30)).add(player.m.hexes.add(1).log10().add(1).log10().div(30)).add(0.01*Math.pow(player.h.challenges[62],0.5));
				},
				display(){
					return "Enhance Power's first effect ^"+format(layers.m.clickables[21].realEffect(),4)+"\n\
					Time: "+formatTime(player.m.spellTimes[21].max(0));
				},
                style: {'height':'160px','width':'200px'},
			}
		},
		upgrades: {
            rows: 2,
            cols: 3,
			11: {
				title: "One-Time Spell 11",
                description: "Solarity gain and Super-Booster Boost gain are boosted based on your Magic.",
                cost: new Decimal(1),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { 
					let ret=player.m.points.add(1).log10().add(1).mul(10);
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "One-Time Spell 12",
                description: "Unlock a normal spell.",
                cost: new Decimal(5),
                unlocked() { return true },
            },
			13: {
				title: "One-Time Spell 13",
                description: "Autocast normal spells.",
                cost: new Decimal(200),
                unlocked() { return true },
            },
			21: {
				title: "One-Time Spell 21",
                description: "Unlock a normal spell and 1st Magical Dimension.",
                cost: new Decimal(10000),
                unlocked() { return true },
            },
			22: {
				title: "One-Time Spell 22",
                description: "Solar Dimensions and Subspace Dimensions are boosted based on your Hexes.",
                cost: new Decimal(500000),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect() { 
					let base=50;
					let ret=Decimal.pow(base,player.m.hexes.add(1).log10().pow(0.9));
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			23: {
				title: "One-Time Spell 23",
                description: "Unlock a normal spell.",
                cost: new Decimal(1e13),
                unlocked() { return true },
            },
		},
		update(diff){
			for(var i in player.m.spellTimes){
				player.m.spellTimes[i]=player.m.spellTimes[i].sub(diff);
				if(hasUpgrade("m",13) && player.m.spellTimes[i].lte(0) && player.m.points.gte(1) && tmp.m.clickables[i] && tmp.m.clickables[i].unlocked){
					player.m.points=player.m.points.sub(1);
					player.m.hexes=player.m.hexes.add(1);
					player.m.spellTimes[i]=new Decimal(60);
				}
			}
			if(hasUpgrade("m",21))player.m.hexes=player.m.hexes.add(tmp.m.buyables[11].effect.mul(diff));
		},
		
	buyables: {
            rows: 4,
            cols: 2,
            11: {
                title: "1st Magical Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.m.dim1;
					gain=gain.mul(Decimal.pow(2,player.m.buyables[11]));
					gain=gain.mul(clickableEffect("m",12));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.m.dim1)+" 1st Magical Dimensions. ("+format(player.m.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" hexes per second.<br>"+
					"Cost for Next 1st Magical Dimension: "+format(data.cost)+" magic";
                },
                unlocked() { return hasUpgrade("m",21) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.m.points = player.m.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.m.dim1 = player.m.dim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	
	 passiveGeneration(){
		 if(player.h.challenges[62]>=1)return 1;
		 return 0;
	 },
})


addLayer("ba", {
    name: "balance",
    symbol: "BA",
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		pos: new Decimal(0),
		pdim1: new Decimal(0),
		pdim2: new Decimal(0),
		pdim3: new Decimal(0),
		pdim4: new Decimal(0),
		neg: new Decimal(0),
		ndim1: new Decimal(0),
		ndim2: new Decimal(0),
		ndim3: new Decimal(0),
		ndim4: new Decimal(0),
    }},
        color: "#fced9f",
    requires: new Decimal("1e1240"),
    resource: "balance energy",
    baseResource: "quirks", 
    baseAmount() {return player.q.points},
    type: "normal",
    exponent: 0.005,
    logExponent: 0.65,
	softcap: new Decimal(Infinity),
	softcapPower: new Decimal(1),
    gainMult() {
        mult = new Decimal(1)
		if(hasUpgrade("ba",23))mult=mult.mul(upgradeEffect("ba",23));
		return mult
    },
    gainExp() {
       return new Decimal(1);
    },
    row: 4,
    hotkeys: [],
    layerShown(){return player.h.challenges[51] || player.ba.unlocked},
	branches: ["q","ss"],
		milestones: {
            0: {requirementDescription: "1 Balance Energy",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Keep all previous layer upgrades/milestones/challenge completions on reset, Autobuy quirk layers and subspace dimensions, Unlock 1st Positive Dimension.",
            },
			1: {requirementDescription: "2 Balance Energy",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Subspace Energy, Subspace Energy resets nothing",
            },
			2: {requirementDescription: "5 Balance Energy",
                done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
                effectDescription: "Unlock 1st Negative Dimension.",
            }
		},
	 hotkeys: [
           {key: "a", description: "A: Balance reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
		doReset(l){
		},
			tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					["display-text",function(){return "You have "+format(player.ba.pos)+" positivity, which multiplies all subspace dimensions by "+format(tmp.ba.posEff)}],
					["display-text",function(){return "You have "+format(player.ba.neg)+" negativity, which multiplies Quirk Upgrade 21's effect by "+format(tmp.ba.negEff)}],
					"buyables",
					"milestones",
                   "upgrades"],
	buyables: {
            rows: 4,
            cols: 2,
            11: {
                title: "1st Positive Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.ba.pdim1;
					gain=gain.mul(Decimal.pow(2,player.ba.buyables[11]));
					if(hasUpgrade("ba",11))gain=gain.mul(upgradeEffect("ba",11));
					if(hasUpgrade("ba",21))gain=gain.mul(upgradeEffect("ba",21));
					if(hasUpgrade("ba",22))gain=gain.mul(upgradeEffect("ba",22));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.ba.pdim1)+" 1st Positive Dimensions. ("+format(player.ba.buyables[11])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" positivity per second.<br>"+
					"Cost for Next 1st Positive Dimension: "+format(data.cost)+" balance energy";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.ba.points = player.ba.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.ba.pdim1 = player.ba.pdim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "1st Negative Dimension", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(5, x.pow(1.35))
                    return cost
                },
                effect() {
					let gain=player.ba.ndim1;
					gain=gain.mul(Decimal.pow(2,player.ba.buyables[12]));
					if(hasUpgrade("ba",12))gain=gain.mul(upgradeEffect("ba",12));
					if(hasUpgrade("ba",13))gain=gain.mul(upgradeEffect("ba",13));
					if(hasUpgrade("ba",22))gain=gain.mul(upgradeEffect("ba",22));
					return gain;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.ba.ndim1)+" 1st Negative Dimensions. ("+format(player.ba.buyables[12])+" bought)<br>"+
                    "They are producing "+format(data.effect)+" negativity per second.<br>"+
					"Cost for Next 1st Negative Dimension: "+format(data.cost)+" balance energy";
                },
                unlocked() { return player.ba.best.gte(5) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.ba.points = player.ba.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
					player.ba.ndim1 = player.ba.ndim1.add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	update(diff){
		 player.ba.pos=player.ba.pos.add(tmp.ba.buyables[11].effect.mul(diff));
		 if(player.ba.best.gte(5))player.ba.neg=player.ba.neg.add(tmp.ba.buyables[12].effect.mul(diff));
	},
	posEff(){
		return player.ba.pos.add(1).pow(3);
	},
	negEff(){
		return player.ba.neg.add(1).log10().add(1).pow(0.5);
	},
		upgrades: {
            rows: 2,
            cols: 3,
			11: {
				title: "Balance Upgrade 11",
                description: "Positivity boosts positivity gain.",
                cost: new Decimal(1e3),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect(){ 
					let base=2;
					let ret = Decimal.pow(base,Decimal.log10(player.ba.pos.add(1)).pow(0.9))
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Balance Upgrade 12",
                description: "Negativity boosts negativity gain.",
                cost: new Decimal(1e5),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect(){ 
					let base=2;
					let ret = Decimal.pow(base,Decimal.log10(player.ba.neg.add(1)).pow(0.9))
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Balance Upgrade 13",
                description: "Positivity boosts negativity gain.",
                cost: new Decimal(1e6),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect(){ 
					let base=2;
					let ret = Decimal.pow(base,Decimal.log10(player.ba.pos.add(1)).pow(0.9))
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
				title: "Balance Upgrade 21",
                description: "Negativity boosts positivity gain.",
                cost: new Decimal(1e7),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect(){ 
					let base=2;
					let ret = Decimal.pow(base,Decimal.log10(player.ba.neg.add(1)).pow(0.9))
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			22: {
				title: "Balance Upgrade 22",
                description: "Balance Energy boosts positivity gain and negativity gain.",
                cost: new Decimal(1e8),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect(){ 
					let base=2;
					let ret = Decimal.pow(base,Decimal.log10(player.ba.points.add(1)).pow(0.9))
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			23: {
				title: "Balance Upgrade 23",
                description: "Positivity boosts Balance Energy gain.",
                cost: new Decimal(1e10),
                unlocked() { return true }, // The upgrade is only visible when this is true
				effect(){ 
					let base=1.5;
					let ret = Decimal.pow(base,Decimal.log10(player.ba.pos.add(1)).pow(0.9))
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
		},
	 passiveGeneration(){
		 if(player.h.challenges[62]>=1)return 1;
		 return 0;
	 },
})


addLayer("ps", {
    name: "phantom souls",
    symbol: "PS",
    position: 1,
	startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
        color: "#b38fbf",
    requires: new Decimal("1e45000"),
    resource: "phantom souls",
    baseResource: "quirk energy", 
    baseAmount() {return player.q.energy},
    type: "static",
	base: new Decimal("1e5000"),
	exponent: 1.5,
	row: 4,
	layerShown(){return player.h.challenges[62]>=1},
	branches: ["q", ["h", 2]],
		milestones: {
            0: {requirementDescription: "1 Phantom Soul",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Keep all previous layer upgrades/milestones/challenge completions on reset, unlock Damned Souls.",
            },
			1: {requirementDescription: "2 Phantom Souls",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Unlock Wraiths.",
            },
			2: {requirementDescription: "4 Phantom Souls",
                done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
                effectDescription: "Unlock Phantom Soul Upgrades.",
            },
			3: {requirementDescription: "6 Phantom Souls",
                done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Phantom Souls.",
            }
		},
	 hotkeys: [
           {key: "P", description: "Shift+P: Phantom Soul reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
     ],
	buyables: {
            rows: 4,
            cols: 2,
            11: {
                title: "Damned Souls", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(10, x.pow(Decimal.pow(0.5,player.ps.points).mul(2).add(2)));
                    return cost;
                },
                effect() {
					let x=player[this.layer].buyables[this.id].mul(tmp[this.layer].buyables[12].effect.add(14));
					return x;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player[this.layer].buyables[this.id])+" Damned Souls.<br>"+
					"They are providing "+format(data.effect)+" Quirk Layers.<br>"+
					"Cost for Next Damned Soul: "+format(data.cost)+" hindrance spirit";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.h.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].buyables[this.id]=player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "Wraiths", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = new Decimal(30).mul(x.add(1).pow(1.5)).add(40);
					if(hasUpgrade("ps",23))cost=cost.div(upgradeEffect("ps",23));
                    return cost;
                },
                effect() {
					let x=player[this.layer].buyables[this.id].pow(0.61).mul(8);
					if(hasUpgrade("ps",21))x=x.mul(upgradeEffect("ps",21));
					return x;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player[this.layer].buyables[this.id])+" Wraiths.<br>"+
					"They are adding "+format(data.effect)+" Quirk Layers per Damned Soul.<br>"+
					"Requirement for Next Wraith: "+format(data.cost)+" Damned Souls";
                },
                unlocked() { return player[this.layer].best.gte(2) }, 
                canAfford() {
                    return player[this.layer].buyables[11].gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].buyables[this.id]=player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
		upgrades: {
            rows: 2,
            cols: 3,
			11: {
				title: "Phantom Soul Upgrade 11",
                description: "Quirk Energy boost its production.",
                cost: new Decimal(4),
                unlocked() { return player[this.layer].best.gte(4) }, // The upgrade is only visible when this is true
				effect(){ 
					let base=1.81;
					let ret = Decimal.pow(base,Decimal.log10(player.q.energy.add(1)).pow(0.9))
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Phantom Soul Upgrade 12",
                description: "Hindrance Power gain is boosted by your Quirk Energy.",
                cost: new Decimal(6),
                unlocked() { return player[this.layer].best.gte(4) }, // The upgrade is only visible when this is true
				effect(){ 
					let base=1.003;
					let ret = Decimal.pow(base,Decimal.log10(player.q.energy.add(1)).pow(0.9))
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Phantom Soul Upgrade 13",
                description: "Unlock 3 new Quirk Upgrades.",
                cost: new Decimal(6),
                unlocked() { return player[this.layer].best.gte(4) },
            },
			21: {
				title: "Phantom Soul Upgrade 21",
                description: "Boost Wraith Effect by Phantom Souls.",
                cost: new Decimal(9),
                unlocked() { return player[this.layer].best.gte(4) }, // The upgrade is only visible when this is true
				effect(){ 
					let ret = Decimal.pow(player.ps.points,0.2);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			22: {
				title: "Phantom Soul Upgrade 22",
                description: "Unlock 3 new Hindrance Upgrades.",
                cost: new Decimal(10),
                unlocked() { return player[this.layer].best.gte(4) },
            },
			23: {
				title: "Phantom Soul Upgrade 23",
                description: "Wraiths are cheaper based on Phantom Souls.",
                cost: new Decimal(14),
                unlocked() { return player[this.layer].best.gte(4) }, // The upgrade is only visible when this is true
				effect(){ 
					let ret = Decimal.pow(1.025,Decimal.pow(player.ps.points,0.5));
					return ret;
				},
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
		},
		canBuyMax(){return player.ps.best.gte(6);}
})