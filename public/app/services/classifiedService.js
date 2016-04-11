angular.module('classifiedService', [])

    .factory('Classified', ['$rootScope', '$http', '$timeout', 'Auth', function ($rootScope, $http, $timeout, Auth) {

        var classifiedFactory = {};

        classifiedFactory.create = function (classifiedData) {
            return $http.post('/api', classifiedData);
        };

        /*classifiedFactory.getClassifieds = function () {
            return $http.get('/api');
        };*/

        classifiedFactory.getClassified = function (classified_id) {
            //console.log(classified_id);
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