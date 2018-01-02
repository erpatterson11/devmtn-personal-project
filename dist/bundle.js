'use strict';

// CONFIG
// ============================================================
angular.module("portfolioApp", ['ui.router', 'ngAnimate']).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  // INITILIZE STATES
  // ============================================================
  $stateProvider
  // HOME STATE
  .state('portfolio', {
    url: '/portfolio',
    templateUrl: 'app/routes/home/homeTmpl.html',
    controller: 'homeCtrl',
    cache: false
  }).state('golden-ratio', {
    url: '/golden-ratio',
    templateUrl: 'app/routes/golden-ratio-site/goldenRatioTmpl.html',
    controller: 'goldenRatioCtrl'
  }).state('galaxy-strike', {
    url: '/galaxy-strike',
    templateUrl: 'app/routes/game/gameTmpl.html',
    controller: 'gameCtrl'
  }).state('weather', {
    url: '/weather',
    templateUrl: 'app/routes/weather-app/weatherTmpl.html',
    controller: 'weatherCtrl'
  }).state('about', {
    url: '/',
    templateUrl: 'app/routes/about/aboutTmpl.html',
    controller: 'aboutCtrl'
  }

  // ASSIGN OTHERWISE
  // ============================================================
  );$urlRouterProvider.otherwise('/');
}]);
"use strict";

angular.module("portfolioApp").controller("mainCtrl", ["$scope", "$window", "$state", "mainService", function ($scope, $window, $state, mainService) {

    var allowedRoutes = ['home', 'about'];

    $scope.hideNav = allowedRoutes.includes($state.name);
    $scope.hideNav = false;

    $scope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
        $scope.viewTransition = fromState.name !== 'home';
        $scope.hideNav = !allowedRoutes.includes(toState.name);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    $scope.myEmail = 'ecpatterson11@gmail.com';

    $scope.sendMail = function (subject, message) {
        $window.open("mailto:" + $scope.myEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message) + ",_self");
    };

    mainService.routeLoadAnimation();
}]);
"use strict";

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("mainService", ["$http", function ($http) {

  this.routeLoadAnimation = function () {
    TweenMax.from([$('#main-nav'), $('#ham-menu')], 0.2, {
      delay: 0.5,
      opacity: 0
    });
  };
}]);
"use strict";

