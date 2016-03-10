(function () {

    "use strict";

    angular
        .module('classifieds')
        .controller('registerClassifiedsCtrl',
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

                $scope.register = function () {
                    Authentication.register($scope.user);
                }; // register
        }]); // controller
}());