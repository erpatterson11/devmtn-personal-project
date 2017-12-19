angular.module("portfolioApp").service("homeService", function() {
    
    this.routeLoadAnimations = function() {
        TweenMax.staggerFrom(
            [
                $('.top'),
                $('.bottom')
            ],
            0.25,
            {
                delay: 0.25,
                ease: Power1.easeOut,
                x: -500,
                opacity: 0
            },
            0.15
        )
    }
  
});
  