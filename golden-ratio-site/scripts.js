
$(function() {

  // target DOM elements
  var WIN = $(window);
  var sections = $('.js-section');
  var spiral = $('.js-spiral')

  // creating variables to store values
  var _winW;
  var _winH;
  var smallScreen;
  var landscape;
  // set by Golden Ratio
  var aspect = .618033;
  //  used to help set spiral origin
  // where did this number come from?
  var axis = .7237;
  var spiralOrigin;

  // track changes/location in spiral
  var rotation = 0; // counts # of rotations
  var sectionCount = sections.length; // counts total number of 'section' divs
  var currentSection = 0; // index of currently selected 'section' div
  var touchStartY = 0;
  var touchStartX = 0;
  var moved = 0;
  var animRAF;
  var animating = false;
  var scrollTimeout;

  // determines browser type
  var userAgent = window.navigator.userAgent.toLowerCase(),
      firefox = userAgent.indexOf('firefox') != -1 || userAgent.indexOf('mozilla') == -1,
      ios = /iphone|ipod|ipad/.test( userAgent ),
      safari = (userAgent.indexOf('safari') != -1 && userAgent.indexOf('chrome') == -1) || ios,
      linux = userAgent.indexOf('linux') != -1,
      windows = userAgent.indexOf('windows') != -1;

  // sets horizontal/vertical orientation depending on window size
  resizeHandler();

// EVENTS
/////////

  // check orientation of spiral based on changes in window size
  WIN.on('resize',resizeHandler);
  // disable default scroll funtionality
  WIN.on('scroll',function(e){
    e.preventDefault();
  })

  // on scroll wheel move, record change in Y, set movement variable, and add/subtract movement to rotation variable
  // then check rotation to prevent it from getting too big or small
  // then start scroll timeout,
  WIN.on('wheel', function(e) {
    var deltaY = -e.originalEvent.deltaY;
    if (windows || linux) {
      deltaY = e.deltaY * 5;
    }
    moved = -deltaY || 0;
    rotation += moved/-10;
    rotation = trimRotation();
    e.preventDefault();
    startScrollTimeout()
    cancelAnimationFrame(animRAF);
    scrollHandler();
  });

// handles 'touch scrolling' on mobile/touchscreen

// set starting touch coordinates
  WIN.on('touchstart', function(e) {
    e.preventDefault()
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    moved = 0;
    touchStartX = touch.pageX;
    touchStartY = touch.pageY;
    cancelAnimationFrame(animRAF);
  })
// adjust rotation and scaling based on distance finger is moved on touch
  WIN.on('touchmove', function(e) {
    e.preventDefault()
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    moved = ((touchStartY - touch.pageY)+(touchStartX - touch.pageX)) * 3;
    touchStartX = touch.pageX;
    touchStartY = touch.pageY;
    rotation += moved/-10;
    rotation = trimRotation();
    startScrollTimeout();
    cancelAnimationFrame(animRAF);
    scrollHandler()
  });
  //
  WIN.on('touchend', function(e) {
    animateScroll()
  })
1
// scroll to nex/previous section on key press
  WIN.on('keydown',function(e) {
    if (e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 32) {
      cancelAnimationFrame(animRAF);
      animateScroll((currentSection + 1) * -90,rotation)
    } else if (e.keyCode === 37 || e.keyCode === 38) {
      cancelAnimationFrame(animRAF);
      animateScroll((currentSection - 1) * -90,rotation)
    }
    scrollHandler()
  })

// moved to target div when clicked
  sections.on('click',function() {
    cancelAnimationFrame(animRAF)
    animateScroll($(this).index() * -90,rotation);
  })


// FUNCTIONS
////////////

// on scrolling, animate rotation and scaling of the entire spiral
  function scrollHandler() {
    requestAnimationFrame(function(){
      var scale = Math.pow(aspect,rotation/90);
      currentSection = Math.min(sectionCount + 2,Math.max(-sectionCount,Math.floor((rotation-30)/-90)));
      spiral.css({
        transform: 'rotate(' + rotation + 'deg) scale(' + scale + ')',
      })
      sections.removeClass('active')
      sections.eq(currentSection).addClass('active')
    })
  }


// automatically moves to target div
  function animateScroll(targR,startR,speed) {
    var distance = startR - targR;
    var mySpeed = speed || .2;
    if (((targR || Math.abs(targR) === 0) && Math.abs(targR - rotation) > .1) || Math.abs(moved) > 1) {
      if (targR || Math.abs(targR) === 0) {
        rotation += mySpeed * (targR - rotation);
      } else {
        moved *= .98;
        rotation += moved/-10;
      }
      rotation = trimRotation();
      scrollHandler();
      animRAF = requestAnimationFrame(function(){
        animateScroll(targR,startR,speed)
      });
    } else if (targR || Math.abs(targR) === 0) {
      cancelAnimationFrame(animRAF)
      rotation = targR;
      rotation = trimRotation();
      scrollHandler();
    }
  }

// generates the spiral structure of elements
  function buildSpiral() {
    // rotate around this point
    spiralOrigin = Math.floor(_winW * axis) + 'px ' + Math.floor(_winW * aspect * axis) +'px';
    var w = _winW * aspect;
    var h = w; // they're squares!
    if (smallScreen && !landscape) { // flip it 90deg if it's a portrait phone
      spiralOrigin = Math.floor((_winW/aspect) * aspect * (1 - axis)) +'px ' + Math.floor((_winW/aspect) * axis) + 'px ';
      w = _winW;
      h = _winW;
    }
    // HACK to smooth out Chrome vs Safari/Firefox
    var translate = '';
    if (safari || firefox) {
      translate = 'translate3d(0,0,0)'
    }
    // END HACK

// set CSS so that everything in the spiral rotates around the spiralOrigin
// and so the 'backside' of divs are not displayed. not sure why this is here
    spiral.css({
      transformOrigin: spiralOrigin,
      backfaceVisiblity: 'hidden'
    })

// for each 'section' div, rotate and scal according to index position in DOM.
// divs will rotate 1/4 turn from the last and get progressively smaller
// background color will get progressively darker
    sections.each(function(i){
      var myRot = Math.floor(90*i);
      var scale = Math.pow(aspect, i);
      $(this).css({
        width: w,
        height: h,
        transformOrigin: spiralOrigin,
        backfaceVisiblity: 'hidden',
        backgroundColor: 'rgb(' + Math.floor(255-i*(255/sectionCount)) + ',50,50)',
        transform: 'rotate(' + myRot + 'deg) scale(' + Math.pow(aspect, i) + ') ' + translate
      })
    })
    scrollHandler();
  }

// Set the size of images and preload them
  function resizeHandler () {
    _winW = window.innerWidth/(1000/window.innerHeight);
    _winH = window.innerHeight;
    smallScreen = _winW < 960;
    landscape = _winH < _winW;
    buildSpiral()
  }

  // keep it from getting too small or too big
  function trimRotation() {
    return Math.max(-1500, Math.min(1200, rotation))
  }

  // if no scrolling happens for 200ms, animate to the closest section
  function startScrollTimeout () {
    clearTimeout(scrollTimeout)
    if (currentSection > -1 && currentSection < sectionCount) {
      scrollTimeout = setTimeout(function(){
        cancelAnimationFrame(animRAF);
        animateScroll(currentSection * -90,rotation,.15);
      },200);
    }
  }
})
