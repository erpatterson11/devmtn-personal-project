angular.module('portfolioApp').service('aboutService', function() {

    this.routeLoadAnimation = function() {
        let bgImage = new Image()
        bgImage.src = './app/routes/about/images/neon-1.jpg'
        bgImage.onload = function() {
            const neonSign = $('#neon-sign')
            TweenMax.from(
                neonSign,
                1,
                {
                    opacity: 0
                }
            )
            neonSign.css({
                'background':`linear-gradient(transparent, transparent 50%, rgb(0,0,0) 100%), url('./app/routes/about/images/neon-1.jpg')`,
                'background-size': 'cover'
            })
        }
    }


    function Images() {
        this.html = new Image()
        this.css = new Image()
        this.javascript = new Image()
        this.react = new Image()
        this.angular = new Image()
        this.node = new Image()
        this.postgresql = new Image()
        this.sass = new Image()
        this.jquery = new Image()
        this.greensock = new Image()
        this.webpack = new Image()
        this.gulp = new Image()
        this.git = new Image()
        this.github = new Image()

        this.html.src = './app/routes/about/images/html.svg'
        this.css.src = './app/routes/about/images/css.svg'
        this.javascript.src = './app/routes/about/images/js.svg'
        this.react.src = './app/routes/about/images/react.svg'
        this.angular.src = './app/routes/about/images/angular.svg'
        this.node.src = './app/routes/about/images/node.svg'
        this.postgresql.src = './app/routes/about/images/postgresql.svg'
        this.sass.src = './app/routes/about/images/sass.svg'
        this.jquery.src = './app/routes/about/images/jquery.svg'
        this.greensock.src = './app/routes/about/images/greensock.svg'
        this.webpack.src = './app/routes/about/images/webpack.svg'
        this.gulp.src = './app/routes/about/images/gulp.svg'
        this.git.src = './app/routes/about/images/git.svg'
        this.github.src = './app/routes/about/images/github_logo.svg'

        this.html.color = '#e44d26'
        this.css.color = '#1572b6'
        this.javascript.color = '#f0db4f'       
        this.react.color = '#61dafb'
        this.angular.color = '#c4473a'
        this.node.color = '#83cd29'
        this.postgresql.color = '#336791'
        this.sass.color = '#cb6699'
        this.jquery.color = '#0868ac'
        this.greensock.color = '#8ac640'
        this.webpack.color = '#1c78c0'
        this.gulp.color = '#eb4a4b'
        this.git.color = '#f34f29'
        this.github.color = '#ffffff'
    }

    this.images = new Images()

    this.pulseNeon = function() {
        let workingNeon = $('.neon-animation')
        let flickeringNeon = $('#neon-flicker')
        let tl = new TimelineMax({
                        repeat:-1,
                        yoyo: true
                      })


        let orange = "#ff9933"
        let white = "#ffffff"
        
        tl.to(workingNeon, 0.2, {
            // "text-shadow": `0 0 10px ${white}, 0 0 20px ${white}, 0 0 30px ${white}, 0 0 40px ${orange}, 0 0 70px ${orange}, 0 0 80px ${orange}, 0 0 100px ${orange}, 0 0 150px ${orange}`,
            "opacity" : 0.8
        }).to(workingNeon, 0.4, {
            // "text-shadow": `0 0 5px ${white}, 0 0 10px ${white}, 0 0 15px ${white}, 0 0 20px ${orange}, 0 0 35px ${orange}, 0 0 40px ${orange}, 0 0 50px ${orange}, 0 0 750px ${orange}`,
            "opacity" : 0.7
        }).to(workingNeon, 0.1, {
            // "text-shadow": `0 0 10px ${white}, 0 0 20px ${white}, 0 0 30px ${white}, 0 0 40px ${orange}, 0 0 70px ${orange}, 0 0 80px ${orange}, 0 0 100px ${orange}, 0 0 150px ${orange}`,
            "opacity" : 0.8
        }).to(workingNeon, 0.3, {
            // "text-shadow": `0 0 5px ${white}, 0 0 10px ${white}, 0 0 15px ${white}, 0 0 20px ${orange}, 0 0 35px ${orange}, 0 0 40px ${orange}, 0 0 50px ${orange}, 0 0 750px ${orange}`,
            "opacity" : 0.7
        })

        // tl.play()
        
    }


})