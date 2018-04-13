var kogeki = (function() {
	var scriptQueue = [],
	numResources = 0,
	numResourcesLoaded = 0,
	executeRunning = false;
	
	var settings = {
		baseScore: 100,
		controls: {
			CLICK: "destroyBlock",
			TOUCH: "destroyBlock"
		}
	};
	
	var gameAudio = {};
	
	function executeScriptQueue() {
		var next = scriptQueue[0],
		first, script;
		
		if (next && next.loaded) {
			executeRunning = true;
			scriptQueue.shift();
			first = document.getElementsByTagName('script')[0];
			script = document.createElement('script');
			script.onload = function() {
				if (next.callback) {
					next.callback();
				}
				executeScriptQueue();
			};
			script.src = next.src;
			first.parentNode.insertBefore(script, first);
		}
		else{
			executeRunning = false;
		}
	}
	
	function load(src,callback) {
		var image, queueEntry;
		numResources++;
		
		queueEntry = {
			src : src,
			callback : callback, loaded : false
		}
		scriptQueue.push(queueEntry);
		
		image = new Image();
		image.onload = image.onerror = function() {
			numResourcesLoaded++;
			queueEntry.loaded = true;
			if(!executeRunning) {
				executeScriptQueue();
			}
		};
		image.src = src;
	}
	
	
	
	function getLoadProgress() {
		return numResourcesLoaded / numResources;
	}
	
	function setup() {
		kogeki.showScreen("splash-screen");
		gameAudio.damage = document.getElementById("damage");
		gameAudio.button_press = document.getElementById("button_press");
		gameAudio.button_hover = document.getElementById("button_hover");
		gameAudio.menu_bgm = document.getElementById("menu_bgm");
		gameAudio.level_bgm = document.getElementById("level_bgm");
	}
	
	function showScreen(screenID) {
		var dom = kogeki.dom,
		$ = dom.$,
		activeScreen = $("#game .screen.active")[0],
		screen = $("#" + screenID)[0];
		
		
		if (activeScreen) {
			dom.removeClass(activeScreen, "active");
		}
		dom.addClass(screen, "active");
		kogeki.screens[screenID].run();

	}
	
	return {
		load : load,
		setup : setup,
		showScreen : showScreen,
		settings : settings,
		gameAudio: gameAudio,
		screens : {},
		getLoadProgress : getLoadProgress
	};
	
	
})();