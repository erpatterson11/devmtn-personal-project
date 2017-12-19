angular.module("portfolioApp").service("routeLoadAnimationService", function() {
    this.routeLoadAnimation = function(targets) {
        TweenMax.staggerFrom(
            targets,
            0.5,
            {
                delay: 0.25,
                ease: Power1.easeOut,
                x: -500,
                opacity: 0
            },
            0.15
        )
    }
})