(function () {
    "use strict";

angular
    .module('classifiedDBService', [])
    .factory('ClassifiedsDB', ['$rootScope', '$http', function($rootScope, $http) {

        if (!$rootScope.classifieds) {
            $rootScope.classifieds = [];
        }

        //todo: замість 4-х аргументів config-обєкт
        var ClassifiedsDB = function(userId, category, itemsPerPage, ascend) {
            this.userId = userId;
            this.busy = false;
            this.after = '';
            this.category = category;
            this.itemsPerPage = itemsPerPage;
            this.ascend = ascend;
        };

        ClassifiedsDB.prototype.nextPage = function() {

            var url = setURL(this);

            if (this.busy) return;

            this.busy = true;

            return $http.get(url)
                //todo: перенести success в pagination.ctrl.js
                .success(function(classifieds) {
                    for (var i = 0; i < classifieds.length; i++) {
                        $rootScope.classifieds.push(classifieds[i]);
                    }
                    this.after = $rootScope.classifieds.length;
                    this.busy = false;

                    //initSelect2();

                }.bind(this));

            function setURL(contextObj) {
                var url = "/api/list?after=" + contextObj.after;

                if (contextObj.userId) {
                    url = '/api/list/' + contextObj.userId + '?after=' + contextObj.after;
                }

                if(contextObj.category) {
                    url += '&category=' + contextObj.category;
                }

                if(contextObj.itemsPerPage) {
                    url += '&itemsPerPage=' + contextObj.itemsPerPage;
                }

                if(contextObj.ascend) {
                    url += '&ascend=' + contextObj.ascend;
                }
                return url;
            }

            /*function initSelect2() {
                // todo: використати $timeout
                setTimeout(function () {
                    $('.select').select2({
                        tags: true
                    });
                }, 0);
            }*/
        };

        return ClassifiedsDB;
    }]);
}());