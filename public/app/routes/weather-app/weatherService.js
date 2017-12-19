angular.module('portfolioApp').service('weatherService', function(){

    this.routeLoadAnimation = function() {

        const landingBgImage = new Image()
        landingBgImage.src = './app/routes/weather-app/images/bg.jpg'
        landingBgImage.onload = function() {
            const landingBg = $('#landing-page-background')
            TweenMax.from(
                landingBg,
                3,
                {
                    opacity: 0
                }
            )
            landingBg.css({
                'background':`url('./app/routes/weather-app/images/bg.jpg')`,
                'background-size': 'cover'
            })
            // cb()
        }
    }

})    