angular
    .module('classifieds')
    .controller('homeCtrl', ['$rootScope', '$scope', 'ClassifiedsDB', function ($rootScope, $scope, ClassifiedsDB) {

        $scope.$emit('userClassifieds', 'none');

        $scope.classifiedsGetter = new ClassifiedsDB();
        $scope.classifiedsGetter.nextPage()
            .then(function (data) {
                $scope.classifieds = data.data.splice(0, 5);
            });
    }]);