angular.module("portfolioApp").service("routeLoadAnimationService", function () {
    this.routeLoadAnimation = function (targets) {
        TweenMax.staggerFrom(targets, 0.5, {
            delay: 0.25,
            ease: Power1.easeOut,
            x: -500,
            opacity: 0
        }, 0.15);
    };
});
"use strict";

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("reusableFuncsService", ["$http", function ($http) {

  this.debounce = function (func) {
    var timeout = void 0;
    var wait = 10;
    var immediate = true;

    return function () {
      var context = this,
          args = arguments;
      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  };
}]);
'use strict';

angular.module('portfolioApp').directive('gameOverModal', function () {

    return {
        restrict: 'E',
        templateUrl: './app/directives/gameOverModal/gameOverModalTmpl.html'
    };
});
'use strict';

angular.module('portfolioApp').directive('svgButton', ["$state", function ($state) {

    return {
        restrict: 'E',
        templateUrl: './app/directives/svgButton/svgButtonTmpl.html',
        scope: {
            text: '@',
            desktop: '@',
            toState: '@'
        },
        link: function link(scope, elem, attrs) {
            elem.on('touchend', function () {
                if (attrs.desktop !== undefined) {
                    if (confirm('Heads up, this project contains features that require keyboard input and is not yet optimized for mobile. Please visit on a laptop/desktop for the best experience.')) {
                        if (attrs.uiSref) $state.transitionTo(attrs.uiSref);else if (attrs.href) open(attrs.href);
                    }
                }
            });
            elem.on('click', function () {
                console.log(attrs.uiSref, attrs.href);
                if (!attrs.uiSref && attrs.href) {
                    open(attrs.href);
                }
            });
        },
        controller: function controller() {}
    };
}]);
'use strict';

angular.module('portfolioApp').directive('weatherSideNav', function () {

    return {
        restrict: 'E',
        templateUrl: './app/directives/weatherSideNav/weatherSideNavTmpl.html'
    };
});
'use strict';

angular.module('portfolioApp').controller('aboutCtrl', ["$scope", "aboutService", "routeLoadAnimationService", function ($scope, aboutService, routeLoadAnimationService) {

    routeLoadAnimationService.routeLoadAnimation($('.fade-in'));
    aboutService.routeLoadAnimation();

    $scope.iconColors = {};

    $scope.images = aboutService.images;

    $scope.bgImage = aboutService.image;

    $scope.toggleBoxShadow = function (item, bool) {
        if (bool) {
            $scope.iconColors[item.key] = {};
            $scope.iconColors[item.key].dropShadow = { "filter": "drop-shadow(0 0 25px " + item.value.color + ")" };
            $scope.iconColors[item.key].textShadow = { "textShadow": "0 0 5px " + item.value.color };
        } else {
            $scope.iconColors[item.key].dropShadow = null;
            $scope.iconColors[item.key].textShadow = null;
        }
    };

    // aboutService.pulseNeon()

}]);
'use strict';

angular.module('portfolioApp').service('aboutService', function () {

    this.routeLoadAnimation = function () {
        var bgImage = new Image();
        bgImage.src = './app/routes/about/images/neon-1.jpg';
        bgImage.onload = function () {
            var neonSign = $('#neon-sign');
            TweenMax.from(neonSign, 1, {
                opacity: 0
            });
            neonSign.css({
                'background': 'linear-gradient(transparent, transparent 50%, rgb(0,0,0) 100%), url(\'./app/routes/about/images/neon-1.jpg\')',
                'background-size': 'cover'
            });
        };
    };

    function Images() {
        this.html = new Image();
        this.css = new Image();
        this.javascript = new Image();
        this.react = new Image();
        this.angular = new Image();
        this.node = new Image();
        this.postgresql = new Image();
        this.sass = new Image();
        this.jquery = new Image();
        this.greensock = new Image();
        this.webpack = new Image();
        this.gulp = new Image();
        this.git = new Image();
        this.github = new Image();

        this.html.src = './app/routes/about/images/html.svg';
        this.css.src = './app/routes/about/images/css.svg';
        this.javascript.src = './app/routes/about/images/js.svg';
        this.react.src = './app/routes/about/images/react.svg';
        this.angular.src = './app/routes/about/images/angular.svg';
        this.node.src = './app/routes/about/images/node.svg';
        this.postgresql.src = './app/routes/about/images/postgresql.svg';
        this.sass.src = './app/routes/about/images/sass.svg';
        this.jquery.src = './app/routes/about/images/jquery.svg';
        this.greensock.src = './app/routes/about/images/greensock.svg';
        this.webpack.src = './app/routes/about/images/webpack.svg';
        this.gulp.src = './app/routes/about/images/gulp.svg';
        this.git.src = './app/routes/about/images/git.svg';
        this.github.src = './app/routes/about/images/github_logo.svg';

        this.html.color = '#e44d26';
        this.css.color = '#1572b6';
        this.javascript.color = '#f0db4f';
        this.react.color = '#61dafb';
        this.angular.color = '#c4473a';
        this.node.color = '#83cd29';
        this.postgresql.color = '#336791';
        this.sass.color = '#cb6699';
        this.jquery.color = '#0868ac';
        this.greensock.color = '#8ac640';
        this.webpack.color = '#1c78c0';
        this.gulp.color = '#eb4a4b';
        this.git.color = '#f34f29';
        this.github.color = '#ffffff';
    }

    this.images = new Images();

    this.pulseNeon = function () {
        var workingNeon = $('.neon-animation');
        var flickeringNeon = $('#neon-flicker');
        var tl = new TimelineMax({
            repeat: -1,
            yoyo: true
        });

        var orange = "#ff9933";
        var white = "#ffffff";

        tl.to(workingNeon, 0.2, {
            // "text-shadow": `0 0 10px ${white}, 0 0 20px ${white}, 0 0 30px ${white}, 0 0 40px ${orange}, 0 0 70px ${orange}, 0 0 80px ${orange}, 0 0 100px ${orange}, 0 0 150px ${orange}`,
            "opacity": 0.8
        }).to(workingNeon, 0.4, {
            // "text-shadow": `0 0 5px ${white}, 0 0 10px ${white}, 0 0 15px ${white}, 0 0 20px ${orange}, 0 0 35px ${orange}, 0 0 40px ${orange}, 0 0 50px ${orange}, 0 0 750px ${orange}`,
            "opacity": 0.7
        }).to(workingNeon, 0.1, {
            // "text-shadow": `0 0 10px ${white}, 0 0 20px ${white}, 0 0 30px ${white}, 0 0 40px ${orange}, 0 0 70px ${orange}, 0 0 80px ${orange}, 0 0 100px ${orange}, 0 0 150px ${orange}`,
            "opacity": 0.8
        }).to(workingNeon, 0.3, {
            // "text-shadow": `0 0 5px ${white}, 0 0 10px ${white}, 0 0 15px ${white}, 0 0 20px ${orange}, 0 0 35px ${orange}, 0 0 40px ${orange}, 0 0 50px ${orange}, 0 0 750px ${orange}`,
            "opacity": 0.7
        }

        // tl.play()

        );
    };
});
"use strict";
"use strict";
"use strict";
"use strict";

angular.module("portfolioApp").controller("gameCtrl", ["$scope", "$timeout", "scoreService", "gameService", function ($scope, $timeout, scoreService, gameService) {

  //========================== Variables ================================

  $scope.isShownSubmissionForm = false;
  $scope.isShownNicknameInput = false;

  //========================== Game Functions ================================


  // ensures game is stopped before user navigates to other route
  $scope.$on('$stateChangeStart', function (e) {
    gameService.stopGame();
  }

  //========================== DOM Manipulation Functions ================================

  );$scope.showScoreSubmission = function () {
    $scope.isShownSubmissionForm = true;
    $scope.getFinalScore();
  };

  //========================== HTTP Requests ================================

  $scope.initGame = function () {
    $scope.isShownSubmissionForm = false;
    $scope.isShownNicknameInput = false;
    gameService.initGame();
  };

  $scope.getAuth0Info = function () {
    scoreService.getAuth0Info().then(function (results) {
      $scope.userInfo = results.data;
    });
  };

  $scope.getFinalScore = function () {
    $scope.finalScore = gameService.getScore();
  };

  $scope.getDbScores = function () {
    scoreService.getScores().then(function (results) {
      $scope.scores = results.data;
    });
  };

  $scope.getDbScores();

  $scope.submitFinalScore = function (name) {
    if ($scope.userInfo) {
      scoreService.getAuth0Info().then(function (results) {
        $scope.userInfo = results.data;
      }).then(function () {
        var obj = {
          score: $scope.finalScore,
          nickname: name,
          auth0id: $scope.userInfo
        };
        scoreService.addScore(obj);
      });
    } else {
      var obj = {
        score: $scope.finalScore,
        nickname: name
      };
      scoreService.addScore(obj).then(function () {
        $scope.getDbScores();
        $scope.isShownNicknameInput = !$scope.isShownNicknameInput;
      });
    }
  };
}]);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("gameService", ["reusableFuncsService", function (reusableFuncsService) {

  // note: there is a getScore function attached to the service
  //       that is declared after the game code


  // GAME CODE
  ///////////////////////////////////////////////////////////////////////////////

  //========================== Custom Functions ================================

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  //========================== Shims ================================

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  //========================== Target DOM Elements ================================

  var gameCanvas = document.querySelector('#gameCanvas');
  var bgCanvas = document.querySelector('#bgCanvas');
  var explosionCanvas = document.querySelector('#explosionCanvas');

  var gameContainer = document.querySelector('#game-container');
  var statsBar = document.querySelector('#stats-bar');

  var loadingScreen = document.querySelector('#game-loading-screen');
  var startScreen = document.querySelector('#start-screen');
  var gameOverScreen = document.querySelector('#game-over-screen');
  var healthBarFill = document.querySelector('#health-bar-fill');
  var healthText = document.querySelector('#health-text');
  var scoreText = document.querySelector('#score');

  var startButton = document.querySelector('#start-button');
  var restartButton = document.querySelectorAll('.restart-button');
  var submitScoreButton = document.querySelector('#submit-score');
  var pauseButton = document.querySelector('#pause-button');
  var muteButton = document.querySelector('#mute-button');

  var speakerIcon = document.querySelector('#speaker-icon');
  var playPauseIcon = document.querySelector('#play-pause-icon');
  var gameControllerIcon = document.querySelector('#game-controller-icon');

  var controlsTooltip = document.querySelector('#controls-tooltip');

  var scoreSubmissionBox = document.querySelector('#score-submission-box');
  var closeContentIcon = document.querySelector('#content-close-icon');
  var guestButton = document.querySelector('#guest-login-button');
  var customLoginForm = document.querySelector('#custom-login');
  var finalScoreText = document.querySelector('#final-score-text'

  //========================== Image Repo ================================

  );var images = new function () {
    var _this = this;

    this.spaceship = new Image();
    this.bullet = new Image();
    this.enemy = new Image();
    this.enemyBullet = new Image();
    this.explosion = new Image();
    this.bg = new Image();
    this.bg2 = new Image();
    this.powerup1 = new Image();
    this.powerup2 = new Image();
    this.powerup3 = new Image();

    this.spaceship.src = 'app/routes/game/media/img/ship.png';
    this.bullet.src = 'app/routes/game/media/img/bullet.png';
    this.enemy.src = 'app/routes/game/media/img/enemy.png';
    this.enemyBullet.src = 'app/routes/game/media/img/bullet_enemy.png';
    this.explosion.src = 'app/routes/game/media/img/explosion.png';
    this.bg.src = 'app/routes/game/media/img/spr_stars01.png';
    this.bg2.src = 'app/routes/game/media/img/spr_stars02.png';
    this.powerup1.src = 'app/routes/game/media/img/powerup1.png';
    this.powerup2.src = 'app/routes/game/media/img/powerup2.png';
    this.powerup3.src = 'app/routes/game/media/img/powerup3.png';

    var allImages = Object.keys(this).filter(function (x) {
      return _this[x] instanceof Image;
    });

    this.scaleImages = function (scaleX, scaleY) {
      var _this2 = this;

      allImages.map(function (img) {
        _this2[img].width = _this2[img].naturalWidth * scaleX;
        _this2[img].height = _this2[img].naturalHeight * scaleY;
      });
    };

    var total = allImages.length;
    var loaded = 0;

    var promiseArray = [];

    this.monitorLoading = function () {
      var _this3 = this;

      allImages.map(function (img) {
        var p = new Promise(function (resolve, reject) {
          _this3[img].onload = function () {
            resolve(_this3[img]);
          };
        });
        promiseArray.push(p);
      });
      return Promise.all(promiseArray);
    };
  }();

  //========================== Spritesheet Repo ================================

  var spriteRepo = new function () {
    var _this4 = this;

    this.explosion = new Image();
    this.explosion2 = new Image();

    this.explosion.src = "app/routes/game/media/img/explosion.png";
    this.explosion2.src = "app/routes/game/media/img/explosion-2.png";

    this.scaleImages = function (scaleX, scaleY) {
      var keys = Object.keys(this);
      keys.map(function (sprite) {
        if (_typeof(spriteRepo[sprite]) === 'object') {
          spriteRepo[sprite].width = spriteRepo[sprite].naturalWidth * scaleX;
          spriteRepo[sprite].height = spriteRepo[sprite].naturalHeight * scaleY;
        }
      });
    };

    var allSprites = Object.keys(this).filter(function (x) {
      return _this4[x] instanceof Image;
    });

    var total = allSprites.length;
    var loaded = 0;

    var promiseArray = [];

    this.monitorLoading = function () {
      var _this5 = this;

      allSprites.map(function (img) {
        var p = new Promise(function (resolve, reject) {
          _this5[img].onload = function () {
            resolve(_this5[img]);
          };
        });
        promiseArray.push(p);
      });
      return Promise.all(promiseArray);
    };
  }();

  //========================== Audio Repo ================================

  var audio = new function () {
    var _this6 = this;

    this.laser1 = new Audio();
    this.laser2 = new Audio();
    this.laser3 = new Audio();
    this.explosion = new Audio();

    this.laser1.src = 'app/routes/game/media/audio/laser.wav';
    this.laser2.src = 'app/routes/game/media/audio/turret-1.wav';
    this.laser3.src = 'app/routes/game/media/audio/wlkrsht2.wav';
    this.explosion.src = 'app/routes/game/media/audio/explosion.wav';

    this.laser1.volume = 0.75;
    this.laser2.volume = 0.5;
    this.laser3.volume = 0.5;

    var allAudio = Object.keys(this).filter(function (x) {
      return _this6[x] instanceof Audio;
    });

    var total = allAudio.length;
    var loaded = 0;

    var promiseArray = [];

    this.monitorLoading = function () {
      var _this7 = this;

      allAudio.map(function (audio) {
        var p = new Promise(function (resolve, reject) {
          _this7[audio].oncanplaythrough = function () {
            resolve(_this7[audio]);
          };
        });
        promiseArray.push(p);
      });
      return Promise.all(promiseArray);
    };
  }();

  //========================== Canvas SetUp ================================

  var ctx = gameCanvas.getContext('2d');

  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = 'high';

  //========================== Background Canvas Setup ================================

  var bgCtx = bgCanvas.getContext('2d');

  bgCtx.imageSmoothingEnabled = false;

  //========================== Explosion Canvas Setup ================================

  var explCtx = explosionCanvas.getContext('2d');

  explCtx.imageSmoothingEnabled = false;

  //========================== Canvas Sizing ================================
  var gameW = 1200;
  var gameH = 780;
  var gameAspect = gameW / gameH;
  var cW = void 0;
  var cH = void 0;
  var imgScaleX = void 0;
  var imgScaleY = void 0;

  function sizeGame() {
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var userAspect = screenW / screenH;
    if (userAspect > gameAspect) {
      cW = screenH * gameAspect;
      cH = screenH;
    } else if (userAspect < gameAspect) {
      cW = screenW;
      cH = screenW / gameAspect;
    }
    gameCanvas.width = bgCanvas.width = explosionCanvas.width = cW;
    gameCanvas.height = bgCanvas.height = explosionCanvas.height = cH;
    gameContainer.style.width = gameCanvas.style.width = bgCanvas.style.width = explosionCanvas.style.width = cW + 'px';
    gameContainer.style.height = gameCanvas.style.height = bgCanvas.style.height = explosionCanvas.style.height = cH + 'px';

    imgScaleX = cW / gameW;
    imgScaleY = cW / gameAspect / gameH;
    images.scaleImages(imgScaleX, imgScaleY);
    spriteRepo.scaleImages(imgScaleX, imgScaleY);
  }

  sizeGame();

  window.addEventListener('resize', reusableFuncsService.debounce(sizeGame)

  //========================== Player Movement Logic ================================

  // object to relate keycodes to keyname
  );var KeyCodes = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'

    // generate object to store status of each key
    // initialize status of all pressed keys to false
  };var KeyStatus = {};
  for (var code in KeyCodes) {
    KeyStatus[KeyCodes[code]] = false;
  }

  // listener to change key status to true when key is pressed
  document.onkeydown = function (e) {
    var currCode = e.keyCode ? e.keyCode : e.charCode;
    if (KeyCodes[currCode]) {
      KeyStatus[KeyCodes[currCode]] = true;
    }
  };

  // listener to change key status to false when key is release
  document.onkeyup = function (e) {
    e.preventDefault();
    var currCode = e.keyCode ? e.keyCode : e.charCode;
    if (KeyCodes[currCode]) {
      KeyStatus[KeyCodes[currCode]] = false;
    }
  };

  //====================================================================
  //                          Factory Functions
  //====================================================================


  //========================== Re-usable Factory Functions ================================

  var BulletPoolFactory = function BulletPoolFactory(max, speed, image) {
    var arr = [];
    for (var i = 0; i < max; i++) {
      var bullet = {
        alive: false,
        x: -100,
        y: -100,
        speed: speed,
        img: image
      };
      arr.push(bullet);
    }
    return arr;
  };

  var DrawObject = function DrawObject(obj, callback) {
    callback(obj);
    ctx.drawImage(obj.img, obj.x, obj.y, obj.img.width, obj.img.height);
  };

  var NewPowerupFactory = function NewPowerupFactory(image, interval) {
    return {
      alive: false,
      x: -10,
      y: -10,
      dx: -1,
      dy: 2,
      img: image,
      interval: interval
    };
  };

  var DrawSpriteFactory = function DrawSpriteFactory(totalFrames, frameRate) {
    var sp = spriteRepo.explosion;
    sp.count = 0;
    var isAnimating = true;
    var currentFrame = 0;
    var frameWidth = sp.width / totalFrames;
    var frameSpeed = frameRate / 100;

    var updateSprite = function updateSprite() {
      sp.count++;
      if (sp.count >= frameSpeed) {
        sp.count = 0;
        currentFrame++;
        if (currentFrame >= totalFrames) {
          isAnimating = false;
          currentFrame = 0;
        }
      }
    };

    var drawSprite = function drawSprite(x, y) {
      explCtx.drawImage(sp, spriteRepo.explosion.width / totalFrames * currentFrame, 0, spriteRepo.explosion.width / totalFrames, spriteRepo.explosion.height / totalFrames, x, y, frameWidth, sp.height);
    };

    var explReq = void 0;

    var animateSprite = function animateSprite(x, y) {
      explCtx.clearRect(0, 0, cW, cH);
      updateSprite();
      drawSprite(x, y);
      if (isAnimating) {
        explReq = requestAnimationFrame(animateSprite);
      } else {
        cancelAnimationFrame(explReq);
        isAnimating = true;
      }
    };

    return {
      draw: animateSprite
    };
  };

  //========================== Draw BackgroundFactory ================================

  var BackgroundAnimateFactory = function BackgroundAnimateFactory() {
    var current = 0;

    var drawBackground = function drawBackground() {
      bgCtx.clearRect(0, 0, cW, cH);
      bgCtx.drawImage(images.bg, current * 2, 0, cW, cH);
      bgCtx.drawImage(images.bg, cW + current * 2, 0, cW, cH);
      bgCtx.drawImage(images.bg2, current, 0, cW, cH);
      bgCtx.drawImage(images.bg2, cW + current, 0, cW, cH);
      moveBackground();
    };

    var moveBackground = function moveBackground() {
      current--;
      if (current < -cW) {
        current = 0;
      }
    };

    return {
      draw: drawBackground
    };
  };

  //========================== Player Factory ================================


  var PlayerFactory = function PlayerFactory() {
    var player = {
      x: 10,
      y: cH / 2,
      width: images.spaceship.width,
      height: images.spaceship.height,
      img: images.spaceship,
      speed: 7,
      health: 10,
      maxHealth: 10
    };

    healthText.innerText = "Health: " + 100 * player.health / player.maxHealth + "%";
    healthBarFill.style.width = '0%';

    var updateHealth = function updateHealth(num) {
      player.health += num;
      healthText.innerText = "Health: " + 100 * player.health / player.maxHealth + "%";
      healthBarFill.style.width = 100 - 100 * player.health / player.maxHealth + "%";
    };

    var getPlayerInfo = function getPlayerInfo() {
      return player;
    };

    var movePlayer = function movePlayer() {
      if (KeyStatus.left) {
        player.x -= player.speed;
        player.x <= 0 ? player.x = 0 : null;
      }
      if (KeyStatus.right) {
        player.x += player.speed;
        player.x >= cW - player.img.width ? player.x = cW - player.img.width : null;
      }
      if (KeyStatus.up) {
        player.y -= player.speed;
        player.y <= 0 ? player.y = 0 : null;
      }
      if (KeyStatus.down) {
        player.y += player.speed;
        player.y >= cH - player.img.height ? player.y = cH - player.img.height : null;
      }
    };

    var drawPlayer = function drawPlayer() {
      DrawObject(player, movePlayer);
    };

    return {
      changeHealth: updateHealth,
      get: getPlayerInfo,
      draw: drawPlayer
    };
  };

  //========================== Player Bullet Factory ================================


  var PlayerBulletFactory = function PlayerBulletFactory() {
    var bulletParams = {
      maxBullets: 100,
      bulletSpeed: 15,
      fireRate: 200,
      lastFire: Date.now(),
      powerup: false
    };

    var bulletPool = BulletPoolFactory(bulletParams.maxBullets, bulletParams.bulletSpeed, images.bullet);

    var moveBullet = function moveBullet(b) {
      b.x += b.speed;
      if (b.x >= cW) {
        b.alive = false;
        Score.change(-1);
      }
    };

    var fireOne = function fireOne(player, fireRate) {
      bulletParams.fireRate = fireRate;
      var b = bulletPool[0];
      if (!b.alive) {
        audio.laser1.currentTime = 0;
        audio.laser1.play();
        b.alive = true;
        b.x = player.x + player.img.width;
        b.y = player.y + player.img.height / 2;
        bulletPool.push(bulletPool.shift());
      }
    };

    var fireTwo = function fireTwo(player, fireRate) {
      bulletParams.fireRate = fireRate;
      var b = bulletPool[0];
      if (!b.alive) {
        audio.laser1.currentTime = 0;
        audio.laser1.play();
        b.alive = true;
        b.x = player.x + player.img.width;
        b.y = player.y + player.img.height * 0.25;
        bulletPool.push(bulletPool.shift());
      }
      var bn = bulletPool[0];
      if (!bn.alive) {
        audio.laser2.currentTime = 0;
        audio.laser2.play();
        bn.alive = true;
        bn.x = player.x + player.img.width;
        bn.y = player.y + player.img.height * 0.75;
        bulletPool.push(bulletPool.shift());
      }
    };

    var fireFour = function fireFour(player, fireRate) {
      bulletParams.fireRate = fireRate;
      var b = bulletPool[0];
      if (!b.alive) {
        audio.laser1.currentTime = 0;
        audio.laser1.play();
        b.alive = true;
        b.x = player.x + player.img.width;
        b.y = player.y + player.img.height * 0.25;
        bulletPool.push(bulletPool.shift());
      }
      var bn = bulletPool[0];
      if (!bn.alive) {
        audio.laser2.currentTime = 0;
        audio.laser2.play();
        bn.alive = true;
        bn.x = player.x + player.img.width;
        bn.y = player.y + player.img.height * 0.75;
        bulletPool.push(bulletPool.shift());
      }
      var by = bulletPool[0];
      if (!by.alive) {
        audio.laser3.currentTime = 0;
        audio.laser3.play();
        by.alive = true;
        by.x = player.x + player.img.width;
        by.y = player.y;
        bulletPool.push(bulletPool.shift());
      }
      var bz = bulletPool[0];
      if (!bz.alive) {
        bz.alive = true;
        bz.x = player.x + player.img.width;
        bz.y = player.y + player.img.height;
        bulletPool.push(bulletPool.shift());
      }
    };

    var drawBullets = function drawBullets() {
      for (var i = 0; i < bulletPool.length; i++) {
        var b = bulletPool[i];
        if (b.alive) {
          DrawObject(b, moveBullet);
        }
      }
    };

    var shootBullets = function shootBullets(player, index) {
      if (KeyStatus.space) {
        var now = Date.now();
        var dif = now - bulletParams.lastFire;
        if (dif >= bulletParams.fireRate) {
          bulletParams.lastFire = now;
          if (KeyStatus.space) {
            if (index > 2) {
              fireFour(player, 100);
            } else if (index > 1) {
              fireFour(player, 200);
            } else if (index > 0) {
              fireTwo(player, 200);
            } else {
              fireOne(player, 200);
            }
          }
        }
      }
    };

    var updateBulletSpeed = function updateBulletSpeed(num) {
      for (var i = 0; i < bulletPool.length; i++) {
        bulletPool[i].speed = num;
      }
    };

    var accessPool = function accessPool() {
      return bulletPool;
    };

    return {
      draw: drawBullets,
      shoot: shootBullets,
      changeBulletSpeed: updateBulletSpeed,
      get: accessPool
    };
  };

  //========================== Enemy Factory ================================

  var EnemyFactory = function EnemyFactory() {
    var enemyPool = [];
    var maxEnemies = 20;
    var speed = {
      low: 0.5,
      high: 2
    };
    var chance = {
      low: 0.005,
      high: 0.05
    };
    var enemyLives = 3;

    // automatically generate enemies when factory is run
    for (var i = 0; i < maxEnemies; i++) {
      var enemy = {
        alive: true,
        x: random(cW, cW * 1.5),
        y: random(0, cH - images.enemy.height),
        speed: random(speed.low, speed.high),
        chance: random(chance.low, chance.high),
        life: enemyLives,
        img: images.enemy
      };
      enemyPool.push(enemy);
    }

    var moveEnemy = function moveEnemy(e) {
      e.x -= e.speed;
      e.x <= 0 ? e.x = random(cW, cW * 1.5) : null;
    };

    var shootBullets = function shootBullets() {
      for (var _i = 0; _i < enemyPool.length; _i++) {
        var e = enemyPool[_i];
        var _chance = random(0, 50);
        if (_chance < e.chance) {
          return e;
        }
      }
    };

    var spawnEnemies = function spawnEnemies() {
      for (var _i2 = 0; _i2 < enemyPool.length; _i2++) {
        enemyPool[_i2].alive = true;
      }
    };

    var drawEnemies = function drawEnemies() {
      for (var i = 0; i < enemyPool.length; i++) {
        var e = enemyPool[i];
        if (e.alive) {
          DrawObject(e, moveEnemy);
        }
      }
    };

    var accessPool = function accessPool() {
      return enemyPool;
    };

    return {
      spawnEnemies: spawnEnemies,
      shoot: shootBullets,
      draw: drawEnemies,
      get: accessPool
    };
  };

  //========================== Enemy Bullet Factory ================================

  var EnemyBulletFactory = function EnemyBulletFactory() {
    var bulletParams = {
      maxBullets: 100,
      bulletSpeed: 15
    };

    var enemyBulletPool = BulletPoolFactory(bulletParams.maxBullets, bulletParams.bulletSpeed, images.enemyBullet);

    var moveEnemyBullet = function moveEnemyBullet(b) {
      b.x -= b.speed;
      b.x <= 0 - b.img.width ? b.alive = false : null;
    };

    var drawEnemyBullets = function drawEnemyBullets() {
      for (var i = 0; i < enemyBulletPool.length; i++) {
        var b = enemyBulletPool[i];
        if (b.alive) {
          DrawObject(b, moveEnemyBullet);
        }
      }
    };

    var shootBullets = function shootBullets(e) {
      var b = enemyBulletPool[0];
      if (!b.alive && e) {
        b.alive = true;
        b.x = e.x + e.img.width;
        b.y = e.y + e.img.height / 2;
        enemyBulletPool.push(enemyBulletPool.shift());
      }
    };

    var updateBulletSpeed = function updateBulletSpeed(num) {
      for (var i = 0; i < enemyBulletPool.length; i++) {
        enemyBulletPool[i].speed = num;
      }
    };

    var accessPool = function accessPool() {
      return enemyBulletPool;
    };

    return {
      draw: drawEnemyBullets,
      shoot: shootBullets,
      updateBulletSpeed: updateBulletSpeed,
      get: accessPool
    };
  };

  //========================== Powerup Factory ================================

  var PowerupFactory = function PowerupFactory() {

    var powerup1 = NewPowerupFactory(images.powerup1, 10);
    var powerup2 = NewPowerupFactory(images.powerup2, 15);
    var powerup3 = NewPowerupFactory(images.powerup3, 20);
    var powerup4 = powerup3;

    var powerupPool = [powerup1, powerup2, powerup3, powerup4];
    var index = 0;
    var lastPowerup = Date.now();

    var getPowerups = function getPowerups() {
      return powerupPool;
    };

    var getIndex = function getIndex() {
      return index;
    };

    var activatePowerup = function activatePowerup(powerup) {
      ctx.clearRect(powerup.x - 2, powerup.y - 2, powerup.img.width + 2, powerup.img.height + 2);
      powerup.x = cW + 100;
      powerup.y = random(0, cH - powerup.img.height);
      index++;
      index >= powerupPool.length - 1 ? index = powerupPool.length - 1 : null;
      resetPowerupTimer();
    };

    var resetPowerup = function resetPowerup() {
      index = 0;
    };

    var generatePowerup = function generatePowerup() {
      var now = Date.now();
      var dif = now - lastPowerup;
      if (dif >= powerupPool[index].interval * 1000 && !powerupPool[index].alive) {
        spawnPowerup();
      }
      if (powerupPool[index].alive) {
        drawPowerup(powerupPool[index]);
      }
    };

    var resetPowerupTimer = function resetPowerupTimer() {
      lastPowerup = Date.now();
      powerupPool.map(function (x) {
        return x.alive = false;
      });
    };

    var spawnPowerup = function spawnPowerup() {
      powerupPool[index].alive = true;
      powerupPool[index].x = cW + 10;
      powerupPool[index].y = random(100, cH - 100);
    };

    var movePowerup = function movePowerup(p) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.y < 0 || p.y > cH - p.img.height) {
        p.dy = -p.dy;
      }
      if (p.x < 0 - p.width) {
        resetPowerupTimer();
      }
    };

    var drawPowerup = function drawPowerup(powerup) {
      DrawObject(powerup, movePowerup);
    };

    return {
      get: getPowerups,
      getIndex: getIndex,
      generate: generatePowerup,
      activate: activatePowerup,
      reset: resetPowerup
    };
  };

  //========================== Game Stat Factory ================================


  var ScoreFactory = function ScoreFactory() {
    var score = 0;
    scoreText.innerText = "Score: " + score;

    var changeScore = function changeScore(num) {
      score += num;
      score <= 0 ? score = 0 : null;
      scoreText.innerText = "Score: " + score;
    };

    var getScore = function getScore() {
      return parseInt("" + score);
    };

    return {
      change: changeScore,
      get: getScore
    };
  };

  //========================== Collision Detection Factory ================================


  var CollisionDetectionFactory = function CollisionDetectionFactory(player, bullets, enemies, enemyBullets, powerup, explosion) {
    var detectCollision = function detectCollision(rect1, rect2) {
      if (rect1.x < rect2.x + rect2.img.width && rect1.x + rect1.img.width > rect2.x && rect1.y < rect2.y + rect2.img.height && rect1.img.height + rect1.y > rect2.y) {
        return true;
      } else {
        return false;
      }
    };

    var resetEnemy = function resetEnemy(e) {
      e.x = random(cW, cW * 1.5);
      e.y = random(0, cH - images.enemy.height);
    };

    var resetBullet = function resetBullet(b) {
      b.alive = false;
      b.x = -100;
      b.y = -100;
    };

    var detectHitOnEnemy = function detectHitOnEnemy() {
      for (var i = 0; i < bullets.length; i++) {
        for (var j = 0; j < enemies.length; j++) {
          if (bullets[i].alive) {
            if (detectCollision(bullets[i], enemies[j])) {
              Score.change(100);
              audio.explosion.currentTime = 0;
              audio.explosion.play();
              Explosion.draw(enemies[j].x - images.enemy.height, enemies[j].y - images.enemy.height);
              resetEnemy(enemies[j]);
              resetBullet(bullets[i]);
            }
          }
        }
      }
    };

    var detectPlayerDamage = function detectPlayerDamage(arr, player, callback) {
      for (var i = 0; i < arr.length; i++) {
        if (detectCollision(arr[i], player)) {
          Player.changeHealth(-1);
          Powerup.reset();
          Score.change(-100);
          callback(arr[i]);
          audio.explosion.currentTime = 0;
          audio.explosion.play();
        }
      }
    };

    var detectPowerupCollected = function detectPowerupCollected() {
      for (var i = 0; i < enemies.length; i++) {
        var activePowerup = void 0;
        powerup.map(function (x) {
          return x.alive ? activePowerup = x : null;
        });
        if (activePowerup) {
          if (detectCollision(player, activePowerup)) {
            Powerup.activate(activePowerup);
          }
        }
      }
    };

    var runDetections = function runDetections() {
      detectHitOnEnemy();
      detectPlayerDamage(enemyBullets, player, resetBullet);
      detectPlayerDamage(enemies, player, resetEnemy);
      detectPowerupCollected();
    };
    return {
      run: runDetections
    };
  };

  //========================== Set Game Objects ================================

  var Player = void 0;
  var PlayerBullets = void 0;
  var Enemies = void 0;
  var EnemyBullets = void 0;
  var Score = void 0;
  var Powerup = void 0;
  var Explosion = void 0;
  var DetectAllCollisions = void 0;
  var Background = void 0;

  //========================== Game Loop ================================

  var GameFactory = function GameFactory() {
    var req = void 0;
    var isAnimating = false;

    var init = function init() {
      Player = PlayerFactory();
      PlayerBullets = PlayerBulletFactory();
      Enemies = EnemyFactory();
      EnemyBullets = EnemyBulletFactory();
      Score = ScoreFactory();
      Powerup = PowerupFactory();
      Explosion = DrawSpriteFactory(46, 60);
      DetectAllCollisions = CollisionDetectionFactory(Player.get(), PlayerBullets.get(), Enemies.get(), EnemyBullets.get(), Powerup.get(), Explosion);
      Background = BackgroundAnimateFactory();
    };

    var setPlayIcon = function setPlayIcon() {
      playPauseIcon.classList.remove('fa-pause');
      playPauseIcon.classList.add('fa-play');
    };

    var setPauseIcon = function setPauseIcon() {
      playPauseIcon.classList.remove('fa-play');
      playPauseIcon.classList.add('fa-pause');
    };

    var gameloop = function gameloop() {
      isAnimating = true;
      ctx.clearRect(0, 0, cW, cH);
      Background.draw();
      Enemies.draw();
      PlayerBullets.shoot(Player.get(), Powerup.getIndex());
      EnemyBullets.shoot(Enemies.shoot());
      PlayerBullets.draw();
      EnemyBullets.draw();
      Player.draw();
      Powerup.generate();
      DetectAllCollisions.run();
      if (Player.get().health > 0) {
        req = requestAnimationFrame(gameloop);
      } else {
        isAnimating = false;
        gameOverScreen.classList.remove('hidden');
        cancelAnimationFrame(req);
        setPauseIcon();
      }
    };

    var cancelRAF = function cancelRAF() {
      isAnimating = false;
      cancelAnimationFrame(req);
    };

    var toggleGameLoop = function toggleGameLoop() {
      if (isAnimating) {
        cancelRAF();
        setPauseIcon();
      } else {
        gameloop();
        setPlayIcon();
      }
    };

    var toggleMutePage = function toggleMutePage() {
      for (var key in audio) {
        audio[key].muted = !audio[key].muted;
      }
      if (speakerIcon.classList.value.includes('fa-volume-up')) {
        speakerIcon.classList.remove('fa-volume-up');
        speakerIcon.classList.add('fa-volume-off');
      } else {
        speakerIcon.classList.remove('fa-volume-off');
        speakerIcon.classList.add('fa-volume-up');
      }
    };

    var loopStatus = function loopStatus() {
      return isAnimating;
    };

    return {
      init: init,
      loop: gameloop,
      status: loopStatus,
      toggleLoop: toggleGameLoop,
      toggleMute: toggleMutePage,
      stop: cancelRAF
    };
  };

  var Game = GameFactory

  //========================== DOM Manipulation ================================


  ();Promise.all([audio.monitorLoading(), images.monitorLoading(), spriteRepo.monitorLoading()]).then(function (results) {
    loadingScreen.classList.add('media-loaded');
    Game.init();
  }).catch(function (error) {
    return console.log("failure", error);
  });

  startButton.addEventListener('click', function () {
    startScreen.classList.add('hidden');
    Game.loop();

    window.addEventListener('keydown', function (e) {
      if (e.keyCode === 77) {
        Game.toggleMute();
      }
      if (e.keyCode === 80) {
        Game.toggleLoop();
      }
    });
  });

  pauseButton.addEventListener('click', Game.toggleLoop);

  restartButton.forEach(function (button) {
    button.addEventListener('click', function () {
      Game.toggleLoop();
      gameOverScreen.classList.add('hidden');
      Game.init();
      Game.loop();
      console.log('restart game!');
    });
  });

  muteButton.addEventListener('click', Game.toggleMute);

  gameControllerIcon.addEventListener('click', function () {
    if (Game.status()) {
      Game.toggleLoop();
    }
    controlsTooltip.classList.remove('hidden');
  });

  gameControllerIcon.addEventListener('blur', function () {
    if (!Game.status()) {
      Game.toggleLoop();
    }
    controlsTooltip.classList.add('hidden');
  }

  ////////////////////////////////////////////////////////////////////
  // END OF GAME CODE


  // SERVICE FUNCTIONS
  ////////////////////////////////////////////////////////////////////

  );this.getScore = function () {
    return Score.get();
  };

  this.stopGame = function () {
    return Game.stop();
  };

  this.initGame = function () {
    return Game.init();
  };
}]);
"use strict";

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("scoreService", ["$http", function ($http) {

  this.getScores = function () {
    return $http({
      method: 'GET',
      url: '/api/scores'
    });
  };
  this.addScore = function (obj) {
    return $http({
      method: 'POST',
      url: '/api/scores',
      data: obj
    });
  };
  this.getAuth0Info = function () {
    return $http({
      method: 'GET',
      url: 'api/auth0'
    });
  };
}]);
"use strict";

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("goldenRatioCtrl", ["$scope", "goldenRatioService", function ($scope, goldenRatioService) {

  goldenRatioService.generateContent();
}]);
"use strict";

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("goldenRatioService", function () {

  this.generateContent = function () {

    var win = $(window);
    var spiral = $('.spiral');
    var sections = $('.section');

    var svgContainer = document.querySelector('#svgContainer');
    var svgElement = document.querySelector('#spiralSVG');
    var path = document.querySelector('#spiral-path');

    var canvas = document.querySelector('#spiral-canvas');
    var ctx = canvas.getContext('2d');

    var startOver = false;
    var shouldAnimate = false;
    var currentSection = 0;
    var rotate = 0;
    var goldenRatio = 0.618033;
    var axis = 0.7237;
    var spiralOrigin = void 0;
    var spiralOriginX = void 0;
    var spiralOriginY = void 0;
    var wW = window.innerWidth;
    var wH = wW * goldenRatio;
    var smallScreen = void 0;
    var landscape = void 0;
    var rotation = 0;
    var sectionCount = sections.length;
    var scale = 0;
    var bounds = void 0;
    var rotationRate = 2;
    var chgInt = 178;
    var createSpiral = void 0;
    var spiralSpeed = 11;
    var moved = void 0;
    var touchStartX = void 0;
    var touchStartY = void 0;

    var colorSchemes = {
      0: {
        bg: "#18121E",
        accent1: "#F4F4F4",
        accent2: "#e52127",
        text: "#18121E"
      },
      1: {
        bg: "#faad69",
        accent1: "#244c89",
        accent2: "#faad69",
        text: "#ffffff"
      },
      2: {
        bg: "#6ad4ff",
        accent1: "#356a85",
        accent2: "#6ad4ff",
        text: "#ffffff"
      },
      3: {
        bg: "#52beac",
        accent1: "#2c2435",
        accent2: "#52beac",
        text: "#ffffff"
      },
      4: {
        bg: "#f11b1b",
        accent1: "#2f3436",
        accent2: "#e52127",
        text: "#ffffff"
      },
      5: {
        bg: "#F4F4F4",
        accent1: "#76323F",
        accent2: "#F4F4F4",
        text: "#373737"
      },
      6: {
        bg: "#A23988",
        accent1: "#0E0B16",
        accent2: "#A23988",
        text: "#ffffff"
      },
      7: {
        bg: "#FF3B3F",
        accent1: "#CAEBF2",
        accent2: "#FF3B3F",
        text: "#0E0B16"
      },
      8: {
        bg: "#813772",
        accent1: "#062F4F",
        accent2: "#813772",
        text: "#ffffff"
      },
      9: {
        bg: "#94618E",
        accent1: "#49274A",
        accent2: "#94618E",
        text: "#ffffff"
      },
      10: {
        bg: "#76323F",
        accent1: "#565656",
        accent2: "#76323F",
        text: "#ffffff"
      }
    };

    var startingAnimation = function startingAnimation(direction, animationTime, offSet) {
      var w = window.innerWidth;
      var h = window.innerHeight;

      if (w < h) {
        svgElement.setAttribute('height', w + "px");
        svgElement.style.transform = "translateX(" + w + "px) rotate(90deg)";
      } else {
        svgElement.setAttribute('height', w * goldenRatio + "px");
        svgElement.style.transform = 'none';
      }

      path.style.transition = path.style.WebkitTransition = 'none';
      var length = path.getTotalLength();
      path.style.strokeDasharray = length + " " + length;
      path.style.strokeDashoffset = length;
      path.getBoundingClientRect();
      path.style.transition = path.style.WebkitTransition = "stroke-dashoffset " + animationTime + "s ease-in";
      path.style.strokeDashoffset = "" + (length + 2 * length * direction);

      if (!startOver) {
        setTimeout(function () {
          path.setAttribute('stroke', '#fff');
          svgContainer.style.opacity = '0';
          setTimeout(function () {
            svgContainer.style.zIndex = '-99';
          }, 1000);
        }, animationTime * 1000 / 2);
        startOver = true;
      }
    };

    startingAnimation(1, 2, true);

    var animateCanvasSpirals = function animateCanvasSpirals() {
      var spiralSources = ['golden-curve', 'golden-curve-orange', 'golden-curve-purple'];
      var spiralSourcesMobile = ['golden-curve-mobile'];
      var spiralSVG = new Image();
      var resetSpiralSVG = function resetSpiralSVG() {
        spiralSVG.src = "./app/routes/golden-ratio-site/img/golden-curve.svg ";
        rotate = 0;
      };
      resetSpiralSVG();

      var chooseSpiralSource = function chooseSpiralSource(i) {
        spiralSVG.src = "./app/routes/golden-ratio-site/img/" + spiralSources[i] + ".svg ";
      };

      var drawLine = function drawLine(num) {
        ctx.globalAlpha = 1;
        ctx.translate(spiralOriginX, spiralOriginY);
        ctx.rotate(num);
        ctx.translate(-spiralOriginX, -spiralOriginY);
        ctx.drawImage(spiralSVG, 0, 0, wW, wW * goldenRatio);
      };

      drawLine(0);

      var animate = function animate() {
        rotate++;
        if (rotate > chgInt * 3) {
          rotate = 0;
          chooseSpiralSource(0);
        } else if (rotate > chgInt * 2) {
          chooseSpiralSource(2);
        } else if (rotate > chgInt * 1 && rotate < chgInt * 2) {
          chooseSpiralSource(1);
        }
        drawLine(spiralSpeed);
      };

      // canvas spiral animation controll. ignores r key for 'reset'
      win.on('wheel keydown click touchmove', function (e) {
        if (shouldAnimate && e.keyCode !== 82) {
          animate();
        }
      }

      // wheel navigation
      );win.on('wheel', function (e) {
        var dY = e.originalEvent.deltaY;
        if (dY > 0) {
          currentSection--;
        } else if (dY < 0) {
          currentSection++;
        }
        updateSpiral();
      }

      // arrow key navigation
      );window.addEventListener('keydown', function (e) {
        if (e.keyCode === 38 || e.keyCode === 39) {
          currentSection++;
          updateSpiral();
        } else if (e.keyCode === 37 || e.keyCode === 40) {
          currentSection--;
          updateSpiral();
        } else if (e.keyCode === 82) {
          currentSection = 0;
          updateSpiral();
        }
      }

      // touch scroll navigation
      );window.addEventListener('touchstart', function (e) {
        var touch = e.touches[0] || e.changedTouches[0];
        moved = 0;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      });
      window.addEventListener('touchmove', function (e) {
        var touch = e.touches[0] || e.changedTouches[0];
        moved = (touchStartY - touch.clientX + touchStartX - touch.clientY) * 3;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        rotation += moved / -10;
        if (rotation > 50) {
          currentSection--;
          rotation = 0;
          updateSpiral();
        } else if (rotation < -50) {
          currentSection++;
          rotation = 0;
          updateSpiral();
        }
      });

      sections.each(function (i) {
        $(sections[i]).on('click', function (e) {
          if (currentSection !== i) {
            currentSection = i;
            updateSpiral();
          }
        });
      });
    };

    var limitNums = function limitNums(num) {
      if (num > 10) {
        do {
          num = num - 10;
        } while (num > 10);
      }
      return num;
    };

    var changeColors = function changeColors(section) {
      ;
      var num = limitNums(section);
      num < 0 ? num = 0 : null;
      var colors = colorSchemes[num];
      document.documentElement.style.setProperty('--gr-bg-color', colors.bg);
      document.documentElement.style.setProperty('--gr-accent-1-color', colors.accent1);
      document.documentElement.style.setProperty('--gr-accent-2-color', colors.accent2);
      document.documentElement.style.setProperty('--gr-text-color', colors.text);
    };

    // prevents strange artifacts when the page is zoomed out
    var trimZoomOut = function trimZoomOut(limit) {
      if (currentSection == -limit + 1) {
        spiral.addClass("hidden");
      }
      if (currentSection >= -limit + 2) {
        spiral.removeClass("hidden");
      }
    };

    var hideBehindCurrent = function hideBehindCurrent() {
      sections.each(function (i) {
        if (i < currentSection - 1) {
          $(sections[i]).css({ 'display': 'none' });
        } else {
          $(sections[i]).css({ 'display': 'flex' });
        }
      });
    };

    var resetCanvas = function resetCanvas() {
      shouldAnimate = false;
      ctx.resetTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, wW, wH);
      rotate = 0;
    };

    // callback function to move to the next or previous section (depending on currentSection)
    var updateSpiral = function updateSpiral() {
      var zoomOutLimit = 12;
      trimZoomOut(zoomOutLimit);
      var inBounds = currentSection > -zoomOutLimit && currentSection < sections.length + 3;
      if (inBounds) {
        if (currentSection < sections.length + 2 && currentSection >= -1) {
          // hide sections after rotation animation. make sure this time matches transition delay set in css on .spiral element
          hideBehindCurrent();
          resetCanvas();
          changeColors(currentSection);
        } else {
          document.documentElement.style.setProperty('--gr-bg-color', '#18121E');
          shouldAnimate = true;
        }
        spiral.css({
          'transform-origin': spiralOriginX + "px " + spiralOriginY + "px",
          'transform': "rotate(" + ~~(-90 * currentSection) + "deg) scale(" + 1 / Math.pow(goldenRatio, currentSection) + ")"
        });
      } else {
        currentSection > 0 ? currentSection-- : currentSection++;
      }
    };

    // generates spiral from all divs with class 'section'
    createSpiral = function createSpiral() {
      var h = void 0;
      var w = void 0;
      if (!landscape) {
        spiralOrigin = wW * (1 - axis) + "px " + wW / goldenRatio * axis + "px";
        h = wW;
        w = h;
        spiral.css({
          'transform-origin': "" + spiralOrigin,
          'backface-visiblity': 'hidden'
        });
      } else {
        spiralOrigin = wW * axis + "px " + wW * goldenRatio * axis + "px";
        h = wW * goldenRatio;
        w = h;
        spiral.css({
          'transform-origin': "" + spiralOrigin,
          'backface-visiblity': 'hidden'
        });
      }
      sections.each(function (i) {
        var myRot = ~~(90 * i);
        var scale = Math.pow(goldenRatio, i);
        $(sections[i]).css({
          'width': "" + w,
          'height': "" + h,
          'transform-origin': "" + spiralOrigin,
          'transform': "rotate(" + myRot + "deg) scale(" + scale + ")"
        });
      });
      changeColors(currentSection);
    };

    // conditions: vertical or horizontal

    // initial rotation & spiral origin change


    var sizeApp = function sizeApp() {
      wW = window.innerWidth;
      wH = window.innerHeight;
      if (wW < wH) {
        landscape = false;
        spiralOriginX = wW * (1 - axis);
        spiralOriginY = wW / goldenRatio * axis;
        canvas.width = wH;
        canvas.height = wH;
      } else {
        landscape = true;
        spiralOriginX = wW * axis;
        spiralOriginY = wW * goldenRatio * axis;
        canvas.width = wW;
        canvas.height = wW;
      }
      createSpiral();
    };

    sizeApp();
    createSpiral();
    animateCanvasSpirals();

    window.addEventListener('resize', sizeApp);
  };
});
'use strict';

