// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("goldenRatioService", function() {

  this.generateContent = () => {

    const win = $(window)
    const spiral = $('.spiral')
    const sections = $('.section')

    const svgContainer = document.querySelector('#svgContainer')
    const svgElement = document.querySelector('#spiralSVG')
    const path = document.querySelector('#spiral-path')


    const canvas = document.querySelector('#spiral-canvas')
    const ctx = canvas.getContext('2d')

    let startOver = false
    let shouldAnimate = false
    let currentSection = 0
    let rotate = 0
    let goldenRatio = 0.618033
    let axis = 0.7237
    let spiralOriginX
    let spiralOriginY
    let wW = window.innerWidth
    let wH = wW * goldenRatio
    let smallScreen
    let landscape
    let rotation = 0
    let sectionCount = sections.length
    let scale = 0
    let bounds
    let rotationRate = 2
    let chgInt = 178
    let createSpiral
    let spiralSpeed = 11

    let colorSchemes = {
      0: {
        bg: "#18121E",
        accent1: "#F4F4F4",
        accent2: "#e52127",
        text: "#18121E"
      },
      1: {
        bg: "#faad69",
        accent1: "#244c89",
        accent2: "#faad69",
        text: "#ffffff"
      },
      2: {
        bg: "#6ad4ff",
        accent1: "#356a85",
        accent2: "#6ad4ff",
        text: "#ffffff"
      },
      3: {
        bg: "#52beac",
        accent1: "#2c2435",
        accent2: "#52beac",
        text: "#ffffff"
      },
      4: {
        bg: "#f11b1b",
        accent1: "#2f3436",
        accent2: "#e52127",
        text: "#ffffff"
      },
      5: {
        bg: "#F4F4F4",
        accent1: "#76323F",
        accent2: "#F4F4F4",
        text: "#373737"
      },
      6: {
        bg: "#A23988",
        accent1: "#0E0B16",
        accent2: "#0E0B16",
        text: "#ffffff"
      },
      7: {
        bg: "#FF3B3F",
        accent1: "#CAEBF2",
        accent2: "#FF3B3F",
        text: "#0E0B16"
      },
      8: {
        bg: "#813772",
        accent1: "#062F4F",
        accent2: "#813772",
        text: "#ffffff"
      },
      9: {
        bg: "#94618E",
        accent1: "#49274A",
        accent2: "#94618E",
        text: "#ffffff"
      },
      10: {
        bg: "#76323F",
        accent1: "#565656",
        accent2: "#76323F",
        text: "#ffffff"
      }
    }



    let startingAnimation = (direction, animationTime, offSet) => {
      let w = window.innerWidth
      let h = window.innerHeight

      if (w < h) {
        svgElement.setAttribute('height', `${w}px`)
        svgElement.style.transform = `translateX(${w}px) rotate(90deg)`
      } else {
        svgElement.setAttribute('height', `${w*goldenRatio}px`)
        svgElement.style.transform = 'none'
      }

      path.style.transition = path.style.WebkitTransition = 'none'
      let length = path.getTotalLength()
      path.style.strokeDasharray = `${length} ${length}`
      path.style.strokeDashoffset = length
      path.getBoundingClientRect()
      path.style.transition = path.style.WebkitTransition =
        `stroke-dashoffset ${animationTime}s ease-in`
      // if (offSet) {
      //   console.log('forward');
        path.style.strokeDashoffset = `${length + (2*length*direction)}`
      // } else {
      //   path.style.strokeDashoffset = 0
      //   path.style.strokeDashoffset = `${length*direction}`
      //   console.log(path.style.strokeDashoffset);
      // }


      if (!startOver) {
        setTimeout(() => {
          path.setAttribute('stroke','#fff')
          svgContainer.style.opacity = '0'
          setTimeout(()=> {
            svgContainer.style.zIndex='-99'
            svgContainer.style.opacity = '1'
          },1000)
        }, animationTime*1000/2)
        startOver = true
      }
    }

    startingAnimation(1,2,true)

    let animateCanvasSpirals = function() {
      let spiralSources = ['golden-curve','golden-curve-orange','golden-curve-purple']
      let spiralSourcesMobile = ['golden-curve-mobile']
      const spiralSVG = new Image()
      let resetSpiralSVG = () => {
        spiralSVG.src = `./app/routes/golden-ratio-site/img/golden-curve.svg `
        rotate = 0
      }
      resetSpiralSVG()

      let chooseSpiralSource = (i) => {
        spiralSVG.src = `./app/routes/golden-ratio-site/img/${spiralSources[i]}.svg `
      }

      let drawLine = (num) => {
        ctx.globalAlpha = 1;
        ctx.translate(spiralOriginX, spiralOriginY);
        ctx.rotate(num)
        ctx.translate( -spiralOriginX, -spiralOriginY);
        ctx.drawImage(spiralSVG, 0,0,wW,wW*goldenRatio);
      }

      drawLine(0)

      let animate = () => {
        rotate++
        if (rotate > chgInt * 3) {
          rotate = 0
          chooseSpiralSource(0)
        } else if (rotate > chgInt * 2) {
          chooseSpiralSource(2)
        } else if (rotate > chgInt*1 && rotate < chgInt * 2) {
          chooseSpiralSource(1)
        }
        drawLine(spiralSpeed)
      }

      win.on('wheel keydown click', (e) => {
        if(shouldAnimate && e.keyCode!==82) {
          animate()
        } else {
          ctx.resetTransform(1,0,0,1,0,0)
          ctx.clearRect(0,0,wW,wH)
          resetSpiralSVG()
          // startingAnimation(1,1, false)
        }
      })

      $('canvas').on('click', () => {
        currentSection = 0
        updateSpiral()
        ctx.resetTransform(1,0,0,1,0,0)
        ctx.clearRect(0,0,wW,wH)
        resetSpiralSVG()
        // startingAnimation(1,1, false)
      })
    }

      win.on('wheel', (e) => {
        let dY = e.originalEvent.deltaY
        if (dY > 0) {
          currentSection--
        } else if (dY < 0) {
          currentSection++
        }
        updateSpiral()
      })

      win.on('keydown', (e) => {
        if(e.keyCode === 38 || e.keyCode === 39) {
          currentSection++
          updateSpiral()
        } else if(e.keyCode === 37 || e.keyCode === 40) {
          currentSection--
          updateSpiral()
        } else if (e.keyCode === 82) {
          currentSection = 0
          updateSpiral()
        }
      })

    // win.on('click', () => {
    //   if
    // })

    // win.on('touchstart', (e) => {
    //   e.preventDefault()
    //   let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]
    //   touchStartX = touch.pageX
    //   thouchStartY = touch.pageY
    // })
    //
    // win.on('touchmove', (e) => {
    //   e.preventDefault()
    //   let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]
    //
    // })

    sections.each((i)=>{
      $(sections[i]).on('click',(e)=> {
        if (currentSection !== i) {
          currentSection = i
          updateSpiral()
        }
      })
    })


    let limitNums = (num) => {
      console.log(num);
      if (num > 10) {
        do {
          num = num - 10
        } while (num > 10)
      }
      console.log(num);
      return num
    }

    let changeColors = (section) => {;
      num = limitNums(section)
      num < 0 ? num = 0 : null
      let colors = colorSchemes[num]
      document.documentElement.style.setProperty('--gr-bg-color', colors.bg)
      document.documentElement.style.setProperty('--gr-accent-1-color', colors.accent1)
      document.documentElement.style.setProperty('--gr-accent-2-color', colors.accent2)
      document.documentElement.style.setProperty('--gr-text-color', colors.text)
    }

  // prevents strange artifacts when the page is zoomed out
    let trimZoomOut = (limit) => {
      if (currentSection == -limit+1) {
        spiral.addClass("hidden")
      }
      if (currentSection >= -limit+2) {
        spiral.removeClass("hidden")
      }
    }

  // callback function to move to the next or previous section (depending on currentSection)
  let updateSpiral = () => {
    let zoomOutLimit = 12
    trimZoomOut(zoomOutLimit)
    let inBounds = (currentSection > -zoomOutLimit && currentSection < sections.length + 3)
    if (inBounds) {
      if (currentSection < sections.length + 2 && currentSection >= -1)  {
        shouldAnimate = false
        changeColors(currentSection)
      } else {
        document.documentElement.style.setProperty('--gr-bg-color', 'black')
        shouldAnimate = true
      }
      spiral.css({
        'transform-origin': `${spiralOriginX}px ${spiralOriginY}px`,
        'transform': `rotate(${~~(-90*currentSection)}deg) scale(${1/Math.pow(goldenRatio,currentSection)})`
      })
    } else {
      currentSection > 0 ? currentSection-- : currentSection++
    }
  }

  // generates spiral from all divs with class 'section'
    createSpiral = () => {
      let h
      let w
      if (!landscape) {
        spiralOrigin = `${(wW*(1-axis))}px ${(wW/goldenRatio) * axis}px`
        h = wW
        w = h
        spiral.css({
          'transform-origin': `${spiralOrigin}`,
          'backface-visiblity': 'hidden'
        })
      } else {
        spiralOrigin = `${(wW * axis)}px ${wW * goldenRatio * axis}px`
        h = wW * goldenRatio
        w = h
        spiral.css({
          'transform-origin': `${spiralOrigin}`,
          'backface-visiblity': 'hidden'
        })
      }
      sections.each((i) => {
        let myRot = ~~(90*i)
        let scale = Math.pow(goldenRatio, i)
        $(sections[i]).css({
          'width': `${w}`,
          'height': `${h}`,
          'transform-origin': `${spiralOrigin}`,
          'transform': `rotate(${myRot}deg) scale(${scale})`
        })
      })
      changeColors(currentSection)
    }


  // conditions: vertical or horizontal

  // initial rotation & spiral origin change


    let sizeApp = () => {
      wW = window.innerWidth
      wH = window.innerHeight
      if (wW < wH) {
        landscape = false
        spiralOriginX = (wW*(1-axis))
        spiralOriginY = ((wW/goldenRatio) * axis)
        canvas.width = wH
        canvas.height = wH
      } else {
        landscape = true
        spiralOriginX = (wW * axis)
        spiralOriginY = (wW * goldenRatio * axis)
        canvas.width = wW
        canvas.height = wW
      }
      createSpiral()
    }

    sizeApp()
    createSpiral()
    animateCanvasSpirals()

    window.addEventListener('resize', sizeApp)

  }

});
