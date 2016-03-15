//angular.module('classifiedCtrl', ['classifiedService'])
angular.module('classifieds')
    .controller('ClassifiedController', function ($scope, $timeout, $mdSidenav, $state, Classified) {

        var vm = this;

        vm.closeSidebar = closeSidebar;

        $timeout(function () {
            $mdSidenav('left').open();
        });

        $scope.$watch('vm.sidenavOpen', function (sidenav) {
            if (sidenav === false) {
                $mdSidenav('left')
                    .close()
                    .then(function () {
                        $state.go('classifieds');
                    });
            }
        });

        Classified.allClassified()
            .success(function (data) {
                vm.classifieds = data;
            });

        vm.createClassified = function () {
            vm.message = '';
            Classified.create(vm.classifiedData)
                .success(function (data) {
                    vm.classifiedData = '';

                    vm.message = data.message;

                    vm.classifieds.push(data);

                    closeSidebar();
                    //showToast("Товар Додано!");
                })
        };

        function closeSidebar() {
            vm.sidenavOpen = false;
        }

    });