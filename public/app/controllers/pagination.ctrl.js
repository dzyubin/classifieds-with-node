(function () {
    'use strict';

angular.module('classifieds')
    .controller('PaginationCtrl', ['$rootScope', '$scope', '$state', '$location', '$mdToast', 'Auth', 'Classified', 'ClassifiedsDB', 'userClassifieds',
        function($rootScope, $scope, $state, $location, $mdToast, Auth, Classified, ClassifiedsDB, userClassifieds){
        var vm = this;

        vm.initialCategories = [];
        vm.loggedIn = Auth.isLoggedIn();
        vm.loadClassifieds = loadClassifieds;
        vm.disableSortingByCategory = disableSortingByCategory;
        vm.currentPath = '#/' + $location.$$path.split('/')[1] + '/';

        // todo: змінити $rootScope.user на $scope.user;

        $(document).ready(function(){
            $('.list-group').affix({offset: {top: 60} });
        });

        Auth.getUser()
            .then(function (data) { // користувач авторизований

                $rootScope.user = data.data;
                $rootScope.user.id = $rootScope.user.id || $rootScope.user._id;

                if (userClassifieds) {
                    //todo: перенести в loadUserClassifieds()
                    $scope.$emit('userClassifieds', 'my');
                    loadUserClassifieds();
                } else {
                    loadAllClassifieds();
                }

            }, function (error) { // користувач не авторизований
                $rootScope.user = {};
                loadAllClassifieds();
            });

        function loadUserClassifieds() {
            loadClassifieds($rootScope.user.id);
            $scope.myClassifiedsBtnActive = true;
        }

        function loadAllClassifieds() {
            $scope.$emit('userClassifieds', 'all');
            loadClassifieds();
            $scope.myClassifiedsBtnActive = false;
        }

        function loadClassifieds(userId) {
            var category = $state.params.category;
            $rootScope.classifieds = [];
            $scope.classifiedsDBService = new ClassifiedsDB(userId, category);
            $scope.classifiedsDBService.nextPage()
                .success(function () {
                    vm.activeCategory = category;
                })
                .error(function(error){
                    showToast('Не вдалося отримати дані. Спробуйте ще раз')
                });
        }

        function disableSortingByCategory() {
            $state.params.category = '';
            loadClassifieds();
        }

        /*function loadClassifiedsByCategory(category) {
            var userId = $rootScope.user.id ? $rootScope.user.id : null;
            if ($state.current.url === '/all-classifieds') userId = null;
            console.log(userId);
            vm.categoryBtnClass = category;
            loadClassifieds(userId, category);
        }*/

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

            //todo: перенести в .success(...)
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

        // todo: замінити на bootstrap notification і винести в сервіс
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