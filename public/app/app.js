// CONFIG
  // ============================================================
  angular.module("portfolioApp",['ui.router']).config(function($stateProvider, $urlRouterProvider) {
    // INITILIZE STATES
    // ============================================================
    $stateProvider
      // HOME STATE
      .state('home', {
        url: '/',
        templateUrl: 'app/routes/home/homeTmpl.html',
        controller: 'homeCtrl'
      })
      .state('golden-ratio', {
        url: '/golden-ratio',
        templateUrl: 'app/routes/golden-ratio-site/goldenRatioTmpl.html',
        controller: 'goldenRatioCtrl'
      })
      .state('magnify', {
        url: '/magnify',
        templateUrl: 'app/routes/magnifying-glass-site/magnifyTmpl.html',
        controller: 'magnifyCtrl'
      })
      .state('space-game', {
        url: '/space',
        templateUrl: 'app/routes/game/gameTmpl.html',
        controller: 'gameCtrl'
      })

    // ASSIGN OTHERWISE
    // ============================================================
    $urlRouterProvider.otherwise('/')
  });
