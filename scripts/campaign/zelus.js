const zelusGenerator = require('campaign/zelusGenerator');
const asteroidGen = require('campaign/asteroidGenerator');

function setPlanet(p, s){
    p.grid = PlanetGrid.create(s);
    p.sectors.ensureCapacity(p.grid.tiles.length);
    for(var i = 0; i < p.grid.tiles.length; i++){
        p.sectors.add(new Sector(p, p.grid.tiles[i]));
    }

    p.sectorApproxRadius = p.sectors.first().tile.v.dst(p.sectors.first().tile.corners[0].v);
}

const zelus = new JavaAdapter(Planet, {
    load(){
        this.meshLoader = prov(() => new SunMesh(zelus, 4, 6, 2.8, 1.4, 1.8, 1.4, 1.1,
            Color.valueOf("5ecdc6"),
            Color.valueOf("5ebbcd"),
            Color.valueOf("5ecda6"),
            Color.valueOf("5ecd86"),
            Color.valueOf("5ecd65"),
            Color.valueOf("5e9acd")
        ));
        this.super$load();
    }
}, "Zelus", Planets.sun, 1);
setPlanet(zelus, 4);
zelus.generator = asteroidGen.asteroidGen;
zelus.atmosphereColor = Color.valueOf("f0e4a860");
zelus.accessible = true;
zelus.orbitRadius = 12;
zelus.atmosphereRadIn = 0.02;
zelus.atmosphereRadOut = 0.4;
zelus.startSector = 1;
zelus.localizedName = "Zelus";
zelus.alwaysUnlocked = true;


const asteroidbelt = new JavaAdapter(Planet, {
    load(){
        this.meshLoader = prov(() => new SunMesh(asteroidbelt, 8, 0.2, 2.4, 1.4, 1.8, 1.4, 1.1,
            Color.valueOf("171716"),
            Color.valueOf("0d0d0c"),
            Color.valueOf("171714"),
            Color.valueOf("121211"),
            Color.valueOf("141111"),
            Color.valueOf("1f1f1d"),
            Color.valueOf("1a1a16"),
            Color.valueOf("1f1c1c"),
            Color.valueOf("0d0b0b"),
            Color.valueOf("0f0e0e")
        ));
        this.super$load();
    }
}, "Asteroid Belt", Planets.sun, 1);
setPlanet(asteroidbelt, 1);
asteroidbelt.drawOrbit = false;
asteroidbelt.generator = asteroidGen.asteroidGen;
asteroidbelt.atmosphereColor = Color.valueOf("0f0f0f00");
asteroidbelt.accessible = true;
asteroidbelt.orbitRadius = 28;
asteroidbelt.atmosphereRadIn = 0;
asteroidbelt.atmosphereRadOut = 0;
asteroidbelt.startSector = 1;
asteroidbelt.localizedName = "Asteroid Belt";
asteroidbelt.alwaysUnlocked = true;



module.exports = {
	zelus: zelus,
	asteroidbelt: asteroidbelt
}
