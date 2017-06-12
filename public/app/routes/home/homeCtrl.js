// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("homeCtrl", function($scope) {

  const nav = document.querySelector('#main-nav')

  function debounce(func) {
    let timeout
    let wait = 10
    let immediate = true
    return function() {
      let context = this, args = arguments
      let later = function() {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      let callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) {
        func.apply(context, args)
      }
    }
  }

  let lastScrollTop = 0
  let navHeight = parseInt(getComputedStyle(nav).height)

  let navbarControl = () => {
    let distFromTop = window.scrollY
    let deltaScrollY = lastScrollTop - distFromTop
    if (deltaScrollY < 0) {
      if (distFromTop > navHeight) {
        nav.style.top = `-100%`
      }
    } else {
      nav.style.top = `0`
    }
    lastScrollTop = distFromTop
  }

  window.addEventListener('scroll', debounce(navbarControl));


});
