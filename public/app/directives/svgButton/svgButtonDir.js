angular.module('portfolioApp').directive('svgButton', function() {

    return {
        restrict: 'E',
        templateUrl: './app/directives/svgButton/svgButtonTmpl.html',
        scope: {
            text: '@'
        }
    }
})