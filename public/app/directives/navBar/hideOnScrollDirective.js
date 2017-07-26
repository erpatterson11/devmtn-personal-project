angular.module('portfolioApp')
.directive("scrollHide", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            scope.toggle = false
            console.log(scope.toggle)
            scope.$apply()
        })
    }
})