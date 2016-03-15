angular
    .module("classifieds", ['ngMaterial', 'ui.router', 'authService', 'userCtrl', 'userService', 'classifiedService'])
   /* .module("classifieds", ["ngMaterial", "ui.router", "firebase"])

    .constant('FIREBASE_URL', 'https://class1f1eds.firebaseio.com/')*/

    .config(function ($mdThemingProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('orange');

        $httpProvider.interceptors.push('AuthInterceptor');

        $urlRouterProvider.when('', '/classifieds');

        $stateProvider
            .state('/', {
                url: '/classifieds',
                templateUrl: 'app/views/pages/classifieds.tpl.html',
                controller: 'classifiedsCtrl as vm'
            })
            .state('classifieds.login', {
                url: '/login',
                templateUrl: 'app/views/pages/classifieds.login.tpl.html',
                controller: 'classifiedsCtrl as vm'
            })
            .state('classifieds.register', {
                url: '/register',
                templateUrl: 'app/views/pages/classifieds.register.tpl.html',
                controller: 'UserCreateController as vm'
            })
            .state('classifieds', {
                url: '/classifieds',
                templateUrl: 'app/views/pages/classifieds.tpl.html',
                controller: 'classifiedsCtrl as vm'
            })
            .state('classifieds.new', {
                url: '/new',
                templateUrl: 'app/views/pages/classifieds.new.tpl.html',
                controller: 'ClassifiedController as vm'
            })
            /*.state('classifieds.edit', {
                url: '/edit/:id',
                templateUrl: 'app/views/pages/classifieds.edit.tpl.html',
                controller: 'editClassifiedsCtrl as vm',
                params: {
                    classified: null
                }
            })*/
    });