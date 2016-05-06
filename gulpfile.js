var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pkg = require('./package.json');
var ngAnnotate = require('gulp-ng-annotate'),
    minifyCSS = require('gulp-clean-css');

var paths = {
    js: [
        'public/app/js/vendor/jquery.js',
        'public/app/js/vendor/jquery-ui.js',
        'public/app/js/vendor/bootstrap.js',
        'public/app/js/vendor/angular.js',
        'public/app/js/vendor/angular-animate.js',
        'public/app/js/vendor/angular-aria.js',
        'public/app/js/vendor/angular-locale_uk-ua.js',
        'public/app/js/vendor/angular-material.js',
        'public/app/js/vendor/angular-ui-router.js',
        'public/app/js/vendor/ng-file-upload-shim.js',
        'public/app/js/vendor/ng-file-upload.js',
        'public/app/js/vendor/ng-infinite-scroll.js',
        'public/app/js/vendor/satellizer.js',
        'public/app/js/vendor/select2.min.js',
        'public/app/js/app.js',
        'public/app/services/authService.js',
        'public/app/services/userService.js',
        'public/app/services/classifiedService.js',
        'public/app/services/classifiedDB.js',
        'public/app/controllers/home.ctrl.js',
        'public/app/controllers/main.ctrl.js',
        'public/app/controllers/register.ctrl.js',
        'public/app/controllers/newClassified.ctrl.js',
        'public/app/controllers/login.ctrl.js',
        'public/app/controllers/edit.ctrl.js',
        'public/app/controllers/pagination.ctrl.js',
        'public/app/directives/navbar.dir.js'
    ],

    css: [
        'public/app/css/bootstrap.min.css',
        'public/app/css/bootstrap-theme.min.css',
        'public/app/css/bootstrap-theme.min.css.map',
        'public/app/css/angular-material.css'
    ]
/*
    js: [
        'public/app/js/vendor/!*.js',
        'public/app/js/app.js',
        'public/app/services/!*.js',
        'public/app/controllers/!*.js'
    ]
*/
};

gulp.task('uglify', function(){
    gulp.src(paths.js)
        .pipe(concat(pkg.name+'.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('public/app/js/build'));
});

gulp.task('css', function(){
    gulp.src(paths.css)
        .pipe(concat(pkg.name+'.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/app/css/build'));
});

gulp.task('watch', function () {
    gulp.watch(paths.js, ['uglify']);
});

gulp.task('default', ['uglify']);