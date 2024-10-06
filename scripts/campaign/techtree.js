let zelus = require("campaign/zelus");
let maps = require("campaign/maps");
//let statuses = require("libs/statuses")
//let fever = require("turrets/fever");
//Casually stals from [Gdeft/substructure]'s techtree.js

/**
 * Node for the research tech tree.
 *
 * @property {UnlockableContent}    parent          - The parent of the current node.
 * @property {UnlockableContent}    contentType     - The unlockable content that the current node contains.
 * @property {ItemStack}            requirements    - The research requirements required to unlock this node, will use the default if set to null.
 * @property {Seq}                  objectives      - A sequence of Objectives required to unlock this node. Can be null.
 */

const noderoot = (name, content, requiresUnlock, children) =>  {
	zelus.techTree = TechTree.nodeRoot(name, content, requiresUnlock, children)
}

const extendcontent = (type, name) => {
	return extend(type, name, {});
}

noderoot("Zelus", extendcontent(CoreBlock, "core-flow"), false, () => {
	TechTree.node(maps.M1, Seq.with(new Objectives.SectorComplete(SectorPresets.stainedMountains), new Objectives.Research(extendcontent(Wall, "dark-matter-wall")), new Objectives.Research(extendcontent(ItemTurret, "dark-matter-turret"))), () => {
		TechTree.node(maps.M2, Seq.with(new Objectives.SectorComplete(maps.M1), new Objectives.Research(extendcontent(UnitFactory, "advanced-unit-factory"))), () => {
			TechTree.node(maps.M3, Seq.with(new Objectives.SectorComplete(maps.M2), new Objectives.Research(extendcontent(GenericCrafter, "rocket-forge"))), () => {
				TechTree.node(maps.M4, Seq.with(new Objectives.SectorComplete(maps.M3), new Objectives.Research(extendcontent(Reconstructor, "darkshade-reconstructor"))), () => {
					
				})
				
				TechTree.node(maps.A1, Seq.with(new Objectives.SectorComplete(maps.M3), new Objectives.Research(extendcontent(Wall, "electrum-wall-large")), new Objectives.Research(extendcontent(MassDriver, "dark-matter-massdriver"))), () => {
					TechTree.node(maps.A2, Seq.with(new Objectives.SectorComplete(maps.A1), new Objectives.Research(extendcontent(MassDriver, "teleporter")), new Objectives.Research(extendcontent(ItemBridge, "electrum-bridge")), new Objectives.Research(extendcontent(LiquidBridge, "electrum-conduit"))), () => {
							
					});
				})
			})
		})
	})
});


/*
const node = (parent, contentType, requirements, objectives) => {
  const tnode = new TechTree.TechNode(TechTree.node(parent), contentType, requirements != null ? requirements : contentType.researchRequirements());
  let used = new ObjectSet();
  
  if(objectives != null){
    tnode.objectives.addAll(objectives);
  };
};

const matter = {
	//'1': [ItemTurret, "dark-matter-turret", {}, SectorPresets.stainedMountains, zelus.M1, Wall, "dark-matter-wall", {}],
	//'2': [UnitFactory, "advanced-unit-factory", {}, zelus.M1, zelus.M2, Wall, "dark-matter-wall-large", {}],
	//'3': [Wall, "red-matter-wall", {}, zelus.M2, zelus.M3, GenericCrafter, "rocket-forge", {}],
	//'4': [Wall, "red-matter-wall-large", {}, zelus.M3, zelus.M4, Reconstructor, "darkshade-reconstructor", {}],
	//'5': [Wall, "electrum-wall-large", {}, zelus.M2, zelus.A1, Wall, "electrum-wall", {}],
	//'6': [Wall, "galaxy-wall-large", {}, zelus.A1, zelus.A2, MassDriver, "teleporter", {}],
};

for(var e in matter){
	node(matter[e][3], matter[e][4], null, Seq.with(new Objectives.SectorComplete(matter[e][3]), new Objectives.Research(extend(matter[e][0], matter[e][1], matter[e][2])), new Objectives.Research(extend(matter[e][5], matter[e][6], matter[e][7]))));
}
*/