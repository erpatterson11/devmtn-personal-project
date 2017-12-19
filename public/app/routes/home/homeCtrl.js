// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("homeCtrl", function($scope, $rootScope, pulseParticlesService, routeLoadAnimationService) {
  
    pulseParticlesService.bloody(document.querySelector('#cardiac-canvas'))
    routeLoadAnimationService.routeLoadAnimation([$('.top'),$('.bottom')])

});
