kogeki.input = (function() {
	var inputHandlers;
	
	function initialize() {
		var dom = kogeki.dom,
		$ = dom.$,
		controls = kogeki.settings.controls,
		playArea = $("#game-screen .play-area")[0];
		
	inputHandlers = {};
	dom.bind(playArea, "mousedown", function(event) {
		handleClick(event, "CLICK", event);
	});
	dom.bind(playArea, "touchstart", function(event) {
		handleClick(event, "TOUCH", event.targetTouches[0]);
	});
	}
	
	function bind(action, handler) {
		if(!inputHandlers[action]) {
			inputHandlers[action] = [];
		}
		inputHandlers[action].push(handler);
	}
	
	function trigger(action) {
		var handlers = inputHandlers[action],
			args = Array.prototype.slice.call(arguments, 1);
			
			args.forEach(function(e) {
			});
			
			if(handlers){
				for (var i = 0; i < handlers.length; i++) {
					handlers[i].apply(null,args);
				}
			}
		}
		
	function handleClick(event, control, click) {
		var settings = kogeki.settings,
		action = settings.controls[control];
		
		if(!action) {
			return;
		}
		
		var playArea = kogeki.dom.$("#game-screen .play-area")[0],
			rect = playArea.getBoundingClientRect(),
			relX, relY,
			
			relX = click.clientX - rect.left;
			relY = click.clientY - rect.top; 
			trigger(action, relX, relY);
			event.preventDefault();
	}
	
	return {
		initialize: initialize,
		bind: bind
	};
})();