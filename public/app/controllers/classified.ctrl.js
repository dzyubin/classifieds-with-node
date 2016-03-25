//angular.module('classifiedCtrl', ['classifiedService'])
angular.module('classifieds')
    .controller('ClassifiedController', ['$rootScope', '$scope', '$timeout', '$mdSidenav', '$mdComponentRegistry', '$mdToast', '$state', 'Classified', 'Auth',
        function ($rootScope, $scope, $timeout, $mdSidenav, $mdComponentRegistry, $mdToast, $state, Classified, Auth) {

        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();

        vm.closeSidebar = closeSidebar;

        /*$timeout(function () {
            $mdSidenav('left').open();
        });*/

        // відкриває форму для додавання нового оголошення
        $mdComponentRegistry.when('left').then(function(it){
            it.open();
        });

        $scope.$watch('vm.sidenavNewClassifiedOpen', function (sidenav) {
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

                    $rootScope.classifieds.push(data);

                    closeSidebar();
                    showToast("Товар Додано!");
                })
        };

        function closeSidebar() {
            vm.sidenavNewClassifiedOpen = false;
        }

        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position('top, right')
                    .hideDelay(3000)
            );
        }

    }]);