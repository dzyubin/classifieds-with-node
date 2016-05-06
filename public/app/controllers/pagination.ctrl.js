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

        function disableSortingByCategory(evt) {

            preventParentDefault(evt);

            //todo: створити змінну var path = $location.$$path;
            if ($location.$$path.split('/')[1] === 'all-classifieds') {
                //todo: знайти краще рішення
                $state.go('my-classifieds');
                $state.go('all-classifieds', {category: ''});
            } else {
                //todo: знайти краще рішення
                $state.go('all-classifieds');
                $state.go('my-classifieds', {category: ''});
            }
        }

        function preventParentDefault(evt) {
            //todo: замість preventDefault() використати stopPropagation()?
            var parent = evt.currentTarget.parentElement;
            parent.addEventListener('click', function (evt) {
                evt.preventDefault();
            });
        }

        Classified.getCategories()
            .success(function (data) {
                vm.categories = data[0].categories;
            })
            .error(function (error) {
                showToast('Не вдалося отримати перелік категорій. Спробуйте ще раз');
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

            createListOfNewCategories(classified);

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

        function createListOfNewCategories(classified) {
            classified.category.forEach(function (elem){
                if (vm.categories.indexOf(elem) === -1) {
                    classified.newCategories = [];
                    classified.newCategories.push(elem);
                }
            });
        }

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