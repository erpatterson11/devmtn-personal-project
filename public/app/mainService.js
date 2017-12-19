// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("mainService", function($http) {

  this.routeLoadAnimation = function() {
    TweenMax.from(
      [
        $('#main-nav'),
        $('#ham-menu')
      ],
      0.2,
      {
        delay: 0.5,
        opacity: 0
      }
    )

  }

});
