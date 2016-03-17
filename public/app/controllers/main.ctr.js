(function () {

    "use strict";

    angular
        .module("classifieds")
        .controller("classifiedsCtrl", function ($rootScope, $scope, $mdSidenav, $state, $location, $mdToast, Auth) {

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
        })
}());