angular.module('portfolioApp').service('pulseParticlesService', function () {

    this.bloody = function (canv) {
        //                
        var particleSize = 20,
            particleCount = 110,
            interval = 200,
            W = window.innerWidth,
            H = window.innerHeight,
            ctx = void 0,
            //ctx stands for context and is the "curso" of our canvas element.
        particles = []; //this is an array which will hold our particles Object/Class

        var canvas = canv;
        canvas.width = W;
        canvas.height = H;

        window.addEventListener('resize', function () {
            console.log('resyzed');
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        });

        ctx = canvas.getContext("2d"); // settng the context to 2d rather than the 3d WEBGL
        ctx.globalCompositeOperation = "lighter";
        var mouse = {
            x: 0,
            y: 0,
            rx: 0,
            ry: 0,
            speed: 45,
            delta: 0
        };

        var counter = 0;

        function randomNorm(mean, stdev) {

            return Math.abs(Math.round(Math.random() * 2 - 1 + (Math.random() * 2 - 1) + (Math.random() * 2 - 1)) * stdev) + mean;
        }

        //Setup particle class
        function Particle() {
            //using hsl is easier when we need particles with similar colors
            this.h = parseInt(360, 10);
            this.s = parseInt(55 * Math.random() + 50, 10);
            this.l = parseInt(25 * Math.random() + 50, 10);
            this.a = 0.5 * Math.random();

            this.color = "hsla(" + this.h + "," + this.s + "%," + this.l + "%," + this.a + ")";
            this.shadowcolor = "hsla(" + this.h + "," + this.s + "%," + this.l + "%," + parseFloat(this.a - 0.55) + ")";

            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.direction = {
                "x": -1 + Math.random() * 2,
                "y": -1 + Math.random() * 2
            };
            // this.radius = 9 * ((Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1)+3);
            this.radius = randomNorm(0, particleSize); //PARTICLE SIZE
            this.scale = 0.8 * Math.random() + 0.5;
            this.rotation = Math.PI / 4 * Math.random();

            this.grad = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, 0);
            this.grad.addColorStop(0, this.color);
            this.grad.addColorStop(1, this.shadowcolor);

            this.vx = (2 * Math.random() + 1) * .01 * this.radius;
            this.vy = (2 * Math.random() + 1) * .01 * this.radius;
            this.defaultx = this.vx;
            this.defaulty = this.vy;

            this.speedup = function () {
                this.vx += .1;
                this.vy += .1;
            };

            this.slowdown = function () {
                this.vx -= .02;
                this.vy -= .02;

                if (this.vx < this.defaultx) this.vx = this.defaultx;
                if (this.vy < this.defaulty) this.vy = this.defaulty;
            };

            this.valpha = 0.01 * Math.random() - 0.02;

            this.move = function () {
                this.x += this.vx * this.direction.x;
                this.y += this.vy * this.direction.y;
                this.rotation += this.valpha;
                //this.radius*= Math.abs((this.valpha*0.01+1));
            };
            this.changeDirection = function (axis) {
                this.direction[axis] *= -1;
                this.valpha *= -1;
            };
            this.draw = function () {
                ctx.save();
                ctx.translate(this.x + mouse.rx / -20 * this.radius, this.y + mouse.ry / -20 * this.radius);
                ctx.rotate(this.rotation);
                ctx.scale(1, this.scale);

                this.grad = ctx.createRadialGradient(0, 0, this.radius, 0, 0, 0);
                this.grad.addColorStop(1, this.color);
                this.grad.addColorStop(0, this.shadowcolor);
                ctx.beginPath();
                ctx.fillStyle = this.grad;
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.restore();
            };
            this.boundaryCheck = function () {
                if (this.x >= W * 1.2) {
                    this.x = W * 1.2;
                    this.changeDirection("x");
                } else if (this.x <= -W * 0.2) {
                    this.x = -W * 0.2;
                    this.changeDirection("x");
                }
                if (this.y >= H * 1.2) {
                    this.y = H * 1.2;
                    this.changeDirection("y");
                } else if (this.y <= -H * 0.2) {
                    this.y = -H * 0.2;
                    this.changeDirection("y");
                }
            };
        } //end particle class

        function clearCanvas() {
            ctx.clearRect(0, 0, W, H);
        } //end clear canvas

        function createParticles() {
            for (var i = particleCount - 1; i >= 0; i--) {
                var p = new Particle();
                particles.push(p);
            }
        } // end createParticles

        function drawParticles() {
            for (var i = particleCount - 1; i >= 0; i--) {
                var p = particles[i];
                p.draw();
            }
        } //end drawParticles

        function updateParticles() {
            for (var i = particles.length - 1; i >= 0; i--) {
                var p = particles[i];
                p.move();
                p.boundaryCheck();
            }
        } //end updateParticles

        function heartBeat() {
            counter++;

            if (counter < interval) return;
            if (counter >= interval && counter < interval + 15) {
                for (var i = particleCount - 1; i >= 0; i--) {
                    var p = particles[i];
                    p.speedup();
                }
            } else if (counter >= interval + 15 && counter < interval + 90) {
                for (var _i = particleCount - 1; _i >= 0; _i--) {
                    var _p = particles[_i];
                    _p.slowdown();
                }
            } else {
                counter = 0;
            }
        }

        function initParticleSystem() {
            createParticles();
            drawParticles();
        }

        function animateParticles() {
            clearCanvas();
            heartBeat();
            drawParticles();
            updateParticles();
            requestAnimationFrame(animateParticles);
        }

        initParticleSystem();
        requestAnimationFrame(animateParticles);
    };
});
"use strict";

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("homeCtrl", ["$scope", "$rootScope", "pulseParticlesService", "routeLoadAnimationService", function ($scope, $rootScope, pulseParticlesService, routeLoadAnimationService) {

  pulseParticlesService.bloody(document.querySelector('#cardiac-canvas'));
  routeLoadAnimationService.routeLoadAnimation([$('.top'), $('.bottom')]);
}]);
"use strict";

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("magnifyCtrl", ["$scope", "reusableFuncsService", function ($scope, reusableFuncsService) {

  $scope.textInput;
  $scope.radio1;
  $scope.radio2;
  $scope.checkbox1;
  $scope.checkbox2;
  $scope.checkbox3;

  // VARIABLES
  // ============================================================


  var body = document.querySelector('body');
  var glass = document.querySelector('#magnifying-glass');

  var glassArt = document.querySelector('#magnifying-glass-art');
  var glassArtRim = document.querySelector('#glass-rim');
  var glassArtGlass = document.querySelector('#svg-glass-content');

  var original = document.querySelector('body').children[1];
  // creates a copy of the content to be applied to the magnifying glass div
  var content = document.querySelector('.container1');
  var clone = content.cloneNode(true);
  var zoomed = void 0;

  // note: this may not be cross-browser comptatible
  var pageCenter = {
    w: document.body.scrollWidth / 2,
    h: document.body.scrollHeight / 2
  };

  var scale = 2; // scale is ratio of zoomed and original content
  var glassSize = 600;
  var isMagnifying = false;
  var shiftDown = false;
  var corr = glassSize / 2;
  var artCorr = 31 * scale; // accounts for thickenss of rim on glass artwork


  // FUNCTIONS
  // ============================================================


  function init() {
    glass.style.width = glassArt.style.width = glassSize + 'px';
    glass.style.height = glassArt.style.height = glassSize + 'px';
    glass.style.clipPath = "circle(50% at 50% 50%)";
    glass.style.WebkitClipPath = "circle(50% at 50% 50%)";

    glassArt.style.transformOrigin = "29.0668% 29.0061%";
    glassArt.style.transform = "scale(" + scale + ") translate(" + artCorr + "px, " + artCorr + "px)";

    // applies content copy to magnifying glass div
    glass.append(clone);
    zoomed = glass.children[0];

    // add classnames to differentiate original vs copied elements
    original.className += ' original';
    zoomed.className += ' zoomed';

    zoomed.style.transform = "scale(" + scale + ")";
  }

  function toggleGlass() {
    if (isMagnifying) {
      glassArt.style.display = 'inline';
      glass.style.display = 'inline';
    } else {
      glassArt.style.display = 'none';
      glass.style.display = 'none';
    }
  }

  // event function to move mag-glass around zoomed conten t
  function moveGlass(e) {
    if (shiftDown && isMagnifying) {
      glass.style.cursor = 'none';

      if (pageCenter.w !== document.body.scrollWidth / 2 || pageCenter.h !== document.body.scrollHeight / 2) {
        pageCenter = {
          w: document.body.scrollWidth / 2,
          h: document.body.scrollHeight / 2
        };
      }

      mouse = {
        x: e.pageX,
        y: e.pageY
      };
      var centOffsetX = (scale - 1) * (mouse.x - pageCenter.w) / pageCenter.w * pageCenter.w;
      var centOffsetY = (scale - 1) * (mouse.y - pageCenter.h) / pageCenter.h * pageCenter.h;
      var distFromTop = document.querySelector('body').scrollTop;
      // translate container div mith mouse move
      var divTranslateX = mouse.x - corr;
      var divTranslateY = mouse.y - corr - distFromTop;
      glassArt.style.transform = "scale(" + scale + ") translate(" + (artCorr + divTranslateX / scale) + "px, " + (artCorr + divTranslateY / scale) + "px)";
      glass.style.transform = "translate(" + divTranslateX + "px, " + divTranslateY + "px)";
      // correct container div translations
      // centOffsetX and centOffsetY account for the scaling difference between the original content and the zoom
      // scale maintains scaling of content in magnifying glass
      var glassTranslateX = -mouse.x - centOffsetX + corr;
      var glassTranslateY = -mouse.y - centOffsetY + corr;
      zoomed.style.transform = "translate(" + glassTranslateX + "px, " + glassTranslateY + "px) scale(" + scale + ")";
    } else {
      glass.style.cursor = 'default';
    }
  }

  function resizeGlass() {}

  // EVENT LISTENERS
  // ============================================================


  // initialized on load to prevent position issues with the magnified content
  window.addEventListener('load', init());

  window.addEventListener('resize', function () {
    pageCenter = {
      w: document.body.scrollWidth / 2,
      h: document.body.scrollHeight / 2
    };
  });

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 16) {
      shiftDown = true;
    }
    // keyboard shortcut (ctrl + shift + 'm') to toggle magnifying glass
    if (e.keyCode === 90 & e.shiftKey & e.ctrlKey) {
      isMagnifying = !isMagnifying;
      toggleGlass();
    }
  });

  window.addEventListener('keyup', function (e) {
    if (e.keyCode === 16) {
      shiftDown = false;
    }
  });

  window.addEventListener('mousemove', function (e) {
    moveGlass(e);
  }

  // window.addEventListener('scroll', reusableFuncsService.debounce(() => {
  //   console.log(getComputedStyle(zoomed));
  //   let distFromTop = document.querySelector('body').scrollTop
  //   // zoomed.style.transform = `translate(0px, ${-distFromTop}px) scale(${scale})`
  // }))

  );
}]);
"use strict";
'use strict';

