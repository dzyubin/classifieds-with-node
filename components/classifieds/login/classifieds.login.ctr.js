(function () {

    "use strict";

    angular
        .module('classifieds')
        .controller('loginClassifiedsCtrl',
        ['$scope', '$mdSidenav', '$state', 'Authentication',
        function ($scope, $mdSidenav, $state, Authentication) {

            this.sidenavOpen = true;

            $scope.$watch('vm.sidenavOpen', function (sidenav) {
                if (sidenav === false) {
                    $mdSidenav('right')
                        .close()
                        .then(function () {
                            $state.go('classifieds');
                        });
                }
            });

            $scope.login = function () {
                Authentication.login($scope.user);
            }; // login

            $scope.logout = function () {
                Authentication.logout();
            }; // logout

        }]);
}());