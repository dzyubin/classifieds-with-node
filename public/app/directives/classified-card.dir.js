(function () {

    "use strict";

    angular
        .module("classifieds")

        .directive('classifiedCard', function () {
            return {
                templateUrl: 'app/views/pages/classified-card.tpl.html',
                scope: {
                    classifieds: "=classifieds",
                    classifiedsFilter: "=classifiedsFilter",
                    category: "=category",
                    userIdFilter: "=userIdFilter"
                }
                //, controller: classifiedCardController,
                //controllerAs: "vm"
            };

/*
            function classifiedCardController($state, $scope, $mdDialog, $mdToast) {

                var vm = this;
                vm.editClassified = editClassified;
                vm.deleteClassified = deleteClassified;

                function editClassified(classified) {
                    $state.go('classifieds.edit', {
                        id: classified.$id
                    });
                }

                // mongoose. Removing document
                vm.removeClassified = function () {
                    Classified.findOneAndRemove(
                        {title : "asgasg"},
                        {select : 'category'},
                        function (err, classified){
                            if (!err) {
                                console.log(classified.category);
                            }
                        }
                    );
                };

                function deleteClassified(event, classified) {
                    var confirm = $mdDialog.confirm()
                        .title('Ви справді хочете видалити ' + classified.title + '?')
                        .ok('Так')
                        .cancel('Ні')
                        .targetEvent(event);

                    $mdDialog.show(confirm).then(function () {
                        $scope.classifieds.$remove(classified);
                        showToast('Оголошення видалено!');
                    }, function () {

                    });
                }

                function showToast(message) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content(message)
                            .position('top, right')
                            .hideDelay(3000)
                    );
                }

            }
*/
        })
}());