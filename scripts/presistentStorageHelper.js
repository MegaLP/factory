const hf = require('helperfunctions');

let config = null;
let fullConfigPath = "saves/factoryModStorage.json";

function loadConfig() {
	if (Fi(fullConfigPath).exists() == false) {
		Fi(fullConfigPath).write();
	}
	
	let fileContent = Fi(fullConfigPath).readString();
	
	if (fileContent == null) {
		Vars.ui.consolefrag.addMessage("[orange]Config file is empty! Won't load any saved configs!");
		return null;
	}
	if (fileContent == "") {
		config = {};
		Vars.ui.consolefrag.addMessage("[green]Config is empty! Saving default value: {}");
		return null;
	}
	try {
		config = JSON.parse(fileContent);
		Vars.ui.consolefrag.addMessage("[green]Loaded custom config succesfully!");
	} catch (e) {
		Vars.ui.consolefrag.addMessage("[red]Could not read config file. If you manualy changed it, you messed UP. Make a backup NOW!");
		return null;
	}
}

function saveConfig() {
	if (Fi(fullConfigPath).exists() == false) {
		Fi(fullConfigPath).write();
	}
	
	if (config == null) {
		Vars.ui.consolefrag.addMessage("[orange]Config is empty! Saving default value: {}");
		config = {};
	}
	let fileContent = JSON.stringify(config);
	Fi(fullConfigPath).writeString(fileContent);
	Vars.ui.consolefrag.addMessage("[green]Saved custom config succesfully!");
}

function setConfig(data) {
	config = data;
}

function getConfig() {
	return config;
}

Events.on(ClientLoadEvent, event => {
	loadConfig();
	hf.loadConfigUnits(config);
});

module.exports = {
	setConfig: setConfig,
	getConfig: getConfig,
	loadConfig: loadConfig,
	saveConfig: saveConfig
}
