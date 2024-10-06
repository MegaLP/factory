const hf = require('helperfunctions');
const conf = require('presistentStorageHelper');

const factory = extend(UnitAssembler, "historical-tank-factory", {});

function calcCosts(requirements) {
	let out = "[royal]Costs:";
	
	requirements.forEach((e) => {
		out += "\n"+e.item.localizedName+" "+e.amount;
	});
	out += "\n";
	return out;
}

function calcStats(object) {
	let out = "[royal]Stats:";
	
	out += "\nHealth: "+object._health;
	out += "\nArmor: "+object._armorInternal;
	out += "\nTurret Rotation Speed: "+object._turretRotationSpeed;
	out += "\nTurret Reload Speed: "+object._turretReloadSpeed;
	out += "\nEngine Power: "+object._enginePowerInternal;
	if (object._weigth > object._enginePowerInternal) {
		out += "[red]\nWeight: "+Math.round(object._weigth)+" MAX("+object._enginePowerInternal+")";
	} else {
		out += "\nWeight: "+Math.round(object._weigth);
	}
	out += "[royal]\nMobility: "+Math.round(object._mobility);
	out += "\nFire Power: "+object._firePower;
	
	return out;
}

function addBuildTypeToNewAssembler(newBlock) {
	newBlock.buildType = () => {return new extend(UnitAssembler.UnitAssemblerBuild, newBlock, {
		
		_basedOffBuild: "tiger",
		
		// Modifiable
		_health: 100,
		_armor: 100,
		_turretRotationSpeed: 100,
		_turretReloadSpeed: 100,
		_enginePower: 100,
		_ammunition: "ap",
		_axialmg: false,
		_boardmg: true,
		_commandermg: false,
		
		// Not Modifiable
		_weigth: 100,
		_mobility: 100,
		_firePower: 100,
		_armorInternal: 100,
		_enginePowerInternal: 100,
		
		update(){
			this.super$update();
		},
		
		addMaterialToBuild(name, amount, relativeAddition) {
			
			let object = this.plan().requirements.find((e) => e.item == Vars.content.block(name));
			if (object === "undefined" || object == null) {
				object = this.plan().requirements.add(PayloadStack(Vars.content.block(name), amount));
			} else if (object.amount === "undefined" || object.amount == null){} else {
				if (relativeAddition) {
					object.amount += amount;
				} else {
					object.amount = amount;
				}
				if (object.amount <= 0) {
					this.removeMaterialToBuild(name);
				}
			}
			return object;
		},
		
		removeMaterialToBuild(name) {
			
			let object = this.plan().requirements.find((e) => e.item == Vars.content.block(name));
			if (object === "undefined" || object == null) {} else {
				for (let i = 0; i < this.plan().requirements.size; i++) {
					if (this.plan().requirements.get(i).item.toString() == name) {
						this.plan().requirements.remove(i);
						break;
					}
				}
			}
		},
		
		recalcBuildingCosts() {
			switch (this._basedOffBuild) {
				case "factory-tiger":
					let surgeWall = this.plan().requirements.find((e) => e.item == Vars.content.block("surge-wall-large"));
					let darkMatterWall = this.plan().requirements.find((e) => e.item == Vars.content.block("factory-dark-matter-wall-large"));
					let shotgun = this.plan().requirements.find((e) => e.item == Vars.content.block("factory-shotgun"));
					let sniperTurrets = this.plan().requirements.find((e) => e.item == Vars.content.block("factory-sniper-turret"));
					let energyBlaster = this.plan().requirements.find((e) => e.item == Vars.content.block("factory-energy-blaster"));
					
					this._mobility = 100;
					this._weigth = 100;
					this._firePower = 100;
					this._armorInternal = this._armor;
					this._enginePowerInternal = this._enginePower;
					
					if (this._health > 100) {
						surgeWall.amount = 14 + ((this._health-100)/2);
						this._weigth += ((this._health-100)/2)*2;
					} else if (this._health == 100) {
						surgeWall.amount = 14;
					} else {
						surgeWall.amount = 14 + Math.round((this._health-100)/10);
						this._weigth += ((this._health-100)/2);
					}
					
					if (this._armor > 100) {
						 this.addMaterialToBuild("tungsten-wall-large", ((this._armor-100)/2), false);
						 this._weigth += ((this._armor-100)/2)*2.6;
					} else if (this._armor == 100) {
						this.removeMaterialToBuild("tungsten-wall-large");
					} else {
						this.removeMaterialToBuild("tungsten-wall-large");
						this._mobility -= ((this._armor-100)/2)*0.5;
						this._weigth += ((this._armor-100)/2);
					}
					
					if (this._turretRotationSpeed > 100) {
						this.addMaterialToBuild("battery-large", ((this._turretRotationSpeed-100)/2), false);
						this._weigth += ((this._turretRotationSpeed-100)/2)*0.2;
					} else if (this._turretRotationSpeed == 100) {
						this.removeMaterialToBuild("battery-large");
					} else {
						this.removeMaterialToBuild("battery-large");
						this._armorInternal -= ((this._turretRotationSpeed-100)/2)*0.5;
						this._weigth += ((this._turretRotationSpeed-100)/2)*0.5;
					}
					
					if (this._turretReloadSpeed > 100) {
						sniperTurrets.amount = 5 + ((this._turretReloadSpeed-100)/2);
						this._weigth += ((this._turretReloadSpeed-100)/2)*0.5;
					} else if (this._turretReloadSpeed == 100) {
						sniperTurrets.amount = 5;
					} else {
						sniperTurrets.amount = 5;
						this._firePower -= ((this._turretReloadSpeed-100)/10)*2;
						this._weigth += ((this._turretReloadSpeed-100)/2)*0.2;
						if (this._turretReloadSpeed <= 50) {
							sniperTurrets.amount = 4;
						}
					}
					
					if (this._enginePower > 100) {
						this.removeMaterialToBuild("phase-heater");
						this.addMaterialToBuild("differential-generator", ((this._enginePower-100)/5), false);
						this._weigth += ((this._enginePower-100)/5);
						this._enginePowerInternal += ((this._enginePower-100)/5)*5;
						if (this._enginePower > 150) {
							this.addMaterialToBuild("differential-generator", 10+((this._enginePower-150)/2), false);
							this.addMaterialToBuild("phase-heater", ((this._enginePower-150)/5), false);
							this._enginePowerInternal += ((this._enginePower-100)/5)*5;
						}
					} else if (this._enginePower == 100) {
						this.removeMaterialToBuild("differential-generator");
						this.removeMaterialToBuild("phase-heater");
					}
					
					if (this._boardmg) {
						this.addMaterialToBuild("factory-shotgun", 1, false);
					} else {
						this.removeMaterialToBuild("factory-shotgun");
					}
					
					if (this._axialmg) {
						this.addMaterialToBuild("factory-crystal-weapon", 1, false);
					} else {
						this.removeMaterialToBuild("factory-crystal-weapon");
					}
					
					if (this._commandermg) {
						this.addMaterialToBuild("factory-crystal-air", 1, false);
					} else {
						this.removeMaterialToBuild("factory-crystal-air");
					}
					
					switch (this._ammunition) {
						case "ap":
							this.removeMaterialToBuild("shock-mine");
						break;
						case "apcr":
							this.addMaterialToBuild("tungsten-wall-large", 20, true);
							this.removeMaterialToBuild("shock-mine");
						break;
						case "he":
							this.addMaterialToBuild("shock-mine", 100, false);
						break;
					}
					
				break;
			}
			
			this._mobility = this._mobility*((this._mobility/this._weigth)/2);
		},
		
		createVariant(){
			this.resetVariant();
			
			let config = conf.getConfig();
			if (config == null || config === "undefined") {
				config = {};
			}
			if (config.variants == null || config.variants === "undefined" || config.variants.constructor.name != "Array") {
				config.variants = [];
			}
			
			let newUnit;
			let variantName = config.variants.find((key) => {
				if (key.type == this._basedOffBuild && 
					key.axialmg == this._axialmg && 
					key.boardmg == this._boardmg && 
					key.commandermg == this._commandermg && 
					key.turretRotationSpeed == this._turretRotationSpeed && 
					key.turretReloadSpeed == this._turretReloadSpeed && 
					key.armor == this._armor &&
					Math.round(key.mobility) == Math.round(this._mobility) &&
					Math.round(key.weigth) == Math.round(this._weigth) &&
					key.firePower == this._firePower &&
					key.ammunition == this._ammunition &&
					key.health == this._health) {
					return key;
				}
			});
			
			if (variantName === "undefined" || variantName == null) {
				newUnit = hf.cloneTankUnit(this.plan().unit, null, false);
				
				hf.setMainBullet(newUnit, this._basedOffBuild, this._ammunition);
				hf.addVariantMGs(newUnit, this._basedOffBuild, this._boardmg, this._axialmg, this._commandermg, this._turretReloadSpeed, this._turretRotationSpeed, this._firePower);
				hf.updateUnitVariantStats(newUnit, this._armor, this._health, this._mobility, this._turretReloadSpeed, this._turretRotationSpeed, this._firePower);
				
				newUnit.init();
				newUnit.load();
				newUnit.loadIcon();
				
				config.variants.push({
					"type": this._basedOffBuild,
					"axialmg": this._axialmg,
					"boardmg": this._boardmg,
					"commandermg": this._commandermg,
					"name": newUnit.name,
					"armor": this._armor,
					"health": this._health,
					"mobility": this._mobility,
					"turretRotationSpeed": this._turretRotationSpeed,
					"turretReloadSpeed": this._turretReloadSpeed,
					"firePower": this._firePower,
					"weigth": this._weigth,
					"ammunition": this._ammunition
				});
				
				conf.setConfig(config);
				conf.saveConfig();
			} else {
				newUnit = Vars.content.unit(variantName.name);
			}
			
			this.plan().unit = newUnit;
		},
		
		resetVariant(){
			this._basedOffBuild = this.plan().unit.name;
			if (this._basedOffBuild.search("variant") != -1) {
				this._basedOffBuild = this._basedOffBuild.substring(0,this._basedOffBuild.search("variant")-1);
			}
			this.plan().unit = Vars.content.unit(this._basedOffBuild);
		},
		
		buildConfiguration(table) {
			table.button(new TextureRegionDrawable(Core.atlas.find("factory-configure")), Styles.defaulti, 30, run(() => {
				let stepSize = 2;
				this._basedOffBuild = this.plan().unit.name;
				if (this._basedOffBuild.search("variant") != -1) {
					this._basedOffBuild = this._basedOffBuild.substring(0,this._basedOffBuild.search("variant")-1);
				}
				const dialog = new BaseDialog("[red]Modify Chassis?");
				dialog.setFillParent(false);
				const statsText = new Label(calcCosts(this.plan().requirements));
				const hiddenStatsText = new Label(calcStats(this.plan().requirements));
				const thisObject = this;
				const healthSliderText = new Label("[green]Health: "+this._health+"%");
				const armorSliderText = new Label("[yellow]Armor: "+this._armor+"%");
				const turretRotationSpeedSliderText = new Label("[purple]Turret Rotation Speed: "+this._turretRotationSpeed+"%");
				const turretReloadSpeedSliderText = new Label("[red]Turret Reload Speed: "+this._turretReloadSpeed+"%");
				const enginePowerSliderText = new Label("[orange]Engine Power: "+this._enginePower+"%");
				
				let statsTable = Core.scene.table();
				statsTable.add(statsText);
				statsTable.row();
				statsTable.add(hiddenStatsText);
				statsTable.align(Align.left);
				statsTable.marginRight(100);
				statsTable.right();
				
				for (let i = 0; i < statsTable.getCells().size; i++) {
					statsTable.getCells().get(i).left();
				}
				
				let mgSelectionTable = Core.scene.table();
				mgSelectionTable.align(Align.right);
				mgSelectionTable.marginLeft(200);
				mgSelectionTable.left();
				let boardmgCheck = mgSelectionTable.check("Board-mg", this._boardmg, new Boolc({get: function (value){
					thisObject._boardmg = value;
					thisObject.recalcBuildingCosts();
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				mgSelectionTable.row();
				let axialmgCheck = mgSelectionTable.check("Axial-mg", this._axialmg, new Boolc({get: function (value){
					thisObject._axialmg = value;
					thisObject.recalcBuildingCosts();
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				mgSelectionTable.row();
				let commandermgCheck = mgSelectionTable.check("Commander-mg", this._commandermg, new Boolc({get: function (value){
					thisObject._commandermg = value;
					thisObject.recalcBuildingCosts();
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				
				for (let i = 0; i < mgSelectionTable.getCells().size; i++) {
					mgSelectionTable.getCells().get(i).left();
				}
				
				let ammunitionSelectionTableElements = [];
				function resolveCheck(finalElementText) {
					ammunitionSelectionTableElements.forEach((key) => {
						if (key.getText() == finalElementText) {
							key.setChecked(true);
						} else {
							key.setChecked(false);
						}
					});
				}
				let ammunitionSelectionTable = Core.scene.table();
				ammunitionSelectionTable.align(Align.right);
				ammunitionSelectionTable.marginLeft(500);
				ammunitionSelectionTable.left();
				let ap = ammunitionSelectionTable.check("AP Ammunition", true, new Boolc({get: function (value){
					thisObject._ammunition = "ap";
					thisObject.recalcBuildingCosts();
					resolveCheck("AP Ammunition");
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				ammunitionSelectionTable.row();
				let apcr = ammunitionSelectionTable.check("APCR Ammunition", false, new Boolc({get: function (value){
					thisObject._ammunition = "apcr";
					thisObject.recalcBuildingCosts();
					resolveCheck("APCR Ammunition");
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				ammunitionSelectionTable.row();
				let he = ammunitionSelectionTable.check("HE Ammunition", false, new Boolc({get: function (value){
					thisObject._ammunition = "he";
					thisObject.recalcBuildingCosts();
					resolveCheck("HE Ammunition");
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				
				for (let i = 0; i < ammunitionSelectionTable.getCells().size; i++) {
					ammunitionSelectionTable.getCells().get(i).left();
				}
				
				ammunitionSelectionTableElements.push(ap);
				ammunitionSelectionTableElements.push(apcr);
				ammunitionSelectionTableElements.push(he);
				
				dialog.cont.add(healthSliderText);
				dialog.cont.row();
				let healthSlider = dialog.cont.slider(50,200,stepSize,this._health,new Floatc({get: function (value){
					healthSliderText.setText("[green]Health: "+value+"%");
					thisObject._health = parseInt(value);
					thisObject.recalcBuildingCosts();
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				
				dialog.cont.row();
				dialog.cont.add(armorSliderText);
				dialog.cont.row();
				let armorSlider = dialog.cont.slider(10,350,stepSize,this._armor,new Floatc({get: function (value){
					armorSliderText.setText("[yellow]Armor: "+value+"%");
					thisObject._armor = parseInt(value);
					thisObject.recalcBuildingCosts();
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				
				dialog.cont.row();
				dialog.cont.add(turretRotationSpeedSliderText);
				dialog.cont.row();
				let turretRotationSpeedSlider = dialog.cont.slider(50,150,stepSize,this._turretRotationSpeed,new Floatc({get: function (value){
					turretRotationSpeedSliderText.setText("[purple]Turret Rotation Speed: "+value+"%");
					thisObject._turretRotationSpeed = parseInt(value);
					thisObject.recalcBuildingCosts();
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				
				dialog.cont.row();
				dialog.cont.add(turretReloadSpeedSliderText);
				dialog.cont.row();
				let turretReloadSpeedSlider = dialog.cont.slider(10,300,stepSize,this._turretReloadSpeed,new Floatc({get: function (value){
					turretReloadSpeedSliderText.setText("[red]Turret Reload Speed: "+value+"%");
					thisObject._turretReloadSpeed = parseInt(value);
					thisObject.recalcBuildingCosts();
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				
				dialog.cont.row();
				dialog.cont.add(enginePowerSliderText);
				dialog.cont.row();
				let enginePowerSlider = dialog.cont.slider(100,200,5,this._enginePower,new Floatc({get: function (value){
					enginePowerSliderText.setText("[orange]Engine Power: "+value+"%");
					thisObject._enginePower = parseInt(value);
					thisObject.recalcBuildingCosts();
					statsText.setText(calcCosts(thisObject.plan().requirements));
					hiddenStatsText.setText(calcStats(thisObject));
				}})).get();
				
				dialog.tapped(run(() => {
					statsTable.setZIndex(dialog.getZIndex()+1);
					mgSelectionTable.setZIndex(dialog.getZIndex()+1);
					ammunitionSelectionTable.setZIndex(dialog.getZIndex()+1);
				}));
				
				thisObject.recalcBuildingCosts();
				statsText.setText(calcCosts(thisObject.plan().requirements));
				hiddenStatsText.setText(calcStats(thisObject));
				
				dialog.buttons.button("@ok", run(() => {
					if (this._weigth > this._enginePowerInternal) {
						
					} else {
						dialog.hide();
						statsTable.clearChildren();
						mgSelectionTable.clearChildren();
						ammunitionSelectionTable.clearChildren();
						this._health = parseInt(healthSliderText.getText().toString().replace(/.* /, ""));
						this._armor = parseInt(armorSliderText.getText().toString().replace(/.* /, ""));
						this._turretRotationSpeed = parseInt(turretRotationSpeedSliderText.getText().toString().replace(/.* /, ""));
						this._turretReloadSpeed = parseInt(turretReloadSpeedSliderText.getText().toString().replace(/.* /, ""));
						this._enginePower = parseInt(enginePowerSliderText.getText().toString().replace(/.* /, ""));
						this.recalcBuildingCosts();
						this.createVariant();
						/*this.drawPayload(); // Update Tile Data
						this.updateTile();
						this.draw();
						this.checkTier();*/
					}
				})).width(125);
				
				dialog.row();
				dialog.buttons.button("@back", run(() => {
					dialog.hide();
					statsTable.clearChildren();
					mgSelectionTable.clearChildren();
					ammunitionSelectionTable.clearChildren();
				})).width(125);
				
				dialog.row();
				dialog.buttons.button("Reset", run(() => {
					dialog.hide();
					statsTable.clearChildren();
					mgSelectionTable.clearChildren();
					ammunitionSelectionTable.clearChildren();
					this._health = 100;
					this._armor = 100;
					this._turretRotationSpeed = 100;
					this._turretReloadSpeed = 100;
					this._enginePower = 100;
					this._boardmg = true;
					this._axialmg = false;
					this._commandermg = false;
					this._ammunition = "ap";
					this.recalcBuildingCosts();
					this.resetVariant();
					/*this.updateTile();
					this.draw();
					this.checkTier();*/
				})).width(125);
				
				dialog.show();
				statsTable.setZIndex(dialog.getZIndex()+1);
				mgSelectionTable.setZIndex(dialog.getZIndex()+1);
				ammunitionSelectionTable.setZIndex(dialog.getZIndex()+1);
			})).size(40);
		}
		
	})};
}

factory.buildType = () => {return new extend(UnitAssembler.UnitAssemblerBuild, factory, {
	
	_init: false,

	update(){
		this.super$update();
		
		if (this._init == false && this.block.name.equals("factory-historical-tank-factory")) {
			this._init = true;
			
			let newBlock = hf.cloneUnitAssemblerBlock(Vars.content.block("factory-historical-tank-factory"), null, false);
			
			newBlock.buildVisibility = BuildVisibility.hidden;
			
			newBlock.plans = new Seq(1);
			newBlock.plans.add(new UnitAssembler.AssemblerUnitPlan(this.plan().unit, this.plan().time, this.plan().requirements.copy()));
			
			addBuildTypeToNewAssembler(newBlock);
			
			newBlock.init();
			newBlock.load();
			newBlock.setBars();
			newBlock.setStats();
			
			this.tile.setBlock(newBlock, this.team, this.rotation);
		}
	}
	
	
})};