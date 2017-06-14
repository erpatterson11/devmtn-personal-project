angular.module('portfolioApp').service('weatherService', function($http, $q) {

    var location;
    var lat;
    var long;
    var weather;

    this.getWeatherData = function(lat, long) {
        return $http.get({
          method: 'GET',
          url: `/api/weather/coords/${lat}/${long}`
        })
      }

    this.getBrowserLocation = function() {
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(deferred.resolve);
        return deferred.promise
    }

    this.searchLocation = function(address) {
      let encodedAddress = encodeURIComponent(address)
      console.log(encodedAddress);
        return $http.get({
          method: 'GET',
          url: `/api/weather/search/?location=${encodedAddress}`
        })
    }

    var getWeatherData = this.getWeatherData
    var getBrowserLocation = this.getBrowserLocation
    var searchLocation = this.searchLocation

    this.getWeatherDataFromSearch = function(address) {
        // console.log('address',address)
        searchLocation(address)
            .then(function(results) {
                var locationData = results.data.results[0]
                // console.log(results, "getWeatherDataFromSearch")
                getWeatherData(locationData.location.lat, locationData.location.lng)
                    .then(function(results) {
                        // console.log(results,'weather')
                        return {
                            weather: results,
                            location: locationData
                        }
                    })
            })
    }


    // this.getWeatherDataFromSearch = function(address) {
    //   $http.get('https://api.geocod.io/v1/geocode?q='+ encodeURIComponent(address) +'&api_key=f00109f6f598100219c5f209f121138022256f8')
    //     .then(function(response) {
    //       location = [response.data.results[0].address_components.city,response.data.results[0].address_components.state]
    //       lat = response.data.results[0].location.lat
    //       long = response.data.results[0].location.lng
    //     }).then(function() {
    //       $http.get('https://api.darksky.net/forecast/51ad5a6fd44830ae0a78d025de05e749/' + lat  + ',' + long)
    //         .then(function(results) {
    //           weather = results
    //           return {location: location, weather: weather}
    //         })
    //     })
    // }

});
