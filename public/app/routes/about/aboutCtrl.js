angular.module('portfolioApp').controller('aboutCtrl', function($scope, aboutService) {

    aboutService.routeLoadAnimation()

    $scope.iconColors = {}

    $scope.images = aboutService.images

    $scope.bgImage = aboutService.image

    $scope.toggleBoxShadow = function(item, bool) {
        if (bool) {
          $scope.iconColors[item.key] = {}
          $scope.iconColors[item.key].dropShadow = {"filter": "drop-shadow(0 0 25px " + item.value.color +")"} 
          $scope.iconColors[item.key].textShadow = {"textShadow": "0 0 5px " + item.value.color}           
        } else {
        $scope.iconColors[item.key].dropShadow = null
        $scope.iconColors[item.key].textShadow = null
        }
    }

    // aboutService.pulseNeon()


})