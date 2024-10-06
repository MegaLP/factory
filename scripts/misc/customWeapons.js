function minigunBuilder(fullName, spriteName, damage, x, y, rotationLimit, rotateSpeed, shootX, shootY, collidesAir, Zlayer, fireAmount, fragBullets) {
	let weapon = new Weapon(fullName);
	weapon.reload = 5;
	weapon.alternate = false;
	weapon.mirror = false;
	weapon.rotate = true;
	weapon.ignoreRotation = true;
	weapon.shootCone = 360;
	weapon.rotateSpeed = rotateSpeed;
	weapon.rotationLimit = rotationLimit;
	weapon.inaccuracy = 3;
	weapon.top = false;
	weapon.soundPitchMin = 1;
	weapon.soundPitchMax = 1;
	weapon.recoilTime = 0.2;
	weapon.recoilPow = 0.15;
	weapon.recoil = 0.15;
	weapon.shootX = shootX;
	weapon.shootY = shootY;
	weapon.layerOffset = Zlayer;
	weapon.aiControllable = false;
	
	weapon.shoot = new ShootPattern();
	weapon.shoot.shots = 2;
	weapon.shoot.shotDelay = 1;
	
	weapon.bullet = new BasicBulletType();
	weapon.bullet.sprite = "factory-mg-bullet";
	weapon.bullet.backSprite = "factory-mg-bullet-back";
	weapon.bullet.width = 2;
	weapon.bullet.height = 4;
	weapon.bullet.speed = 6;
	weapon.bullet.lifetime = 60;
	weapon.bullet.maxRange = 150;
	weapon.bullet.damage = damage;
	weapon.bullet.collidesAir = collidesAir;
	weapon.bullet.trailChance = 0.01;
	weapon.bullet.trailParam = 1;
	weapon.bullet.incendAmount = fireAmount;
	
	if (fragBullets) {
		weapon.bullet.fragBullet = new BasicBulletType();
		weapon.bullet.fragBullet.sprite = "factory-mg-bullet";
		weapon.bullet.fragBullet.backSprite = "factory-mg-bullet-back";
		weapon.bullet.fragBullet.damage = 5;
		weapon.bullet.fragRandomSpread = 60;
		weapon.bullet.fragBullets = 5;
		weapon.bullet.fragBullet.init();
		weapon.bullet.fragBullet.load();
	}
	
	weapon.bullet.init();
	weapon.bullet.load();
	
	weapon.x = x;
	weapon.y = y;
	
	if (Core.atlas.find(spriteName) != "error") {
		Core.atlas.addRegion(fullName,Core.atlas.find(spriteName));
	}
	
	weapon.init();
	weapon.load();
	
	return weapon;
}



module.exports = {
	minigunBuilder: minigunBuilder
}