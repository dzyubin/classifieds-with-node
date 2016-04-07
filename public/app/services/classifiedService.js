angular.module('classifiedService', [])

    .factory('Classified', ['$rootScope', '$http', '$timeout', 'Auth', function ($rootScope, $http, $timeout, Auth) {

        var classifiedFactory = {};

        classifiedFactory.create = function (classifiedData) {
            return $http.post('/api', classifiedData);
        };

        /*classifiedFactory.getClassifieds = function () {
            return $http.get('/api');
        };*/

        classifiedFactory.getClassifieds = function () {
            var classifiedsDataRoute,
                userId,
                updatedCategories = [],
                pageNumber;

            //vm.classifieds = []; //declare an empty array
            $rootScope.pageNumber = 1; // initialize page no to 1
            pageNumber = $rootScope.pageNumber;
            //vm.total_count = 25;
            $rootScope.itemsPerPage = 20; //this could be a dynamic value from a drop down
            $rootScope.getData = function(pageNumber){ // This would fetch the data on page change.
                //In practice this should be in a factory.
                $timeout(function () {

                    //vm.classifieds = [];

                    if (Auth.isLoggedIn()){
                        userId = $rootScope.$root.user.id;
                        classifiedsDataRoute = "/api/list/" + $rootScope.itemsPerPage + "/" + pageNumber + "/" + userId;
                        console.log(classifiedsDataRoute);
                    } else {
                        classifiedsDataRoute = "/api/list/" + $rootScope.itemsPerPage + "/" + pageNumber;
                        console.log(classifiedsDataRoute);
                    }

                    //$http.get("/api/list/" + vm.itemsPerPage + "/" + pageNumber).success(function(response){
                    $http.get(classifiedsDataRoute).success(function(response){
                        $rootScope.classifieds = response.classifieds;  // data to be displayed on current page.
                        $rootScope.total_count = response.total_count; // total data count.
                        //$rootScope.categories = getCategories($rootScope.classifieds);

                        // Select2 плагін. Ініціалізація і реєстрація eventListener'а
                        $timeout(function() {

                            $(document).ready(function () {
                                var Select = $('select');
                                Select.select2({
                                    //placeholder: "Змінити категорію"
                                });

                                Select.on("select2:select", function (e) {
                                    updatedCategories.push(e.params.data.id); //e.params.data.id);
                                });
                            });

                        }, 50);
                    });
                });
            };
            $rootScope.getData(pageNumber); // Call the function to fetch initial data on page load.
        };

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

        /*classifiedFactory.remove = function (classified) {
            return $http.post('/api/remove', classified);
        };*/

        return classifiedFactory;
    }]);