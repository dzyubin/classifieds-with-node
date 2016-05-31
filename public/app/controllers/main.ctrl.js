(function () {

    "use strict";

    angular
        .module("classifieds")
        .controller("classifiedsCtrl", ['$rootScope', '$scope', '$http', '$state', 'Auth', 'Classified',
            function ($rootScope, $scope, $http, $state, Auth, Classified) {

            var vm = this;
            vm.loggedIn = Auth.isLoggedIn();

            $rootScope.$on('$stateChangeStart', function () {
                vm.loggedIn = Auth.isLoggedIn();
                Auth.getUser()
                    .then(function (data) {
                        //vm.user = data.data;
                        $rootScope.user = data.data;
                    });
            });

            $scope.$on('userClassifieds', function (event, message) {
                $scope.activeNavbarBtn = message;
            });

            $scope.$on('editSaved', function (event, message) {
                Classified.notify(message);
            });

            vm.doLogout = function () {

                // видалити user.id для того щоб вимкнути фільтрування оголошень по автору оголошення
                $rootScope.user.id = '';
                Auth.logout();

                // todo: hack. знайти краще рішення
                $state.go('all-classifieds');
                $state.go('home');
                //Classified.notify('До побачення!');
            };

            vm.openSidebar = function openSidebar() {
                if (Auth.isLoggedIn()) {
                    $state.go('new');
                } else {
                    Classified.notify("Необхідна авторизація (натисніть 'Увійти')");
                }
            };
        }])
}());