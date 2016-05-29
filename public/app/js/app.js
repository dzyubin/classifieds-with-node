angular
    .module("classifieds", ['ngMaterial', 'ui.router', 'ngFileUpload', 'infinite-scroll', 'authService', 'userCtrl', 'userService', 'classifiedService', 'classifiedDBService', 'satellizer'])

    .config(function ($mdThemingProvider, $stateProvider, $urlRouterProvider, $httpProvider, $authProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('orange');

        $httpProvider.interceptors.push('AuthInterceptor');

        $authProvider.facebook({
            clientId: '1019357971452075'
        });

        $authProvider.linkedin({
            clientId: '77nj3q7ec8pekm'
        });

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/views/pages/home.tpl.html',
                controller: 'homeCtrl as vm'
            })
            .state('all-classifieds', {
                url: '/all-classifieds/:category',
                templateUrl: 'app/views/pages/classifieds.tpl.html',
                controller: 'PaginationCtrl as data',
                resolve: {
                    userClassifieds: function () {
                        return false;
                    }
                }
            })
            .state('my-classifieds', {
                url: '/my-classifieds/:category',
                templateUrl: 'app/views/pages/classifieds.tpl.html',
                controller: 'PaginationCtrl as data',
                resolve: {
                    userClassifieds: function () {
                        return true;
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/views/pages/login.tpl.html',
                controller: 'loginCtrl as vm'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'app/views/pages/register.tpl.html',
                controller: 'UserCreateCtrl as vm'
            })
            .state('new', {
                url: '/new',
                templateUrl: 'app/views/pages/newClassified.tpl.html',
                controller: 'ClassifiedCtrl as vm',
                /*resolve: {
                    userClassifieds: function () {
                        return false;
                    }
                }*/

            })
            .state('edit', {
                url: '/edit/:id',
                templateUrl: 'app/views/pages/edit.tpl.html',
                controller: 'editClassifiedsCtrl as vm',
                params: {
                    classified: null
                }
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'app/views/pages/chart.tpl.html',
                controller: 'ChartCtrl as vm'
            })
    });