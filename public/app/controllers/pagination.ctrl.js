(function () {
    'use strict';

angular.module('classifieds')
    .controller('PaginationCtrl', ['$rootScope', '$scope', '$state', '$mdToast', '$timeout', 'Auth', 'Classified', 'ClassifiedsDB', 'userClassifieds',
        function($rootScope, $scope, $state, $mdToast, $timeout, Auth, Classified, ClassifiedsDB, userClassifieds){
        var vm = this;

        vm.initialCategories = [];

        // видалити?
        vm.loggedIn = Auth.isLoggedIn();

        /*vm.loadAllClassifieds = loadAllClassifieds;
        vm.loadUserClassifieds = loadUserClassifieds;*/
        Auth.getUser()
            .then(function (data) { // користувач авторизований
                $rootScope.user = data.data;
                $rootScope.user.id = $rootScope.user.id || $rootScope.user._id;
                if (userClassifieds) {
                    $scope.$emit('userClassifieds', 'my');
                    loadUserClassifieds();
                } else {

                    // todo: перенести в loadAllClassifieds()
                    $scope.$emit('userClassifieds', 'all');
                    loadAllClassifieds();
                }
            }, function (error) { // користувач не авторизований
                //$scope.$emit('userClassifieds');
                console.log(error);
                $rootScope.user = {};
                $scope.$emit('userClassifieds', 'all');
                loadAllClassifieds();
            });

        //loadClassifieds($rootScope.user.id);

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
            })
            .error(function (error) {
                showToast('Не вдалося отримати дані. Спробуйте ще раз');
            });

        vm.editClassified = function (classified) {
            $state.go('edit', {
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
            classified.category = vm.initialCategories;
        };

        // todo: винести функцію в сервіс або замінити на bootstrap notification
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