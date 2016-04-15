(function () {
    'use strict';

angular.module('classifieds')
    .controller('PaginationCtrl', ['$rootScope', '$scope', '$state', 'Auth', 'Classified', 'ClassifiedsDB',
        function($rootScope, $scope, $state, Auth, Classified, ClassifiedsDB){
        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();

        // перезавантаження оголошень при зміні стану авторизації
        $scope.$watch('vm.loggedIn', function () {
            console.log('loggedIn');
            // ініціал-ія при авторизації через форму
            Auth.getUser()
                .then(function (data) { // користувач авторизований
                    $rootScope.user = data.data;
                    if ($rootScope.user._id) {
                        $rootScope.user.id = $rootScope.user._id;
                    }
                    $rootScope.classifieds = [];
                    console.log($rootScope.user);
                    $scope.classifiedsDBService = new ClassifiedsDB();
                    $scope.classifiedsDBService.nextPage();
                    //$('#infinite-scroll-hack').css('display', 'block');
                }, function () { // користувач не авторизований
                    $rootScope.classifieds = [];
                    $rootScope.user = {};
                    $scope.classifiedsDBService = new ClassifiedsDB();
                    $scope.classifiedsDBService.nextPage();
                    //$('#infinite-scroll-hack').css('display', 'block');
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

        //$scope.classifiedsDB = new ClassifiedsDB();

        /*$rootScope.$on('newClassified', function (newClassified) {
            console.log(newClassified);
            //$scope.classifiedsDB.classifieds
        });*/

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
        }
    }]);
}());