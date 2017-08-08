angular.module('portfolioApp').directive('svgButton', function($state) {

    return {
        restrict: 'E',
        templateUrl: './app/directives/svgButton/svgButtonTmpl.html',
        scope: {
            text: '@',
            desktop: '@',
            toState: '@'
        },
        link: function(scope, elem, attrs) {
            elem.on('touchend', function() {
                if (attrs.desktop !== undefined){
                   if (confirm('Heads up, this project contains features that require keyboard input and is not yet optimized for mobile. Please visit on a laptop/desktop for the best experience.') ) {
                       if (attrs.uiSref) $state.transitionTo(attrs.uiSref)
                       else if (attrs.href) open(attrs.href)
                   }    
                }
            })
            elem.on('click', function() {
                if (!attrs.uiSref & attrs.href) open(attrs.href)
            })
        },
        controller: function() {

        }
    }
})