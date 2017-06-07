// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("goldenRatioCtrl", function($scope) {
  // VARIABLES
  // ============================================================

  // FUNCTIONS
  // ============================================================


//========================== Variables ================================

(function() {

  const win = $(window)
  const spiral = $('.spiral')
  const sections = $('.section')
  const canvas = document.querySelector('#spiral-canvas')
  const ctx = canvas.getContext('2d')

  let shouldAnimate = false
  let currentSection = 0
  let rotate = 0
  let goldenRatio = 0.618033
  let axis = 0.7237
  let sprialOriginX
  let spiralOriginY
  let wW = window.innerWidth;
  let wH = wW * goldenRatio
  let smallScreen
  let landscape
  let rotation = 0
  let sectionCount = sections.length
  let touchStartY = 0
  let touchStartX = 0
  let scale = 0
  let bounds
  let rotationRate = 2
  let chgInt = 120
  let createSpiral
  // let animateSpeed = ~~(Math.random()*(20-0)+1)


  let animateCanvasSpirals = function() {

    let spiralSources = ['golden-curve','golden-curve-orange','golden-curve-purple', 'golden-curve-dark-blue']
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
    if (rotate > chgInt*1 && rotate < chgInt * 2) {
      chooseSpiralSource(1)
    } else if (rotate > chgInt * 2) {
      chooseSpiralSource(2)
    } else if (rotate > chgInt * 3) {
      chooseSpiralSource(3)
    }
    if (rotate > chgInt*4) {
      rotate = 0
      // animateSpeed = ~~(Math.random()*(20-0)+1)
      chooseSpiralSource(0)
    }
    drawLine(11)
  }


  win.on('wheel keydown', (e) => {
    if(shouldAnimate && e.keyCode!==82) {
      animate()
    } else {
      ctx.resetTransform(1,0,0,1,0,0)
      ctx.clearRect(0,0,wW,wH)
      resetSpiralSVG()
      drawLine(0)
    }
  })


  $('canvas').on('click', () => {
    currentSection = 0
    updateSpiral()
    ctx.resetTransform(1,0,0,1,0,0)
    ctx.clearRect(0,0,wW,wH)
    resetSpiralSVG()
    drawLine(0)
  })
}

  win.on('wheel', (e) => {
    e.preventDefault()
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
      currentSection = i
      updateSpiral()
    })
  })

// callback function to move to the next or previous section (depending on currentSection)
let updateSpiral = () => {
  let zoomOutLimit = 15
  inBounds = (currentSection > -zoomOutLimit && currentSection < sections.length + 3)
  if (inBounds) {
    if (currentSection < sections.length + 2 && currentSection >= -1)  {
      shouldAnimate = false
      canvas.style.background = 'transparent'
    } else {
      canvas.style.background ='black'
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
      console.log(h,w);
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
        'background': `hsla(301,0%,${40-i*(35/sections.length)}%, 0.5)`,
        'transform': `rotate(${myRot}deg) scale(${scale})`
      })
    })
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

})()

});
