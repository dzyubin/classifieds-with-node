(function () {

    "use strict";

    angular
        .module('classifieds')
        .controller('loginCtrl',
        ['$rootScope', '$scope', '$mdSidenav', '$state', '$auth', 'Auth', 'Classified',
        function ($rootScope, $scope, $mdSidenav, $state, $auth, Auth, Classified) {

            var vm = this;

            /*this.sidenavOpen = true;

            $scope.$watch('vm.sidenavOpen', function (sidenav) {
                if (sidenav === false) {
                    $mdSidenav('right')
                        .close()
                        .then(function () {
                            $state.go('home');
                        });
                }
            });*/

            vm.doLogin = function () {

                vm.message = '';

                if ($scope.myform.$valid) {
                    $scope.showSpinner = true;

                    Auth.login(vm.loginData.username, vm.loginData.password)
                        .success(function (data) {

                            Auth.getUser()
                                .then(function (data) {
                                    $rootScope.user = data.data;
                                });

                            if (data.success) {
                                $state.go('my-classifieds');
                            } else {
                                vm.message = data.message;
                                $scope.showSpinner = false;
                            }
                        })
                        .error(function (error) {
                            console.log(error);
                        });
                } else {
                    $scope.showValidation = true;
                }
            };

            vm.authenticate = function(provider) { // facebook авторизація
                $auth.authenticate(provider)
                    .then(function (data) {
                        if ($rootScope.user === 'undefined') {
                            console.log($rootScope.user);
                            Classified.notify('Не вдалося провести авторизацію. Спробуйте ще раз');
                            return;
                        }
                        $rootScope.user.id = $rootScope.user._id;

                        $state.go('my-classifieds');
                    })
                    .catch(function (err) {
                        console.log(err);
                        Classified.notify('Не вдалося провести авторизацію. Спробуйте ще раз');
                    });
            };
        }]);
}());