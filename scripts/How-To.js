kogeki.screens["How-To"] = (function() {
	var dom = kogeki.dom,
		firstRun = true;
	
	
	function setup() {
		
		kogeki.dom.bind("#How-To .back", "click", function() {
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