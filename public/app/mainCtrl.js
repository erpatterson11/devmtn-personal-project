// INITILIZE CONTROLLER
// ============================================================

angular.module("portfolioApp").controller("mainCtrl", function($scope, mainService, reusableFuncsService, $stateParams, $state) {

$scope.current = $state.current === 'home' ? false : true

$scope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
        $scope.current = fromState.name === 'home' ? false : true
    })

})
