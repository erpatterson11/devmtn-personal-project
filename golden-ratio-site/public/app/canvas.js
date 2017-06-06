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
