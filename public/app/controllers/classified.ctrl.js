//angular.module('classifiedCtrl', ['classifiedService'])
angular.module('classifieds')
    .controller('ClassifiedController', ['$rootScope', '$scope', '$timeout', '$mdSidenav', '$mdComponentRegistry', '$mdToast', '$state', 'Classified', 'Auth', 'Upload',
        function ($rootScope, $scope, $timeout, $mdSidenav, $mdComponentRegistry, $mdToast, $state, Classified, Auth, Upload) {

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

        vm.createClassified = function (file) {
            vm.message = '';

            // upload image to 'public/images'
            file.upload = Upload.upload({
                url: '/uploads',
                method: 'POST',
                data: {user: $rootScope.user, file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    vm.classifiedData.image = 'images/' + response.config.data.file.name;

                    Classified.create(vm.classifiedData)
                        .success(function (data) {
                         vm.classifiedData = '';

                         vm.message = data.message;

                         $rootScope.classifieds.push(data);

                         closeSidebar();
                         showToast("Товар Додано!");
                         })
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
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