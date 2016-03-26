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

                Classified.getClassified($state.params.id)
                    .success(function (data) {
                        console.log(data);
                        vm.classified = data;
                    });

                $scope.$watch('vm.sidenavOpen', function (sidenav) {
                    if (sidenav === false) {
                        $mdSidenav('left')
                            .close()
                            .then(function () {
                                $state.go('classifieds');
                            });
                    }
                });

                function saveEdit() {

                    Classified.editClassified(vm.classified);


                   /* vm.classifieds.$save(vm.classified).then(function () {
                        $scope.$emit('editSaved', 'Редагування збережено!');
                        vm.sidenavOpen = false;
                    });*/
                }

                function closeSidebar() {
                    vm.sidenavOpen = false;
                }

                /*
                                vm.doLogin = function () {

                                    vm.processing = true;

                                    vm.error = '';

                                    Auth.login(vm.loginData.username, vm.loginData.password)
                                        .success(function (data) {
                                            vm.processing = false;

                                            Auth.getUser()
                                                .then(function (data) {
                                                    $rootScope.user = data.data;
                                                    vm.user = data.data;
                                                });
                                            if(data.success) {
                                                $state.go('classifieds');
                                            } else {
                                                vm.error = data.message;
                                            }
                                        });
                                };
                */
            }]);
}());