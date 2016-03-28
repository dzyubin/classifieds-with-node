(function () {

    "use strict";

    angular
        .module("classifieds")
        .controller("classifiedsCtrl", ['$rootScope', '$scope', '$mdSidenav', '$state', '$location', '$mdToast', 'Auth', 'Classified',
            function ($rootScope, $scope, $mdSidenav, $state, $location, $mdToast, Auth, Classified) {

            var vm = this;

            vm.openSidebar = openSidebar;

            vm.loggedIn = Auth.isLoggedIn();

            Auth.getUser()
                .then(function (data) {
                    $rootScope.user = data.data;
                });

            $rootScope.$on('$stateChangeStart', function () {

                vm.loggedIn = Auth.isLoggedIn();

               /* Auth.getUser()
                    .then(function (data) {
                        //vm.user = data.data;
                        $rootScope.user = data.data;
                    });*/
            });

            $scope.$on('editSaved', function (event, message) {
                showToast(message);
            });

            Classified.getClassifieds()
                .success(function (data) {
                    $rootScope.classifieds = data;
                    vm.categories = getCategories($rootScope.classifieds);
                });


            vm.doLogout = function () {

                // видалити user.id для того щоб вимкути фільтрування оголошень по автору оголошення
                $rootScope.user.id = '';

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