angular.module('portfolioApp').service('weatherApiService', ["$http", "$q", function ($http, $q) {

  var searchedLocation = {};
  var currentLocation = {};

  // gets user location from browser, returns lat & lng
  function getBrowserLocation() {
    var deferred = $q.defer();
    navigator.geolocation.getCurrentPosition(deferred.resolve);
    return deferred.promise;
  }

  // search by lat & lng, return weather data
  function getWeatherData(latitude, longitude) {
    var url = '/api/weather/coords/' + encodeURIComponent(latitude) + '/' + encodeURIComponent(longitude);
    return $http.get(url);
  }

  // search by city or zip, returns coordinates and location name info
  function searchLocationByAddress(address) {
    return $http.get('/api/weather/search?location=' + encodeURIComponent(address));
  }

  // search by coordinates, returns coordinates and location name info
  function getLocationByCoords(latitude, longitude) {
    return $http.get('/api/weather/search?latitude=' + encodeURIComponent(latitude) + '&longitude=' + encodeURIComponent(longitude));
  }

  // Gets coordinates from browser and injects them into location-from-coordinates and weather API calls.
  // If getBrowserLocation API call fails, then return error message to tell controller to bring up prompt to search location

  this.getWeatherDataFromBrowserLocation = function () {
    return getBrowserLocation().then(function (results) {
      console.log(results);
      return $q.all({ weather: getWeatherData(results.coords.latitude, results.coords.longitude), location: getLocationByCoords(results.coords.latitude, results.coords.longitude) }).then(function (apiResults) {
        console.log(apiResults);
        currentLocation.weather = apiResults.weather;
        currentLocation.city = apiResults.location.data.results[0].address_components.city;
        currentLocation.state = apiResults.location.data.results[0].address_components.state;
        return currentLocation;
      });
    });
  };

  // Takes in a "city,state" or "zip-code" search and makes API call to return location info. Corrdinates from results are used to make weather API call.
  // Weather info, city name, and state name are added to a currentLocation object that is passed on to the controller.

  this.searchWeatherAndLocationInfo = function (address) {
    return searchLocationByAddress(address).then(function (location) {
      searchedLocation.city = location.data.results[0].address_components.city;
      searchedLocation.state = location.data.results[0].address_components.state;
      return getWeatherData(location.data.results[0].location.lat, location.data.results[0].location.lng).then(function (weather) {
        searchedLocation.weather = weather;
        return searchedLocation;
      });
    });
  };

  this.checkCachedWeatherData = function () {};
}] //---------------------------------------------------------------------------
);
'use strict';

