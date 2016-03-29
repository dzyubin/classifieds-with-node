angular.module('classifiedService', [])

    .factory('Classified', ['$http', function ($http) {

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

        classifiedFactory.editClassified = function (classified) {
            //console.log('classified: ', classified);
            return $http.post('/api/update', classified);
        };

        return classifiedFactory;
    }]);