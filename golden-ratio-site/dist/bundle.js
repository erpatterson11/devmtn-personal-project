
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


let animateCanvasSpirals = function() {

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  let w = window.innerWidth
  let h = window.innerHeight

  canvas.width = w
  canvas.height = h

  let spiralOriginX = ~~(_winW * axis)
  let spiralOriginY = ~~_winW * goldenRatio * axis
  let colors = ['red','blue','white', 'green', 'yellow', 'orange']

  let drawLine = (color) => {
    ctx.strokeStyle = color
    ctx.beginPath()
    // ctx.moveTo(w/2 +100, h/2 + 100)
    ctx.bezierCurveTo(200,100,2000,500,300,300)
    ctx.bezierCurveTo(200,100,20,-500,450,500)
    ctx.stroke()
  }

let animate = () => {
  let i;
  rotate += 1
  if (rotate < 360*2) {
    i = 0
  } else if (rotate > 360*2 && rotate < 360 * 4) {
    i = 1
  } else if (rotate > 360 * 4) {
    i = 2
  }
  rotate > 360*6 ? rotate = 0 : null;
  ctx.translate(spiralOriginX,spiralOriginY)
  ctx.rotate(1)
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
  bounds = (currentSection > -10 && currentSection < sections.length + 1)
  if (bounds) {
    (currentSection < sections.length + 2 && currentSection > -1) ? shouldAnimate = false : shouldAnimate = true
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
        'background': `hsl(200,100%,${70-i*(40/sections.length)}%)`,
        'transform': `rotate(${myRot}deg) scale(${scale})`
      })
    })
  }
  buildSpiral()
})()
