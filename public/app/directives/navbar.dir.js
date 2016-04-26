(function () {
    'use strict';

angular.module('classifieds')
.directive('navbar', function () {
        return {
            restrict: 'EA',
            templateUrl: 'app/views/pages/navbar.tpl.html'
        }
    })

}());