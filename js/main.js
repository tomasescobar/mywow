angular.module('wow', [

	'angular-loading-bar',
	'ui.router',
	'pascalprecht.translate',

	'wow.filters',
	'wow.services',
	'wow.directives',
	'wow.controllers'
]);

angular.module('wow.filters', []);
angular.module('wow.services', []);
angular.module('wow.directives', []);
angular.module('wow.controllers', []);
/* global appConfig */
angular.module('wow')

// Angular-translate config
.config(['$translateProvider', function($translateProvider) {

	var langRev = appConfig.langRev;
	if (langRev.trim() !== '') {
		langRev = '-' + langRev;
	}
	
	// Set language locale prefix
	$translateProvider.useStaticFilesLoader({
		prefix: '/mywow/lang/',
		suffix: langRev + '.json'
	});

	// Set preferred language
	$translateProvider.preferredLanguage('es');

}])

.run(['$rootScope', function($rootScope) {
	$rootScope.$on('$translateChangeSuccess', function() {
		$rootScope.i18nLoaded = true;
	});
}]);
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
angular.module('wow.directives')

.directive('teWowLevel', [function() {
	return {
		restrict: 'AE',
		templateUrl: '/template/levels/te-wow-level.html',

		link: function(scope, element, attr) {
			scope.levelNumber = 0;

			var levels = [
				{
					number: 1,
					hint: 'Green shows the answer',
					password: ['wizard']
				},
				{
					number: 2,
					bgImg: '/mywow/img/2.jpg',
					hint: 'Have you tried my birthplace? It\'s not Buenos Aires.',
					password: ['san juan']
				},
				{
					number: 3,
					bgImg: '/mywow/img/3.jpg',
					hint: 'A computer is needed to do it',
					password: ['programming', 'code', 'coding', 'computer programming']
				},
				{
					number: 4,
					bgImg: '/mywow/img/5.jpg',
					hint: 'Imparted in schools (and everywhere)',
					password: ['education', 'learning']
				},
				{
					number: 5,
					bgImg: '/mywow/img/4.jpg',
					hint: 'You can enter either the sport or the team I\'m fan of (whose stadium is called "Monumental)"',
					password: ['football', 'soccer', 'river plate', 'river']
				},
				{
					number: 6,
					bgImg: '/mywow/img/6.jpg',
					hint: 'Human beings in general or considered collectively',
					password: ['people', 'group']
				},
			];

			scope.hint = function() {
				scope.level.showHint = true;
			};

			scope.submit = function() {
				for (var i in scope.level.password) {
					if (scope.level.answer.toLowerCase() === scope.level.password[i]) {
						nextLevel();
						return;
					}
				}
				incorrect();
			};

			scope.keyDown = function(e) {
				var keyCode = e.which ? e.which : e.keyCode;

				if (keyCode === 27) {
					scope.level.answer = '';
				} else if (keyCode === 13) {
					scope.submit();
				} else {
					scope.incorrect = false;
				}
			};

			function nextLevel() {
				scope.levelNumber++;
				scope.level = levels[scope.levelNumber-1];
				scope.level.answer = '';
			}

			function incorrect() {
				scope.incorrect = true;
				scope.level.answer = '';
			}

			nextLevel();
		}
	};
}]);
