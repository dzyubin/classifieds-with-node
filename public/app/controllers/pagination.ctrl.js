(function () {
    'use strict';

angular.module('classifieds')
    .controller('PaginationCtrl', ['$rootScope', '$scope', '$state', '$mdToast', '$timeout', 'Auth', 'Classified', 'ClassifiedsDB',
        function($rootScope, $scope, $state, $mdToast, $timeout, Auth, Classified, ClassifiedsDB){
        var vm = this;

        vm.initialCategories = [];
        vm.loggedIn = Auth.isLoggedIn();
        vm.loadAllClassifieds = loadAllClassifieds;
        vm.loadUserClassifieds = loadUserClassifieds;

        // перезавантаження оголошень при зміні стану авторизації
        $scope.$watch('vm.loggedIn', function () {
            Auth.getUser()
                .then(function (data) { // користувач авторизований
                    $rootScope.user = data.data;
                    $rootScope.user.id = $rootScope.user.id || $rootScope.user._id;
                    loadUserClassifieds();
                }, function () { // користувач не авторизований
                    $rootScope.user = {};
                    loadAllClassifieds();
                });
        });

        function loadUserClassifieds() {
            //console.log($rootScope.user);
            loadClassifieds($rootScope.user.id);
            $scope.myClassifiedsBtnActive = true;
        }

        function loadAllClassifieds() {
            //console.log('all classifieds');
            loadClassifieds();
            $scope.myClassifiedsBtnActive = false;
        }

        function loadClassifieds(userId) {
            $rootScope.classifieds = [];
            $scope.classifiedsDBService = new ClassifiedsDB(userId);
            $scope.classifiedsDBService.nextPage();
        }

        Classified.getCategories()
            .success(function (data) {
                vm.categories = data[0].categories;
                /*$timeout(function () {
                    $('.select').select2();
                }, 2000);*/
            });

        vm.editClassified = function (classified) {
            $state.go('classifieds.edit', {
                id: classified._id
            });
        };

        vm.removeClassified = function (classified) {
            Classified.remove(classified)
                .success(function () {
                    $rootScope.classifieds = $rootScope.classifieds.filter(function (el) {
                        return el._id !== classified._id;
                    })
                })
                .error(function (err) {
                    console.log(err);
                })
        };

        vm.updateCategory = function (classified) {

            var modalId = '#' + classified._id;

            classified.category.forEach(function (elem){
                if (vm.categories.indexOf(elem) === -1) {
                    classified.newCategories = [];
                    classified.newCategories.push(elem);
                }
            });

            Classified.editClassified(classified)
                .success(function (res) {
                    $(modalId).modal('hide');
                    showToast('Категорію(-ії) збережено!');
                })
                .error(function (err) {
                    $(modalId).modal('hide');
                    showToast('Не вдалося зберегти категорії. Спробуйте ще раз');
                });
        };

        vm.cancelCategoriesEdit = function (classified) {
            console.log('sdfd');
            classified.category = vm.initialCategories;
        };

        /*vm.addNewCategory = function (classified) {
            classified.newCategories = [];
            classified.category.push(vm.newCategory);
            var div = '#' + classified._id + ' select';
            vm.categories.push(vm.newCategory);
            classified.newCategories.push(vm.newCategory);
            vm.newCategory = '';
        };*/

        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position('top, right')
                    .hideDelay(3000)
            );
        }
    }]);
}());