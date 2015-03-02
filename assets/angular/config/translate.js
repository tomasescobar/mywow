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
		prefix: '/lang/',
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