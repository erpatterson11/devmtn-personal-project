angular.module('portfolioApp').controller('weatherCtrl', function($scope, $location, weatherApiService, weatherLogicService){

  //------------------------------------------------------------------------------
  //            $scope Variables
  //------------------------------------------------------------------------------

$scope.fiveDay = false
$scope.selectedTime = 0
$scope.sideNav = false

  //------------------------------------------------------------------------------
  //            $scope Functions
  //------------------------------------------------------------------------------


$scope.getWeatherDataFromBrowserLocation = function() {
  weatherApiService.getWeatherDataFromBrowserLocation()
  .then(function(results) {
    $scope.currentCity = results.city
    $scope.currentState = results.state

    $scope.weather = results.weather.data
    $scope.hourly = results.weather.data.hourly.data

    $('#timeSlider').val(0)

    $scope.changeArtwork($scope.selectedTime)
    $scope.artworkTransition()
    localStorage.weather = JSON.stringify(results.weather.data)
    })
}


$scope.searchWeatherAndLocationInfo = function(address) {
      weatherApiService.searchWeatherAndLocationInfo(address).then(function(results) {
        $scope.currentCity = results.city
        $scope.currentState = results.state

        $scope.weather = results.weather.data
        $scope.hourly = results.weather.data.hourly.data

        $('#timeSlider').val(0)

        $scope.changeArtwork($scope.selectedTime)
        $scope.searchLocation = ''
        $scope.artworkTransition()
        localStorage.weather = JSON.stringify(results.weather.data)
      })
}


// human readable time
$scope.unixToTime = function (time) {
  var humanDate = new Date(time * 1000)
  return humanDate;
}


$scope.artworkTransition = function() {
  $('#artwork-container').removeClass('hidden')
  $('#landing-page-background').addClass('slide-up-animation')
}

$scope.changeArtwork = function(inputTime) {
  let time = $scope.hourly[inputTime]
  weatherLogicService.changeArtwork(time)
}

$scope.toggleNav = function() {
  console.log($scope.sideNav,  $('#side-nav, #side-nav-toggle-button'))
  if (!$scope.sideNav) {
    $('#side-nav, #side-nav-toggle-button').css({'transform':'translateX(310px)'})
    $('.data-header').css({'transform':'translateY(-250px)'})
    $('.controlls').css({'transform':'translateY(250px)'})
  } else {
    $('#side-nav, #side-nav-toggle-button').css({'transform':'translateX(0px)'})
    $('.data-header').css({'transform':'translateY(0px)'})
    $('.controlls').css({'transform':'translateY(0px)'})
  }
  $scope.sideNav = !$scope.sideNav
}


$(document).mouseup(function(e) {
    let sideNav = $("#side-nav")
    console.log(!sideNav.is(e.target), sideNav.has(e.target).length === 0)
    if (!sideNav.is(e.target) && sideNav.has(e.target).length === 0) {
      $('#side-nav, #side-nav-toggle-button').css({'transform':'translateX(0px)'})
      $('.data-header').css({'transform':'translateY(0px)'})
      $('.controlls').css({'transform':'translateY(0px)'})
      $scope.sideNav = false
    }
});


//-------------------------------------------------------------------
//            Other Functions
//--------------------------------------------------------------------


})//---------------------------------------------------------------------------------
