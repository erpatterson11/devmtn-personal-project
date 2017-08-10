angular.module("portfolioApp").controller("gameCtrl", function($scope, $timeout, scoreService, gameService) {


  //========================== Variables ================================

  $scope.isShownSubmissionForm = false
  $scope.isShownNicknameInput = false

  //========================== Game Functions ================================


// ensures game is stopped before user navigates to other route
  $scope.$on('$stateChangeStart', (e) => {
    gameService.stopGame()
  })

  //========================== DOM Manipulation Functions ================================

  $scope.showScoreSubmission = function() {
    $scope.isShownSubmissionForm = !$scope.isShownSubmissionForm
    $scope.getFinalScore()
  }

//========================== HTTP Requests ================================

  $scope.getAuth0Info = function() {
    scoreService.getAuth0Info()
      .then(function(results) {
        $scope.userInfo = results.data
      })
  }

  $scope.getFinalScore = function() {
    $scope.finalScore = gameService.getScore()
  }

  $scope.getDbScores = function() {
    scoreService.getScores()
      .then(function(results) {
        $scope.scores = results.data
      })
  }

  $scope.getDbScores()

  $scope.submitFinalScore = function(name) {
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
    scoreService.addScore(obj).then(function() {
      console.log('score submitted!')
      $scope.getDbScores()
      $scope.isShownNicknameInput = !$scope.isShownNicknameInput
    })
    }
  }


});
