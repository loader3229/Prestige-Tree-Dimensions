const SOFTCAPS = {
	p21: {
		title: "Prestige Upgrade 21",
		start() { 
					let softcap=12;
					if(hasUpgrade("p",52))softcap+=3;
					if(hasUpgrade("sp",11))softcap+=Infinity;
					return softcap;
		},
		display() { return hasUpgrade("p", 21) && player.p.upgrades.length >= this.start() },
		info() { return "Starts at "+format(this.start())+" upgrades" },
	},
	e22: {
		title: "Enhance Upgrade 22",
		start() { 
					let softcap=new Decimal(135);
					if(hasUpgrade("e",34))softcap=softcap.add(upgradeEffect("e",34));
					return softcap;
		},
		display() { return hasUpgrade("e", 22) && upgradeEffect("e", 22).gte(this.start()) },
		info() { 
			if(player.inf.points.gte(4))return "Starts at "+format(this.start())+"x, brought to the 3.7th root"
			if(player.inf.points.gte(2))return "Starts at "+format(this.start())+"x, brought to the 3.5th root"
			if(player.inf.points.gte(1))return "Starts at "+format(this.start())+"x, cube rooted"
			return "Starts at "+format(this.start())+"x, square rooted" 
		},
	},
	e22b: {
		title: "Enhance Upgrade 22",
		start() { 
					let softcap=new Decimal(550);
				    if(player.inf.points.gte(3))softcap=new Decimal(350);
					if(hasUpgrade("e",34))softcap=softcap.add(upgradeEffect("e",34));
					return softcap;
		},
		display() { return hasUpgrade("e", 22) && upgradeEffect("e", 22).gte(this.start()) },
		info() { 
			if(player.inf.points.gte(4))return "Starts at "+format(this.start())+"x, brought to the 3.7th root"
			if(player.inf.points.gte(2))return "Starts at "+format(this.start())+"x, brought to the 3.5th root"
			if(player.inf.points.gte(1))return "Starts at "+format(this.start())+"x, cube rooted"
			return "Starts at "+format(this.start())+"x, square rooted"
		},
	},
	gpe: {
		title: "Generator Power Effect",
		start() { 
					let softcap=new Decimal("e125e6");
					if(player.inf.points.gte(2))softcap=new Decimal("e1e6");
					return softcap;
		},
		display() { return player.g.unlocked && player.g.power.gte(this.start()) },
		info() { return "Starts at "+format(this.start())+" Generator Power, exponent brought to the 1.2th root" },
	},
	e34: {
		title: "Enhance Upgrade 34",
		start() { 
					let softcap=new Decimal(900).add(tmp.n.dustEffs.purple);
					return softcap;
		},
		display() { return hasUpgrade("e", 34) && upgradeEffect("e", 34).gte(this.start()) && player.inf.points.gte(3) },
		info() { 
			return "Starts at "+format(this.start())+"x, brought to the 1.5th root"
		},
	},
}
addLayer("sc", {
	startData() { return {unlocked: true}},
	color: "#e6ff69",
	symbol: "SC",
	row: "side",
	position: 0,
	layerShown() { return true },
	tooltip: "Softcaps",
	tabFormat: [
		"blank", "blank", "blank",
		["raw-html", function() {
			let html = ""
			for (let id in SOFTCAPS) {
				let data = SOFTCAPS[id];
				if (data.display) if (data.display()) {
					html += "<div><h3>"+data.title+"</h3><br>"+data.info();
					html += "</div><br><br>";
				}
			}
			return html;
		}],
	],
})