// Gulp dependencies
var
	gulp            = require('gulp'),
	less            = require('gulp-less'),
	autoprefixer    = require('gulp-autoprefixer'),
	csso            = require('gulp-csso'),
	uglify          = require('gulp-uglify'),
	clean           = require('gulp-clean'),
	concat          = require('gulp-concat'),
	inject          = require('gulp-inject'),
	bower           = require('main-bower-files'),
	rev             = require('gulp-rev'),
	extend          = require('gulp-extend'),
	gulpif          = require('gulp-if'),
	gulpfilter      = require('gulp-filter'),
	minifyHTML      = require('gulp-minify-html'),
	templateCache   = require('gulp-angular-templatecache'),
	template        = require('gulp-template'),
	tap             = require('gulp-tap'),

	argv            = require('yargs').argv,

	// Needed for directory iteration
	fs              = require('fs'),
	path            = require('path'),
	es              = require('event-stream');


var target = {
	css: './public/css',
	js: './public/js',
	locales: './public/lang',
	templates: './public/template',
	public: './public'
};

var paths = {
	less: './assets/less/main.less',
	css: './assets/css/*.css',
	angular: './assets/angular/**/*.js',
	scripts: './assets/js/**/*.js',
	locales: './assets/locales/',
	templates: ['./assets/templates/partials/**/*.html','./assets/angular/**/*.html'],
	mainFile: './assets/templates/index.html'
};

// Production
var production = argv.production || argv.prod;

var appConfig = {
	appName: 'wow',
	langRev: '',
	domain: '',
};

// Get directories
function getDirectories(dir){
	return fs.readdirSync(dir)
		.filter(function(file){
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}

var minifyRules = {
	quotes: true,
	empty: true
};

gulp.task('build', ['inject-html']);

// Minify HTML
gulp.task('minify-html-templates', function() {
	return gulp.src(paths.templates )
		.pipe(minifyHTML(minifyRules))
		.pipe(gulp.dest(target.templates))
		.pipe(templateCache({ module : appConfig.appName, filename:'templates.js', root:'/template/' }))
		.pipe(gulpif(production, uglify()))
		.pipe(gulpif(production, rev()))
		.pipe(gulp.dest(target.js));
});

// Inject css and script refs to HTML
gulp.task('inject-html', ['styles', 'scripts-libs', 'scripts-main','minify-html-templates', 'locales', 'clean-tmp'], function() {
	return gulp.src(paths.mainFile)
		.pipe(inject(gulp.src([
			target.css+'/*.css',
			// JS in order !important
			target.js+'/lib*.js',
			target.js+'/main*.js',
			target.js+'/templates*.js'
		], {read:false}), {
			addPrefix: production ? appConfig.domain : '',
			addRootSlash: production ? false : true,
			ignorePath: '/public'
		}))
		.pipe(template({APP_CONFIG: JSON.stringify(appConfig)}))
		.pipe(minifyHTML(minifyRules))
		.pipe(gulp.dest(target.public));
});

// Styles (autoprefixer, minify)
gulp.task('styles', ['clean-old-styles', 'build-css', 'build-less'], function() {
	return gulp.src('./assets/tmp/*.css')
		.pipe(concat('main.css'))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'ios 6', 'android 4'))
		.pipe(gulpif(production, csso()))
		.pipe(gulpif(production, rev()))
		.pipe(gulp.dest(target.css));
});

// Clean old CSS
gulp.task('clean-old-styles', function() {
	return gulp.src(target.css+'/main*.css', {read:false})
		.pipe(clean({force: true}));
});

// Concat CSS
gulp.task('build-css', function() {
	return gulp.src(paths.css)
		.pipe(concat('all.css'))
		.pipe(gulp.dest('./assets/tmp'));
});

// Compile LESS -> CSS
gulp.task('build-less', function() {
	return gulp.src(paths.less)
		.pipe(less())
		.pipe(concat('less.css'))
		.pipe(gulp.dest('./assets/tmp'));
});

// Limpiar archivos temporales creados
gulp.task('clean-tmp', function() {
	return gulp.src('./assets/tmp/*', {read:false})
		.pipe(clean({force: true}));
});

// Main JS files (angular app)
gulp.task('scripts-main', ['scripts-libs'], function() {
	return gulp.src([paths.angular])
		.pipe(concat('main.js'))
		.pipe(gulpif(production, uglify()))
		.pipe(gulpif(production, rev()))
		.pipe(gulp.dest(target.js));
});

// Extend and concat locales by language
gulp.task('locales', function() {
	var dirs = getDirectories(paths.locales);

	var tasks = dirs.map(function(dir) {
		return gulp.src(path.join(paths.locales, dir, '/*.json'))
			.pipe(extend(dir + '.json'))
			.pipe(gulp.dest(target.locales));
	});

	return es.concat.apply(null, tasks);
});

// Extend and concat locales by language
gulp.task('locales', function() {
	var dirs = getDirectories(paths.locales);

	var tasks = dirs.map(function(dir) {
		return gulp.src(path.join(paths.locales, dir, '/*.json'))
			.pipe(extend(dir + '.json'))
			.pipe(gulpif(production, rev()))
			.pipe(tap(function(file) {
				if (production) {
					appConfig.langRev = path.basename(file.path, '.json').replace(/^[a-z]+-/i, '');
				}
			}))
			.pipe(gulp.dest(target.locales));
	});

	return es.concat.apply(null, tasks);
});

// Scripts JS
gulp.task('scripts-libs', ['clean-old-scripts'], function() {
	return gulp.src(bower().concat([paths.scripts]))
		.pipe(concat('lib.js'))
		.pipe(gulpif(production, uglify()))
		.pipe(gulpif(production, rev()))
		.pipe(gulp.dest(target.js));
});

// Limpiar viejos JS
gulp.task('clean-old-scripts', function() {
	return gulp.src([
			target.js+'/*.js',
			// Locales
			target.locales+'/**/*.json',
		], {read:false})
		.pipe(clean({force: true}));
});

// Watch
gulp.task('watch', function() {
	gulp.watch('./assets/less/**/*.less', ['build']);
	gulp.watch('./assets/css/**/*.css', ['build']);
	gulp.watch('./assets/angular/**/*.js', ['build']);
	gulp.watch('./assets/angular/**/*.html', ['build']);
	gulp.watch('./assets/angular/**/*.less', ['build']);
	gulp.watch('./assets/js/**/*.js', ['build']);
	gulp.watch('./assets/locales/**/*.json', ['build']);
	gulp.watch('./assets/templates/**/*.html', ['build']);
});

// Default (starts watch)
gulp.task('default', production ? ['build'] : ['build', 'watch']);
