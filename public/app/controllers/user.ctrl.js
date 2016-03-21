angular.module('userCtrl', ['userService'])

    .controller('UserController', function (User) {

        var vm = this;

        User.all()
            .success(function (data) {
                vm.users = data;
            })
    })

    .controller('UserCreateController', ['$scope', '$mdSidenav', '$state', 'User', '$location', '$window',
        function ($scope, $mdSidenav, $state, User, $location, $window) {

        var vm = this;

        vm.sidenavOpen = true;

        $scope.$watch('vm.sidenavOpen', function (sidenav) {
            if (sidenav === false) {
                $mdSidenav('right')
                    .close()
                    .then(function () {
                        $state.go('classifieds');
                    });
            }
        });

        vm.signupUser = function () {
            vm.message = '';

            User.create(vm.userData)
                .then(function (response) {
                    vm.userData = {};
                    vm.message = response.data.message;

                    $window.localStorage.setItem('token', response.data.token);
                    $location.path('/classifieds');
                })
        };
    }]);