angular.module('portfolioApp').service('weatherApiService', function($http, $q){


let searchedLocation = {}
let currentLocation = {}

// gets user location from browser, returns lat & lng
function getBrowserLocation() {
  let deferred = $q.defer()
  navigator.geolocation.getCurrentPosition(deferred.resolve)
  return deferred.promise
}

// search by lat & lng, return weather data
function getWeatherData(latitude,longitude) {
  let url = `/api/weather/coords/${encodeURIComponent(latitude)}/${encodeURIComponent(longitude)}`
  return $http.get(url)
}

// search by city or zip, returns coordinates and location name info
 function searchLocationByAddress(address) {
   return $http.get(`/api/weather/search?location=${encodeURIComponent(address)}`)
}

// search by coordinates, returns coordinates and location name info
function getLocationByCoords(latitude, longitude) {
  return $http.get(`/api/weather/search?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`)
}


// Gets coordinates from browser and injects them into location-from-coordinates and weather API calls.
// If getBrowserLocation API call fails, then return error message to tell controller to bring up prompt to search location

this.getWeatherDataFromBrowserLocation = function() {
  return getBrowserLocation().then(function(results) {
     return $q.all({weather: getWeatherData(results.coords.latitude, results.coords.longitude), location: getLocationByCoords(results.coords.latitude, results.coords.longitude)})
      .then(function(apiResults) {
          currentLocation.weather = apiResults.weather;
          currentLocation.city = apiResults.location.data.results[0].address_components.city;
          currentLocation.state = apiResults.location.data.results[0].address_components.state;
        return currentLocation;
      })
  })
}


// Takes in a "city,state" or "zip-code" search and makes API call to return location info. Corrdinates from results are used to make weather API call.
// Weather info, city name, and state name are added to a currentLocation object that is passed on to the controller.

this.searchWeatherAndLocationInfo = function(address) {
  return searchLocationByAddress(address)
    .then(function(location) {
      searchedLocation.city = location.data.results[0].address_components.city;
      searchedLocation.state = location.data.results[0].address_components.state;
      return getWeatherData(location.data.results[0].location.lat,location.data.results[0].location.lng).then(function(weather) {
        searchedLocation.weather = weather;
        return searchedLocation;
      })
    })
}


})//---------------------------------------------------------------------------
