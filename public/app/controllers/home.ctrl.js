angular
    .module('classifieds')
    .controller('homeCtrl', ['$rootScope', '$scope', 'ClassifiedsDB', function ($rootScope, $scope, ClassifiedsDB) {

        $scope.$emit('userClassifieds', 'none');
        $rootScope.classifieds = [];
        $scope.classifiedsGetter = new ClassifiedsDB(null, null, 5);
        $scope.classifiedsGetter.nextPage();
    }]);