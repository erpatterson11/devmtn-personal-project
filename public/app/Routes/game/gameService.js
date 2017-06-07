// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("gameService", function($http) {

  this.getUsers = function() {
    return $http({
      method: 'GET',
      url: '/api/collection'
    })
  }
  this.getScores = function() {
    return $http({
      method: 'GET',
      url: '/api/collection?_id='
    })
  }
  this.addScore = function(score) {
    return $http({
      method: 'POST',
      url: '/api/collection',
      data: score
    })
  }
  this.addUser = function(user) {
    return $http({
      method: 'POST',
      url: "/api/collection/",
      data: collection
    })
  }
  this.deleteCollection = function() {
    return $http({
      method: 'DELETE',
      url: '/api/collection/'
    })
  }


});
