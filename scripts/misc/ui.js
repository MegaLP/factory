function setZoom(min, max) {
	if (Vars.renderer == null) {
		return;
	}
    Vars.renderer.minZoom = min;
    Vars.renderer.maxZoom = max;
}

setZoom(0.5, 25);

module.exports = {
	setZoom: setZoom
}