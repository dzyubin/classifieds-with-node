angular.module('classifieds')
    .controller('listdata', function($rootScope, $scope, $http, $timeout, $state, Auth, Classified){
        var vm = this;
        var classifiedsDataRoute,
            userId,
            updatedCategories = [];

        vm.loggedIn = Auth.isLoggedIn();

        $scope.$watch('vm.loggedIn', function () {
            //console.log('$watch Auth.islogged');
            vm.loggedIn = Auth.isLoggedIn();
        });

        //Classified.getClassifieds();

        // перезавантаження оголошень при зміні стану авторизації
        $scope.$watch('vm.loggedIn', function (loggedIn) {
            //console.log('vm.loggedIn changed');
            Classified.getClassifieds();
        });

        vm.updateCategories = function (classified) {
            if (updatedCategories.length) { // якщо обрані нові категорії
                classified.updatedCategories = updatedCategories; // додати їх до оголошення
            }
            Classified.editClassified(classified);
        };

        vm.editClassified = function (classified) {
            $state.go('classifieds.edit', {
                id: classified._id
            });
        }
    });