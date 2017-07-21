angular.module('portfolioApp').controller('aboutCtrl', function($scope, aboutService) {


    $scope.images = aboutService.images
    
})