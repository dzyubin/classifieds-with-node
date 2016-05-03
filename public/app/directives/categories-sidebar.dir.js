angular
.module('classifieds')
.directive('categoriesSidebar', function () {
        return {
            restrict: 'EA',
            templateUrl: 'app/views/pages/categories-sidebar.tpl.html',
            replace: true
        }
    });