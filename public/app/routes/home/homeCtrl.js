// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("homeCtrl", function($scope, $rootScope, pulseParticlesService, homeService) {
  
    pulseParticlesService.bloody(document.querySelector('#cardiac-canvas'))
    homeService.routeLoadAnimations()

});
