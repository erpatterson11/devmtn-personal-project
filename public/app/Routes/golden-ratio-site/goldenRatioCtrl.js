// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("goldenRatioCtrl", function($scope, goldenRatioService) {

  goldenRatioService.generateContent()

  document.querySelector('nav').style.display = 'none'

  window.onbeforeunload = function() {
    document.querySelector('nav').style.display = 'inline'
  }

});
