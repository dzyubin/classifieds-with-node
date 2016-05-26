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

                $scope.$emit('userClassifieds', 'none');

                Classified.getSingleClassified($state.params.id)
                    .success(function (data) {
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

                    Classified.editClassified(vm.classified)
                        .then(function (data) {
                            vm.classified = {};
                            //vm.error = '';
                            $scope.$emit('editSaved', 'Редагування збережено!');
                            $state.go('my-classifieds');
                        })
                        .catch(function (error) {
                            console.log(error);
                            vm.error = "Не вдалося зберегти редагування. Спробуйте ще раз"
                        });
                }

                function closeSidebar() {
                    $state.go('my-classifieds');
                }
            }]);
}());