kogeki.screens["main-menu"] = (function() {
	var dom = kogeki.dom,
	firstRun = true;
	
	function setup() {
			dom.bind("#main-menu ul.menu", "click", function(e) {
				if (e.target.nodeName.toLowerCase() === "button") {
					var action = e.target.getAttribute("name");
					kogeki.showScreen(action);
					console.log(action);
				}
			
				
			});
		
	}
	
	function run () {
		if (firstRun) {
			setup(),
			firstRun = false;
		}
		
	}
		
	return {
	run : run
	};	


})();