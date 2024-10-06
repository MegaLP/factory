const nukeexplosion = new ExplosionEffect();
	
nukeexplosion.lifetime = 400;

nukeexplosion.sparkColor = Color.valueOf("ff6200");
nukeexplosion.sparks = 20;
nukeexplosion.sparkLen = 2;
nukeexplosion.sparkStroke = 1;
nukeexplosion.sparkRad = 200;

nukeexplosion.smokeColor = Color.valueOf("474747");
nukeexplosion.smokes = 10;
nukeexplosion.smokeSizeBase = 5;
nukeexplosion.smokeSize = 10;
nukeexplosion.smokeRad = 200;

nukeexplosion.waveColor = Color.valueOf("f76205");
nukeexplosion.waveLife = 200;
nukeexplosion.waveRad = 200;
nukeexplosion.waveRadBase = 1;
nukeexplosion.waveStroke = 50;

let explosionRange = 200;
let explosionDmg = 1000000;
const explosion = new ExplosionBulletType(explosionDmg, explosionRange);
explosion.despawnShake = 100;
explosion.despawnEffect = nukeexplosion;

const reactor = extend(ImpactReactor, "electrum-fusion-reactor", {});
reactor.buildType = () => extend(ImpactReactor.ImpactReactorBuild, reactor, {
	
	_heat: 0,
	_explosions: 0,
	
	update(){
		this.super$update();
		
		this.updateTemp();
		
		this.updateHeat();
	},
	
	updateTemp() {
		let thoriumAmount = this.items.get(Vars.content.item("thorium"));
		let redMatterAmount = this.items.get(Vars.content.item("factory-red-matter"));
		let stabilizedAmount = this.liquids.get(Vars.content.liquid("factory-stabilized-liquid"));
		if (this.warmup >= 0.25 && thoriumAmount >= 1 && redMatterAmount >= 1 && stabilizedAmount <= 0.1) {
			this._heat++;
		} else if (this._heat >= 1){
			this._heat--;
		}
		
	},
	
	updateHeat() {
		if (this._heat >= 40 && this._explosions == 0) {
			this.explode();
		}
	},
	
	explode() {
		this.health = 0;
		BulletType.createBullet(explosion, Team.derelict, this.x, this.y, 1, 10, 1, 1);
		this._explosions++;
	}
	
});

module.exports = {
	reactor: reactor,
	explosion: explosion,
}