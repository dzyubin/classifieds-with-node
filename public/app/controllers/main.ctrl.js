(function () {

    "use strict";

    angular
        .module("classifieds")
        .controller("classifiedsCtrl", ['$rootScope', '$scope', '$http', '$mdSidenav', '$state', '$location', '$mdToast', 'Auth', 'Classified',
            function ($rootScope, $scope, $http, $mdSidenav, $state, $location, $mdToast, Auth, Classified) {

            var vm = this;

            vm.openSidebar = openSidebar;

            vm.loggedIn = Auth.isLoggedIn();

                /*Auth.getUser()
                .then(function (data) {
                    $rootScope.user = data.data;

                });*/

            // видалити?
            $rootScope.$on('$stateChangeStart', function () {
                vm.loggedIn = Auth.isLoggedIn();
               /* Auth.getUser()
                    .then(function (data) {
                        //vm.user = data.data;
                        $rootScope.user = data.data;
                    });*/
            });

            $scope.$on('editSaved', function (event, message) {
                showToast(message, 3000);
            });

            vm.doLogout = function () {

                // видалити user.id для того щоб вимкнути фільтрування оголошень по автору оголошення
                $rootScope.user.id = '';

                Auth.logout();
                $state.go('classifieds');
            };

            function openSidebar() {
                if (Auth.isLoggedIn()) {
                    $state.go('classifieds.new');
                } else {
                    showToast("Необхідна авторизація (натисніть 'Увійти')", 1000);
                }
            }

            function showToast(message, delay) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position('top, right')
                        .hideDelay(delay)
                );
            }

            /*vm.getFBProfile = function() {
                Auth.getFBProfile()
                    .then(function(response) {
                        console.log('getProfile', response);
                        $rootScope.user = response.data;
                    })
                    .catch(function(response) {
                        console.log(response);
                        //toastr.error(response.data.message, response.status);
                    });
            };*/

        }])
}());