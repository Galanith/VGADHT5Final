kogeki.screens["game-screen"] = (function() {
	var paused, lastFrame = 0,
		speedModifier, blocks,
		firstRun = true,
		rect, stars, startTime,
		numBlocks, spawnTimer,
		lastBlock, timeModifier,
		blocksCap, forgiveArea,
		buffs, imageArray = [],
		scoreMultiplier,
		health, pauseTime;
		
	function startGame() {
		var display = kogeki.display;
		
		
		gameState = {
			score: 0
		};
		blocks = [];
		buffs = []
		scoreMultiplier = 1;
		UpdateGameInfo();
		startTime = Date.now();
		numBlocks = 10;
		blocksCap = 10;
		spawnTimer = 700;
		playerHealth = 30;
		points = 0;
		forgiveArea = 5;
		paused = false;
		lastBlock = Date.now();
		paused = false;
		stars = [];
		speedModifier = 1;
		timeModifier = 1;
		lastFrame = Date.now();
		var $ = kogeki.dom.$,
		playArea = $("#game-screen .play-area")[0];
		$(".health .indicator") [0].style.width = Math.floor(playerHealth / 30 * 100) + "%";
		
		canvas = document.createElement("canvas");
		ctx = canvas.getContext('2d');
		kogeki.dom.addClass(canvas, "playArea");
		
		rect = playArea.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		
		for(i = 0; i < generateRandom(45, 60); i++) {
			stars.push(generateStar());
		}
		
		var dom = kogeki.dom,
			overlay = dom.$("#game-screen .pause-screen")[0];
			overlay.style.display = "none";
			
		playArea.appendChild(canvas);
		requestAnimationFrame(updateAll);
	}
	
	function setup() {
		var dom = kogeki.dom,
			input = kogeki.input;
		dom.bind("button.pause", "click", pauseGame);
		dom.bind(".pause-screen .resume", "click", resumeGame);
		
		for(i = 0; i < 6; i++) {
			imageArray[i] = new Image();
		}
		imageArray[0].src = "images/hourglass.png ";
		imageArray[1].src = "images/scoreup.png";
		imageArray[2].src = "images/damage.png";
		imageArray[3].src = "images/bomb.png";
		imageArray[4].src = "images/x2.png";
		imageArray[5].src = "images/slow.png";
		input.initialize();
		input.bind("destroyBlock", destroyBlock);
	}
	
	
	 function gameOver() {
		kogeki.showScreen("game-over");
	}
	
	function UpdateGameInfo() {
		var $ = kogeki.dom.$;
		$("#game-screen .score span") [0].innerHTML = gameState.score;
	}



	function updateAll() {
		console.log("Time since last frame: " + (Date.now() - lastFrame));
		lastFrame = Date.now();
		if(!paused) {
			timeModifier = 1 + ((Date.now() - startTime) / 240000); 
			blocksCap = 10 + ((Date.now() - startTime) / 40000);
			for(var i = 0; i < stars.length; i++) {
				star = stars[i];
				if(Date.now() - star.timeStart >= star.timeTotal) {
					stars.splice(i, 1);
					stars.push(generateStar());
				}
			}
			
			for(i = 0; i < blocks.length; i++) {
				if(blocks[i].y > rect.height) {
					if(!blocks[i].modifier) {
						playerHealth--;
						kogeki.gameAudio.damage.currentTime = 0;
						kogeki.gameAudio.damage.play();
						if(playerHealth <= 0) {
							paused = true;
							gameOver();
							return;
						}
					}
					blocks.splice(i, 1);
					var $ = kogeki.dom.$;
					$(".health .indicator") [0].style.width = Math.floor(playerHealth / 30 * 100) + "%";
				}
			}
			
			
			if(Date.now() - lastBlock >= spawnTimer && numBlocks < blocksCap) {
				if(spawnTimer > 300) {
					spawnTimer -= 1;
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
				e.y += (e.speed * speedModifier * timeModifier);
				ctx.fillRect(e.x, e.y, e.sizeX, e.sizeY);
				if(e.modifier) {
					switch(e.modifier) {
						case "slowDown":
							ctx.drawImage(imageArray[0], e.x, e.y, e.sizeX, e.sizeY);
							break;
						case "speedUp":
							ctx.drawImage(imageArray[1], e.x, e.y, e.sizeX, e.sizeY);
							break;
						case "damage":
							ctx.drawImage(imageArray[2], e.x, e.y, e.sizeX, e.sizeY);
							break;
						case "bomb":
							ctx.drawImage(imageArray[3], e.x, e.y, e.sizeX, e.sizeY);
							break;
					}
				}
			});
			
			for(i = 0; i < buffs.length; i++) {
				if(buffs[i].isBuff == true) {
					ctx.fillStyle = "rgb(0, 255, 0)";
					ctx.beginPath();
					ctx.arc(((i + 1) * 50) + 25, 35, 12, 0, 2 * Math.PI);
					ctx.fill();
					ctx.arc(((i + 1) * 50) + 25, 35, 22, 0, 2 * Math.PI * ((Date.now() - buffs[i].startTime) / buffs[i].totalTime));
					ctx.lineTo(((i + 1) * 50) + 25, 35);
					ctx.fill();
					ctx.drawImage(imageArray[5], (i + 1) * 50, 10, 50, 50);
				} else {
					ctx.fillStyle = "rgb(255, 0, 0)";
					ctx.beginPath();
					ctx.arc(((i + 1) * 50) + 25, 30, 15, 0, 2 * Math.PI);
					ctx.fill();
					ctx.arc(((i + 1) * 50) + 25, 30, 24, 0, 2 * Math.PI * ((Date.now() - buffs[i].startTime) / buffs[i].totalTime));
					ctx.lineTo(((i + 1) * 50) + 25, 30);
					ctx.fill();
					ctx.drawImage(imageArray[4], (i + 1) * 50, 5, 50, 50);
				}
				if(Date.now() - buffs[i].startTime >= buffs[i].totalTime) {
					if(buffs[i].isBuff == true) {
						speedModifier += 0.5;
					} else {
						speedModifier -= 0.5;
					}
					buffs.splice(i, 1);
				}
			}
		}
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
									} else {
									}
									break;
								case "slowDown":
									blocks.splice(i, 1);
									if(!isBuffActive(true)) {
										buffs.push(generateBuff(10000, true));
									} else {
									} 
									break;
								case "damage":
									console.log("Damage");
									console.log(playerHealth);
									playerHealth--;
									console.log(playerHealth);
									if(playerHealth <= 0) {
										paused = true;
										gameOver();
									}
									blocks.splice(i, 1);
									break;
								case "bomb":
									addScore(blocks.length * 50);
									blocks = [];
									break;
							}
							return;
						} else {
							blocks.splice(i, 1);
							addScore(100 * scoreMultiplier);
							scoreMultiplier += 0.1;
							return;
						}
					}
				} 
			}
		}
		scoreMultiplier = 1;
		return;

	}
	
	function addScore(points) {
		var settings = kogeki.settings;
		gameState.score += points;
		UpdateGameInfo();
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
			isBuff: isBuff,
		}
		return buff;
	}
	
	function isBuffActive(buff) {
		for(i = 0; i < buffs.length; i++) {
			if(buffs[i].isBuff == buff) {
				buffs[i].startTime = Date.now();
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
				switch(Math.floor(generateRandom(1, 5))) {
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
		pauseTime = Date.now();
		paused = true;
		kogeki.gameAudio.level_bgm.pause();
		var dom = kogeki.dom,
			overlay = dom.$("#game-screen .pause-screen")[0];
			overlay.style.display = "block";
	}	
	
	function resumeGame() {
		startTime += Date.now() - pauseTime;
		paused = false;
		kogeki.gameAudio.level_bgm.play();
		var dom = kogeki.dom,
			overlay = dom.$("#game-screen .pause-screen")[0];
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
			kogeki.gameAudio.menu_bgm.pause();
			kogeki.gameAudio.level_bgm.currentTime = 0;
			kogeki.gameAudio.level_bgm.play();
			firstRun = false;
		}
		startGame();
	}
	
	return {
		run : run
	};
}) ();