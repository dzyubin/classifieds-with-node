angular.module('classifiedService', [])

    .factory('Classified', ['$rootScope', '$http', function ($rootScope, $http) {

        var classifiedFactory = {};

        classifiedFactory.create = function (classifiedData) {
            return $http.post('/api', classifiedData);
        };

        classifiedFactory.getClassified = function (classified_id) {
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