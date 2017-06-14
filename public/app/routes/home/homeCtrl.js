// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("homeCtrl", function($scope, reusableFuncsService) {

  const nav = document.querySelector('#main-nav')

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

  window.addEventListener('scroll', reusableFuncsService.debounce(navbarControl));


});
