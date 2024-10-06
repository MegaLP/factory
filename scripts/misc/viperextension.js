let table = null;
function updateLabel(message, showLabel) {
	if (!table) {
		table = Core.scene.table();
		table.add(message,Color.red, 1.2);
		table.marginTop(20);
		table.top();
		table.stack();
		table.clearChildren();
	} else if (showLabel) {
		table.clearChildren();
		table.add(message,Color.red, 1.2);
	} else {
		table.clearChildren();
	}
}

const viper = extend(UnitType, "viper", {});
viper.constructor = () => extend(UnitEntity, {
	
	_inAir: true,
	_lastRot: 0,
	_shotsLoaded: 4,
	_totalShoots: 0,
	_rocketMagSize: 4,
	_lastPlayerTime: 0,
	
	update(){
		
		this.super$update();
		
		this.updateSpeeds();
		
		this.updatePlayer();
		
		this.updateBullets();
		
		this.updateAmmo();
		
		//Vars.ui.consolefrag.addMessage(this._shotsLoaded);
		//Vars.ui.consolefrag.addMessage(this._totalShoots);
		
	},
	
	updateSpeeds() {
		
		if (this._inAir == true && this.vel.len() < 14) {
			this.vel.scl(1.1);
		}
		
		if (this.vel.len() > 16) {
			this.vel.scl(0.9);
		}
	},
	
	updatePlayer() {
		this._lastPlayerTime++;
		if (this.getPlayer() != null) {
			this._lastPlayerTime = 0;
			this._inAir = true;
			let message = "Missiles left: " + (this._shotsLoaded - this._totalShoots).toString() + " to Fire!";
			updateLabel(message, true);
			//this.getPlayer().sendMessage(message)
			//Vars.player.unit() get Unit
			//Vars.ui.hudfrag.setHudText(message);
		} else {
			this._inAir = false;
			//Vars.ui.hudfrag.toggleHudText(false);
		}
		if (this._lastPlayerTime >= 100) {
			updateLabel("", false);
		}
	},
	
	updateBullets() {
		
		this._totalShoots = 0;
		
		for (let i = 2; i < 6; i++) {
			this._totalShoots += this.mounts[i].totalShots;
		}
		
		if (this._totalShoots >= this._shotsLoaded) {
			
			this.setRocketFireStatus(false);
			
		}
		
	},
	
	setRocketFireStatus(value) {
		for (let i = 2; i < 6; i++) {
			this.mounts[i].weapon.controllable = value;
			this.mounts[i].weapon.aiControllable = value;
			this.mounts[i].weapon.autoTarget = value;
			this.mounts[i].weapon.noAttack = !value;
			if (!value) {
				this.mounts[i].weapon.minWarmup = 1;
				this.mounts[i].weapon.reload = Infinity;
				this.mounts[i].reload = Infinity;
			} else {
				this.mounts[i].weapon.minWarmup = 0;
				this.mounts[i].weapon.reload = 500;
				this.mounts[i].reload = 500;
			}
			this.mounts[i].weapon.update(this, this.mounts[i])
		}
		
		//Vars.ui.hudfrag.setHudText("SHOOTABLE: " + value);
	},
	
	updateAmmo() {
		if (this._totalShoots >= this._shotsLoaded 
			&& this._totalShoots <= (this._shotsLoaded + this._rocketMagSize)
			&& this.stack.item == "Rocket" 
			&& this.stack.amount > 0) {
				
			this.stack.amount -= 1;
			this._shotsLoaded++;
			
			this.setRocketFireStatus(true);
		}
	}
	
});
