// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("mainService", function($http) {



  this.toggleNavBar = function() {
    const navbar = document.querySelector('#main-nav')
    let didScroll = false
    let lastScrollTop = 0
    let delta = 5
    let navHeight = navbar.style.height

    window.addEventListener('scroll', () => {
      didScroll = true
    })

    setInterval(() => {
      if (didScroll) {
        scroll()
        didScroll = false
      }
    }, 100)

    function scroll() {
      let currentPos = window.scrollY
      if (Math.abs(lastScrollTop - currentPos) <= delta) {
        return
      }
      if (currentPos > lastScrollTop && currentPos > navHeight) {
        navbar.style.top = `-60px`
        // navbar.style.top = `-${getComputedStyle(navbar).height}`
      } else {
        if (currentPos < lastScrollTop) {
        navbar.style.top = '0px'
        }
      }
      lastScrollTop = currentPos
    }
  }


});
