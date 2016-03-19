//angular.module('classifiedCtrl', ['classifiedService'])
angular.module('classifieds')
    .controller('ClassifiedController', function ($scope, $timeout, $mdSidenav, $mdComponentRegistry, $state, Classified, Auth) {

        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();

        vm.closeSidebar = closeSidebar;

        /*$timeout(function () {
            $mdSidenav('left').open();
        });*/

        $mdComponentRegistry.when('left').then(function(it){
            it.open();
        });

        $scope.$watch('vm.sidenavOpen', function (sidenav) { // 'vm.sidenavOpen' or 'vm.sidenavLeftOpen'
            if (sidenav === false) {
                $mdSidenav('left')
                    .close()
                    .then(function () {
                        $state.go('classifieds');
                    });
            }
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