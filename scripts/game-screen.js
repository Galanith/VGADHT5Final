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
		
		for(i = 0; i < generateRandom(45, 60); i++) {
			stars.push(generateStar());
		}
		
		playArea.appendChild(createBackground());
		playArea.appendChild(canvas);
		requestAnimationFrame(updateAll);
	}
	
	function setup() {
		
	}

	function updateAll() {
		for(var i = 0; i < stars.length; i++) {
			star = stars[i];
			//console.log("Time started: " + star.timeStart);
			//console.log("Time Elapsed: " + Date.now() - star.timeStart + "  Time total: " + star.timeTotal);
			if(Date.now() - star.timeStart >= star.timeTotal) {
				stars.splice(i, 1);
				stars.push(generateStar());
			}
		}
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillRect(0, 0, rect.width, rect.height);
		ctx.fillStyle = "rgb(250, 255, 200)";
		stars.forEach(function(e) {
			if(e.changeCount >= e.changeTime) {
				e.changeCount = 0;
				e.xSize = Math.floor(generateRandom(1, 3));
				e.ySize = Math.floor(generateRandom(1, 3));
			} else {
				e.changeCount++;
			}
			ctx.fillRect(e.x, e.y, e.xSize, e.ySize);
		});
		requestAnimationFrame(updateAll);
	}
	
	function createBackground() {
		var background = document.createElement("canvas"),
			ctx = background.getContext('2d'),
			star;
			
		kogeki.dom.addClass(background, "background");
		background.width = rect.width;
		background.height = rect.height;
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillRect(0, 0, rect.width, rect.height);
		ctx.fillStyle = "rgb(250, 255, 200)";
		stars.forEach(function(e) {
			ctx.fillRect(e.x, e.y, 1, 1);
		});
		return background;
	}

	function generateRandom(min, max){
		return Math.random() * (max - min) + min;
	}
	
	function generateStar() {
		var x = generateRandom(0, rect.width),
				y = generateRandom(0, rect.height),
				timeStart, timeTotal;
				
			timeStart = Date.now();
			timeTotal = generateRandom(2, 6) * 1000;
			star = {
				timeStart: timeStart,
				timeTotal: timeTotal,
				x: x,
				y: y,
				changeCount: 0,
				changeTime: generateRandom(2, 15),
				xSize: 1,
				ySize: 1
			}
		return star;
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