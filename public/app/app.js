// CONFIG
  // ============================================================
  angular.module("portfolioApp",['ui.router', 'ngAnimate'])
  
  .config(function($stateProvider, $urlRouterProvider) {
    // INITILIZE STATES
    // ============================================================
    $stateProvider
      // HOME STATE
      .state('portfolio', {
        url: '/portfolio',
        templateUrl: 'app/routes/home/homeTmpl.html',
        controller: 'homeCtrl',
        cache: false
      })
      .state('golden-ratio', {
        url: '/golden-ratio',
        templateUrl: 'app/routes/golden-ratio-site/goldenRatioTmpl.html',
        controller: 'goldenRatioCtrl'
      })
      .state('galaxy-strike', {
        url: '/galaxy-strike',
        templateUrl: 'app/routes/game/gameTmpl.html',
        controller: 'gameCtrl'
      })
      .state('weather', {
        url: '/weather',
        templateUrl: 'app/routes/weather-app/weatherTmpl.html',
        controller: 'weatherCtrl'
      })
      .state('about', {
        url: '/',
        templateUrl: 'app/routes/about/aboutTmpl.html',
        controller: 'aboutCtrl'
      })

    // ASSIGN OTHERWISE
    // ============================================================
    $urlRouterProvider.otherwise('/')
  });
