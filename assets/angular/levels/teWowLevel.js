angular.module('wow.directives')

.directive('teWowLevel', [function() {
	return {
		restrict: 'AE',
		templateUrl: '/template/levels/te-wow-level.html',

		link: function(scope, element, attr) {
			scope.levelNumber = 4;

			var levels = [
				{
					number: 1,
					hint: 'Green shows the answer',
					password: ['wizard']
				},
				{
					number: 2,
					bgImg: '/img/2.jpg',
					hint: 'Have you tried my birthplace? It\'s not Buenos Aires.',
					password: ['san juan']
				},
				{
					number: 3,
					bgImg: '/img/3.jpg',
					hint: 'A computer is needed to do it',
					password: ['programming', 'code', 'coding', 'computer programming']
				},
				{
					number: 4,
					bgImg: '/img/5.jpg',
					hint: 'Imparted in schools (and everywhere)',
					password: ['education', 'learning']
				},
				{
					number: 5,
					bgImg: '/img/4.jpg',
					hint: 'You can enter either the sport or the team I\'m fan of (whose stadium is called "Monumental)"',
					password: ['football', 'soccer', 'river plate', 'river']
				},
				{
					number: 6,
					bgImg: '/img/6.jpg',
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