angular.module('portfolioApp').service('weatherCanvasService', function () {

  var isItRaining = void 0;
  var isItSnowing = void 0;
  var reqR = void 0;
  var reqS = void 0;

  var ctx = document.getElementById('precipCanvas').getContext('2d');

  ctx.canvas.height = window.innerHeight;
  ctx.canvas.width = window.innerWidth * 1.5;
  var w = ctx.canvas.width,
      h = ctx.canvas.height;
  ctx.strokeStyle = '#76b1e2';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';

  //  SERVICE FUNCTIONS
  /////////////////////

  //------------------------------------------------------------------------------
  //            Precipitation Canvas
  //------------------------------------------------------------------------------


  this.setRainBool = function (bool) {
    isItRaining = bool;
  };

  this.setSnowBool = function (bool) {
    isItSnowing = bool;
  };

  this.makeItSnow = function (precipIntensity, windSpeed) {

    var particles = [];
    var snowIntensity = precipIntensity;
    var windySnow = windSpeed;
    var maxParts = snowIntensity * w / 4;
    var shouldAnimate = true;

    function addParticle() {
      var s = Math.random() * 5 + 0.5;
      var x = Math.random() * w;
      var y = 0;
      var xs = Math.random() * 2 - 0.5 + windySnow / 2;
      var ys = Math.random() * 2.5 + 2.5;
      particles.push({ 's': s, 'x': x, 'y': y, 'xs': xs, 'ys': ys });
    }

    function draw() {
      if (particles.length < maxParts) {
        addParticle();
      }
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath
        // arc(x,y,radius,startAndle,endAndle,anticlockwise)
        ();ctx.arc(particles[i].x, particles[i].y, particles[i].s, 0, Math.PI * 2, false);
        ctx.fill();
      }
      move();
    }

    function move() {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (isItSnowing) {
          p.x += p.xs;
          p.y += p.ys;
        }
        if (p.y > h && isItSnowing) {
          p.y = 0;
          p.x = ~~(Math.random() * w) - h / 2;
        }
        if (p.y > h && !isItSnowing || p.x > w && !isItSnowing) {
          p.ys = 0;
          p.y = -5;
        } else if (!isItSnowing) {
          p.ys *= 1.2;
          p.x += p.xs;
          p.y += p.ys;
        }
      }
    }

    function animate() {
      if (!isItSnowing) {
        setTimeout(function () {
          shouldAnimate = false;
          particles = [];
          cancelAnimationFrame(reqS);
          ctx.clearRect(0, 0, w, h);
        }, 500);
      }
      draw();
      if (shouldAnimate) {
        reqS = requestAnimationFrame(animate);
      } else {
        return;
      }
    }

    if (shouldAnimate) {
      animate();
    }
  }; //---------------------------------------------------------------------------


  // Rain function

  this.makeItRain = function (precipIntensity, windSpeed) {
    var windyRain = windSpeed;
    var rainIntensity = precipIntensity;
    var particles = [];
    var maxParts = rainIntensity * w;
    var shouldAnimate = true;

    ctx.lineWidth = 2;

    function addParticle() {
      particles.push({
        x: Math.random() * w,
        y: 0,
        l: Math.random() * 1,
        xs: Math.random() * 2 - 0.5 + windyRain,
        ys: Math.random() * 10 + 50 + rainIntensity * 2
      });
    }

    function draw() {
      if (particles.length < maxParts) {
        addParticle();
      }
      ctx.clearRect(0, 0, w, h);
      for (var c = 0; c < particles.length; c++) {
        var p = particles[c];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
      }
      move();
    }

    function move() {
      for (var b = 0; b < particles.length; b++) {
        var p = particles[b];
        if (isItRaining) {
          p.x += p.xs;
          p.y += p.ys;
        }
        if (p.y > h && isItRaining) {
          p.y = 0;
          p.x = ~~(Math.random() * w) - h / 2;
        }
        if (p.y > h && !isItRaining || p.x > w && !isItRaining) {
          p.ys = 0;
          p.y = -5;
        } else if (!isItRaining) {
          p.ys *= 1.2;
          p.x += p.xs;
          p.y += p.ys;
        }
      }
    }

    function animate() {
      if (!isItRaining) {
        setTimeout(function () {
          shouldAnimate = false;
          particles = [];
          cancelAnimationFrame(reqR);
          ctx.clearRect(0, 0, w, h);
        }, 500);
      }
      draw();
      if (shouldAnimate) {
        reqR = requestAnimationFrame(animate);
      } else {
        return;
      }
    }

    if (shouldAnimate) {
      animate();
    }
  }; //---------------------------------------------------------------------------


  //---------------------------------------------------------------------------
  //                 Stars Canvas
  //---------------------------------------------------------------------------


  // this.twinkleTwinkle = function(isItNight) {
  //
  //   const canvas = document.getElementById('starsCanvas')
  //
  //   canvas.width = window.innerWidth
  //   canvas.height = window.innerHeight
  //
  //   const c = canvas.getContext('2d')
  //   const rand =  function(min,max) {
  //                   return ((Math.random()*(max-min+1))+min)
  //                 }
  //
  //   let cW = canvas.width
  //   let cH = canvas.height
  //
  //   window.addEventListener('resize', function() {
  //     canvas.width = window.innerWidth
  //     canvas.height = window.innerHeight
  //   })
  //
  //
  //   function Star(radius,x,y,opacity,spd) {
  //     this.radius = radius
  //     this.x = x
  //     this.y = y
  //     this.opacity = opacity
  //     this.maxOpacity = opacity
  //     this.minOpacity = rand(0,0.2)
  //     this.spd = spd
  //     this.draw = function() {
  //       c.beginPath()
  //       c.fillStyle = `rgba(255,255,255,${this.opacity})`
  //       c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
  //       c.fill()
  //     }
  //     this.twinkle = function() {
  //       if (this.opacity < 0 || this.opacity > this.maxOpacity) {
  //         this.spd = -this.spd
  //       }
  //       this.opacity -= this.spd
  //       this.draw()
  //     }
  //   }
  //
  //   let totalStars = 300
  //   let starArray = []
  //
  //   for (let i = 0 i < totalStars i++) {
  //     let radius = rand(0.25,1)
  //     let x = rand(radius,cW-radius)
  //     let y = rand(radius,cH-radius)
  //     let opacity = rand(0.4,0.8)
  //     let spd = ((Math.random()+0.1))/50
  //
  //     starArray.push(new Star(radius,x,y,opacity,spd))
  //   }
  //
  //
  //   function animation() {
  //     requestAnimationFrame(animation)
  //     c.clearRect(0,0,cW,cH)
  //
  //     for (let i in starArray) {
  //       starArray[i].twinkle()
  //     }
  //
  //     if (!isItNight) {
  //       setTimeout(function () {
  //         return cancelAnimationFrame(isItNight)
  //       }, 500)
  //     }
  //   }
  //   animation()
  // }
} //-------------------------------------------------------------
);
'use strict';

