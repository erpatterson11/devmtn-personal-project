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
