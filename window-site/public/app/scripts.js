const boxes = document.querySelectorAll('.box')
const glass = document.querySelector('.mag-container')
const original = document.querySelector('body').children[1]
// creates a copy of the content to be applied to the magnifying glass div
const content = document.querySelector('.container1')
const clone = content.cloneNode(true)


// set scale between background content and zoom
let scale = 8
let glassSize = 700

glass.style.width = glassSize + 'px'
glass.style.height = glassSize + 'px'
glass.style.clipPath = `circle(40% at 50% 50%)`
glass.style.WebkitClipPath = `circle(40% at 50% 50%)`

// applies content copy to magnifying glass div
glass.append(clone)
const zoomed = glass.children[0]


// add classnames to differentiate original vs copied elements
original.className += ' original'
zoomed.className += ' zoomed'
// set initial clase of zoomed content
zoomed.style.transform = `scale(${scale})`



let center = {
  w: window.innerWidth/2,
  h: window.innerHeight/2
}

// event function to move mag-glass around zoomed conten t
let moveGlass = (e) => {
  if (spacedown) {
    mouse = {
        x: e.pageX,
        y: e.pageY
      }
    let corr = glassSize/2
    let difX = ((scale-1)*(mouse.x-center.w)/center.w)*center.w
    let difY = ((scale-1)*(mouse.y-center.h)/center.h)*center.h
    // translate container div mith mouse move
    glass.style.transform = `translate(${mouse.x - corr}px, ${mouse.y - corr}px)`
    // correct container div translations
    // difX and difY account for the scaling difference between the original content and the zoom
    // scale maintains scaling of content in magnifying glass
    zoomed.style.transform = `translate(${((-mouse.x) - difX + corr)}px, ${((-mouse.y) - difY + corr)}px) scale(${scale})`
    }
  }



// variable to track spacebar press
let spacedown = false

// event listeners for spacebar press and mousemove
window.addEventListener('resize', () => {
  center = {
    w: window.innerWidth/2,
    h: window.innerHeight/2
  }
})

window.addEventListener('keydown', (e) => {
  e.keyCode === 32 ? spacedown = true : null
})

window.addEventListener('keyup', (e) => {
  e.keyCode === 32 ? spacedown = false : null
})

window.addEventListener('mousemove', (e) => {
  moveGlass(e)
})
