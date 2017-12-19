angular.module('portfolioApp').controller('weatherCtrl', function($scope, $location, weatherService, weatherApiService, weatherLogicService, routeLoadAnimationService){

  //------------------------------------------------------------------------------
  //            $scope Variables
  //------------------------------------------------------------------------------

$scope.fiveDay = false
$scope.selectedTime = 0
$scope.sideNav = false

  //------------------------------------------------------------------------------
  //            Route Load Animation
  //------------------------------------------------------------------------------

routeLoadAnimationService.routeLoadAnimation($('.fade-in'))
weatherService.routeLoadAnimation()
//-------------------------------------------------------------------
//            Other Functions
//--------------------------------------------------------------------


function setWeatherData(data) {
      $scope.currentCity = data.city
      $scope.currentState = data.state
      $scope.weather = data.weather.data
      $scope.hourly = data.weather.data.hourly.data
      $('#timeSlider').val(0)
      $scope.changeArtwork($scope.selectedTime)
      $scope.artworkTransition()
      localStorage.setItem("results", JSON.stringify(data))
}

function checkLocalData() {
  let storedData = JSON.parse(localStorage.getItem("results"))
  if (!storedData) return
  let cachedTime = storedData.weather.data.currently.time
  let now = Date.now() / 1000
  if (now - cachedTime < 3600) {
    setWeatherData( storedData )
  }
}

  //------------------------------------------------------------------------------
  //            $scope Functions
  //------------------------------------------------------------------------------

$scope.getWeatherDataFromBrowserLocation = function() {
  weatherApiService.getWeatherDataFromBrowserLocation().then(function(results) {
    setWeatherData(results)
  })
}

$scope.searchWeatherAndLocationInfo = function(address) {
  weatherApiService.searchWeatherAndLocationInfo(address).then(function(results) {
    setWeatherData(results)
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
  if (!$scope.sideNav) {
    $('#side-nav').css({'transform':'translateX(310px)'})
    $('#side-nav-toggle-button').css({'transform':'translateX(280px)', 'background':'rgba(0,0,0,0)'})
    $('.data-header').css({'transform':'translateY(-250px)'})
  } else {
    $('#side-nav, #side-nav-toggle-button').css({'transform':'translateX(0px) rotateY(180deg)', 'background':'rgba(0,0,0,0.3)'})
    $('.data-header').css({'transform':'translateY(0px)'})
  }
  $scope.sideNav = !$scope.sideNav
}



checkLocalData()

})//---------------------------------------------------------------------------------
