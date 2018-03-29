kogeki.screens["How-To"] = (function() {
	var dom = kogeki.dom,
		firstRun = true;
	
	
	function setup() {
		kogeki.dom.bind("#main-menu", "click", function() {
			kogeki.showScreen("How-To");
			
		kogeki.dom.bind("#How-To", "click", function() {
			kogeki.showScreen("main-menu");
			});
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