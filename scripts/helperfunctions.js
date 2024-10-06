const cw = require('misc/customWeapons');
const cb = require('misc/customBullets');

function guidGenerator(){
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function getClassFields(topClass, depth, internalDepth) {
	let fields = [];
	
	for (let i = 0; i < topClass.getDeclaredFields().length; i++) {
		let field = topClass.getDeclaredFields()[i];
		if (field === "undefined" || field == null) {
			continue;
		}
		field.setAccessible(true);
		fields.push(field);
		if (topClass.getSuperclass() != null && depth > internalDepth) {
			let subclassFields = getClassFields(topClass.getSuperclass(), depth, (internalDepth++));
			for (let x = 0; x < subclassFields.length; x++) {
				fields.push(subclassFields[x]);
			}
		}
	}
	
	return fields;
}

function shallowObjectClone(oldObject, newObject, depth) {
	
	let fields = getClassFields(oldObject.getClass(), depth, 0);
	
	for (let i = 0; i < fields.length; i++) {
		let field = fields[i];
		if (field === "undefined" || field == null) {
			continue;
		}
		field.setAccessible(true);
		if(field.get(oldObject) == null || java.lang.reflect.Modifier.isFinal(field.getModifiers()) || java.lang.reflect.Modifier.isProtected(field.getModifiers())){
			continue;
		}
		if (field.getName() == "id") {
			continue;
		}
		try {
			newObject[field.getName()] = field.get(oldObject);
		} catch (e) {
			
		}
	}
}

function cloneUnitAssemblerBlock(block, fullName, loadBuilding) {
	
	if (loadBuilding === "undefined" || loadBuilding == null) {
		loadBuilding = true;
	}
	
	let newName = block.name;
	
	if (newName.search("variant") != -1) {
		newName = newName.substring(0,newName.search("variant")-1);
	}
	
	if (fullName == null) {
		fullName = newName+"-variant-"+guidGenerator();
	}
	let newBlock = new UnitAssembler(fullName);
	
	shallowObjectClone(block, newBlock, 3);
	
	Core.atlas.addRegion(fullName,Core.atlas.find(block.name));
	Core.atlas.addRegion(fullName+"-top",Core.atlas.find(block.name+"-top"));
	Core.atlas.addRegion(fullName+"-side1",Core.atlas.find(block.name+"-side1"));
	Core.atlas.addRegion(fullName+"-side2",Core.atlas.find(block.name+"-side2"));
	
	newBlock.id = block.id;
	newBlock.name = fullName;
	newBlock.localizedName = block.name;
	
	if (loadBuilding) {
		newBlock.init();
		newBlock.load();
		newBlock.setBars();
		newBlock.setStats();
		newBlock.initBuilding();
	}
	
	return newBlock;
	
}

function cloneWeapon(weapon, fullName) {
	
	let newName = weapon.name;
	
	if (newName.search("variant") != -1) {
		newName = newName.substring(0,newName.search("variant")-1);
	}
	
	if (fullName == null) {
		fullName = newName+"-variant-"+guidGenerator();
	}
	let newWeapon = new Weapon(fullName);
	
	shallowObjectClone(weapon, newWeapon, 1);
	
	newWeapon.name = fullName;
	Core.atlas.addRegion(fullName,Core.atlas.find(weapon.name));
	
	newWeapon.init();
	newWeapon.load();
	
	return newWeapon;
}

function cloneTankUnit(unit, fullName, loadUnit) {
	
	if (loadUnit === "undefined" || loadUnit == null) {
		loadUnit = true;
	}
	
	if (fullName == null) {
		fullName = unit.name+"-variant-"+guidGenerator();
	}
	
	if (Vars.content.unit(fullName) != null) {
		return cloneTankUnit(unit);
	}
	
	Core.atlas.addRegion(fullName,Core.atlas.find(unit.name));
	let newUnit = new UnitType(fullName);
	
	shallowObjectClone(unit, newUnit, 1);
	
	newUnit.weapons = new Seq(unit.weapons.size);
	for (let i = 0; i < unit.weapons.size; i++) {
		let newWeapon = cloneWeapon(unit.weapons.get(i));
		newUnit.weapons.add(newWeapon);
	}
	
	newUnit.weapons.forEach((key) => {
		key = key.copy();
	});
	
	newUnit.localizedName = unit.name;
	
	if (loadUnit) {
		newUnit.init();
		newUnit.load();
		newUnit.loadIcon();
	}
	
	return newUnit;
}

function updateWeaponVariantStats(weapon, turretReloadSpeed, turretRotationSpeed, firePower) {
	
	weapon.rotateSpeed = weapon.rotateSpeed*(parseInt(turretRotationSpeed)/100);
	weapon.reload = Math.round(weapon.reload/(parseInt(turretReloadSpeed)/100));
	weapon.bullet.damage = weapon.bullet.damage*(parseInt(firePower)/100);
	
	
	if (weapon.reload <= 0) {
		weapon.reload = 1;
	}
	if (weapon.rotateSpeed <= 0) {
		weapon.rotateSpeed = 0.01;
	}
	if (weapon.bullet.damage <= 0) {
		weapon.bullet.damage = 1;
	}
}

function updateUnitVariantStats(unit, armor, health, mobility, turretReloadSpeed, turretRotationSpeed, firePower) {
	unit.hidden = true;
	
	unit.armor *= armor/100;
	unit.health *= health/100;
	unit.rotateSpeed *= mobility/100;
	unit.speed *= mobility/100;
	
	for (let i = 0; i < unit.weapons.size; i++) {
		updateWeaponVariantStats(unit.weapons.get(i), turretReloadSpeed, turretRotationSpeed, firePower);
	}
}

function loadConfigUnits(config) {
	if (config == null || config === "undefined") {
		config = {};
	}
	if (config.variants == null || config.variants === "undefined" || config.variants.constructor.name != "Array") {
		config.variants = [];
		return;
	}
	
	config.variants.forEach((key) => {
		let unit = Vars.content.unit(key.type);
		let newUnit = cloneTankUnit(unit, key.name, false);
		
		setMainBullet(newUnit, key.type, key.ammunition);
		addVariantMGs(newUnit, key.type, key.boardmg, key.axialmg, key.commandermg, key.turretReloadSpeed, key.turretRotationSpeed, key.firePower);
		updateUnitVariantStats(newUnit, key.armor, key.health, key.mobility, key.turretReloadSpeed, key.turretRotationSpeed, key.firePower);
		
		newUnit.init();
		newUnit.load();
		newUnit.loadIcon();
		
	});
	
	Vars.ui.consolefrag.addMessage("[green]Loaded all Unit Variants! - Factory");
	
}

function addConstructorForRelativeWeapon(unit, weapon) {
	unit.constructor = () => {
		return extend(TankUnit, {
			
			_commanderMGPosition: 0,
			_initialized: false,
			
			update(){
				
				if (this._initialized == false) {
					for (let i = 0; i < this.mounts.length; i++) {
						if (this.mounts[i].weapon.name.equals("factory-tmp")) {
							this._commanderMGPosition = i;
							break;
						} else {
							this._commanderMGPosition = this.mounts.length-1;
						}
					}
					this.mounts[this._commanderMGPosition] = new WeaponMount(cloneWeapon(weapon));
					this._initialized = true;
				}
				
				this.super$update();
				
				this.updateWeaponPosition();
				
			},
			
			updateWeaponPosition(){
				
				let alpha = parseFloat(this.mounts[0].rotation-152)*(Math.PI/180);
				let distance = 6.6;
				
				this.mounts[this._commanderMGPosition].weapon.x = 0 + (distance * Math.cos(alpha));
				this.mounts[this._commanderMGPosition].weapon.y = 0 + (distance * Math.sin(alpha));
				
			}
		});
	}
}

function addVariantMGs(unit, basedOffBuild, boardmg, axialmg, commandermg, turretReloadSpeed, turretRotationSpeed, firePower) {
	let out = [];
	switch (basedOffBuild) {
		case "factory-tiger":
			let fullName, weapon;
			if (boardmg) {
				fullName = "minigun-variant-"+guidGenerator();
				weapon = cw.minigunBuilder(fullName,"factory-weapon-mg",10,-9,20.5,4,1.5,0,2,false,1,0,false);
				unit.weapons.add(weapon);
				out.push(weapon);
			}
			if (axialmg) {
				fullName = "minigun-variant-"+guidGenerator();
				weapon = cw.minigunBuilder(fullName,"factory-weapon-mg",16,0,0,360,0.5,2,12,false,0,1,false);
				unit.weapons.add(weapon);
				out.push(weapon);
			}
			if (commandermg) {
				fullName = "minigun-variant-"+guidGenerator();
				weapon = cw.minigunBuilder(fullName,"factory-tiger-weapon-commander-mg",15,0,0,360,10,0,4,true,10,0,true);
				let alreadyAttached = false;
				for (let i = 0; i < unit.weapons.size; i++) {
					if (unit.weapons.get(i).name.equals("factory-tmp")) {
						alreadyAttached = true;
						break;
					}
				}
				if (alreadyAttached == false) {
					let tmp = new Weapon("factory-tmp");
					tmp.noAttack = true;
					tmp.rotationLimit = 0;
					tmp.shootCone = 0;
					unit.weapons.add(tmp);
				}
				updateWeaponVariantStats(weapon, turretReloadSpeed, turretRotationSpeed, firePower);
				addConstructorForRelativeWeapon(unit, weapon);
				out.push(weapon);
			}
		break;
	}
	return out;
}

function setMainBullet(unit, basedOffBuild, ammunition) {
	
	switch (basedOffBuild) {
		case "factory-tiger":
			let newBullet;
			switch (ammunition) {
				case "ap":
					//bulletBuilder(damage, speed, lifetime, pierce, pierceBuilding, pierceCap, spliterAmount, incendAmount, fragRandomSpread, splashDamageRadius, splashDamage)
					newBullet = cb.bulletBuilder(250, 8, 60, true, true, 2, 5, 0, 30, 0, 0);
					unit.weapons.get(0).bullet = newBullet;
				break;
				case "apcr":
					newBullet = cb.bulletBuilder(170, 12, 80, true, true, 4, 8, 0, 30, 0, 0);
					unit.weapons.get(0).bullet = newBullet;
				break;
				case "he":
					newBullet = cb.bulletBuilder(10, 4, 150, false, false, -1, 20, 0, 360, 72, 800);
					unit.weapons.get(0).bullet = newBullet;
				break;
			}
			
		break;
	}
}

module.exports = {
	guidGenerator: guidGenerator,
	cloneUnitAssemblerBlock: cloneUnitAssemblerBlock,
	cloneTankUnit: cloneTankUnit,
	loadConfigUnits: loadConfigUnits,
	updateUnitVariantStats: updateUnitVariantStats,
	addVariantMGs: addVariantMGs,
	shallowObjectClone: shallowObjectClone,
	setMainBullet: setMainBullet
}