angular.module("portfolioApp").controller("gameCtrl", function($scope, $timeout, scoreService, gameService) {

  //========================== Variables ================================

  $scope.isShownSubmissionForm = false
  $scope.isShownNicknameInput = false

  //========================== DOM Manipulation Functions ================================

  $scope.showScoreSubmission = function() {
    $scope.isShownSubmissionForm = !$scope.isShownSubmissionForm
    $scope.getFinalScore()
  }

  $scope.showGuestNicknameEntry = function() {
    $scope.isShownNicknameInput = !$scope.isShownNicknameInput
  }

//========================== HTTP Requests ================================

  $scope.getAuth0Info = function() {
    scoreService.getAuth0Info()
      .then(function(results) {
        console.log(results.data);
        $scope.userInfo = results.data
      })
  }


  $scope.getFinalScore = function() {
    console.log('getFinalScore');
    $scope.finalScore = gameService.getScore()
  }

  $scope.getDbScores = function() {
    console.log('getDbScores');
    scoreService.getScores()
      .then(function(results) {
        $scope.scores = results.data
      })
  }

  $scope.getDbScores()

  $scope.submitFinalScore = function(name) {
    console.log('submitFinalScore', name);
    if ($scope.userInfo) {
      scoreService.getAuth0Info()
        .then(function(results) {
          $scope.userInfo = results.data
        })
        .then(function() {
          let obj = {
            score: $scope.finalScore,
            nickname: name,
            auth0id: $scope.userInfo
          }
          scoreService.addScore(obj)
        })
    } else {
      let obj = {
        score: $scope.finalScore,
        nickname: name
      }
    scoreService.addScore(obj)
    }
  }

});
