angular.module('userCtrl', ['userService'])

    .controller('UserController', function (User) {

        var vm = this;

        User.all()
            .success(function (data) {
                vm.users = data;
            })
    })

    .controller('UserCreateCtrl', ['$scope', '$mdSidenav', '$state', 'User', '$location', '$window',
        function ($scope, $mdSidenav, $state, User, $location, $window) {

        var vm = this;

        //vm.sidenavOpen = true;

        /*$scope.$watch('vm.sidenavOpen', function (sidenav) {
            if (sidenav === false) {
                $mdSidenav('right')
                    .close()
                    .then(function () {
                        $state.go('home');
                    });
            }
        });*/

        vm.signupUser = function () {
            vm.message = '';

            if ($scope.myform.$valid) {
                $scope.showSpinner = true;
                User.create(vm.userData)
                    .then(function (response) {
                        var data = response.data;
                        vm.userData = {};
                        if (data.code === 11000) {
                            vm.message = 'Користувач з таким ім\'ям вже зареєстрований. Оберіть інше ім\'я';
                            return;
                        }
                        if (data.token) {
                            $window.localStorage.setItem('token', data.token);
                        }
                        $state.go('my-classifieds');
                    });
                //todo: додати function(error) {
            } else {
                $scope.showValidation = true;
            }
        };
    }]);