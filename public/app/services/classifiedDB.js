(function () {
    "use strict";

angular
    .module('classifiedDBService', [])
    .factory('ClassifiedsDB', ['$rootScope', '$http', function($rootScope, $http) {

        //todo: перемістити if-блок в функцію nextPage() ?
        if (!$rootScope.classifieds) {
            $rootScope.classifieds = [];
        }

        var ClassifiedsDB = function() {
            //this.classifieds = [];
            this.busy = false;
            this.after = '';
        };

        ClassifiedsDB.prototype.nextPage = function() {

            if (this.busy) return;

            this.busy = true;

            //todo: замінити наступних 4 стрічки функцією setURL()
            var url = "/api/list?after=" + this.after;

            if ($rootScope.user && $rootScope.user.id) {
                url = '/api/list/' + $rootScope.user.id + '?after=' + this.after;
            }

            $http.get(url).success(function(classifieds) {
                for (var i = 0; i < classifieds.length; i++) {
                    //this.classifieds.push(classifieds[i]);
                    $rootScope.classifieds.push(classifieds[i]);
                }
                this.after = $rootScope.classifieds.length;
                this.busy = false;
            }.bind(this));
        };

        // Refactoring. Extracting code into separate function
        function setURL() {
            var url = "/api/list?after=" + this.after;

            if ($rootScope.user && $rootScope.user.id) {
                url = '/api/list/' + $rootScope.user.id + '?after=' + this.after;
            }
            return url;
        }
        
        return ClassifiedsDB;
    }]);
}());