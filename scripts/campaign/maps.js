const planet = require('campaign/zelus');

const A1 = extend(SectorPreset, "A1", planet.asteroidbelt, 1, {
	alwaysUnlocked: false,
	difficulty: 17,
	enemyBase: true,
	description: "Fast Thinking",
	localizedName: "Astreorid Attack"
});

const A2 = extend(SectorPreset, "A2", planet.asteroidbelt, 2, {
	alwaysUnlocked: false,
	difficulty: 25,
	enemyBase: true,
	description: "Space Space SPACE!",
	localizedName: "Space Attack"
});

const M1 = extend(SectorPreset, "M1", planet.zelus, 1, {
	alwaysUnlocked: false,
	difficulty: 25,
	enemyBase: true,
	description: "A difficult map for beginners watch out for wave 36 51",
	localizedName: "Infiltrate the Enemy",
});

const M2 = extend(SectorPreset, "M2", planet.zelus, 2, {
	alwaysUnlocked: false,
	difficulty: 30,
	enemyBase: true,
	captureWave: 75,
	description: "find the way",
	localizedName: "The Labyrinth"
});

const M3 = extend(SectorPreset, "M3", planet.zelus, 3, {
	difficulty: 45,
	captureWave: 250,
	description: "Too many enemys",
	localizedName: "Oh no"
});

const M4 = extend(SectorPreset, "M4", planet.zelus, 4, {
	difficulty: 40,
	captureWave: 200,
	description: "you are done",
	localizedName: "The Craters"
});

M2.objectives = Seq.with(
  new Objectives.SectorComplete(Vars.content.getByName(ContentType.block, "M1")),
  new Objectives.Research(Vars.content.getByName(ContentType.block, "factory-electrum")),
  new Objectives.Research(Blocks.largeSolarPanel)
)
M3.objectives = Seq.with(
  new Objectives.SectorComplete(M2),
  new Objectives.Research(Vars.content.getByName(ContentType.block, "factory-red-matter-wall-large"))
)
M4.objectives = Seq.with(
  new Objectives.SectorComplete(M3),
  new Objectives.Research(Vars.content.getByName(ContentType.block, "factory-red-matter-wall-large"))
)


module.exports = {
	M1: M1,
	M2: M2,
	M3: M3,
	M4: M4,
	A1: A1,
	A2: A2
}
