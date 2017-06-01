// INITILIZE APP
// ============================================================
var app = angular.module("windowApp", []);

// INITILIZE CONTROLLER
// ============================================================
angular.module("windowApp").controller("mainCtrl", ["$scope", function($scope) {
  // VARIABLES
  // ============================================================
  
  // FUNCTIONS
  // ============================================================
}]);

// INITILIZE SERVICE
// ============================================================
angular.module("windowApp").service("collectionService", ["$http", function($http) {
  // CRUD FUNCTIONS
  // ============================================================
  // this.getCollections = function() {
  //   return $http({
  //     method: 'GET',
  //     url: '/api/collection'
  //   });
  // };
  // this.getCollection = function(id) {
  //   return $http({
  //     method: 'GET',
  //     url: '/api/collection?_id='+id
  //   });
  // };
  // this.createCollection = function(collection) {
  //   return $http({
  //     method: 'POST',
  //     url: '/api/collection',
  //     data: collection
  //   });
  // };
  // this.editCollection = function(id, collection) {
  //   return $http({
  //     method: 'PUT',
  //     url: "/api/collection/" + id,
  //     data: collection
  //   });
  // };
  // this.deleteCollection = function(id) {
  //   return $http({
  //     method: 'DELETE',
  //     url: '/api/collection/' + id
  //   });
  // };
  // OTHER FUNCTIONS
  // ============================================================

}]);

const body = document.querySelector('body')
const glass = document.querySelector('.mag-container')
const original = document.querySelector('body').children[1]
// creates a copy of the content to be applied to the magnifying glass div
const content = document.querySelector('.container1')
const clone = content.cloneNode(true)


// set scale between background content and zoom
let scale = 2
let glassSize = 700

glass.style.width = glassSize + 'px'
glass.style.height = glassSize + 'px'
glass.style.clipPath = `circle(40% at 50% 50%)`
glass.style.WebkitClipPath = `circle(40% at 50% 50%)`

// applies content copy to magnifying glass div
glass.append(clone)
const zoomed = glass.children[0]


// add classnames to differentiate original vs copied elements
original.className += ' original'
zoomed.className += ' zoomed'
// set initial clase of zoomed content
zoomed.style.transform = `scale(${scale})`


// determines center of entire document body
// note this may not be crowss-browser comptatible
let center = {
  w: document.body.scrollWidth/2,
  h: document.body.scrollHeight/2
}


// event function to move mag-glass around zoomed conten t
let moveGlass = (e) => {
  if (spacedown) {
    mouse = {
        x: e.pageX,
        y: e.pageY
      }
    let corr = glassSize/2
    let centOffsetX = ((scale-1)*(mouse.x-center.w)/center.w)*center.w
    let centOffsetY = ((scale-1)*(mouse.y-center.h)/center.h)*center.h
    let distFromTop = document.querySelector('body').scrollTop
    console.log(distFromTop);
    // translate container div mith mouse move
    glass.style.transform = `translate(${mouse.x - corr}px, ${mouse.y - corr - distFromTop}px)`
    // correct container div translations
    // centOffsetX and centOffsetY account for the scaling difference between the original content and the zoom
    // scale maintains scaling of content in magnifying glass
    zoomed.style.transform = `translate(${((-mouse.x) - centOffsetX + corr)}px, ${((-mouse.y) - centOffsetY + corr - 50)}px) scale(${scale})`
    }
  }



// variable to track spacebar press
let spacedown = false

// event listeners for spacebar press and mousemove
window.addEventListener('resize', () => {
  center = {
    w: document.body.scrollWidth/2,
    h: document.body.scrollHeight/2
  }
  console.log(center);
})

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 32) {
    e.preventDefault()
    spacedown = true
    // body.style.cursor = 'none'
  }
})

window.addEventListener('keyup', (e) => {
  if (e.keyCode === 32) {
    spacedown = false
    // body.style.cursor = 'default'
  }
})

window.addEventListener('mousemove', (e) => {
  moveGlass(e)
})
