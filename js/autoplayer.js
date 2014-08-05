function Autoplayer(gameManager) {

	this.delay = 800;
	this.timouetID = -1;
	this.isAutoplaying = false;
	
	this.maxMovesAhead = 4;

	this.gameManager = gameManager;

}

Autoplayer.prototype.getIsAutoplaying = function() {
	return this.isAutoplaying;
	
};

Autoplayer.prototype.startAutoplay = function() {
	
	if(!this.isAutoplaying) {

		this.timouetID = window.setTimeout(this.makeNextMovement.bind(this), this.delay);
		
		this.isAutoplaying = true;
	}
};

Autoplayer.prototype.makeNextMovement = function(gameManager) {
    var direction = this.getNextDirection();
	
	this.gameManager.move(direction);
	
	this.timeoutID = window.setTimeout(this.makeNextMovement.bind(this), this.delay);
};

Autoplayer.prototype.stopAutoplay = function() {
	if(this.isAutoplaying) {
		window.clearTimeout(this.timouetID);
		timouetID = -1;
		
		this.isAutoplaying = false;
	}
}

Autoplayer.prototype.getNextDirection = function () {


	var testGrid = this.gameManager.grid.copy();
	
	

    var selectedDirection = this.evaluateMove(testGrid, 0);

    return selectedDirection.direction;
};

Autoplayer.prototype.selectDirection = function(mergeValues) {

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

Autoplayer.prototype.evaluateMove = function (testGrid, movesAhead) {
    // 0: up, 1: right, 2: down, 3: left
    var self = this;

    var cell, tile;

    // Store a value indicating the number of merges made in each direction.
    var mergeValues = [
        { value: 0, canMove: false },
        { value: 0, canMove: false },
        { value: 0, canMove: false },
        { value: 0, canMove: false },
    ];

    // Save the current tile positions and remove merger information
    testGrid.commitMoves();

    var map = {
        0: { x: 0, y: -1 }, // Up
        1: { x: 1, y: 0 },  // Right
        2: { x: 0, y: 1 },  // Down
        3: { x: -1, y: 0 }   // Left
    };

    for (var dir = 0; dir < 4; dir++) {

        var traversals = this.gameManager.buildTraversals(map[dir]);


        // Traverse the grid in the right direction and move tiles
        traversals.x.forEach(function (x) {
            traversals.y.forEach(function (y) {
                cell = { x: x, y: y };
                tile = testGrid.cellContent(cell);

                if (tile) {
                    var positions = testGrid.findFarthestPosition(cell, map[dir]);

                    // We need to know if there is a possible move in this direction.
                    if(!(positions.farthest === cell)) {
                        mergeValues[dir].canMove = true;
                    }

                    var next = testGrid.cellContent(positions.next);

                    // If there is a merge, add its value.
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        mergeValues[dir].value += tile.value * 2;
                        mergeValues[dir].canMove = true;
                    }
                }
            });

        });
    }
	
	if(movesAhead === 0) {
		console.log('Initial Results: '.concat(
			'up - ', mergeValues[0].value,
			' right - ', mergeValues[1].value,
			' down - ', mergeValues[2].value,
			' left - ', mergeValues[3].value
			));
	}
	
	var nextMoveNumber = movesAhead + 1;
	// If we have reached the maximum number of moves to look ahead, stop.
	if(nextMoveNumber < this.maxMovesAhead) {
		
	
		for( var i = 0; i < 4; i++) {
			if(mergeValues[i].canMove) {
			
				var moveGrid = testGrid.copy();
				var traversals = this.gameManager.buildTraversals(map[i]);
				
				moveGrid.move(map[i], traversals);
				
				var nextMoveResults = this.evaluateMove(moveGrid, nextMoveNumber);
				
				mergeValues[i].value += nextMoveResults.value / (2 * nextMoveNumber);
			
			}
		};
	}
	
	var selectedDir = this.selectDirection(mergeValues);
	
	if(movesAhead === 0) {
		console.log('Final Results: '.concat(
			'up - ', mergeValues[0].value,
			' right - ', mergeValues[1].value,
			' down - ', mergeValues[2].value,
			' left - ', mergeValues[3].value
			));
			
		console.log('Selected Direction: '.concat(selectedDir));
	}

    return { direction: selectedDir, value: mergeValues[selectedDir].value };
};