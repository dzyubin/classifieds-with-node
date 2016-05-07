// todo: add 'use strict' to all js files
angular.module('classifieds')
    .controller('ClassifiedCtrl', ['$rootScope', '$scope', '$timeout', '$mdSidenav', '$mdComponentRegistry', '$mdToast', '$state', 'Classified', 'Auth', 'Upload',
        function ($rootScope, $scope, $timeout, $mdSidenav, $mdComponentRegistry, $mdToast, $state, Classified, Auth, Upload) {

        var vm = this;
        vm.loggedIn = Auth.isLoggedIn();
        vm.closeSidebar = closeSidebar;
        vm.categories = [];

        Classified.getCategories()
            .success(function (data) {
                vm.categories = data[0].categories;
            })
            .error(function (error) {
                showToast('Не вдалося отримати дані. Спробуйте ще раз');
            });

            // відкриває форму для додавання нового оголошення
        $mdComponentRegistry.when('left').then(function(it){
            it.open();
        });

        $scope.$watch('vm.sidenavNewClassifiedOpen', function (sidenav) {
            if (sidenav === false) {
                $mdSidenav('left')
                    .close()
                    .then(function () {
                        $state.go('my-classifieds');
                    });
            }
        });

        vm.addNewCategory = function() {

            vm.classifiedData.newCategories = [];

            vm.classifiedData.categories = vm.classifiedData.categories || [];

            //todo: видалити два перших if-блока
            if (!vm.newCategory) {
                vm.newCategoryError = 'Введіть назву категорії';
            } else if (vm.categories.indexOf(vm.newCategory) !== -1) {
                vm.newCategoryError = 'Категорія з такою назвою вже створена!';
                vm.newCategory = '';
            } else {
                vm.categories.push(vm.newCategory);
                // обновити локальний список категорій
                vm.classifiedData.categories.push(vm.newCategory);
                // додати категорії, які будуть додані до бази даних
                vm.classifiedData.newCategories.push(vm.newCategory);
                vm.newCategory = '';
            }
        };

        // todo: розділити на дві (чи більше?) функції
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

                        createClassified();

                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            } else { // якщо користувач не обрав зображення, використати зображення за замовчуванням
                // todo: додати default до classified моделі
                // image: { type: String, default: 'images/photo-default-th.png' }
                vm.classifiedData.image = 'images/photo-default-th.png';
                createClassified();
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

        function createClassified() {

            Classified.create(vm.classifiedData)
                .success(function (data) {
                    vm.classifiedData = '';
                    vm.message = data.message;

                    $rootScope.classifieds.push(data);

                    closeSidebar();
                    showToast("Оголошення Додано!");
                })
                .error(function (error) {
                    showToast("Не вдалося створити оголошення. Спробуйте ще раз")
                })
        }
    }]);