angular.module('portfolioApp').controller('weatherCtrl', ["$scope", "$location", "weatherService", "weatherApiService", "weatherLogicService", "routeLoadAnimationService", function ($scope, $location, weatherService, weatherApiService, weatherLogicService, routeLoadAnimationService) {

  //------------------------------------------------------------------------------
  //            $scope Variables
  //------------------------------------------------------------------------------

  $scope.fiveDay = false;
  $scope.selectedTime = 0;
  $scope.sideNav = false;

  //------------------------------------------------------------------------------
  //            Route Load Animation
  //------------------------------------------------------------------------------

  routeLoadAnimationService.routeLoadAnimation($('.fade-in'));
  weatherService.routeLoadAnimation
  //-------------------------------------------------------------------
  //            Other Functions
  //--------------------------------------------------------------------


  ();function setWeatherData(data) {
    $scope.currentCity = data.city;
    $scope.currentState = data.state;
    $scope.weather = data.weather.data;
    $scope.hourly = data.weather.data.hourly.data;
    $('#timeSlider').val(0);
    $scope.changeArtwork($scope.selectedTime);
    $scope.artworkTransition();
    localStorage.setItem("results", JSON.stringify(data));
  }

  function checkLocalData() {
    var storedData = JSON.parse(localStorage.getItem("results"));
    if (!storedData) return;
    var cachedTime = storedData.weather.data.currently.time;
    var now = Date.now() / 1000;
    if (now - cachedTime < 3600) {
      setWeatherData(storedData);
    }
  }

  //------------------------------------------------------------------------------
  //            $scope Functions
  //------------------------------------------------------------------------------

  $scope.getWeatherDataFromBrowserLocation = function () {
    weatherApiService.getWeatherDataFromBrowserLocation().then(function (results) {
      setWeatherData(results);
    });
  };

  $scope.searchWeatherAndLocationInfo = function (address) {
    weatherApiService.searchWeatherAndLocationInfo(address).then(function (results) {
      setWeatherData(results);
    });
  };

  // human readable time
  $scope.unixToTime = function (time) {
    var humanDate = new Date(time * 1000);
    return humanDate;
  };

  $scope.artworkTransition = function () {
    $('#artwork-container').removeClass('hidden');
    $('#landing-page-background').addClass('slide-up-animation');
  };

  $scope.changeArtwork = function (inputTime) {
    var time = $scope.hourly[inputTime];
    weatherLogicService.changeArtwork(time);
  };

  $scope.toggleNav = function () {
    if (!$scope.sideNav) {
      $('#side-nav').css({ 'transform': 'translateX(310px)' });
      $('#side-nav-toggle-button').css({ 'transform': 'translateX(280px)', 'background': 'rgba(0,0,0,0)' });
      $('.data-header').css({ 'transform': 'translateY(-250px)' });
    } else {
      $('#side-nav, #side-nav-toggle-button').css({ 'transform': 'translateX(0px) rotateY(180deg)', 'background': 'rgba(0,0,0,0.3)' });
      $('.data-header').css({ 'transform': 'translateY(0px)' });
    }
    $scope.sideNav = !$scope.sideNav;
  };

  checkLocalData();
}] //---------------------------------------------------------------------------------
);
'use strict';

