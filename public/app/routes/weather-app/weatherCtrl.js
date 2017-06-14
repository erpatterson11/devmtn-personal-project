angular.module('portfolioApp').controller('weatherCtrl', function($scope, $q, weatherService) {

    // $scope.hidePreloader=false;
    //
    //
    // var togglePreloader = function() {
    //   $scope.hidePreloader = true;
    //   $('.loader-wrapper').remove()
    //   console.log("removed!")
    // }
    //
    // $scope.fadePreloader = function() {
    //   TweenMax.to($('.loader-wrapper'), 2, {opacity: 0, onComplete: togglePreloader})
    // }

    $scope.getWeatherDataFromSearch = function(search) {
        weatherService.getWeatherDataFromSearch(search)
            .then(function(results) {
                console.log('second weather API call', results)
                $scope.weather = results;
            })
    }

    $scope.getWeatherData = function() {
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(deferred.resolve);
        deferred.promise
            .then((res) => weatherService.getWeatherData(res.coords.latitude, res.coords.longitude))
            .then(function(results) {
                console.log(results)
                $scope.weather = results;
                $scope.daily = results.data.daily.data
                $scope.current = results.data.currently
                $scope.hourly = results.data.hourly.data
                $scope.hourly[1].icon = 'snow'
                $scope.hourly[1].windSpeed = 10
                $scope.hourly[1].precipIntensity = 1
                // $scope.fadePreloader();
                $scope.$watch('selectedTime', function(sliderTime) {

                    // Set variables for function

                    var current = $scope.hourly[sliderTime]
                    var time = current.time || 0
                    var config = findSunPosition(time)
                    var moveClouds = function() {
                        var tlCloudMovement = new TimelineMax();
                        tlCloudMovement.add('initial')
                        tlCloudMovement.to(pcLeftLarge, 1000 / current.windSpeed, {
                                x: "0vw",
                                repeat: -1,
                                yoyo: true
                            }, 'initial')
                            .to(pcLeftSmall, 500 / current.windSpeed, {
                                x: "150vw",
                                repeat: -1,
                                yoyo: true
                            }, 'initial')
                            .to(pcRightLarge, 100 / current.windSpeed, {
                                x: "100vw",
                                repeat: -1,
                                yoyo: true
                            }, 'initial')
                            .to(pcRightSmall, 300 / current.windSpeed, {
                                x: "250vw",
                                repeat: -1,
                                yoyo: true
                            }, 'initial')
                    }


                    // Toggle rain or snow depending on conditions

                    if (current.icon.includes('snow')) {
                        if (!isItSnowing) {
                            isItRaining = false;
                            isItSnowing = true;
                            setTimeout(() => makeItSnow(current.precipIntensity, current.windSpeed), 500);
                        }
                    } else if (current.icon.includes('rain')) {
                        if (!isItRaining) {
                            isItSnowing = false;
                            isItRaining = true;
                            setTimeout(() => makeItRain(current.precipIntensity, current.windSpeed), 500);
                        }
                    } else {
                        isItSnowing = false;
                        isItRaining = false;
                    }

                    // Toggle gray sky background if it is raining, snowing, or cloud cover is over 75%



                    if (current.cloudCover >= 0.7 || current.precipIntensity > 0.25) {
                        if (21 <= time || time < 6) {
                            tlHourChange.to(graySkyFilter, 0.5, {
                                opacity: 1,
                                backgroundImage: 'linear-gradient(0, #666, #444)'
                            }, 'initial')
                        } else if (21 > time || time >= 6) {
                            tlHourChange.to(graySkyFilter, 0.5, {
                                opacity: 1,
                                backgroundImage: 'linear-gradient(0, #ccc, #aaa)'
                            }, 'initial')
                        }
                    } else {
                        tlHourChange.to(graySkyFilter, 0.5, {
                            opacity: 0
                        }, 'initial')
                    }

                    // Show top rain cloud if it is raining or snowing

                    if (isItRaining || isItSnowing) {
                        tlHourChange.to(pcTop, 0.5, {
                            opacity: 1
                        }, 'initial')

                    } else if (!isItRaining && !isItSnowing) {
                        tlHourChange.to(pcTop, 0.5, {
                            opacity: 0
                        }, 'initial')
                    }

                    // Show background precipitation clouds if it is raining, snowing, or if the cloud cover is greater than 50%

                    if (!precipCloudsShown) {
                        if (current.cloudCover > 0.05 && current.cloudCover < 0.25) {
                            tlHourChange.to(pcLeftSmall, 0.5, {
                                left: "-10vw"
                            }, 'initial')
                        } else if (current.cloudCover > 0.25 && current.cloudCover < 0.5) {
                            tlHourChange.to(pcLeftSmall, 0.5, {
                                    left: "-10vw"
                                }, 'initial')
                                .to(pcRightSmall, 0.5, {
                                    right: "-20vw"
                                }, 'initial')
                        } else if (current.cloudCover > 0.5 || isItRaining || isItSnowing) {
                            tlHourChange.to(pcLeftLarge, 0.5, {
                                    left: "-20vw"
                                }, 'initial')
                                .to(pcLeftSmall, 0.5, {
                                    left: "-10vw"
                                }, 'initial')
                                .to(pcRightLarge, 0.5, {
                                    right: "-20vw"
                                }, 'initial')
                                .to(pcRightSmall, 0.5, {
                                    right: "-20vw",
                                    onComplete: moveClouds()
                                }, 'initial')
                            precipCloudsShown = true;
                        }
                    } else if (!isItRaining && !isItSnowing) {
                        if (current.cloudCover < 0.5) {
                            tlHourChange.to([pcLeftLarge, pcLeftSmall], 0.5, {
                                    left: '-250vw'
                                }, 'initial')
                                .to([pcRightSmall, pcRightLarge], 0.5, {
                                    right: '-200vw'
                                }, 'initial')
                            precipCloudsShown = false;
                        }
                    }


                    // Add wind if windSpeed > 2mph. Animation speed is determined by wind speed

                    if (current.windSpeed >= 3) {

                        var rand = function(range, min) {
                            return ~~(Math.random() * range + min)
                        }

                        tlHourChange.set(windPath1, {
                            strokeWidth: "0.1%",
                            strokeDasharray: '200 7000',
                            strokeDashoffset: '7000',
                            animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear reverse infinite'
                        }, 'initial')
                        tlHourChange.set(windPath3, {
                            strokeWidth: "0.1%",
                            strokeDasharray: '200 5000',
                            strokeDashoffset: '5000',
                            animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear reverse infinite'
                        }, 'initial')
                        tlHourChange.set(windPath2, {
                            strokeWidth: "0.1%",
                            strokeDasharray: '150 7000',
                            strokeDashoffset: '7000',
                            animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear forwards infinite'
                        }, 'initial')
                        tlHourChange.set(windPath4, {
                            strokeWidth: "0.1%",
                            strokeDasharray: '150 5000',
                            strokeDashoffset: '5000',
                            animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear forwards infinite'
                        }, 'initial')
                    } else if (current.windSpeed < 3) {
                        tlHourChange.set([windPath1, windPath2, windPath3, windPath4], {
                            strokeWidth: 0
                        }, 'initial')
                    }


                    // Change sun/moon position and colors of artwork

                    tlHourChange.to(artContainer, 0.2, {
                            ease: Linear.easeNone,
                            backgroundImage: `radial-gradient(circle at ${config[0]}% ${config[1]}%, ${config[2]}`
                        }, 'initial')
                        .to(mountains, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[3]
                        }, 'initial')
                        .to(mountainAccents, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[4]
                        }, 'initial')
                        .to(ground, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[5]
                        }, 'initial')
                        .to(groundAccent, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[6]
                        }, 'initial')
                        .to(mountainLeft, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[7]
                        }, 'initial')

                    tlHourChange = new TimelineMax();

                })
            })
    }


    $scope.getWeatherData();

    $scope.unixToTime = function(time) {
        var date = new Date(time * 1000)
        return date;
    }

    $scope.unixTo24Hour = function(time) {
        var date = new Date(time * 1000).getHours();
        return date;
    }

    $scope.selectedTime = 0;

    var setCurrentState = function(sliderValue) {
        return $scope.hourly[sliderValue];
    }

    $scope.fiveDay = false;

    $scope.toggleFiveDay = function() {
        $scope.fiveDay = !$scope.fiveDay
        console.log($scope.fiveDay)
    }



    //------------------------------------------------------------------------------
    //            Variables
    //------------------------------------------------------------------------------

    var artContainer = $('#artwork-container');
    var sun = $('.sun');
    var pulse = $('.sun-pulse');
    var mountains = $('#mountains');
    var mountainAccents = $('#mountains-accents');
    var mountainLeft = $('#mountain-left');
    var ground = $('#ground');
    var groundAccent = $('#ground-accent');
    var timeSlider = $('#timeSlider');
    var slider = $('.slider')
    var graySkyFilter = $('.gray-sky')
    var precipClouds = $('.precip-cloud')
    var pcLeftLarge = ('#precip-cloud-left-large')
    var pcLeftSmall = ('#precip-cloud-left-small')
    var pcRightLarge = ('#precip-cloud-right-large')
    var pcRightSmall = ('#precip-cloud-right-small')
    var pcTop = $('#precip-cloud-top')
    var windPath1 = $('#windPath1')
    var windPath2 = $('#windPath2')
    var windPath3 = $('#windPath3')
    var windPath4 = $('#windPath4')




    var nightColors = "#ffffff 3%,#e3e5f3 5%,#64676b 8%,#3a3a3a,#282828,#101111";
    var duskColors = '#ffffff 3%,#e3e5f3 5%,#64676b 8%,#414345,#232526,#101111';
    var sunriseColors1 = '#ffdd93 3%,#64676b 8%,#cd82a0,#8a76ab,#3a3a52';
    var sunriseColors2 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#eab0d1,#cd82a0,#7072ab';
    var sunriseColors3 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#a6e6ff,#67d1fb,#eab0d1';
    var dayColors = "rgb(255,194,82) 3%,#e3e5f3 8%,#56CCF2,#4fa9ff,#008be2";
    var sunsetColors1 = 'rgb(255,194,82) 3%,#ffdd93 8%,#90dffe,#38a3d1,#154277';
    var sunsetColors2 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#e38c59,#a33d4b,#46142b';
    var sunsetColors3 = 'rgb(255,194,82) 3%,#e9ce5d 8%,#B7490F,#8A3B12,#2F1107';



    var mountainFillDay = 'hsl(40,54%,35%)'
    var mountainAccentFillDay = 'hsl(40,85%,84%)'
    var groundFillDay = 'hsl(78,60%,42%)'
    var groundAccentFillDay = 'hsl(78,76%,72%)'
    var leftMountainFillDay = 'hsl(41,76%,22%)'

    var mountainFillSunrise3 = '#7f5f4c'
    var mountainAccentFillSunrise3 = '#FFE9AD'
    var groundFillSunrise3 = '#6c8c21'
    var groundAccentFillSunrise3 = '#a5b754'
    var leftMountainFillSunrise3 = '#724f0c'

    var mountainFillSunrise2 = '#704545'
    var mountainAccentFillSunrise2 = '#ffa100'
    var groundFillSunrise2 = '#af7700'
    var groundAccentFillSunrise2 = '#2e3a30'
    var leftMountainFillSunrise2 = '#333333'

    var mountainFillSunrise1 = '#5b343a'
    var mountainAccentFillSunrise1 = '#aa4419'
    var groundFillSunrise1 = '#50450b'
    var groundAccentFillSunrise1 = '#2e3a30'
    var leftMountainFillSunrise1 = '#333333'

    var mountainFillSunset1 = '#7f5f4c'
    var mountainAccentFillSunset1 = '#FFE9AD'
    var groundFillSunset1 = '#6c8c21'
    var groundAccentFillSunset1 = '#a5b754'
    var leftMountainFillSunset1 = '#724f0c'

    var mountainFillSunset2 = '#704545'
    var mountainAccentFillSunset2 = '#ffa100'
    var groundFillSunset2 = '#af7700'
    var groundAccentFillSunset2 = '#2e3a30'
    var leftMountainFillSunset2 = '#333333'

    var mountainFillSunset3 = '#5b343a'
    var mountainAccentFillSunset3 = '#aa4419'
    var groundFillSunset3 = '#50450b'
    var groundAccentFillSunset3 = '#2e3a30'
    var leftMountainFillSunset3 = '#333333'

    var mountainFillNight = 'hsl(278,7%,16%)'
    var mountainAccentFillNight = 'hsl(279,6%,12%)'
    var groundFillNight = 'hsl(130,11%,22%)'
    var groundAccentFillNight = 'hsl(130,6%,10%)'
    var leftMountainFillNight = 'hsl(0,0%,10%)'

    var tlHourChange = new TimelineMax();
    var isItRaining = false;
    var isItSnowing = false;
    var precipCloudsShown = false;
    var stars = false;


    //------------------------------------------------------------------------------
    //            Functions
    //------------------------------------------------------------------------------

    var findSunPosition = function(time) {
        var hour = $scope.unixTo24Hour(time);
        var timePositions = {
            '0': [30, 25, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '1': [50, 20, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '2': [70, 25, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '3': [85, 40, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '4': [100, 80, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '5': [50, 420, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '6': [0, 270, sunriseColors1, mountainFillSunrise1, mountainAccentFillSunrise1, groundFillSunrise1, groundAccentFillSunrise1, leftMountainFillSunrise1, stars = true],
            '7': [8, 69, sunriseColors2, mountainFillSunrise2, mountainAccentFillSunrise2, groundFillSunrise2, groundAccentFillSunrise2, leftMountainFillSunrise2, stars = true],
            '8': [16, 39, sunriseColors3, mountainFillSunrise3, mountainAccentFillSunrise3, groundFillSunrise3, groundAccentFillSunrise3, leftMountainFillSunrise3, stars = true],
            '9': [25, 20, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '10': [33, 14, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '11': [41, 11, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '12': [50, 10, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '13': [58, 11, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '14': [66, 14, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '15': [75, 20, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '16': [83, 28, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '17': [91, 38, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '18': [100, 60, sunsetColors1, mountainFillSunset1, mountainAccentFillSunset1, groundFillSunset1, groundAccentFillSunset1, leftMountainFillSunset1, stars = true],
            '19': [100, 120, sunsetColors2, mountainFillSunset2, mountainAccentFillSunset2, groundFillSunset2, groundAccentFillSunset2, leftMountainFillSunset2, stars = true],
            '20': [100, 270, sunsetColors3, mountainFillSunset3, mountainAccentFillSunset3, groundFillSunset3, groundAccentFillSunset3, leftMountainFillSunset3, stars = true],
            '21': [50, 420, duskColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '22': [0, 120, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '23': [15, 40, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '24': [30, 25, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
        };
        return timePositions[hour];
    }


    var changeArt = function() {
        let config = findSunPosition(0)
        let shadowX = (config[0] - 50) / 5;
        TweenMax.to(artContainer, 1, {
            ease: Power2.easeOut,
            backgroundImage: `radial-gradient(circle at ${config[0]}% ${config[1]}%,` + config[2]
        })
    }


    var hexToHSL = function(hex) {
        hex = hex.replace(/^#/, "")
        r = parseInt(hex.substring(0, 2), 16) / 255;
        g = parseInt(hex.substring(2, 4), 16) / 255;
        b = parseInt(hex.substring(4, 6), 16) / 255;

        console.log(r, g, b)

        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [~~(h * 360), ~~(s * 100), ~~(l * 100)];
    }

    //------------------------------------------------------------------------------
    //            Time Change Animation
    //------------------------------------------------------------------------------

    tlHourChange.add('initial')

    // adds scope listener for changes to slider.
    // moves progress of timeline to progress position based on slider position
    // TweenMax makes movements between progress smooth


    //------------------------------------------------------------------------------
    //            Precipitation Canvas
    //------------------------------------------------------------------------------

    var makeItSnow = function(precipIntensity, windSpeed) {
        var ctx = document.getElementById('precipCanvas').getContext('2d');
        ctx.canvas.width = window.innerWidth * 2;
        ctx.canvas.height = window.innerHeight;
        var cW = ctx.canvas.width,
            cH = ctx.canvas.height;
        var particles = [];
        //  var maxParticles = precipIntensity * cW/2;
        var snowIntensity = precipIntensity;
        var windySnow = windSpeed;
        var maxParticles = snowIntensity * cW;

        function addParticle() {
            var s = ~~(Math.random() * 10) + 1;
            var yv = s;
            var xv = -1 + Math.random() * 2 + 0.5 + windySnow;
            var x = ~~(Math.random() * cW) + 1 - (cW / 2);
            var y = 0;
            particles.push({
                'x': x,
                'y': y,
                's': s,
                'yv': yv,
                'xv': xv
            })
        }

        function precip() {
            if (particles.length < maxParticles && isItSnowing) {
                addParticle();
            }
            for (var i = 0; i < particles.length; i++) {
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.beginPath();
                // arc(x,y,radius,startAndle,endAndle,anticlockwise)
                ctx.arc(particles[i].x += particles[i].xv, particles[i].y += particles[i].yv, particles[i].s * 0.5, 0, Math.PI * 2, false);
                ctx.fill();
                if (particles[i].y > cH && isItSnowing) {
                    particles[i].y = 0
                    particles[i].x = ~~(Math.random() * cW) - (cW / 2);
                } else if (particles[i].y > cH && !isItSnowing) {
                    particles[i].yv = 0;
                    particles[i].y = -5;
                } else if (!isItSnowing) {
                    particles[i].yv *= 3;
                }
            }
        }

        function animate() {

            ctx.save();
            ctx.clearRect(0, 0, cW, cH);
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, cW, cH);
            //rotates the canvas
            //  ctx.rotate(~~(-windySnow/10));
            precip();
            ctx.restore();

        }

        var animateInterval = setInterval(function() {
            animate();
            if (!isItSnowing) {
                setTimeout(() => clearInterval(animateInterval), 500)
            }
        }, 30);

    };


    var makeItRain = function(precipIntensity, windSpeed) {
        var ctx = document.getElementById('precipCanvas').getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        var w = ctx.canvas.width,
            h = ctx.canvas.height;
        ctx.strokeStyle = '#76b1e2';
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';


        //  var windyRain = Math.random()*5 + 2.5;
        var windyRain = windSpeed
        var rainIntensity = precipIntensity

        var particles = [];
        var maxParts = rainIntensity * w

        function addParticle() {

            particles.push({
                x: Math.random() * w,
                y: 0,
                l: Math.random() * 1,
                xs: -1 + Math.random() * 2 + 0.5 + windyRain,
                ys: Math.random() * 10 + 50 + rainIntensity * 2
            })
        }

        function draw() {

            if (particles.length < maxParts) {
                for (var a = 0; a < 5; a++) {
                    addParticle();
                }
            }

            ctx.clearRect(0, 0, w, h);
            for (var c = 0; c < particles.length; c++) {
                var p = particles[c];
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
                ctx.stroke();
            }
            move();
        }

        function move() {
            for (var b = 0; b < particles.length; b++) {
                var p = particles[b];
                p.x += p.xs;
                p.y += p.ys;
                if (p.x > w && isItRaining || p.y > h && isItRaining) {
                    p.x = Math.random() * w;
                    p.y = -20;
                } else if (!isItRaining) {
                    ctx.globalAlpha -= 0.1;
                }



                //  (p.x > w && !isItRaining || p.y > h && !isItRaining){
                //    p.ys = 0;
                //    p.xs = 0;
                //    p.y = -5;
                //  } else if (!isItRaining) {
                //    p.ys *= 5;
                //  }
            }
        }

        var animateInterval = setInterval(function() {
            draw();
            if (!isItRaining) {
                setTimeout(() => clearInterval(animateInterval), 500)
            }
        }, 30);
    };

    //---------------------------------------------------------------------------
    //                 Stars Canvas
    //---------------------------------------------------------------------------

    // var starShine = function() {
    //                   var ctx = document.getElementById('starsCanvas').getContext('2d');
    //                   ctx.canvas.width = window.innerWidth;
    //                   ctx.canvas.height = window.innerHeight;
    //                   var cW = ctx.canvas.width, cH = ctx.canvas.height;
    //                   var starsTemp = [];
    //                   var stars2 = [];
    //                   var stars3 = [];
    //                   var stars4 = [];
    //                   var stars5 = [];
    //                   var maxStars = 150;
    //
    //                   function makeStar(arr) {
    //                     var x = ~~(Math.random()*cW)+1;
    //                     var y = ~~(Math.random()*cH)+1;
    //                     var s = ~~(Math.random()*2)+1;
    //                     var inc = true;
    //                     arr.push({'x':x,'y':y,'s':s})
    //                   }
    //
    //                   for (let j = 0; j < 5; j++) {
    //                     for (let i = 0; i < maxStars/5; i++) {
    //                       makeStar()
    //                     }
    //
    //                     for(let i = 0; i < stars[j].length; i++) {
    //                       ctx.fillStyle = 'rgb(255,255,255)';
    //                       ctx.beginPath();
    //                         // arc(x,y,radius,startAndle,endAndle,anticlockwise)
    //                       ctx.arc(stars[i].x,stars[i].y, stars[i].s*0.5, 0, Math.PI*2, false);
    //                       ctx.globalAlpha = stars[i].s
    //                       ctx.fill();
    //                      }
    //                    }
    //
    //
    //                   function twinkle(index) {
    //                      TweenMax.to(stars)
    //                   }
    //
    //
    // };

})
