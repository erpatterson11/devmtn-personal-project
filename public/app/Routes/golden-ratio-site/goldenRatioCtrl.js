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
  let spiralOrigin
  let sprialOriginX
  let spiralOriginY
  let wW = window.innerWidth;
  let wH = window.innerHeight;
  let w = canvas.width = window.innerWidth
  let h = canvas.height = window.innerHeight
  let smallScreen
  let landscape
  let goldenRatio = 0.618033
  let axis = 0.7237
  let rotation = 0
  let sectionCount = sections.length
  let touchStartY = 0
  let touchStartX = 0
  let scale = 0
  let bounds
  let rotationRate = 2
  let chgInt = 120

  let sizeCanvas = () => {
    if (wW < 960) {
      smallScreen = true;
      spiralOriginX = Math.floor((wW/goldenRatio) * goldenRatio * (1 - axis))
      spiralOriginY = Math.floor((wW/goldenRatio) * axis)
    } else {
      smallScreen = false;
      spiralOriginX = wW * axis
      spiralOriginY = wW * goldenRatio * axis
    }
    canvas.width = wW;
    canvas.height = wW*goldenRatio;

    if (wW < wH) {
      canvas.width = wH*goldenRatio;
      canvas.height = wH;
    }
  }



  window.addEventListener('resize', sizeCanvas)

  let animateCanvasSpirals = function() {

    sizeCanvas()

    let spiralSources = ['spiral-line','spiral-line-orange','spiral-line-purple', 'spiral-line-dark-blue']

    const spiralSVG = new Image()
    spiralSVG.src = `./app/routes/golden-ratio-site/img/spiral-line.svg `

    let chooseSpiralSource = (i) => {
      spiralSVG.src = `./app/routes/golden-ratio-site/img/${spiralSources[i]}.svg `
    }


    let drawLine = (num) => {
      ctx.globalAlpha = 1;
      ctx.translate(spiralOriginX, spiralOriginY);
      ctx.rotate(num)
      ctx.translate( -spiralOriginX, -spiralOriginY);
      ctx.drawImage(spiralSVG, 0,0,wW,wH);
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
      chooseSpiralSource(0)
    }
    drawLine(2)
  }


  win.on('wheel keydown', (e) => {
    if(shouldAnimate || e.keyCode!==82) {
      animate()
    } else {
      ctx.resetTransform(1,0,0,1,0,0)
      ctx.clearRect(0,0,wW,wH)
      spiralSVG.src = `./app/routes/golden-ratio-site/img/spiral-line.svg `
      drawLine(0)
    }
  })


  win.on('click', () => {
    ctx.resetTransform(1,0,0,1,0,0)
    ctx.clearRect(0,0,wW,wH)
    drawLine(0)
  })
}

  animateCanvasSpirals();

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
      console.log(currentSection);
    })
  })

// callback function to move to the next or previous section (depending on currentSection)
let updateSpiral = () => {
  inBounds = (currentSection > -15 && currentSection < sections.length + 3)
  if (inBounds) {
    (currentSection < sections.length + 2 && currentSection >= -1) ? shouldAnimate = false : shouldAnimate = true
    spiral.css({
      'transform-origin': `${spiralOrigin}`,
      'transform': `rotate(${~~(-90*currentSection)}deg) scale(${1/Math.pow(goldenRatio,currentSection)})`
    })
  } else {
    currentSection > 0 ? currentSection-- : currentSection++
  }
console.log(currentSection);
}


// generates spiral from all divs with class 'section'
  let buildSpiral = () => {
    spiralOrigin = `${~~(wW * axis)}px ${~~wW * goldenRatio * axis}px`
    h = wW * goldenRatio
    w = h
    spiral.css({
      'transform-origin': `${spiralOrigin}`,
      'backface-visiblity': 'hidden'
    })
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
  buildSpiral()
})()


});
