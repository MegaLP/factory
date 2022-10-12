const nuker = extend(Block, "tactical-nuke", {
	
	updateTile(){
        this.super$updateTile();
        //shitty stuff
    },
	buildConfiguration(table){
		this.super$buildConfiguration(table);
		this.addImageButton(Icon.upOpen, Styles.clearTransi, run(() => {
			//configure the tile to signal that it has been pressed (this sync on client to server)
			this.configure(0)
		})).size(50).disabled(boolf(b => this.entity != null && !this.entity.cons.valid()))
	},
    

    //override configure event
    configured(tile, value){
        //make sure this weapon has the items it needs to fire
        if(tile.entity.cons.valid()){
            //create 15 bullets at this tile's location with random rotation and velocity/lifetime
            for(var i = 0; i < 15; i++){
                Calls.createBullet(nuke, tile.getTeam(), tile.drawx(), tile.drawy(), Mathf.random(360), Mathf.random(0.5, 1.0), Mathf.random(0.2, 1.0))
            }
            //triggering consumption makes it use up the items it requires
            tile.entity.cons.trigger()
        }
    }
});

const nuke = new ExplosionBulletType(1000, 1000);