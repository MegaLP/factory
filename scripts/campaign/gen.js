const pl_zelus = Vars.content.getByName(ContentType.planet, "Zelus");

const gen = new JavaAdapter(Planet, {}, "gen", pl_zelus, 2, 0.4);
gen.generator = new SerpuloPlanetGenerator();
gen.startSector = 7;
gen.hasAtmosphere = true;
gen.accessible = true;
gen.atmosphereColor = Color.valueOf("1c7fa690");
gen.meshLoader = function(){
  return new HexMesh(gen, 7);
};

