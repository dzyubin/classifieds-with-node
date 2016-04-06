//angular.module('classifiedCtrl', ['classifiedService'])
angular.module('classifieds')
    .controller('ClassifiedController', ['$rootScope', '$scope', '$timeout', '$mdSidenav', '$mdComponentRegistry', '$mdToast', '$state', 'Classified', 'Auth', 'Upload',
        function ($rootScope, $scope, $timeout, $mdSidenav, $mdComponentRegistry, $mdToast, $state, Classified, Auth, Upload) {

        var vm = this;
        vm.loggedIn = Auth.isLoggedIn();
        vm.closeSidebar = closeSidebar;
        vm.categories = [];
        //vm.categories = Classified.getCategories();
        Classified.getCategories()
            .success(function (data) {
                console.log(data[0].categories);
                vm.categories = data[0].categories;
            });
            console.log(vm.categoriesw);

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

        vm.uploadImageAndCreateClassified = function (file) {
            vm.message = '';

            // todo: додати в контролер можливість додавати контактні дані
            vm.classifiedData.contact = {
                name: "Олександр",
                phone: "34-54-45",
                email: "example@mail.com"
            };

            // upload image to 'public/images'
            if (file) { // якщо користувач обрав зображення
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
            } else { // якщо користувач не обрав зображення, використати зображення за замовчуванням
                vm.classifiedData.image = 'images/photo-default-th.png';
                createClassifiedService();
            }
            //Classified.categories(vm.classifiedData.chosenCategories);
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


    }]);