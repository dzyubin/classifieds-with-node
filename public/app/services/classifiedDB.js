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

            /*var url = "/api/list?after=" + this.after;

            if ($rootScope.user && $rootScope.user.id) {
                url = '/api/list/' + $rootScope.user.id + '?after=' + this.after;
            }*/

            var url = setURL(this);
            console.log($rootScope.user);
            console.log(url);
            $http.get(url).success(function(classifieds) {
                for (var i = 0; i < classifieds.length; i++) {
                    $rootScope.classifieds.push(classifieds[i]);
                }
                this.after = $rootScope.classifieds.length;
                this.busy = false;
            }.bind(this));

            function setURL(contextObj) {
                var url = "/api/list?after=" + contextObj.after;

               /* if ($rootScope.user._id) {
                    $rootScope.user.id = $rootScope.user._id;
                }*/
                if ($rootScope.user && ($rootScope.user.id)) {
                    url = '/api/list/' + $rootScope.user.id + '?after=' + contextObj.after;
                }
                return url;
            }
        };


        return ClassifiedsDB;
    }]);
}());