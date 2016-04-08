angular.module('classifieds')
    .controller('listdata', function($rootScope, $scope, $http, $timeout, $state, Auth, Classified, ClassifiedsDB){
        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();

        $scope.$watch('vm.loggedIn', function () {
            //console.log('$watch Auth.islogged');
            vm.loggedIn = Auth.isLoggedIn();
        });

        $scope.classifiedsDB = new ClassifiedsDB();
        //Classified.getClassifieds();

        // перезавантаження оголошень при зміні стану авторизації
        /*$scope.$watch('vm.loggedIn', function (loggedIn) {
            //console.log('vm.loggedIn changed');
            $rootScope.classifieds = [];
            Classified.getClassifieds();
        });*/

        vm.editClassified = function (classified) {
            $state.go('classifieds.edit', {
                id: classified._id
            });
        };

/*
        $scope.loadMoreClassifieds = function() {
            var last = $rootScope.classifieds[$rootScope.classifieds.length - 1];
            for(var i = 1; i <= 8; i++) {
                $rootScope.classifieds.push({title: 'test-infinit-scroll'});
            }
        };
*/
    });