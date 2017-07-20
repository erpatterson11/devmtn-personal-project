// INITILIZE CONTROLLER
// ============================================================

angular.module("portfolioApp").controller("mainCtrl", function($scope, mainService, reusableFuncsService, $stateParams, $state) {

let allowedRoutes = ['home', 'about']

$scope.hideNav = allowedRoutes.includes($state.name)

$scope.$on('$stateChangeSuccess', function(evt, toState, toParams, fromState, fromParams) {
        $scope.viewTransition = fromState.name !== 'home'
        $scope.hideNav = !allowedRoutes.includes(toState.name)
    })



})
