define([], function() {
	var test = {
		start: function(photos) {
			console.log('hey');
			// 
			swampdragon.ready(function () {
				swampdragon.subscribe('photo', 'local-channel', {id: 1}, function (context, data) {
					//debugger;
				}, function (context, data) {
					//debugger
				});
				swampdragon.getSingle('photo', {id:1}, function (context, data) { debugger; }, function (context, data) { debugger; } );
        	});
		}
	}
	return test;
});