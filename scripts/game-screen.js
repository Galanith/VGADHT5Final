kogeki.screens["game-screen"] = (function() {
	var paused, blockSpeed,
		speedModifier = 1, blocks = [];
		
	function newGame() {
		canvas = document.createElement("canvas");
		ctx = canvas.getContext('2d');
		kogeki.dom.addClass(canvas, "playArea");
	}



}