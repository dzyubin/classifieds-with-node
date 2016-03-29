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

            // todo: додати в контролер можливість додавати контактні дані
            vm.classifiedData.contact = {
                name: "Олександр",
                phone: "34-54-45",
                email: "example@mail.com"
            };
            console.log(vm.classifiedData);
            console.log(file);
            // upload image to 'public/images'

            if (file) {
                file.upload = Upload.upload({
                    url: '/uploads',
                    method: 'POST',
                    data: {user: $rootScope.user, file: file}
                });


                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;

                        vm.classifiedData.image = 'images/' + response.config.data.file.name;

                        createClassifiedService();

                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            } else {
                vm.classifiedData.image = 'images/photo-default-th.png';
                createClassifiedService();
            }
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

            function createClassifiedService() {

                Classified.create(vm.classifiedData)
                    .success(function (data) {
                        vm.classifiedData = '';

                        vm.message = data.message;

                        $rootScope.classifieds.push(data);

                        closeSidebar();
                        showToast("Товар Додано!");
                    })
            }

            /*for (var i = 0; i < 3; i+=1) {
                vm.classifiedData = {};
                vm.classifiedData.content = "Опис";
                vm.classifiedData.title = "Тестове оголошення";
                vm.classifiedData.price = 1000;
                vm.classifiedData.category = "Спорт";
                vm.classifiedData.image = "images/photo-default-th.png";

                createClassifiedService();
            }*/
    }]);