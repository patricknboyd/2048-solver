function Autoplayer(gameManager) {

	this.delay = 800;
	this.intervalID = -1;
	this.isAutoplaying = false;

	this.gameManager = gameManager;

}

Autoplayer.prototype.getIsAutoplaying = function() {
	return this.isAutoplaying;
	
};

Autoplayer.prototype.startAutoplay = function() {
	
	if(!this.isAutoplaying) {

		this.intervalID = window.setInterval(this.makeNextMovement.bind(this), this.delay);
		
		this.isAutoplaying = true;
	}
};

Autoplayer.prototype.makeNextMovement = function(gameManager) {
    var direction = this.getNextDirection();
	
	this.gameManager.move(direction);
};

Autoplayer.prototype.stopAutoplay = function() {
	if(this.isAutoplaying) {
		window.clearInterval(this.intervalID);
		intervalID = -1;
		
		this.isAutoplaying = false;
	}
}

Autoplayer.prototype.getNextDirection = function () {
    var mergeValues = this.gameManager.evaluateMove();

    var maxValue = -1;
    var dir = 0;

    for (var i = 0; i < 4; i++) {
        if (mergeValues[i].canMove && mergeValues[i].value > maxValue) {
            maxValue = mergeValues[i].value;
            dir = i;
        }
    }

    return dir;
};