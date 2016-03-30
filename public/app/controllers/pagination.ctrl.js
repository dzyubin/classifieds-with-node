angular.module('classifieds')
    .controller('listdata', function($rootScope, $http, $timeout, $state, Auth, Classified){
        var vm = this;
        var classifiedsDataRoute,
            userId,
            updatedCategories = [];

        vm.classifieds = []; //declare an empty array
        vm.pageNumber = 1; // initialize page no to 1
        vm.total_count = 25;
        vm.itemsPerPage = 5; //this could be a dynamic value from a drop down
        vm.getData = function(pageNumber){ // This would fetch the data on page change.
            //In practice this should be in a factory.
            $timeout(function () {


            vm.classifieds = [];

            if (Auth.isLoggedIn()){
                userId = $rootScope.$root.user.id;
                console.log(userId);
                classifiedsDataRoute = "/api/list/" + vm.itemsPerPage + "/" + pageNumber + "/" + userId;
                console.log(classifiedsDataRoute);
            } else {
                classifiedsDataRoute = "/api/list/" + vm.itemsPerPage + "/" + pageNumber;
                console.log(classifiedsDataRoute);
            }

            //$http.get("/api/list/" + vm.itemsPerPage + "/" + pageNumber).success(function(response){
            $http.get(classifiedsDataRoute).success(function(response){
                $rootScope.classifieds = response.classifieds;  // data to be displayed on current page.
                vm.total_count = response.total_count; // total data count.
                $rootScope.categories = getCategories($rootScope.classifieds);
            });
            });
        };
        vm.getData(vm.pageNumber); // Call the function to fetch initial data on page load.

        // Select2 плагін. Ініціалізація і реєстрація eventListener'а
        $timeout(function() {

            $(document).ready(function () {
                var Select = $('select');
                Select.select2();

                Select.on("select2:select", function (e) {
                    updatedCategories.push(e.params.data.id); //e.params.data.id);
                });
            });

        }, 1000);

        vm.updateCategories = function (classified) {
            if (updatedCategories.length) {
                classified.updatedCategories = updatedCategories;
            }
            console.log(classified);
            Classified.editClassified(classified);
        };

        function getCategories(classifieds) {

            var categories = [];
            angular.forEach(classifieds, function (item) {
                categories.push(item.category);
            });

            return _.uniq(categories);
        }

        vm.editClassified = function (classified) {
            $state.go('classifieds.edit', {
                id: classified._id
            });
        }
    });