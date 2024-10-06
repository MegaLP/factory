let nukeOnField = false;

const nukeexplosion = new ExplosionEffect();
	
nukeexplosion.lifetime = 500;

nukeexplosion.sparkColor = Color.valueOf("ff6200");
nukeexplosion.sparks = 200;
nukeexplosion.sparkLen = 20;
nukeexplosion.sparkStroke = 10;
nukeexplosion.sparkRad = 2000;

nukeexplosion.smokeColor = Color.valueOf("474747");
nukeexplosion.smokes = 100;
nukeexplosion.smokeSizeBase = 50;
nukeexplosion.smokeSize = 100;
nukeexplosion.smokeRad = 2000;

nukeexplosion.waveColor = Color.valueOf("f76205");
nukeexplosion.waveLife = 1000;
nukeexplosion.waveRad = 2000;
nukeexplosion.waveRadBase = 10;
nukeexplosion.waveStroke = 500;


const allEffectsConfig = {
	1: {startDelay: 0, smokeColor: Color.valueOf("404040")},
	2: {startDelay: 10, smokeColor: Color.valueOf("383838")},
	3: {startDelay: 20, smokeColor: Color.valueOf("343434")},
	4: {startDelay: 30, smokeColor: Color.valueOf("303030")},
	5: {startDelay: 40, smokeColor: Color.valueOf("282828")},
	6: {startDelay: 50, smokeColor: Color.valueOf("242424")},
	7: {startDelay: 60, smokeColor: Color.valueOf("202020")},
	8: {startDelay: 70, smokeColor: Color.valueOf("181818")},
	9: {startDelay: 80, smokeColor: Color.valueOf("141414")},
	10: {startDelay: 90, smokeColor: Color.valueOf("101010")},
	11: {startDelay: 100, smokeColor: Color.valueOf("080808")},
};

let effects = {};

for (var i in allEffectsConfig) {
	effects[i] = new ExplosionEffect();
	effects[i].lifetime = 150;
	effects[i].startDelay = allEffectsConfig[i].startDelay;
	effects[i].smokeColor = allEffectsConfig[i].smokeColor;
	effects[i].smokes = 15*i;
	effects[i].smokeSize = 10;
	effects[i].smokeSizeBase = 5;
	effects[i].smokeRad = 10*i;
}

const nukeLaunch = new MultiEffect(effects[1], effects[2], effects[3], effects[4], effects[5], effects[6], effects[7], effects[8], effects[9], effects[10], effects[11]);

// FIX SOUNDS
//const nukesound = FileTree
//Vars.ui.consolefrag.addMessage(Block);
//const nukeStart = new SoundLoop();

let nukeRange = 5000;
let nukeDmg = 50000;
const nuke = new ExplosionBulletType(nukeDmg, nukeRange);
nuke.despawnShake = 500;
nuke.despawnEffect = nukeexplosion;

const disarmed = new ExplosionBulletType(0, 0);
disarmed.despawnEffect = nukeLaunch;

const nuker = extend(Block, "tactical-nuke", {});
nuker.buildType = () => extend(Building, {
	update(){},
	buildConfiguration(table) {
		table.button(new TextureRegionDrawable(Core.atlas.find("factory-nuke")), Styles.defaulti, 30, run(() => {
			let stepSize = 5;
			let maxStep = 350;
			let minStep = -350;
			const dialog = new BaseDialog("[red]Relative coordinates?");
			dialog.setFillParent(false);
			const textX = new Label("[red]X: 0");
			const textY = new Label("[red]Y: 0");
			dialog.cont.add(textX);
			dialog.cont.row();
			dialog.cont.slider(minStep,maxStep,stepSize,new Floatc({get: function (value){textX.setText("[red]X: "+value)}}))
			dialog.cont.row();
			dialog.cont.add(textY);
			dialog.cont.row();
			dialog.cont.slider(minStep,maxStep,stepSize,new Floatc({get: function (value){textY.setText("[red]Y: "+value)}}))
			dialog.buttons.button("[red]FIRE", run(() => {
				dialog.hide();
				this.updateConsumption();
				if (this.efficiency >= 1 && nukeOnField == false) {
					nukeOnField = true;
					this.removeStack(Vars.content.item("factory-rocket"), 100);
					let x = parseInt(this.x) + parseInt(textX.getText().toString().replace(/.* /, "")*10);
					let y = parseInt(this.y) + parseInt(textY.getText().toString().replace(/.* /, "")*10);
					let i = 40;
					BulletType.createBullet(disarmed, this.team, this.x, this.y, 1, 100, 1, 1);
					let message = "[red]Warning Nuclear Weapon at X: " + x/8 + " Y: " + y/8 + " in " + i;
					Vars.ui.hudfrag.setHudText(message);
					Vars.player.sendMessage(message);
					timer(x, y, i, this);
					//Vars.ui.consolefrag.addMessage(this.items);
				}
			})).width(125);
			/*dialog.buttons.button("@ok", run(() => {
				dialog.hide();
				var i = textX.getText().toString();
				i=i.replace(/\D+/g,"");
				Vars.state.wave=Number(i);
				//Действие
			})).width(125);*/
			dialog.row();
			dialog.buttons.button("@back", run(() => {
				dialog.hide();
			})).width(125);
			dialog.show()
		})).size(40);
	}
});

const timer = (x, y, time, block) => {
	Time.runTask(60, run(() => {
		time--;
		block.updateConsumption();
		if (time > 0 && block.efficiency >= 1) {
			let message = "[red]Warning Nuclear Weapon at X: " + x/8 + " Y: " + y/8 + " in " + time;
			Vars.ui.hudfrag.setHudText(message);
			Vars.player.sendMessage(message);
			timer(x, y, time, block);
		} else if (block.efficiency >= 1){
			BulletType.createBullet(nuke, Team.derelict, x, y, 1, 100, 1, 1);
			Vars.ui.hudfrag.toggleHudText(false);
			Time.runTask(150, run(() => {
				nukeOnField = false;
			}));
		} else {
			Vars.player.sendMessage("Nuclear Weapon canceled");
			Vars.ui.hudfrag.setHudText("Not enugh power!");
			Time.runTask(150, run(() => {
				Vars.ui.hudfrag.toggleHudText(false);
				nukeOnField = false;
			}));
		}
	}));
}

module.exports = {
	nuke: nuke,
	nukeexplosion: nukeexplosion
}