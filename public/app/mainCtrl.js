angular.module("portfolioApp").controller("mainCtrl", function($scope, $window, $state, mainService, reusableFuncsService) {

    let allowedRoutes = ['home', 'about']

    $scope.hideNav = allowedRoutes.includes($state.name)

    $scope.$on('$stateChangeSuccess', function(evt, toState, toParams, fromState, fromParams) {
            $scope.viewTransition = fromState.name !== 'home'
            $scope.hideNav = !allowedRoutes.includes(toState.name)
        })

    $scope.myEmail = 'ecpatterson11@gmail.com'

    $scope.sendMail = function(subject, message) {
        $window.open(`mailto:${$scope.myEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)},_self`)
    }

})
