var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pkg = require('./package.json');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('uglify', function(){
    gulp.src(paths.js)
        .pipe(concat('classifieds.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('public/app/js/build'));
});

var paths = {
    js: [
        'public/app/js/vendor/jquery.js',
        'public/app/js/vendor/bootstrap.js',
        'public/app/js/vendor/angular.js',
        'public/app/js/vendor/angular-animate.js',
        'public/app/js/vendor/angular-ui-router.js',
        'public/app/js/vendor/angular-aria.js',
        'public/app/js/vendor/angular-locale_uk-ua.js',
        'public/app/js/vendor/angular-material.js',
        'public/app/js/app.js',
        'public/app/services/authService.js',
        'public/app/services/userService.js',
        'public/app/services/classifiedService.js',
        'public/app/controllers/main.ctrl.js',
        'public/app/controllers/user.ctrl.js',
        'public/app/controllers/classified.ctrl.js',
        'public/app/controllers/login.ctrl.js',
        'public/app/directives/classified-card.dir.js'
    ]
};