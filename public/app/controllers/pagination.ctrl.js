(function () {
    'use strict';

angular.module('classifieds')
    .controller('PaginationCtrl', ['$rootScope', '$scope', '$state', '$mdToast', 'Auth', 'Classified', 'ClassifiedsDB',
        function($rootScope, $scope, $state, $mdToast, Auth, Classified, ClassifiedsDB){
        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();
        vm.loadAllClassifieds = loadAllClassifieds;
        vm.loadAMyClassifieds = loadMyClassifieds;

        // перезавантаження оголошень при зміні стану авторизації
        $scope.$watch('vm.loggedIn', function () {
            // ініціал-ія при авторизації через форму
            Auth.getUser()
                .then(function (data) { // користувач авторизований
                    $rootScope.user = data.data;
                    $rootScope.user.id = $rootScope.user.id || $rootScope.user._id;
                    /*$rootScope.classifieds = [];
                    $scope.classifiedsDBService = new ClassifiedsDB();
                    $scope.classifiedsDBService.nextPage();*/
                    //loadClassifieds();
                    loadMyClassifieds();
                    //$scope.myClassifiedsBtnActive = true;
                }, function () { // користувач не авторизований
                    $rootScope.user = {};
                    /*$rootScope.classifieds = [];
                    $scope.classifiedsDBService = new ClassifiedsDB();
                    $scope.classifiedsDBService.nextPage();*/
                    loadAllClassifieds();
                });

            // ініціал-ія при авторизації через Facebook
            /*Auth.getFBProfile()
                .then(function(data) {
                    console.log('getProfile', data);
                    $rootScope.user = data.data;
                    $rootScope.classifieds = [];
                    $scope.classifiedsDBService = new ClassifiedsDB();
                    $scope.classifiedsDBService.nextPage();
                })
                .catch(function(data) {
                    console.log(data);
                    $rootScope.classifieds = [];
                    $rootScope.user = {};
                    $scope.classifiedsDBService = new ClassifiedsDB();
                    $scope.classifiedsDBService.nextPage();
                });*/
        });

        function loadMyClassifieds() {
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
            });

        //$scope.classifiedsDB = new ClassifiedsDB();

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
            Classified.editClassified(classified)
                .success(function (res) {
                    showToast('Категорію(-ії) збережено!');
                })
                .error(function (err) {
                    showToast('Не вдалося зберегти категорії. Спробуйте ще раз');
                });
        };

        vm.addNewCategory = function (classified) {
            classified.newCategories = [];
            classified.category.push(vm.newCategory);
            vm.categories.push(vm.newCategory);
            classified.newCategories.push(vm.newCategory);
            vm.newCategory = '';
        };

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