(function () {
    "use strict";

angular
    .module('classifiedDBService', [])
    .factory('ClassifiedsDB', ['$rootScope', '$http', function($rootScope, $http) {

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
            var url = "/api/list?after=" + this.after;

            if ($rootScope.user && $rootScope.user.id) {
                url = '/api/list/' + $rootScope.user.id + '?after=' + this.after;
            }

            $http.get(url).success(function(data) {
                var classifieds = data;
                for (var i = 0; i < classifieds.length; i++) {
                    //this.classifieds.push(classifieds[i]);
                    $rootScope.classifieds.push(classifieds[i]);
                }
                this.after = $rootScope.classifieds.length;
                this.busy = false;
            }.bind(this));
        };
        //console.log(ClassifiedsDB);
        return ClassifiedsDB;
    }]);
}());