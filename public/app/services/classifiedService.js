angular.module('classifiedService', [])

    .factory('Classified', ['$rootScope', '$http', function ($rootScope, $http) {

        var classifiedFactory = {};

        classifiedFactory.create = function (classifiedData) {
            return $http.post('/api', classifiedData);
        };

        classifiedFactory.getSingleClassified = function (classified_id) {
            // todo: перейменувати на /api/single-classified
            return $http.get('/api/classified', {params: {classified_id: classified_id}});
        };

        classifiedFactory.getCategories = function () {
            return $http.get('/api/categories');
        };

        classifiedFactory.editClassified = function (classified) {
            return $http.post('/api/update', classified);
        };

        classifiedFactory.remove = function (classified) {
            return $http.post('/api/remove', classified);
        };

        return classifiedFactory;
    }]);