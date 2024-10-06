const hf = require('helperfunctions');

const stringMatches = ["factory-viper", "factory-tiger-variant-.*"];

function reloadUnit(unit) {
	let newUnit = unit.type.spawn(unit.team, unit.x, unit.y);
	hf.shallowObjectClone(unit, newUnit, 1);
	if ((typeof unit.controller !== "function") && unit.controller.getClass().getName().equals("mindustry.gen.Player")) {
		unit.controller.unit(newUnit);
	}
	unit.remove();
}

Events.on(EventType.WorldLoadEvent, event => {
	Time.runTask(40, run(() => {
		let activeTeams = Vars.state.teams.active;
		for (let teamIndex = 0; teamIndex < activeTeams.size; teamIndex++) {
			let units = activeTeams.get(teamIndex).units
			for (let teamUnitIndex = 0; teamUnitIndex < units.size; teamUnitIndex++) {
				let unit = units.get(teamUnitIndex);
				stringMatches.forEach((key) => {
					if (unit.type.toString().match(key) != null) {
						reloadUnit(unit);
					}
				});
			}
		}
		if (Math.random() <= 0.1) {
			Vars.ui.hudfrag.showToast("Rate us in the workshop");
		}
	}));
});