angular.module('portfolioApp').service('weatherLogicService', ["weatherCanvasService", function (weatherCanvasService) {

    //------------------------------------------------------------------------------
    //            Constants
    //------------------------------------------------------------------------------

    var artContainer = $('#artwork-container');
    var mountainSVG = $('#mountainSVG');
    var mountains = $('#mountains');
    var mountainAccents = $('#mountains-accents');
    var mountainLeft = $('#mountain-left');
    var ground = $('#ground');
    var groundAccent = $('#ground-accent');
    var timeSlider = $('#timeSlider');
    var slider = $('.slider');
    var graySkyFilter = $('#gray-sky');
    var precipClouds = $('.precip-cloud');
    var starsCanvas = $('#starsCanvas');
    var pcLeftLarge = $('#precip-cloud-left-large');
    var pcLeftSmall = $('#precip-cloud-left-small');
    var pcRightLarge = $('#precip-cloud-right-large');
    var pcRightSmall = $('#precip-cloud-right-small');
    var pcTop = $('#precip-cloud-top');
    var windPath1 = $('#windPath1');
    var windPath2 = $('#windPath2');
    var windPath3 = $('#windPath3');
    var windPath4 = $('#windPath4');
    var sideNav = $('#side-nav');

    var nightColors = "#ffffff 3%,#e3e5f3 5%,#64676b 8%,#3a3a3a,#282828,#101111";
    var duskColors = '#ffffff 3%,#e3e5f3 5%,#64676b 8%,#414345,#232526,#101111';
    var sunriseColors1 = '#ffdd93 3%,#64676b 8%,#cd82a0,#8a76ab,#3a3a52';
    var sunriseColors2 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#eab0d1,#cd82a0,#7072ab';
    var sunriseColors3 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#a6e6ff,#67d1fb,#eab0d1';
    var dayColors = "rgb(255,194,82) 3%,#e3e5f3 8%,#56CCF2,#4fa9ff,#008be2";
    var sunsetColors1 = 'rgb(255,194,82) 3%,#ffdd93 8%,#90dffe,#38a3d1,#154277';
    var sunsetColors2 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#e38c59,#a33d4b,#46142b';
    var sunsetColors3 = 'rgb(255,194,82) 3%,#e9ce5d 8%,#B7490F,#8A3B12,#2F1107';

    var mountainFillDay = 'hsl(40,54%,35%)';
    var mountainAccentFillDay = 'hsl(40,85%,84%)';
    var groundFillDay = 'hsl(78,60%,42%)';
    var groundAccentFillDay = 'hsl(78,76%,72%)';
    var leftMountainFillDay = 'hsl(41,76%,22%)';

    var mountainFillSunrise3 = '#7f5f4c';
    var mountainAccentFillSunrise3 = '#FFE9AD';
    var groundFillSunrise3 = '#6c8c21';
    var groundAccentFillSunrise3 = '#a5b754';
    var leftMountainFillSunrise3 = '#724f0c';

    var mountainFillSunrise2 = '#704545';
    var mountainAccentFillSunrise2 = '#ffa100';
    var groundFillSunrise2 = '#af7700';
    var groundAccentFillSunrise2 = '#2e3a30';
    var leftMountainFillSunrise2 = '#333333';

    var mountainFillSunrise1 = '#5b3734';
    var mountainAccentFillSunrise1 = '#aa4419';
    var groundFillSunrise1 = '#50450b';
    var groundAccentFillSunrise1 = '#2e3a30';
    var leftMountainFillSunrise1 = '#333333';

    var mountainFillSunset1 = '#7f5f4c';
    var mountainAccentFillSunset1 = '#FFE9AD';
    var groundFillSunset1 = '#6c8c21';
    var groundAccentFillSunset1 = '#a5b754';
    var leftMountainFillSunset1 = '#724f0c';

    var mountainFillSunset2 = '#704545';
    var mountainAccentFillSunset2 = '#ffa100';
    var groundFillSunset2 = '#af7700';
    var groundAccentFillSunset2 = '#2e3a30';
    var leftMountainFillSunset2 = '#333333';

    var mountainFillSunset3 = '#5b343a';
    var mountainAccentFillSunset3 = '#aa4419';
    var groundFillSunset3 = '#50450b';
    var groundAccentFillSunset3 = '#2e3a30';
    var leftMountainFillSunset3 = '#333333';

    var mountainFillNight = 'hsl(278,7%,16%)';
    var mountainAccentFillNight = 'hsl(279,6%,12%)';
    var groundFillNight = 'hsl(130,11%,22%)';
    var groundAccentFillNight = 'hsl(130,6%,10%)';
    var leftMountainFillNight = 'hsl(0,0%,10%)';

    //-------------------------------------------------------------------
    //            Weather State Variables
    //--------------------------------------------------------------------

    var isItRaining = false;
    var isItSnowing = false;
    var precipCloudsShown = false;
    var isItNight = false;
    var stars = false;

    //------------------------------------------------------------------------------
    //            Functions
    //------------------------------------------------------------------------------

    // time to hours in integers
    var unixTo24Hour = function unixTo24Hour(time) {
        var hours = new Date(time * 1000).getHours();
        return hours;
    };

    var findSunPosition = function findSunPosition(time) {
        var stateByTime = {
            '0': [30, 25, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '1': [50, 20, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '2': [70, 25, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '3': [85, 40, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '4': [100, 80, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '5': [50, 420, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '6': [0, 270, sunriseColors1, mountainFillSunrise1, mountainAccentFillSunrise1, groundFillSunrise1, groundAccentFillSunrise1, leftMountainFillSunrise1, stars = true],
            '7': [8, 69, sunriseColors2, mountainFillSunrise2, mountainAccentFillSunrise2, groundFillSunrise2, groundAccentFillSunrise2, leftMountainFillSunrise2, stars = true],
            '8': [16, 39, sunriseColors3, mountainFillSunrise3, mountainAccentFillSunrise3, groundFillSunrise3, groundAccentFillSunrise3, leftMountainFillSunrise3, stars = true],
            '9': [25, 20, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '10': [33, 14, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '11': [41, 11, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '12': [50, 10, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '13': [58, 11, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '14': [66, 14, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '15': [75, 20, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '16': [83, 28, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '17': [91, 38, dayColors, mountainFillDay, mountainAccentFillDay, groundFillDay, groundAccentFillDay, leftMountainFillDay, stars = true],
            '18': [100, 60, sunsetColors1, mountainFillSunset1, mountainAccentFillSunset1, groundFillSunset1, groundAccentFillSunset1, leftMountainFillSunset1, stars = true],
            '19': [100, 120, sunsetColors2, mountainFillSunset2, mountainAccentFillSunset2, groundFillSunset2, groundAccentFillSunset2, leftMountainFillSunset2, stars = true],
            '20': [100, 270, sunsetColors3, mountainFillSunset3, mountainAccentFillSunset3, groundFillSunset3, groundAccentFillSunset3, leftMountainFillSunset3, stars = true],
            '21': [50, 420, duskColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '22': [0, 120, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '23': [15, 40, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
            '24': [30, 25, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true]
        };
        return stateByTime[time];
    };

    //------------------------------------------------------------------------------
    //            Time Change Animation
    //------------------------------------------------------------------------------

    // all animations generated in this.changeArtwork() will be added to this timeline
    var tlHourChange = new TimelineMax();
    tlHourChange.add('initial'

    //-------------------------------------------------------------------
    //            Service Functions
    //--------------------------------------------------------------------

    // Main artwork changing function

    );this.changeArtwork = function (selectedTime) {

        // Set variables for function

        var current = selectedTime;
        var time = unixTo24Hour(current.time) ? unixTo24Hour(current.time) : 0;
        var config = findSunPosition(time);
        var transTime = 0.3;
        var moveClouds = function moveClouds() {
            var tlCloudMovement = new TimelineMax();
            tlCloudMovement.add('initial');
            tlCloudMovement.to(pcLeftLarge, 100 / current.windSpeed, {
                x: "0vw",
                repeat: -1,
                yoyo: true
            }, 'initial').to(pcLeftSmall, 500 / current.windSpeed, {
                x: "150vw",
                repeat: -1,
                yoyo: true
            }, 'initial').to(pcRightLarge, 100 / current.windSpeed, {
                x: "100vw",
                repeat: -1,
                yoyo: true
            }, 'initial').to(pcRightSmall, 300 / current.windSpeed, {
                x: "250vw",
                repeat: -1,
                yoyo: true
            }, 'initial');
        };
        var updateWeatherBools = function updateWeatherBools(rain, snow) {
            isItRaining = rain;
            isItSnowing = snow;
            weatherCanvasService.setRainBool(rain);
            weatherCanvasService.setSnowBool(snow);
        };

        // Toggle stars if it is night

        if (!isItNight) {
            if (time > 20) {
                isItNight = true;
                // weatherCanvasService.twinkleTwinkle(isItNight)
                tlHourChange.from(starsCanvas, transTime, {
                    opacity: 0
                }, 'initial');
            }
        } else if (isItNight) {
            if (time > 6 && time < 21) {
                isItNight = false;
                // weatherCanvasService.twinkleTwinkle(isItNight)
            }
        }

        // Toggle rain or snow depending on conditions

        if (!current.icon.includes('snow') && isItSnowing || !current.icon.includes('rain') && isItRaining) {
            updateWeatherBools(false, false);
        }

        if (current.icon.includes('snow')) {
            if (!isItSnowing) {
                updateWeatherBools(false, true);
                weatherCanvasService.makeItSnow(current.precipIntensity, current.windSpeed);
            }
        } else if (current.icon.includes('rain')) {
            if (!isItRaining) {
                updateWeatherBools(true, false);
                weatherCanvasService.makeItRain(current.precipIntensity, current.windSpeed);
            }
        }

        // Toggle gray sky background if it is raining, snowing, or cloud cover is over 75%
        if (current.cloudCover > 0.65 || current.precipIntensity > 0.25) {
            if (21 <= time || time < 6) {
                tlHourChange.to(graySkyFilter, transTime, {
                    opacity: 1,
                    backgroundImage: 'linear-gradient(0, #666, #444)'
                }, 'initial').to(mountainSVG, transTime, {
                    filter: 'grayscale(40%)'
                }, 'initial');
            } else if (21 > time || time >= 6) {
                tlHourChange.to(graySkyFilter, transTime, {
                    opacity: 1,
                    backgroundImage: 'linear-gradient(0, #ccc, #aaa)'
                }, 'initial').to(mountainSVG, transTime, {
                    filter: 'grayscale(40%)'
                }, 'initial');
            }
        } else {
            tlHourChange.to(graySkyFilter, transTime, {
                opacity: 0
            }, 'initial').to(mountainSVG, transTime, {
                filter: 'grayscale(0%)'
            }, 'initial');
        }

        // Show top rain cloud if it is raining or snowing

        if (isItRaining || isItSnowing) {
            tlHourChange.to(pcTop, transTime, {
                opacity: 1
            }, 'initial');
        } else if (!isItRaining && !isItSnowing) {
            tlHourChange.to(pcTop, transTime, {
                opacity: 0
            }, 'initial');
        }

        // Show background precipitation clouds if it is raining, snowing, or if the cloud cover is greater than 50%
        // if (!precipCloudsShown) {
        if (current.cloudCover > 0.05 && current.cloudCover < 0.25) {
            tlHourChange.to(pcLeftSmall, transTime, {
                opacity: 1
            }, 'initial').to(pcLeftLarge, transTime, {
                opacity: 0
            }, 'initial').to(pcRightLarge, transTime, {
                opacity: 0
            }, 'initial').to(pcRightSmall, transTime, {
                opacity: 0,
                onComplete: moveClouds
            }, 'initial');
        } else if (current.cloudCover >= 0.25 && current.cloudCover < 0.5) {
            tlHourChange.to(pcLeftSmall, transTime, {
                opacity: 1
            }, 'initial').to(pcRightSmall, transTime * 0.8, {
                opacity: 1
            }, 'initial').to(pcLeftLarge, transTime * 1.5, {
                opacity: 0
            }, 'initial').to(pcRightLarge, transTime * 2.1, {
                opacity: 0,
                onComplete: moveClouds
            }, 'initial');
        } else if (current.cloudCover >= 0.5 && current.cloudCover < 0.65) {
            tlHourChange.to(pcLeftSmall, transTime, {
                opacity: 1
            }, 'initial').to(pcRightSmall, transTime * 1.2, {
                opacity: 1
            }, 'initial').to(pcLeftLarge, transTime * 1.3, {
                opacity: 1
            }, 'initial').to(pcRightLarge, transTime * 1.7, {
                opacity: 0,
                onComplete: moveClouds
            }, 'initial');
        } else if (current.cloudCover > 0.65 || isItRaining || isItSnowing) {
            tlHourChange.to(pcLeftLarge, transTime, {
                opacity: 1
            }, 'initial').to(pcLeftSmall, transTime * 1.1, {
                opacity: 1
            }, 'initial').to(pcRightLarge, transTime * 1.4, {
                opacity: 1
            }, 'initial').to(pcRightSmall, transTime * 2.5, {
                opacity: 1,
                onComplete: moveClouds
            }, 'initial'
            // }
            );
        } else if (!isItRaining && !isItSnowing) {
            if (current.cloudCover < 0.5) {
                tlHourChange.to([pcLeftLarge, pcLeftSmall], transTime, {
                    opacity: 1
                }, 'initial').to([pcRightSmall, pcRightLarge], transTime, {
                    opacity: 1,
                    onComplete: moveClouds
                }, 'initial');
            }
        }

        // Add wind if windSpeed > 2mph. Animation speed is determined by wind speed

        if (current.windSpeed >= 3) {

            var rand = function rand(range, min) {
                return ~~(Math.random() * range + min);
            };

            tlHourChange.set(windPath1, {
                strokeWidth: "0.1%",
                strokeDasharray: '200 7000',
                strokeDashoffset: '7000',
                animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear reverse infinite'
            }, 'initial');
            tlHourChange.set(windPath3, {
                strokeWidth: "0.1%",
                strokeDasharray: '200 5000',
                strokeDashoffset: '5000',
                animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear reverse infinite'
            }, 'initial');
            tlHourChange.set(windPath2, {
                strokeWidth: "0.1%",
                strokeDasharray: '150 7000',
                strokeDashoffset: '7000',
                animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear forwards infinite'
            }, 'initial');
            tlHourChange.set(windPath4, {
                strokeWidth: "0.1%",
                strokeDasharray: '150 5000',
                strokeDashoffset: '5000',
                animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear forwards infinite'
            }, 'initial');
        } else if (current.windSpeed < 3) {
            tlHourChange.set([windPath1, windPath2, windPath3, windPath4], {
                strokeWidth: 0
            }, 'initial');
        }

        // Change sun/moon position and colors of artwork

        tlHourChange.to(artContainer, transTime, {
            ease: Linear.easeNone,
            backgroundImage: 'radial-gradient(circle at ' + config[0] + '% ' + config[1] + '%, ' + config[2]
        }, 'initial').to(mountains, transTime, {
            ease: Linear.easeNone,
            fill: config[3]
        }, 'initial').to(mountainAccents, transTime, {
            ease: Linear.easeNone,
            fill: config[4]
        }, 'initial').to(ground, transTime, {
            ease: Linear.easeNone,
            fill: config[5]
        }, 'initial').to(groundAccent, transTime, {
            ease: Linear.easeNone,
            fill: config[6]
        }, 'initial').to(mountainLeft, transTime, {
            ease: Linear.easeNone,
            fill: config[7]
        }, 'initial');

        tlHourChange = new TimelineMax();
    };
}] //--------------------------------------------------------------
);
'use strict';

angular.module('portfolioApp').service('weatherService', function () {

    this.routeLoadAnimation = function () {

        var landingBgImage = new Image();
        landingBgImage.src = './app/routes/weather-app/images/bg.jpg';
        landingBgImage.onload = function () {
            var landingBg = $('#landing-page-background');
            TweenMax.from(landingBg, 3, {
                opacity: 0
            });
            landingBg.css({
                'background': 'url(\'./app/routes/weather-app/images/bg.jpg\')',
                'background-size': 'cover'
            }
            // cb()
            );
        };
    };
});