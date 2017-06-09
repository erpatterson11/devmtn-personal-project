// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("goldenRatioCtrl", function($scope, goldenRatioService) {

  goldenRatioService.generateContent()

});
