kogeki.screens["game-screen"] = (function() {
	var paused, blockSpeed,
		speedModifier = 1, blocks = [],
		firstRun = true,
		rect, stars= [];
		
	function startGame() {
		var $ = kogeki.dom.$,
		playArea = $("#game-screen .play-area")[0];
		
		canvas = document.createElement("canvas");
		ctx = canvas.getContext('2d');
		kogeki.dom.addClass(canvas, "playArea");
		
		rect = playArea.getBoundingClientRect();
		console.log(rect.width + ", " + rect.height);
		canvas.width = rect.width;
		canvas.height = rect.height;
		
		playArea.appendChild(createBackground());
		playArea.appendChild(canvas);
	}
	
	function setup() {
		
	}

	function createBackground() {
		var background = document.createElement("canvas"),
			ctx = background.getContext('2d');
			
		kogeki.dom.addClass(background, "background");
		background.width = rect.width;
		background.height = rect.height;
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillRect(0, 0, rect.width, rect.height);
		ctx.fillStyle = "rgb(250, 255, 200)";
		for(i = 0; i < generateRandom(20, 50); i++) {
			console.log("Memes!");
			var x = generateRandom(0, rect.width),
				y = generateRandom(0, rect.height);
			ctx.fillRect(x, y, 1, 1);
		}
		return background;
	}

	function generateRandom(min, max){
		return Math.random() * (max - min) + min;
	}
	
	function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		startGame();
	}
	
	return {
		run : run
	};
}) ();