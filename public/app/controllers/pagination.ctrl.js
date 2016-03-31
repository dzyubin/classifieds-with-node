angular.module('classifieds')
    .controller('listdata', function($rootScope, $http, $timeout, $state, Auth, Classified){
        var vm = this;
        var classifiedsDataRoute,
            userId,
            updatedCategories = [];

        vm.loggedIn = Auth.isLoggedIn();
        console.log(vm.loggedIn);
        //vm.classifieds = []; //declare an empty array
        /*vm.pageNumber = 1; // initialize page no to 1
        //vm.total_count = 25;
        vm.itemsPerPage = 5; //this could be a dynamic value from a drop down
        vm.getData = function(pageNumber){ // This would fetch the data on page change.
            //In practice this should be in a factory.
            $timeout(function () {

                //vm.classifieds = [];

                if (Auth.isLoggedIn()){
                    userId = $rootScope.$root.user.id;
                    //console.log(userId);
                    classifiedsDataRoute = "/api/list/" + vm.itemsPerPage + "/" + pageNumber + "/" + userId;
                    //console.log(classifiedsDataRoute);
                } else {
                    classifiedsDataRoute = "/api/list/" + vm.itemsPerPage + "/" + pageNumber;
                    //console.log(classifiedsDataRoute);
                }

                //$http.get("/api/list/" + vm.itemsPerPage + "/" + pageNumber).success(function(response){
                $http.get(classifiedsDataRoute).success(function(response){
                    $rootScope.classifieds = response.classifieds;  // data to be displayed on current page.
                    vm.total_count = response.total_count; // total data count.
                    $rootScope.categories = getCategories($rootScope.classifieds);

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

                    }, 300);
                });
            });
        };
        vm.getData(vm.pageNumber); // Call the function to fetch initial data on page load.*/

        Classified.getClassifieds();

        vm.updateCategories = function (classified) {
            if (updatedCategories.length) { // якщо обрані нові категорії
                classified.updatedCategories = updatedCategories; // додати їх до оголошення
            }
            console.log(classified);
            Classified.editClassified(classified);
        };

/*
        function getCategories(classifieds) {
            var categories = [];
            angular.forEach(classifieds, function (item) {
                angular.forEach(item.category, function (item) {
                    categories.push(item);
                })
            });

            return _.uniq(categories);
        }
*/

        vm.editClassified = function (classified) {
            $state.go('classifieds.edit', {
                id: classified._id
            });
        }
    });