kogeki.screens["How-To"] = (function() {
	var dom = kogeki.dom,
		firstRun = true;
	
	
	function setup() {
		kogeki.dom.bind("#main-menu ul.menu", "click", function() {
			kogeki.showScreen("How-To");
		});
	}
	
	function run () {
		if (firstRun) {
			setup(),
			firstRun = false;
		}
		
	}
	
}) ();