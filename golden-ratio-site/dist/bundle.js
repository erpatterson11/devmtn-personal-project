
const win = $(window)
const spiral = $('.spiral')
const sections = $('.section')
const canvas = $('#canvas')

let shouldAnimate = false
let currentSection = 0
let rotate = 0
let spiralOrigin
let _winW = window.innerWidth;
let _winH = window.innerHeight;
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

let animateCanvasSpirals = function() {

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  let w = window.innerWidth
  let h = window.innerHeight

  canvas.width = w
  canvas.height = h

  let spiralOriginX = ~~(_winW * axis)
  let spiralOriginY = ~~_winW * goldenRatio * axis
  let colors = ['orange','black','purple', 'green', 'yellow', 'orange']

  let drawLine = (color) => {
    ctx.beginPath();
  	ctx.lineJoin = 'round';
  	ctx.strokeStyle = color
  	ctx.lineCap = 'round';
  	ctx.miterLimit = 4;
  	ctx.lineWidth = 1;
    ctx.translate(w/2, w/2);
    ctx.moveTo(248.169100, 326.385170);
  	ctx.bezierCurveTo(267.912090, 326.385180, 283.905100, 310.347180, 283.885100, 290.611180);
  	ctx.moveTo(283.885100, 290.611180);
  	ctx.bezierCurveTo(283.885100, 258.737180, 258.000090, 232.909180, 226.124100, 232.935180);
  	ctx.moveTo(226.124100, 232.935180);
  	ctx.bezierCurveTo(174.539090, 232.935180, 132.713100, 274.753180, 132.713100, 326.339180);
  	ctx.moveTo(132.713100, 326.339180);
  	ctx.bezierCurveTo(132.713100, 409.837170, 200.399100, 477.530220, 283.897100, 477.530220);
  	ctx.moveTo(283.897100, 477.530220);
  	ctx.bezierCurveTo(419.006080, 477.530190, 528.546060, 368.005180, 528.546060, 232.889180);
  	ctx.moveTo(528.546060, 232.889180);
  	ctx.bezierCurveTo(528.546060, 14.262183, 351.309100, -162.982820, 132.674090, -162.974820);
  	ctx.moveTo(132.674090, -162.974820);
  	ctx.bezierCurveTo(-221.082910, -162.974820, -507.863940, 123.805190, -507.857890, 477.562200);
    ctx.translate(-w/2, -w/2);
  	ctx.stroke();
  }

let animate = () => {
  let i;
  rotate += 1
  if (rotate < chgInt*1) {
    i = 0

  } else if (rotate > chgInt*1 && rotate < chgInt * 2) {
    i = 1
  } else if (rotate > chgInt * 2) {
    i = 2
  }

  if (rotate > chgInt*3) {
    rotate = 0

  }
  ctx.translate(spiralOriginX,spiralOriginY)
  ctx.rotate(rotationRate)
  ctx.translate(-spiralOriginX,-spiralOriginY)
  drawLine(colors[i])
}


$(window).on('wheel keydown', () => {
  if(shouldAnimate) {
    animate()
  } else {
    ctx.resetTransform(1,0,0,1,0,0)
    ctx.clearRect(0,0,w,h)
  }
})


window.addEventListener('click', () => {
  ctx.resetTransform(1,0,0,1,0,0)
  ctx.clearRect(0,0,w,h)
})

};

animateCanvasSpirals();



//========================== Variables ================================

(function() {

  let userAgent = window.navigator.userAgent.toLowerCase(),
      firefox = userAgent.indexOf('firefox') != -1 || userAgent.indexOf('mozilla') == -1,
      ios = /iphone|ipod|ipad/.test( userAgent ),
      safari = (userAgent.indexOf('safari') != -1 && userAgent.indexOf('chrome') == -1) || ios,
      linux = userAgent.indexOf('linux') != -1,
      windows = userAgent.indexOf('windows') != -1;


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
  bounds = (currentSection > -15 && currentSection < sections.length + 3)
  if (bounds) {
    (currentSection < sections.length + 2 && currentSection > 0) ? shouldAnimate = false : shouldAnimate = true
    spiral.css({
      'transform-origin': `${spiralOrigin}`,
      'transform': `rotate(${~~(-90*currentSection)}deg) scale(${1/Math.pow(goldenRatio,currentSection)})`
    })
  } else {
    currentSection > 0 ? currentSection-- : currentSection++
  }
}

// let drawArc = () => {
//   let container = d3.select(this).append('svg').attr('width', this.width).attr('height', this.height)
//
//   let lineFunction = d3.line()
//                        .x()
//
//   container.append('path')
//            .attr('d', lineFunction)
//            .attr('fill', 'none')
//            .attr('stroke','black')
//            .attr('stroke-width', 5)
// }



// generates spiral from all divs with class 'section'
  let buildSpiral = () => {
    spiralOrigin = `${~~(_winW * axis)}px ${~~_winW * goldenRatio * axis}px`
    h = _winW * goldenRatio
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
        'background': `hsl(301,50%,${40-i*(35/sections.length)}%)`,
        'transform': `rotate(${myRot}deg) scale(${scale})`
      })
    })
  }
  buildSpiral()
})()
