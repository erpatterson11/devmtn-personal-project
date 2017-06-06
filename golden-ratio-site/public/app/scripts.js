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
