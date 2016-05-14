(function () {

    "use strict";

    angular
        .module('classifieds')
        .controller('loginCtrl',
        ['$rootScope', '$scope', '$mdSidenav', '$state', '$auth', 'Auth',
        function ($rootScope, $scope, $mdSidenav, $state, $auth, Auth) {

            var vm = this;

            this.sidenavOpen = true;

            $scope.$watch('vm.sidenavOpen', function (sidenav) {
                if (sidenav === false) {
                    $mdSidenav('right')
                        .close()
                        .then(function () {
                            $state.go('home');
                        });
                }
            });

            vm.doLogin = function () {

                //vm.processing = true;
                vm.error = '';

                Auth.login(vm.loginData.username, vm.loginData.password)
                    .success(function (data) {
                        //vm.processing = false;

                        Auth.getUser()
                            .then(function (data) {
                                $rootScope.user = data.data;
                            });

                        if(data.success) {
                            $state.go('my-classifieds');
                        } else {
                            vm.error = data.message;
                        }
                    });
            };

            vm.authenticate = function(provider) { // facebook авторизація
                $auth.authenticate(provider)
                    .then(function (data) {
                        // непотрібний рядок?
                        if ($rootScope.user._id === 'undefined') {
                            console.log($rootScope.user);
                            vm.error = 'Не вдалося провести авторизацію. Спробуйте ще раз';
                            return;
                        }
                        $rootScope.user.id = $rootScope.user._id;

                        $state.go('my-classifieds');
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            };
        }]);
}());