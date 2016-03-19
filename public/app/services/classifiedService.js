angular.module('classifiedService', [])

    .factory('Classified', function ($http) {

        var classifiedFactory = {};

        classifiedFactory.create = function (classifiedData) {
            return $http.post('/api', classifiedData);
        };

        classifiedFactory.getClassifieds = function () {
            return $http.get('/api');
        };

        return classifiedFactory;
    });