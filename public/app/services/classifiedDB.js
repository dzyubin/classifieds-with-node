(function () {
    "use strict";

angular
    .module('classifieds')
    .factory('ClassifiedsDB', function($http) {
        var ClassifiedsDB = function() {
            this.classifieds = [];
            this.busy = false;
            this.after = '';
        };

        ClassifiedsDB.prototype.nextPage = function() {
            //console.log('sdfsdfg');
            if (this.busy) return;
            this.busy = true;

            var url = "/api/list";
            $http.get(url).success(function(data) {
                var classifieds = data.classifieds;
                console.log(classifieds);
                for (var i = 0; i < classifieds.length; i++) {
                    this.classifieds.push(classifieds[i]);
                }
                //this.after = "t3_" + this.classifieds[this.classifieds.length - 1].id;
                this.busy = false;
            }.bind(this));
        };

        return ClassifiedsDB;
    });
}());