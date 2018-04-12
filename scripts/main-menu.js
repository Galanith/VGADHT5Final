kogeki.screens["main-menu"] = (function() {
	var dom = kogeki.dom,
	firstRun = true;
	
	function setup() {
			dom.bind("#main-menu ul.menu", "click", function(e) {
				if (e.target.nodeName.toLowerCase() === "button") {
					var action = e.target.getAttribute("name");
					kogeki.gameAudio.button_press.play();
					kogeki.showScreen(action);
					console.log(action);
				}
			
				
			});
			
			dom.bind("#main-menu ul.menu", "mouseover", function(e) {
				if (e.target.nodeName.toLowerCase() === "button") {
					var action = e.target.getAttribute("name");
					kogeki.gameAudio.button_hover.play();
					console.log(action);
				}
			
				
			});
		
	}
	
	function run () {
		if (firstRun) {
			setup(),
			kogeki.gameAudio.level_bgm.pause();
			kogeki.gameAudio.menu_bgm.currentTime = 0;
			kogeki.gameAudio.menu_bgm.play();
			firstRun = false;
		}
		
	}
		
	return {
	run : run
	};	


})();