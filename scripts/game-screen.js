kogeki.screens["game-screen"] = (function() {
	var paused, blockSpeed,
		speedModifier = 1, blocks = [],
		firstRun = true,
		rect, stars = [], startTime,
		numBlocks, spawnTimer,
		lastBlock, timeModifier = 1,
		blocksCap, forgiveArea,
		buffs = [];
		
	function startGame() {
		var display = kogeki.display;
		
		
		gameState = {
			score: 0
		};
		
		UpdateGameInfo();
		startTime = Date.now();
		numBlocks = 10;
		blocksCap = 10;
		spawnTimer = 700;
		playerHealth = 10;
		points = 0;
		forgiveArea = 5;
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
		
		pause = false; 
		
		var dom = kogeki.dom,
			overlay = dom.$("#game-screen .pause-screen")[0];
			overlay.style.display = "none";
	}
	
	function setup() {
		var dom = kogeki.dom;
		
		
		var input = kogeki.input;
		input.initialize();
		input.bind("destroyBlock", destroyBlock);
	}
<<<<<<< HEAD
=======
	
	 function gameOver() {
		setTimeout(function() {
			kogeki.showScreen("game-over");
		}, 5000);
		
	}
	
	function UpdateGameInfo() {
		var $ = kogeki.dom.$;
		$("#game-screen .score span") [0].innerHTML = gameState.score;
	}
>>>>>>> 0aea2f7fb76060bb327075b1ed9dc3be2a1628a4

	function updateAll() {
		//timeModifier = 1 + ((Date.now() - startTime) / 50000); 
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
		
		for(i = 0; i < buffs.length; i++) {
			if(Date.now() - buffs[i].startTime >= buffs[i].totalTime) {
				if(buffs[i].isBuff == true) {
					speedModifier += 0.5;
				} else {
					speedModifier -= 0.5;
				}
				buffs.splice(i, 1);
			}
		}
		
		
		if(Date.now() - lastBlock >= spawnTimer && numBlocks < blocksCap) {
			if(spawnTimer > 200) {
				spawnTimer -= 2;
			}
			lastBlock = Date.now();
			blocks.push(generateBlock());
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
			e.y = e.y + (e.speed * speedModifier * timeModifier);
			ctx.fillRect(e.x, e.y, e.sizeX, e.sizeY);
		});
		
		requestAnimationFrame(updateAll);
	}
	
	function destroyBlock(relX, relY) {
		if(arguments.length > 0) {
			for(i = 0; i < blocks.length; i++) {
				if(relY >= blocks[i].y - forgiveArea && relY <= blocks[i].sizeY + blocks[i].y + forgiveArea) {
					if (relX >= blocks[i].x - forgiveArea && relX <= blocks[i].sizeX + blocks[i].x + forgiveArea) {
						if(blocks[i].modifier) {
							switch(blocks[i].modifier) {
								case "speedUp":
									blocks.splice(i, 1);
									if(!isBuffActive(false)) {
										buffs.push(generateBuff(10000, false));
										console.log("Speed up!");
									} else {
										console.log("Buff already active!");
									}
									break;
								case "slowDown":
									blocks.splice(i, 1);
									if(!isBuffActive(true)) {
										buffs.push(generateBuff(10000, true));
										console.log("Slow down!");
									} else {
										console.log("Buff already active!");
									} 
									break;
								case "damage":
									// Do damage
									blocks.splice(i, 1);
									break;
								case "bomb":
									blocks = [];
									break;
							}
						} else {
							blocks.splice(i, 1);
							return;
						}
					}
				} 
			}
		}
		return;
		}
	} 
<<<<<<< HEAD
=======
	
	function addScore(points) {
		var settings = kogeki.settings;
		
		UpdateGameInfo();
	}
>>>>>>> 0aea2f7fb76060bb327075b1ed9dc3be2a1628a4

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
	
	function generateBuff(totalTime, isBuff) {
		var startTime = Date.now(),
			totalTime = totalTime, 
			isBuff = isBuff;
		
		if(isBuff) {
			speedModifier -= 0.5;
		} else {
			speedModifier += 0.5;
		}
		buff = {
			startTime: startTime,
			totalTime: totalTime,
			isBuff: isBuff
		}
		return buff;
	}
	
	function isBuffActive(buff) {
		for(i = 0; i < buffs.length; i++) {
			if(buffs[i].isBuff == buff) {
				return true;
			}
		}
		return false;
	}
	
	function generateBlock() {
		var sizeX = Math.floor(generateRandom(35, 50)),
			sizeY = sizeX,
			x = Math.floor(generateRandom(0, rect.width - sizeX)),
			y = -sizeY,
			speed = generateRandom(1, 5),
			modifier = "", 
			r = Math.floor(generateRandom(100, 255)),
			g = Math.floor(generateRandom(100, 255)),
			b = Math.floor(generateRandom(100, 255));
			if(generateRandom(1, 100) >= 90) {
				var x = Math.floor(generateRandom(1, 5));
				switch(x) {
					case 1:
						modifier += "speedUp";
						break;
					case 2:
						modifier += "slowDown";
						break;
					case 3:
						modifier += "damage";
						break;
					case 4:
						modifier += "bomb";
						break;
				}
				console.log("Modifier spawned of type: " + modifier);
				speed = 1;
			}
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
	
	function pauseGame(){
		if(paused) {
			return;
		}
		
		paused = true;
		var dom = kogeki.dom,
	overlay = dom.$("#game-screen .pause-screen", "click")[0];
			overlay.style.display = "block";
	}	
	
	function resumeGame() {
		paused = false;
		var dom = kogeki.dom,
			overlay = dome.$("#game-screen .pause-screen", "click")[0];
			overlay.style.display = "none";
	}
	
	function exitGame() {
		pauseGame();
		var confirmed = window.confirm(
		"Running away HooMANS, Back to Main Menu?");
		
		if(confirmed) {
			kogeki.showScreen("main-menu");
		}
		else {
			resumeGame();
		}
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