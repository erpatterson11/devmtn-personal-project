angular.module('portfolioApp').controller('weatherCtrl', function($scope, $location, weatherApiService, weatherLogicService){

  //------------------------------------------------------------------------------
  //            $scope Variables
  //------------------------------------------------------------------------------

$scope.fiveDay = false;
$scope.selectedTime = 0;

  //------------------------------------------------------------------------------
  //            $scope Functions
  //------------------------------------------------------------------------------


$scope.getWeatherDataFromBrowserLocation = function() {
  console.log('browser')
  weatherApiService.getWeatherDataFromBrowserLocation()
  .then(function(results) {
    $scope.currentCity = results.city
    $scope.currentState = results.state

    $scope.weather = results.weather.data
    $scope.hourly = results.weather.data.hourly.data

    $('#timeSlider').val(0)

    $scope.changeArtwork($scope.selectedTime)
    $scope.artworkTransition();
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
  var humanDate = new Date(time * 1000);
  return humanDate;
};


$scope.artworkTransition = function() {
  $('#artwork-container').removeClass('hidden')
  $('#landing-page-background').addClass('slide-up-animation')
}

$scope.changeArtwork = function(inputTime) {
  let time = $scope.hourly[inputTime]
  weatherLogicService.changeArtwork(time)
}

$scope.toggleNav = function() {
  if ($('#side-nav').css('left') == "-300px") {
    $('#side-nav').css({'left':'20px'})
    $('.data-header').css({'transform':'translateY(-150px)'})
    $('.controlls').css({'transform':'translateY(150px)'})
  }
  else {
    $('#side-nav').css({'left':'-300px'})
    $('.data-header').css({'transform':'translateY(0px)'})
    $('.controlls').css({'transform':'translateY(0px)'})
  }
}


$(document).mouseup(function(e) {
    var container = $("#side-nav");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      $('#side-nav').css({'left':'-300px'})
      $('.data-header').css({'transform':'translateY(0px)'})
      $('.controlls').css({'transform':'translateY(0px)'})
    }
});


//-------------------------------------------------------------------
//            Other Functions
//--------------------------------------------------------------------


})//---------------------------------------------------------------------------------
