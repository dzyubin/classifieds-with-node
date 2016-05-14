angular
    .module('classifieds')
    .controller('homeCtrl', ['$rootScope', '$scope', 'ClassifiedsDB', function ($rootScope, $scope, ClassifiedsDB) {

        $scope.$emit('userClassifieds', 'none');

        $scope.classifiedsGetter = new ClassifiedsDB(null, null, 5);
        $scope.classifiedsGetter.nextPage()
            /*.then(function (data) {
                $scope.classifieds = data.data.splice(0, 5);
            });*/
    }]);