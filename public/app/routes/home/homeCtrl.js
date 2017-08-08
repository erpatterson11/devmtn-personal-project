// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("homeCtrl", function($scope, $rootScope, pulseParticlesService) {
  
    pulseParticlesService.bloody(document.querySelector('#cardiac-canvas'))

});
