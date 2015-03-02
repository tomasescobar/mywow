angular.module('wow.directives')

// Set background image
.directive('teBackImg', ['$parse', function($parse) {
	return function(scope, element, attrs){
		attrs.$observe('teBackImg', function(value) {
			var url = value.indexOf('http') === 0 ? value : $parse(value)(scope);
			element.css({
				'background-image': 'url(' + url +')'
			});
		});
	};
}]);