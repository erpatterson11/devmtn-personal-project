// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("scoreService", function($http) {

  this.getScores = function() {
    return $http({
      method: 'GET',
      url: '/api/scores'
    })
  }
  this.addScore = function(obj) {
    return $http({
      method: 'POST',
      url: '/api/scores',
      data: obj
    })
  }
  this.getAuth0Info = function() {
    return $http({
      method: 'GET',
      url: 'api/auth0'
    })
  }

})
