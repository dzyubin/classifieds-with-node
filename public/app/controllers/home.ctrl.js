angular
    .module('classifieds')
    .controller('homeCtrl', ['$scope', function ($scope) {
        $scope.$emit('userClassifieds', 'none');
    }]);