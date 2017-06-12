// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("magnifyCtrl", function($scope) {

  $scope.textInput
  $scope.radio1
  $scope.radio2
  $scope.checkbox1
  $scope.checkbox2
  $scope.checkbox3

  // VARIABLES
  // ============================================================


  const body = document.querySelector('body')
  const glass = document.querySelector('#magnifying-glass')

  const glassArt = document.querySelector('#magnifying-glass-art')
  const glassArtRim = document.querySelector('#glass-circle-art')

  const original = document.querySelector('body').children[1]
  // creates a copy of the content to be applied to the magnifying glass div
  const content = document.querySelector('.container1')
  const clone = content.cloneNode(true)
  let zoomed


  // note: this may not be cross-browser comptatible
  let pageCenter = {
    w: document.body.scrollWidth/2,
    h: document.body.scrollHeight/2
  }


  let scale = 2   // scale is ratio of zoomed and original content
  let glassSize = 600
  let isMagnifying = false
  let shiftDown = false
  let corr = glassSize/2
  let artCorr = 31*scale // accounts for thickenss of rim on glass artwork



  // FUNCTIONS
  // ============================================================


  function init() {
    glass.style.width = glassArt.style.width = glassSize + 'px'
    glass.style.height = glassArt.style.height = glassSize + 'px'
    glass.style.clipPath = `circle(50% at 50% 50%)`
    glass.style.WebkitClipPath = `circle(50% at 50% 50%)`

    glassArt.style.transformOrigin = `29.0668% 29.0061%`
    glassArt.style.transform = `scale(${scale}) translate(${62}px, ${62}px)`

    // applies content copy to magnifying glass div
    glass.append(clone)
    zoomed = glass.children[0]

    // add classnames to differentiate original vs copied elements
    original.className += ' original'
    zoomed.className += ' zoomed'

    zoomed.style.transform = `scale(${scale})`
  }



  function toggleGlass() {
    if (isMagnifying) {
      glassArt.style.display = 'inline'
      glass.style.display = 'inline'
    } else {
      glassArt.style.display = 'none'
      glass.style.display = 'none'
    }
  }


  // event function to move mag-glass around zoomed conten t
  function moveGlass(e) {
    if (shiftDown && isMagnifying) {
      glass.style.cursor = 'none'

      if (pageCenter.w !== document.body.scrollWidth/2 || pageCenter.h !== document.body.scrollHeight/2) {
        pageCenter = {
          w: document.body.scrollWidth/2,
          h: document.body.scrollHeight/2
        }
      }

      mouse = {
          x: e.pageX,
          y: e.pageY
        }
      let centOffsetX = ((scale-1)*(mouse.x-pageCenter.w)/pageCenter.w)*pageCenter.w
      let centOffsetY = ((scale-1)*(mouse.y-pageCenter.h)/pageCenter.h)*pageCenter.h
      let distFromTop = document.querySelector('body').scrollTop
      // translate container div mith mouse move
      let divTranslateX = mouse.x - corr
      let divTranslateY = mouse.y - corr - distFromTop
      glassArt.style.transform = `scale(${scale}) translate(${artCorr + divTranslateX/scale}px, ${artCorr + divTranslateY/scale}px)`
      glass.style.transform = `translate(${divTranslateX}px, ${divTranslateY}px)`
      // correct container div translations
      // centOffsetX and centOffsetY account for the scaling difference between the original content and the zoom
      // scale maintains scaling of content in magnifying glass
      let glassTranslateX = -mouse.x - centOffsetX + corr
      let glassTranslateY = -mouse.y - centOffsetY + corr
      zoomed.style.transform = `translate(${glassTranslateX}px, ${glassTranslateY}px) scale(${scale})`
    } else {
      glass.style.cursor = 'default'
    }
    }


    // EVENT LISTENERS
    // ============================================================


  // initialized on load to prevent position issues with the magnified content
  window.addEventListener('load', init())


  window.addEventListener('resize', () => {
    pageCenter = {
      w: document.body.scrollWidth/2,
      h: document.body.scrollHeight/2
    }
  })

  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 16) {
      shiftDown = true
    }
    // keyboard shortcut (ctrl + shift + 'm') to toggle magnifying glass
    if (e.keyCode === 90 & e.shiftKey & e.ctrlKey) {
      isMagnifying = !isMagnifying
      toggleGlass()
    }
  })

  window.addEventListener('keyup', (e) => {
    if (e.keyCode === 16) {
      shiftDown = false
      // body.style.cursor = 'default'
    }
  })

  window.addEventListener('mousemove', (e) => {
    moveGlass(e)
  })

  window.addEventListener('scroll', (e) => {

  })


});
