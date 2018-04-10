kogeki.screens["game-screen"] = (function() {
	var paused, blockSpeed,
		speedModifier = 1, blocks = [],
		firstRun = true,
		rect, stars= [], startTime,
		numBlocks, spawnTimer,
		lastBlock, timeModifier = 1,
		blocksCap;
		
	function startGame() {
		startTime = Date.now();
		numBlocks = 10;
		blocksCap = 10;
		spawnTimer = 700;
		playerHealth = 10;
		points = 0;
		lastBlock = Date.now();
		var $ = kogeki.dom.$,
		playArea = $("#game-screen .play-area")[0];
		
		canvas = document.createElement("canvas");
		ctx = canvas.getContext('2d');
		kogeki.dom.addClass(canvas, "playArea");
		
		rect = playArea.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		
		for(i = 0; i < generateRandom(45, 60); i++) {
			stars.push(generateStar());
		}
		
		playArea.appendChild(canvas);
		requestAnimationFrame(updateAll);
	}
	
	function setup() {
		var dom = kogeki.dom;
		
		
		var input = kogeki.input;
		input.initialize();
		input.bind("destroyBlock", destroyBlock);
	}

	function updateAll() {
		timeModifier = 1 + ((Date.now() - startTime) / 50000); 
		blocksCap = 10 + ((Date.now() - startTime) / 10000);
		for(var i = 0; i < stars.length; i++) {
			star = stars[i];
			if(Date.now() - star.timeStart >= star.timeTotal) {
				stars.splice(i, 1);
				stars.push(generateStar());
			}
		}
		
		for(i = 0; i < blocks.length; i++) {
			if(blocks[i].y > rect.height) {
				blocks.splice(i, 1);
				playerHealth--;
			}
		}
		
		
		
		if(Date.now() - lastBlock >= spawnTimer && numBlocks < blocksCap) {
			if(spawnTimer > 200) {
				spawnTimer -= 2;
			}
			lastBlock = Date.now();
			blocks.push(generateBlock());
			console.log(spawnTimer);
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
		
		blocks.forEach(function(e) {
			ctx.fillStyle = "rgb(" + e.r + ", " + e.g + ", " + e.b + ")";
			e.y = Math.floor(e.y + (e.speed * speedModifier * timeModifier));
			ctx.fillRect(e.x, e.y, e.sizeX, e.sizeY);
		});
		
		requestAnimationFrame(updateAll);
	}
	
	function destroyBlock(relX, relY) {
		if(arguments.length == 0) {
			blocks.forEach(function(e) {
			if(e.y == relY && e.y + e.height == relY) {
					blocks.splice(e);
					console.log("destroy");
				} 
			if (e.x == relX && e.x + e.width == relX) {
				blocks.splice(e);
				console.log("destroy");
			}
		});
		return;
		}
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
	
	function generateBlock() {
		var sizeX = Math.floor(generateRandom(20, 50)),
			sizeY = sizeX,
			x = Math.floor(generateRandom(0, rect.width - sizeX)),
			y = -sizeY,
			speed = generateRandom(1, 6),
			modifier, 
			r = Math.floor(generateRandom(100, 255)),
			g = Math.floor(generateRandom(100, 255)),
			b = Math.floor(generateRandom(100, 255));
		block = {
			sizeX: sizeX,
			sizeY: sizeY,
			x: x,
			y: y,
			speed: speed,
			modifier: modifier,
			r: r,
			g: g,
			b: b
		}
		return block;	
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