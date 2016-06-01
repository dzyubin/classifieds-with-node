// todo: add 'use strict' to all js files
angular.module('classifieds')
    .controller('ClassifiedCtrl', ['$rootScope', '$scope', '$timeout', '$mdToast', '$state', 'Classified', 'Auth', 'Upload',
        function ($rootScope, $scope, $timeout, $mdToast, $state, Classified, Auth, Upload) {
        var vm = this;
        vm.loggedIn = Auth.isLoggedIn();
        vm.finishAddingNewClassified = finishAddingNewClassified;
        vm.categories = [];

        $scope.$emit('userClassifieds', 'newClassified');

        Classified.getCategories()
            .success(function (data) {
                vm.categories = data[0].categories;
                initializeSelect2();

/*
                for(var i = 0; i < 3; i+=1) {
                    var categoryNumber = Math.floor(Math.random()*10),
                        randomDay = Math.ceil(Math.random()*31),
                        randomHour = Math.floor(Math.random()*24),
                        //randomMonth = Math.ceil(Math.random()*12),
                        dummyDate = new Date(2014, 11, 28, 0);

                    //dummyDate.setHours(randomHour);
                    console.log(dummyDate);
                    vm.classifiedData = {};
                    vm.classifiedData.title = "Charts Testing";
                    vm.classifiedData.price = Math.ceil(Math.random()*10)*500;
                    vm.classifiedData.content = "Testing Charts Description";
                    vm.classifiedData.categories = vm.categories[categoryNumber];
                    vm.classifiedData.image = "images/photo-default-th.png";

                    vm.classifiedData.created = dummyDate;
                    console.log(vm.classifiedData);
                    createClassified();
                }
*/
            })
            .error(function (error) {
                Classified.notify("Не вдалося отримати перелік категорій. Спробуйте ще раз");
            });

        function initializeSelect2() {
            // todo: використати $timeout
            setTimeout(function () {
                $('.select').select2({
                    tags: true
                });
            }, 0);
        }


/*
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
*/

        // todo: розділити на дві (чи більше?) функції
        vm.uploadImageAndCreateClassified = function (file) {
            //vm.message = '';

            if ($scope.myform.$valid) {
                $scope.showSpinner = true;

                // todo: додати в контролер можливість додавати контактні дані
                /*vm.classifiedData.contact = {
                 name: "Олександр",
                 phone: "34-54-45",
                 email: "example@mail.com"
                 };*/
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

                    //createListOfNewCategories(vm.classifiedData);
                    createClassified();
                }
            } else {
                $scope.showValidation = true;
                console.log($scope.myform);
            }
        };



/*
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position('top, right')
                    .hideDelay(3000)
            );
        }
*/

        function createClassified() {

            vm.classifiedData.contact.name = $rootScope.user.username;
            createListOfNewCategories(vm.classifiedData);

            Classified.create(vm.classifiedData)
                .success(function (data) {
                    vm.classifiedData = '';
                    //vm.message = data.message;

                    //todo: коли newClassified.tpl.html завантажується через рефреш (F5)
                    // $rootScope.classifieds == undefined. додати try-catch
                    //$rootScope.classifieds.push(data);

                    finishAddingNewClassified();
                    Classified.notify("Оголошення Додано!");
                })
                .error(function (error) {
                    Classified.notify("Не вдалося створити оголошення. Спробуйте ще раз");
                })
        }

        function finishAddingNewClassified() {
            vm.classifiedData = {};
            $state.go('my-classifieds');
        }

        function createListOfNewCategories(classified) {
            classified.category.forEach(function (elem){
                if (vm.categories.indexOf(elem) === -1) {
                    classified.newCategories = [];
                    classified.newCategories.push(elem);
                }
            });
        }
    }]);