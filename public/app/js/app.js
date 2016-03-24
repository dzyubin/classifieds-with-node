angular
    .module("classifieds", ['ngMaterial', 'ui.router', 'authService', 'userCtrl', 'userService', 'classifiedService'])

    .config(function ($mdThemingProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('orange');

        $httpProvider.interceptors.push('AuthInterceptor');

        // uncommenting this line fixes problem with new classified form
        //$urlRouterProvider.when('', '/classifieds');

        $stateProvider
            .state('/', {
                url: '/classifieds',
                templateUrl: 'app/views/pages/main.tpl.html',
                controller: 'classifiedsCtrl as vm'
            })
            .state('classifieds.login', {
                url: '/login',
                templateUrl: 'app/views/pages/login.tpl.html',
                controller: 'loginClassifiedsCtrl as vm'
            })
            .state('classifieds.register', {
                url: '/register',
                templateUrl: 'app/views/pages/register.tpl.html',
                controller: 'UserCreateController as vm'
            })
            .state('classifieds', {
                url: '/classifieds',
                templateUrl: 'app/views/pages/main.tpl.html',
                controller: 'classifiedsCtrl as vm'
            })
            .state('classifieds.new', {
                url: '/new',
                templateUrl: 'app/views/pages/new.tpl.html',
                controller: 'ClassifiedController as vm'
            });
            /*.state('classifieds.edit', {
                url: '/edit/:id',
                templateUrl: 'app/views/pages/edit.tpl.html',
                controller: 'editClassifiedsCtrl as vm',
                params: {
                    classified: null
                }
            })*/
    });