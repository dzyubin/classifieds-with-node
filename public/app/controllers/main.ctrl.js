(function () {

    "use strict";

    angular
        .module("classifieds")
        .controller("classifiedsCtrl", ['$rootScope', '$scope', '$mdSidenav', '$state', '$location', '$mdToast', 'Auth', 'Classified',
            function ($rootScope, $scope, $mdSidenav, $state, $location, $mdToast, Auth, Classified) {

            var vm = this;

            vm.openSidebar = openSidebar;

            vm.loggedIn = Auth.isLoggedIn();


            //$rootScope.$on('$routeChangeStart', function () {
            $rootScope.$on('$stateChangeStart', function () {

                vm.loggedIn = Auth.isLoggedIn();

                Auth.getUser()
                    .then(function (data) {
                        //vm.user = data.data;
                        $rootScope.user = data.data;
                        //console.log("state change");
                    });
            });

            Classified.getClassifieds()
                .success(function (data) {
                    vm.classifieds = data;
                    vm.categories = getCategories(vm.classifieds);
                });

            vm.doLogout = function () {
                Auth.logout();
                $state.go('classifieds');
            };

            function openSidebar() {
                if (Auth.isLoggedIn()) {
                    $state.go('classifieds.new');
                } else {
                    showToast("Необхідна авторизація (натисніть 'Вхід')");
                }
            }

            function showToast(message) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position('top, right')
                        .hideDelay(3000)
                );
            }

            function getCategories(classifieds) {

                var categories = [];

                angular.forEach(classifieds, function (item) {
                    categories.push(item.category);
                });

                return _.uniq(categories);
            }
        }])
}());