(function () {
    "use strict";

angular
    .module('classifiedDBService', [])
    .factory('ClassifiedsDB', ['$rootScope', '$http', function($rootScope, $http) {

        if (!$rootScope.classifieds) {
            $rootScope.classifieds = [];
        }

        var ClassifiedsDB = function(userId) {
            this.userId = userId;
            this.busy = false;
            this.after = '';
        };

        ClassifiedsDB.prototype.nextPage = function() {

            var url = setURL(this);

            if (this.busy) return;

            this.busy = true;

            return $http.get(url).success(function(classifieds) {
                for (var i = 0; i < classifieds.length; i++) {
                    $rootScope.classifieds.push(classifieds[i]);
                }
                this.after = $rootScope.classifieds.length;
                this.busy = false;

                initSelect2();

            }.bind(this));

            function setURL(contextObj) {
                var url = "/api/list?after=" + contextObj.after;

                //if ($rootScope.user && $rootScope.user.id) {
                if (contextObj.userId) {
                    url = '/api/list/' + contextObj.userId + '?after=' + contextObj.after;
                }
                return url;
            }

            function initSelect2() {
                // todo: використати $timeout
                setTimeout(function () {
                    $('.select').select2({
                        tags: true
                    });
                }, 0);
            }
        };

        return ClassifiedsDB;
    }]);
}());