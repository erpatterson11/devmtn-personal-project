angular.module('portfolioApp').service('weatherLogicService', function(weatherCanvasService) {

    //------------------------------------------------------------------------------
    //            Constants
    //------------------------------------------------------------------------------

    const artContainer = $('#artwork-container')
    const mountains = $('#mountains')
    const mountainAccents = $('#mountains-accents')
    const mountainLeft = $('#mountain-left')
    const ground = $('#ground')
    const groundAccent = $('#ground-accent')
    const timeSlider = $('#timeSlider')
    const slider = $('.slider')
    const graySkyFilter = $('.gray-sky')
    const precipClouds = $('.precip-cloud')
    const starsCanvas = $('#starsCanvas')
    const pcLeftLarge = $('#precip-cloud-left-large')
    const pcLeftSmall = $('#precip-cloud-left-small')
    const pcRightLarge = $('#precip-cloud-right-large')
    const pcRightSmall = $('#precip-cloud-right-small')
    const pcTop = $('#precip-cloud-top')
    const windPath1 = $('#windPath1')
    const windPath2 = $('#windPath2')
    const windPath3 = $('#windPath3')
    const windPath4 = $('#windPath4')
    const sideNav = $('#side-nav')

    const nightColors = "#ffffff 3%,#e3e5f3 5%,#64676b 8%,#3a3a3a,#282828,#101111"
    const duskColors = '#ffffff 3%,#e3e5f3 5%,#64676b 8%,#414345,#232526,#101111'
    const sunriseColors1 = '#ffdd93 3%,#64676b 8%,#cd82a0,#8a76ab,#3a3a52'
    const sunriseColors2 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#eab0d1,#cd82a0,#7072ab'
    const sunriseColors3 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#a6e6ff,#67d1fb,#eab0d1'
    const dayColors = "rgb(255,194,82) 3%,#e3e5f3 8%,#56CCF2,#4fa9ff,#008be2"
    const sunsetColors1 = 'rgb(255,194,82) 3%,#ffdd93 8%,#90dffe,#38a3d1,#154277'
    const sunsetColors2 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#e38c59,#a33d4b,#46142b'
    const sunsetColors3 = 'rgb(255,194,82) 3%,#e9ce5d 8%,#B7490F,#8A3B12,#2F1107'

    const mountainFillDay = 'hsl(40,54%,35%)'
    const mountainAccentFillDay = 'hsl(40,85%,84%)'
    const groundFillDay = 'hsl(78,60%,42%)'
    const groundAccentFillDay = 'hsl(78,76%,72%)'
    const leftMountainFillDay = 'hsl(41,76%,22%)'

    const mountainFillSunrise3 = '#7f5f4c'
    const mountainAccentFillSunrise3 = '#FFE9AD'
    const groundFillSunrise3 = '#6c8c21'
    const groundAccentFillSunrise3 = '#a5b754'
    const leftMountainFillSunrise3 = '#724f0c'

    const mountainFillSunrise2 = '#704545'
    const mountainAccentFillSunrise2 = '#ffa100'
    const groundFillSunrise2 = '#af7700'
    const groundAccentFillSunrise2 = '#2e3a30'
    const leftMountainFillSunrise2 = '#333333'

    const mountainFillSunrise1 = '#5b343a'
    const mountainAccentFillSunrise1 = '#aa4419'
    const groundFillSunrise1 = '#50450b'
    const groundAccentFillSunrise1 = '#2e3a30'
    const leftMountainFillSunrise1 = '#333333'

    const mountainFillSunset1 = '#7f5f4c'
    const mountainAccentFillSunset1 = '#FFE9AD'
    const groundFillSunset1 = '#6c8c21'
    const groundAccentFillSunset1 = '#a5b754'
    const leftMountainFillSunset1 = '#724f0c'

    const mountainFillSunset2 = '#704545'
    const mountainAccentFillSunset2 = '#ffa100'
    const groundFillSunset2 = '#af7700'
    const groundAccentFillSunset2 = '#2e3a30'
    const leftMountainFillSunset2 = '#333333'

    const mountainFillSunset3 = '#5b343a'
    const mountainAccentFillSunset3 = '#aa4419'
    const groundFillSunset3 = '#50450b'
    const groundAccentFillSunset3 = '#2e3a30'
    const leftMountainFillSunset3 = '#333333'

    const mountainFillNight = 'hsl(278,7%,16%)'
    const mountainAccentFillNight = 'hsl(279,6%,12%)'
    const groundFillNight = 'hsl(130,11%,22%)'
    const groundAccentFillNight = 'hsl(130,6%,10%)'
    const leftMountainFillNight = 'hsl(0,0%,10%)'


    //-------------------------------------------------------------------
    //            Weather State Variables
    //--------------------------------------------------------------------

    let isItRaining = false
    let isItSnowing = false
    let precipCloudsShown = false
    let isItNight = false
    let stars = false

    //------------------------------------------------------------------------------
    //            Functions
    //------------------------------------------------------------------------------

    // time to hours in integers
    const unixTo24Hour = function(time) {
        let hours = new Date(time * 1000).getHours()
        return hours
    }

    const findSunPosition = function(time) {
        const stateByTime = {
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
            '24': [30, 25, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true]
        }
        return stateByTime[time]
    }

    //------------------------------------------------------------------------------
    //            Time Change Animation
    //------------------------------------------------------------------------------

    // all animations generated in this.changeArtwork() will be added to this timeline
    let tlHourChange = new TimelineMax()
    tlHourChange.add('initial')

    //-------------------------------------------------------------------
    //            Service Functions
    //--------------------------------------------------------------------

    // Main artwork changing function

    this.changeArtwork = function(selectedTime) {

        // Set variables for function

        var current = selectedTime
        var time = (unixTo24Hour(current.time)) ? unixTo24Hour(current.time) : 0
        var config = findSunPosition(time)
        var transTime = 0.7
        var moveClouds = function moveClouds() {
            var tlCloudMovement = new TimelineMax()
            tlCloudMovement.add('initial')
            tlCloudMovement.to(pcLeftLarge, 100 / current.windSpeed, {
                x: "0vw",
                repeat: -1,
                yoyo: true
            }, 'initial').to(pcLeftSmall, 500 / current.windSpeed, {
                x: "150vw",
                repeat: -1,
                yoyo: true
            }, 'initial').to(pcRightLarge, 100 / current.windSpeed, {
                x: "100vw",
                repeat: -1,
                yoyo: true
            }, 'initial').to(pcRightSmall, 300 / current.windSpeed, {
                x: "250vw",
                repeat: -1,
                yoyo: true
            }, 'initial')
        }
        var updateWeatherBools = (rain,snow) => {
          isItRaining = rain
          isItSnowing = snow
          weatherCanvasService.setRainBool(rain)
          weatherCanvasService.setSnowBool(snow)
        }

        // set side-menu background based on chosen time
        sideNav.css({'background':`radial-gradient(circle at -10px 110%, ${config[2]})`})

        // Toggle stars if it is night

        if (!isItNight) {
            if (time > 20) {
                isItNight = true
                weatherCanvasService.twinkleTwinkle(isItNight)
                tlHourChange.from(starsCanvas, transTime, {
                    opacity: 0
                }, 'initial')
            }
        } else if (isItNight) {
            if (time > 6 && time < 21) {
                isItNight = false
                weatherCanvasService.twinkleTwinkle(isItNight)
            }
        }

        // Toggle rain or snow depending on conditions

        if (!current.icon.includes('snow') && isItSnowing || !current.icon.includes('rain') && isItRaining) {
             updateWeatherBools(false,false)
         }

        if (current.icon.includes('snow')) {
            if (!isItSnowing) {
              updateWeatherBools(false,true)
                weatherCanvasService.makeItSnow(current.precipIntensity, current.windSpeed)
            }
        } else if (current.icon.includes('rain')) {
            if (!isItRaining) {
              updateWeatherBools(true,false)
                weatherCanvasService.makeItRain(current.precipIntensity, current.windSpeed)
            }
        }


        // Toggle gray sky background if it is raining, snowing, or cloud cover is over 75%
        if (current.cloudCover >= 0.7 || current.precipIntensity > 0.25) {
            if (21 <= time || time < 6) {
                tlHourChange.to(graySkyFilter, transTime, {
                    opacity: 1,
                    backgroundImage: 'linear-gradient(0, #666, #444)'
                }, 'initial')
            } else if (21 > time || time >= 6) {
                tlHourChange.to(graySkyFilter, transTime, {
                    opacity: 1,
                    backgroundImage: 'linear-gradient(0, #ccc, #aaa)'
                }, 'initial')
            }
        } else {
            tlHourChange.to(graySkyFilter, transTime, {
                opacity: 0
            }, 'initial')
        }

        // Show top rain cloud if it is raining or snowing

        if (isItRaining || isItSnowing) {
            tlHourChange.to(pcTop, transTime, {
                opacity: 1
            }, 'initial')
        } else if (!isItRaining && !isItSnowing) {
            tlHourChange.to(pcTop, transTime, {
                opacity: 0
            }, 'initial')
        }

        // Show background precipitation clouds if it is raining, snowing, or if the cloud cover is greater than 50%
        // if (!precipCloudsShown) {
        if (current.cloudCover > 0.05 && current.cloudCover < 0.25) {
            tlHourChange.to(pcLeftSmall, transTime, {
                opacity: 1
            }, 'initial').to(pcLeftLarge, transTime, {
                opacity: 0
            }, 'initial').to(pcRightLarge, transTime, {
                opacity: 0
            }, 'initial').to(pcRightSmall, transTime, {
                opacity: 0,
                onComplete: moveClouds
            }, 'initial')
        } else if (current.cloudCover >= 0.25 && current.cloudCover < 0.5) {
            tlHourChange.to(pcLeftSmall, transTime, {
                opacity: 1
            }, 'initial').to(pcRightSmall, transTime*0.8, {
                opacity: 1
            }, 'initial').to(pcLeftLarge, transTime*1.5, {
                opacity: 0
            }, 'initial').to(pcRightLarge, transTime*2.1, {
                opacity: 0,
                onComplete: moveClouds
            }, 'initial')
        } else if (current.cloudCover >= 0.5 && current.cloudCover < 0.75) {
            tlHourChange.to(pcLeftSmall, transTime, {
                opacity: 1
            }, 'initial').to(pcRightSmall, transTime*1.2, {
                opacity: 1
            }, 'initial').to(pcLeftLarge, transTime*1.3, {
                opacity: 1
            }, 'initial').to(pcRightLarge, transTime*1.7, {
                opacity: 0,
                onComplete: moveClouds
            }, 'initial')
        } else if (current.cloudCover > 0.75 || isItRaining || isItSnowing) {
            tlHourChange.to(pcLeftLarge, transTime, {
                opacity: 1
            }, 'initial').to(pcLeftSmall, transTime*1.1, {
                opacity: 1
            }, 'initial').to(pcRightLarge, transTime*1.4, {
                opacity: 1
            }, 'initial').to(pcRightSmall, transTime*2.5, {
                opacity: 1,
                onComplete: moveClouds
            }, 'initial')
            // }
        } else if (!isItRaining && !isItSnowing) {
            if (current.cloudCover < 0.5) {
                tlHourChange.to([pcLeftLarge, pcLeftSmall], transTime, {
                    opacity: 1
                }, 'initial').to([pcRightSmall, pcRightLarge], transTime, {
                    opacity: 1,
                    onComplete: moveClouds
                }, 'initial')
            }
        }

        // Add wind if windSpeed > 2mph. Animation speed is determined by wind speed

        if (current.windSpeed >= 3) {

            var rand = function rand(range, min) {
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

        tlHourChange.to(artContainer, transTime, {
                ease: Linear.easeNone,
                backgroundImage: 'radial-gradient(circle at ' + config[0] + '% ' + config[1] + '%, ' + config[2]
            }, 'initial')
            .to(mountains, transTime, {
                ease: Linear.easeNone,
                fill: config[3]
            }, 'initial')
            .to(mountainAccents, transTime, {
                ease: Linear.easeNone,
                fill: config[4]
            }, 'initial')
            .to(ground, transTime, {
                ease: Linear.easeNone,
                fill: config[5]
            }, 'initial')
            .to(groundAccent, transTime, {
                ease: Linear.easeNone,
                fill: config[6]
            }, 'initial')
            .to(mountainLeft, transTime, {
                ease: Linear.easeNone,
                fill: config[7]
            }, 'initial')

        tlHourChange = new TimelineMax()
    }

}) //--------------------------------------------------------------
