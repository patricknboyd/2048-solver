function Autoplayer() {

	this.delay = 800;
	
	this.intervalID = -1;
	
	this.isAutoplaying = false;

}

Autoplayer.prototype.getIsAutoplaying = function() {
	return this.isAutoplaying;
	
};

Autoplayer.prototype.startAutoplay = function(gameManager) {
	
	if(!this.isAutoplaying) {
		this.gameManager = gameManager;

		this.intervalID = window.setInterval(this.makeRandomMovement.bind(this), this.delay);
		
		this.isAutoplaying = true;
	}
};

Autoplayer.prototype.makeRandomMovement = function(gameManager) {
	var direction = Math.floor(Math.random() * 4);
	
	this.gameManager.move(direction);
};

Autoplayer.prototype.stopAutoplay = function() {
	if(this.isAutoplaying) {
		window.clearInterval(this.intervalID);
		intervalID = -1;
		
		this.isAutoplaying = false;
	}
}