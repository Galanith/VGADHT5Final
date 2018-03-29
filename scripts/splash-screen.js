kogeki.screens["splash-screen"] = (function() {
	var firstRun = true;
	
	function checkProgress() {
		var $ = kogeki.dom.$,
		p = kogeki.getLoadProgress() * 100;
		$(".progress .indicator") [0].style.width = p + "%";
		
		if (p ==  100) {
			setup();
		}
		else {
			setTimeout(checkProgress, 30);
		}	
	}
	function setup() {
		kogeki.dom.bind("#splash-screen", "click", function() {
			jewel.showScreen("main-menu");
		});
	}
	
	function run() {
		if(firstRun) {
			checkProgress();
			firstRun = false;
		}
		
	}
	
	return {
		run : run
	};
	
	
})();