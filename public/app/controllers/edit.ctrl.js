(function () {

    "use strict";

    angular
        .module('classifieds')
        .controller('editClassifiedsCtrl',
        ['$rootScope', '$scope', '$mdSidenav', '$state', '$http', 'Auth', 'Classified',
            function ($rootScope, $scope, $mdSidenav, $state, $http, Auth, Classified) {

                var vm = this;

                this.sidenavOpen = true;

                vm.closeSidebar = closeSidebar;
                vm.saveEdit = saveEdit;


                Classified.getSingleClassified($state.params.id)
                    .success(function (data) {
                        //console.log(data);
                        vm.classified = data;
                    });

                $scope.$watch('vm.sidenavOpen', function (sidenav) {
                    if (sidenav === false) {
                        $mdSidenav('left')
                            .close()
                            .then(function () {
                                $state.go('my-classifieds');
                            });
                    }
                });

                function saveEdit() {
                    //vm.classified.category = vm.classified.category.split(',');

                    Classified.editClassified(vm.classified);

                    $rootScope.classifieds.forEach(function(classified) {
                        if (classified._id === $state.params.id) {
                            for (var prop in vm.classified) {
                                if (vm.classified.hasOwnProperty(prop)) {
                                    classified[prop] = vm.classified[prop];
                                }
                            }
                        }
                    });

                    vm.classified = {};
                    vm.sidenavOpen = false;
                    $scope.$emit('editSaved', 'Редагування збережено!');
                }

                function closeSidebar() {
                    vm.sidenavOpen = false;
                }
            }]);
}());