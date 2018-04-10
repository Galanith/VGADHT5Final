kogeki.screens["Game-over"] = (function() {
	var dom = kogeki.dom,
		firstRun = true;
	
	
	function setup() {
		
		kogeki.dom.bind("#Game-Over .main-menu", "click", function() {
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