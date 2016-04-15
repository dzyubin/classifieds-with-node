angular.module('classifieds')
    .controller('facebookCtrl', function($scope, $auth, $state) {

        $scope.authenticate = function(provider) {
            $auth.authenticate(provider);
            $state.go('classifieds.login');
            //$state.go('classifieds');
        };

        $scope.authenticated = $auth.isAuthenticated();

    });