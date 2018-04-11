kogeki.screens["game-over"] = (function() {
	var dom = kogeki.dom,
		firstRun = true;
	
	
	function setup() {
		
		kogeki.dom.bind("#game-over .main-menu", "click", function() {
			kogeki.showScreen("main-menu");
			
		
		});
		
	}
	
	function run () {
		if (firstRun) {
			setup(),
			firstRun = false;
		}
		
	}
	
	return {
		run:run
	};
	
}) ();