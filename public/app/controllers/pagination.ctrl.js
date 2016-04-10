angular.module('classifieds')
    .controller('listdata', ['$rootScope', '$scope', '$state', 'Auth', 'Classified', 'ClassifiedsDB',
        function($rootScope, $scope, $state, Auth, Classified, ClassifiedsDB){
        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();

        // перезавантаження оголошень при зміні стану авторизації
        $scope.$watch('vm.loggedIn', function () {
            Auth.getUser()
                .then(function (data) { // користувач авторизований
                    $rootScope.user = data.data;
                    $rootScope.classifieds = [];
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
    }]);