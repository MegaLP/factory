function bulletBuilder(damage, speed, lifetime, pierce, pierceBuilding, pierceCap, spliterAmount, incendAmount, fragRandomSpread, splashDamageRadius, splashDamage) {
	let bullet = new BasicBulletType();
	bullet.sprite = "factory-tiger-APCR-nade";
	bullet.backSprite = "factory-tiger-APCR-nade";
	bullet.width = 5;
	bullet.height = 10;
	bullet.hitSize = 8;
	bullet.pierceCap = parseInt(pierceCap);
	bullet.pierceBuilding = pierceBuilding;
	bullet.pierce = pierce;
	bullet.speed = parseFloat(speed);
	bullet.lifetime = parseFloat(lifetime);
	bullet.damage = parseFloat(damage);
	bullet.hittable = false;
	bullet.reflectable = false;
	bullet.absorbable = true;
	bullet.collidesAir = false;
	bullet.incendAmount = incendAmount;
	bullet.fragRandomSpread = parseFloat(fragRandomSpread);
	bullet.splashDamageRadius = parseFloat(splashDamageRadius);
	bullet.splashDamage = parseFloat(splashDamage);
	if (incendAmount > 0) {
		bullet.makeFire = true;
	}
	
	bullet.fragBullet = new BasicBulletType();
	bullet.fragBullet.sprite = "factory-mg-bullet";
	bullet.fragBullet.backSprite = "factory-mg-bullet-back";
	bullet.fragBullet.damage = (damage/10);
	bullet.fragBullets = spliterAmount;
	
	bullet.init();
	bullet.fragBullet.init();
	bullet.load();
	bullet.fragBullet.load();
	
	return bullet;
}


// APCR less damage many spliter high velocity 

module.exports = {
	bulletBuilder: bulletBuilder
}