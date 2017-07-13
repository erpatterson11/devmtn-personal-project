// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("reusableFuncsService", function($http) {

  this.debounce = (func) => {
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

});
