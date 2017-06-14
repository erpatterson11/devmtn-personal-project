// CONFIG
  // ============================================================
  angular.module("portfolioApp",['ui.router', 'ngAnimate']).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    // INITILIZE STATES
    // ============================================================
    $stateProvider
      // HOME STATE
      .state('home', {
        url: '/',
        templateUrl: 'app/routes/home/homeTmpl.html',
        controller: 'homeCtrl'
      })
      .state('golden-ratio', {
        url: '/golden-ratio',
        templateUrl: 'app/routes/golden-ratio-site/goldenRatioTmpl.html',
        controller: 'goldenRatioCtrl'
      })
      .state('magnify', {
        url: '/magnify',
        templateUrl: 'app/routes/magnifying-glass-site/magnifyTmpl.html',
        controller: 'magnifyCtrl'
      })
      .state('galaxy-strike', {
        url: '/galaxy-strike',
        templateUrl: 'app/routes/game/gameTmpl.html',
        controller: 'gameCtrl'
      })
      .state('weather', {
        url: '/weather',
        templateUrl: 'app/routes/weather-app/weatherTmpl.html',
        controller: 'weatherCtrl'
      })

    // ASSIGN OTHERWISE
    // ============================================================
    $urlRouterProvider.otherwise('/')
  }]);

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("mainCtrl", ["$scope", "mainService", "reusableFuncsService", function($scope, mainService, reusableFuncsService) {



}]);

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("mainService", ["$http", function($http) {



  this.toggleNavBar = function() {
    const navbar = document.querySelector('#main-nav')
    let didScroll = false
    let lastScrollTop = 0
    let delta = 5
    let navHeight = navbar.style.height

    window.addEventListener('scroll', () => {
      didScroll = true
    })

    setInterval(() => {
      if (didScroll) {
        scroll()
        didScroll = false
      }
    }, 100)

    function scroll() {
      let currentPos = window.scrollY
      if (Math.abs(lastScrollTop - currentPos) <= delta) {
        return
      }
      if (currentPos > lastScrollTop && currentPos > navHeight) {
        navbar.style.top = `-60px`
        // navbar.style.top = `-${getComputedStyle(navbar).height}`
      } else {
        if (currentPos < lastScrollTop) {
        navbar.style.top = '0px'
        }
      }
      lastScrollTop = currentPos
    }
  }


}]);

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("reusableFuncsService", ["$http", function($http) {

  this.debounce = (func) => {
      let timeout
      let wait = 10
      let immediate = true
      return function() {
        let context = this, args = arguments
        let later = function() {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        let callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) {
          func.apply(context, args)
        }
      }
    }

}]);

angular.module("portfolioApp").controller("gameCtrl", ["$scope", "$timeout", "scoreService", "gameService", function($scope, $timeout, scoreService, gameService) {

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
    $scope.showGuestNicknameEntry()
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
      $scope.getDbScores()
    })
    }
  }

}]);

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("gameService", function() {


// note: there is a getScore function attached to the service
//       it is declared after the game code


  // GAME CODE
  //==============================================================


  //========================== Custom Functions ================================

  function random(min, max) {
      return (Math.random() * (max - min)) + min
  }

  //========================== Target DOM Elements ================================

  const gameCanvas = document.querySelector('#gameCanvas')
  const bgCanvas = document.querySelector('#bgCanvas')
  const explosionCanvas = document.querySelector('#explosionCanvas')


  const canvasContainer = document.querySelector('.canvas-container')
  const statsBar = document.querySelector('#stats-bar')

  const startScreen = document.querySelector('#start-screen')
  const gameOverScreen = document.querySelector('#game-over-screen')
  const healthBarFill = document.querySelector('#health-bar-fill')
  const healthText = document.querySelector('#health-text')
  const scoreText = document.querySelector('#score')

  const startButton = document.querySelector('#start-button')
  const restartButton = document.querySelectorAll('.restart-button')
  const submitScoreButton = document.querySelector('#submit-score')
  const pauseButton = document.querySelector('#pause-button')
  const muteButton = document.querySelector('#mute-button')

  const speakerIcon = document.querySelector('#speaker-icon')
  const playPauseIcon = document.querySelector('#play-pause-icon')
  const gameControllerIcon = document.querySelector('#game-controller-icon')

  const controlsTooltip = document.querySelector('#controls-tooltip')

  const scoreSubmissionBox = document.querySelector('#score-submission-box')
  const closeContentIcon = document.querySelector('#content-close-icon')
  const guestButton = document.querySelector('#guest-login-button')
  const customLoginForm = document.querySelector('#custom-login')
  const finalScoreText = document.querySelector('#final-score-text')

  //========================== Canvas SetUp ================================

  let gameAspect = 1200 / 780
  let screenW = window.innerWidth
  let screenH = window.innerHeight
  let userAspect = screenW / screenH

  let cW = gameCanvas.width = 900
  let cH = gameCanvas.height = 600

  canvasContainer.style.width = statsBar.style.width = `${cW}px`
  canvasContainer.style.height = statsBar.style.height = `${cH}px`

  let ctx = gameCanvas.getContext('2d')

  //========================== Background Canvas Setup ================================

  bgCanvas.width = gameCanvas.width
  bgCanvas.height = gameCanvas.height

  let bgCtx = bgCanvas.getContext('2d')

  //========================== Explosion Canvas Setup ================================

  explosionCanvas.width = gameCanvas.width
  explosionCanvas.height = gameCanvas.height

  let explCtx = explosionCanvas.getContext('2d')

  //========================== Image Repo ================================

  const images = new function() {
      this.spaceship = new Image()
      this.bullet = new Image()
      this.enemy = new Image()
      this.enemyBullet = new Image()
      this.explosion = new Image()
      this.bg = new Image()
      this.bg2 = new Image()
      this.powerup1 = new Image()
      this.powerup2 = new Image()
      this.powerup3 = new Image()

      this.spaceship.src = 'app/routes/game/media/img/ship.png'
      this.bullet.src = 'app/routes/game/media/img/bullet.png'
      this.enemy.src = 'app/routes/game/media/img/enemy.png'
      this.enemyBullet.src = 'app/routes/game/media/img/bullet_enemy.png'
      this.explosion.src ='app/routes/game/media/img/explosion.png'
      this.bg.src = 'app/routes/game/media/img/spr_stars01.png'
      this.bg2.src = 'app/routes/game/media/img/spr_stars02.png'
      this.powerup1.src = 'app/routes/game/media/img/powerup1.png'
      this.powerup2.src = 'app/routes/game/media/img/powerup2.png'
      this.powerup3.src = 'app/routes/game/media/img/powerup3.png'
  }

  //========================== Spritesheet Repo ================================

  const spriteRepo = new function() {
    this.explosion = new Image()
    this.explosion2 = new Image()

    this.explosion.src = "app/routes/game/media/img/explosion.png"
    this.explosion2.src = "app/routes/game/media/img/explosion-2.png"
  }

  //========================== Audio Repo ================================

  const audio = new function() {
    this.laser1 = new Audio()
    this.laser2 = new Audio()
    this.laser3 = new Audio()
    this.explosion = new Audio()

    this.laser1.src = 'app/routes/game/media/audio/laser.wav'
    this.laser2.src = 'app/routes/game/media/audio/turret-1.wav'
    this.laser3.src = 'app/routes/game/media/audio/wlkrsht2.wav'
    this.explosion.src = 'app/routes/game/media/audio/explosion.wav'

    this.laser1.volume = 0.75
    this.laser2.volume = 0.5
    this.laser3.volume = 0.5
  }

  //========================== Player Movement Logic ================================

  // object to relate keycodes to keyname
  const KeyCodes = {
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
  }

  // generate object to store status of each key
  // initialize status of all pressed keys to false
  const KeyStatus = {}
  for (code in KeyCodes) {
      KeyStatus[KeyCodes[code]] = false
  }

  // listener to change key status to true when key is pressed
  document.onkeydown = (e) => {
      let currCode = (e.keyCode) ? e.keyCode : e.charCode
      if (KeyCodes[currCode]) {
          KeyStatus[KeyCodes[currCode]] = true;
      }
  }

  // listener to change key status to false when key is release
  document.onkeyup = (e) => {
      e.preventDefault()
      let currCode = (e.keyCode) ? e.keyCode : e.charCode
      if (KeyCodes[currCode]) {
          KeyStatus[KeyCodes[currCode]] = false;
      }
  }

  //====================================================================

  //                          Factory Functions

  //====================================================================


  //========================== Re-usable Factory Functions ================================

    const BulletPoolFactory = (max, speed, image) => {
      let arr = []
      for (let i = 0; i < max; i++) {
        let bullet = {
            alive: false,
            x: -100,
            y: -100,
            speed: speed,
            img: image
        }
        arr.push(bullet)
      }
      return arr
    }

    const DrawObject = (obj, callback) => {
      callback(obj)
      ctx.drawImage(obj.img, obj.x, obj.y)
    }

    const NewPowerupFactory = (image, interval) => {
      return {
          alive: false,
          x: -10,
          y: -10,
          dx: -1,
          dy: 2,
          img: image,
          interval: interval
      }
    }

    const DrawSpriteFactory = (sprite, totalFrames, frameRate) => {
        let sp = sprite
        sp.count = 0
        let isAnimating = true
        let currentFrame = 0
        let frameWidth = sp.width/totalFrames
        let frameSpeed = frameRate/100

        let updateSprite = () => {
            sp.count++
            if (sp.count >= frameSpeed) {
              sp.count = 0
              currentFrame++
              if (currentFrame >= totalFrames) {
                isAnimating = false
                currentFrame = 0
              }
            }
          }

        let drawSprite = (x, y) => {
           explCtx.drawImage(sp,frameWidth*currentFrame,0,frameWidth,sp.height,x,y,frameWidth,sp.height)
          }

          let explReq

        const animateSprite = (x, y) => {
           explCtx.clearRect(0,0,cW,cH)
           updateSprite()
           drawSprite(x, y)
           if (isAnimating) {
             explReq = requestAnimationFrame(animateSprite)
           } else {
             cancelAnimationFrame(explReq)
             isAnimating = true
           }
        }

        return {
          draw: animateSprite
        }
    };

    //========================== Draw BackgroundFactory ================================

    const BackgroundAnimateFactory = () => {
      let current = 0

      let drawBackground = () => {
        bgCtx.clearRect(0,0,cW,cH)
        bgCtx.drawImage(images.bg,current*2,0,cW, cH)
        bgCtx.drawImage(images.bg,cW+current*2,0,cW,cH)
        bgCtx.drawImage(images.bg2,current,0,cW, cH)
        bgCtx.drawImage(images.bg2,cW+current,0,cW,cH)
        moveBackground()
      }

      let moveBackground = () => {
        current--
        if (current < -cW) {
          current = 0
        }
      }

      return {
        draw: drawBackground
      }
    }


  //========================== Player Factory ================================


  const PlayerFactory = () => {
    let player = {
        x: 10,
        y: cH/2,
        width: images.spaceship.width,
        height: images.spaceship.height,
        img: images.spaceship,
        speed: 7,
        health: 10,
        maxHealth: 10
        }

    healthText.innerText = `Health: ${100*player.health/player.maxHealth}%`
    healthBarFill.style.width = '0%'

    const updateHealth = (num) => {
      player.health += num
      healthText.innerText = `Health: ${100*player.health/player.maxHealth}%`
      healthBarFill.style.width = `${100-(100*player.health/player.maxHealth)}%`
    }

    const getPlayerInfo = () => {
      return player
    }

    let movePlayer = () => {
        if (KeyStatus.left) {
            player.x -= player.speed
            player.x <= 0 ? player.x = 0 : null
        }
        if (KeyStatus.right) {
            player.x += player.speed
            player.x >= (cW - player.width) ? player.x = cW - player.width : null
        }
        if (KeyStatus.up) {
            player.y -= player.speed
            player.y <= 0 ? player.y = 0 : null
        }
        if (KeyStatus.down) {
            player.y += player.speed
            player.y >= (cH - player.height) ? player.y = cH - player.height : null
        }
    }

    const drawPlayer = () => {
      DrawObject(player,movePlayer)
    }

    return {
      changeHealth: updateHealth,
      get: getPlayerInfo,
      draw: drawPlayer
    }
  };


  //========================== Player Bullet Factory ================================


  const PlayerBulletFactory = () => {
    let bulletParams = {
      maxBullets: 100,
      bulletSpeed: 15,
      fireRate: 200,
      lastFire: Date.now(),
      powerup: false
    }

    let bulletPool = BulletPoolFactory(bulletParams.maxBullets,bulletParams.bulletSpeed,images.bullet)

    let moveBullet = (b) => {
      b.x += b.speed
      if (b.x >= cW) {
        b.alive = false
        Score.change(-1)
      }
    }

    let fireOne = (player, fireRate) => {
      bulletParams.fireRate = fireRate
      let b = bulletPool[ 0]
      if (!b.alive) {
        audio.laser1.currentTime=0;
        audio.laser1.play()
        b.alive = true
        b.x = player.x + player.width
        b.y = player.y + player.height / 2
        bulletPool.push(bulletPool.shift())
      }
    }

    let fireTwo = (player, fireRate) => {
      bulletParams.fireRate = fireRate
      let b = bulletPool[0]
      if (!b.alive) {
        audio.laser1.currentTime=0;
        audio.laser1.play()
        b.alive = true
        b.x = player.x + player.width
        b.y = player.y + player.height * 0.25
        bulletPool.push(bulletPool.shift())
      }
      let bn = bulletPool[0]
      if (!bn.alive) {
        audio.laser2.currentTime=0;
        audio.laser2.play()
        bn.alive = true
        bn.x = player.x + player.width
        bn.y = player.y + player.height * 0.75
        bulletPool.push(bulletPool.shift())
      }
    }

    let fireFour = (player, fireRate) => {
      bulletParams.fireRate = fireRate
      let b = bulletPool[0]
      if (!b.alive) {
        audio.laser1.currentTime=0;
        audio.laser1.play()
        b.alive = true
        b.x = player.x + player.width
        b.y = player.y + player.height * 0.25
        bulletPool.push(bulletPool.shift())
      }
      let bn = bulletPool[0]
      if (!bn.alive) {
        audio.laser2.currentTime=0;
        audio.laser2.play()
        bn.alive = true
        bn.x = player.x + player.width
        bn.y = player.y + player.height * 0.75
        bulletPool.push(bulletPool.shift())
      }
      let by = bulletPool[0]
      if (!by.alive) {
        audio.laser3.currentTime=0;
        audio.laser3.play()
        by.alive = true
        by.x = player.x + player.width
        by.y = player.y
        bulletPool.push(bulletPool.shift())
      }
      let bz = bulletPool[0]
      if (!bz.alive) {
        bz.alive = true
        bz.x = player.x + player.width
        bz.y = player.y + player.height
        bulletPool.push(bulletPool.shift())
      }
    }

    const drawBullets = () => {
      for (var i = 0; i < bulletPool.length; i++) {
        let b = bulletPool[i]
        if (b.alive) {
          DrawObject(b,moveBullet)
        }
      }
    }

    const shootBullets = (player, index) => {
      if(KeyStatus.space) {
        let now = Date.now()
        let dif = now - bulletParams.lastFire
        if (dif >= bulletParams.fireRate) {
          bulletParams.lastFire = now
          if (KeyStatus.space) {
            if (index>2) {
              fireFour(player, 100)
            } else if (index > 1) {
              fireFour(player, 200)
            } else if (index > 0) {
              fireTwo(player, 200)
            } else {
              fireOne(player, 200)
            }
          }
        }
      }
    }

    const updateBulletSpeed = (num) => {
      for (let i = 0; i < bulletPool.length; i++) {
        bulletPool[i].speed = num
      }
    }

    const accessPool = () => {
      return bulletPool
    }

    return {
      draw: drawBullets,
      shoot: shootBullets,
      changeBulletSpeed: updateBulletSpeed,
      get: accessPool
    }
  };

  //========================== Enemy Factory ================================

  const EnemyFactory = () => {
    let enemyPool = []
    let maxEnemies = 20
    let speed = {
      low: 0.5,
      high: 2
    }
    let chance = {
      low: 0.005,
      high: 0.05
    }
    let enemyLives = 3

    // automatically generate enemies when factory is run
      for (let i = 0; i < maxEnemies; i++) {
        let enemy = {
            alive: true,
            x: random(cW, cW*1.5),
            y: random(0, cH - images.enemy.height),
            speed: random(speed.low,speed.high),
            chance: random(chance.low, chance.high),
            life: enemyLives,
            img: images.enemy
        }
        enemyPool.push(enemy)
      }

    let moveEnemy = (e) => {
      e.x -= e.speed
      e.x <= 0 ? e.x = random(cW, cW*1.5) : null
    }

    const shootBullets = () => {
      for (let i = 0; i < enemyPool.length; i++) {
        let e = enemyPool[i]
        let chance = random(0,50)
        if (chance < e.chance) {
          return e
        }
      }
    }

    const spawnEnemies = () => {
      for (let i = 0; i < enemyPool.length; i++) {
          enemyPool[i].alive = true
      }
    }

    const drawEnemies = () => {
      for (var i = 0; i < enemyPool.length; i++) {
        let e = enemyPool[i]
        if (e.alive) {
          DrawObject(e,moveEnemy)
        }
      }
    }

    const accessPool = () => {
      return enemyPool
    }

    return {
      spawnEnemies: spawnEnemies,
      shoot: shootBullets,
      draw: drawEnemies,
      get: accessPool
    }
  };


  //========================== Enemy Bullet Factory ================================

  const EnemyBulletFactory = () => {
    let bulletParams = {
      maxBullets: 100,
      bulletSpeed: 15,
    }

    let enemyBulletPool = BulletPoolFactory(bulletParams.maxBullets,bulletParams.bulletSpeed,images.enemyBullet)

    let moveEnemyBullet = (b) => {
      b.x -= b.speed
      b.x <= 0 - b.img.width ? b.alive = false : null
    }

    const drawEnemyBullets = () => {
      for (var i = 0; i < enemyBulletPool.length; i++) {
        let b = enemyBulletPool[i]
        if (b.alive) {
          DrawObject(b,moveEnemyBullet)
        }
      }
    }

    const shootBullets = (e) => {
      let b = enemyBulletPool[0]
      if (!b.alive && e) {
          b.alive = true
          b.x = e.x + e.img.width
          b.y = e.y + e.img.height / 2
          enemyBulletPool.push(enemyBulletPool.shift())
      }
    }

    const updateBulletSpeed = (num) => {
      for (let i = 0; i < enemyBulletPool.length; i++) {
        enemyBulletPool[i].speed = num
      }
    }

    const accessPool = () => {
      return enemyBulletPool
    }

    return {
      draw: drawEnemyBullets,
      shoot: shootBullets,
      updateBulletSpeed: updateBulletSpeed,
      get: accessPool
    }
  };


  //========================== Powerup Factory ================================

  const PowerupFactory = () => {

    let powerup1 = NewPowerupFactory(images.powerup1, 10)
    let powerup2 = NewPowerupFactory(images.powerup2, 15)
    let powerup3 = NewPowerupFactory(images.powerup3, 20)
    let powerup4 = powerup3

    let powerupPool = [powerup1,powerup2,powerup3, powerup4]
    let index = 0
    let lastPowerup = Date.now()

    const getPowerups = () => {
      return powerupPool
    }

    const getIndex = () => {
      return index
    }

    const activatePowerup = (powerup) => {
      ctx.clearRect(powerup.x-2,powerup.y-2,powerup.img.width+2,powerup.img.height+2)
      powerup.x = cW + 100
      powerup.y = random(0, cH - powerup.img.height)
      index++
      index >= powerupPool.length-1 ? index = powerupPool.length-1 : null
      resetPowerupTimer()
    }

    const resetPowerup = () =>{
      index = 0
    }

    const generatePowerup = () => {
      let now = Date.now()
      let dif = now - lastPowerup
      if (dif >= powerupPool[index].interval*1000 && !powerupPool[index].alive) {
        spawnPowerup()
      }
      if (powerupPool[index].alive) {
        drawPowerup(powerupPool[index])
      }
    }

    let resetPowerupTimer = () => {
      lastPowerup = Date.now()
      powerupPool.map(x=> x.alive = false)
    }

    let spawnPowerup = () => {
      powerupPool[index].alive = true
      powerupPool[index].x = cW + 10
      powerupPool[index].y = random(100,cH-100)
    }

    let movePowerup = (p) => {
      p.x += p.dx
      p.y += p.dy
      if (p.y < 0 || p.y > cH - p.img.height) {
        p.dy = -p.dy
      }
      if (p.x < 0-p.width) {
        resetPowerupTimer()
      }
    }

    let drawPowerup = (powerup) => {
      DrawObject(powerup,movePowerup)
    }

    return {
      get: getPowerups,
      getIndex: getIndex,
      generate: generatePowerup,
      activate: activatePowerup,
      reset: resetPowerup
    }
  };


  //========================== Game Stat Factory ================================


  const ScoreFactory = () => {
    let score = 0
    scoreText.innerText = `Score: ${score}`

    const changeScore = (num) => {
      score += num
      score <= 0 ? score = 0 : null
      scoreText.innerText = `Score: ${score}`
    }

    const getScore = () => {
      return parseInt(`${score}`)
    }

    return {
      change: changeScore,
      get: getScore
    }
  };


  //========================== Collision Detection Factory ================================


  const CollisionDetectionFactory = (player, bullets, enemies, enemyBullets, powerup, explosion) => {
    let detectCollision = (rect1, rect2) => {
      if (rect1.x < rect2.x + rect2.img.width &&
         rect1.x + rect1.img.width > rect2.x &&
         rect1.y < rect2.y + rect2.img.height &&
         rect1.img.height + rect1.y > rect2.y) {
           return true
      } else {
        return false
      }
    }

    let resetEnemy = (e) => {
      e.x = random(cW, cW*1.5)
      e.y = random(0, cH - images.enemy.height)
    }

    let resetBullet = (b) => {
      b.alive = false
      b.x = -100
      b.y = -100
    }

    let detectHitOnEnemy = () => {
      for(let i = 0; i < bullets.length; i++) {
        for(let j = 0; j < enemies.length; j++) {
          if (bullets[i].alive) {
            if (detectCollision(bullets[i], enemies[j])) {
              Score.change(100)
              audio.explosion.currentTime = 0
              audio.explosion.play()
              Explosion.draw(enemies[j].x-images.enemy.height,enemies[j].y-images.enemy.height)
              resetEnemy(enemies[j])
              resetBullet(bullets[i])
            }
          }
        }
      }
    }

    let detectPlayerDamage = (arr, player, callback) => {
      for (let i = 0; i < arr.length; i++) {
        if (detectCollision(arr[i], player)) {
          Player.changeHealth(-1)
          Powerup.reset()
          Score.change(-100)
          callback(arr[i])
          audio.explosion.currentTime = 0
          audio.explosion.play()
        }
      }
    }

    let detectPowerupCollected = () => {
      for (let i = 0; i < enemies.length; i++) {
        let activePowerup
        powerup.map(x => x.alive ? activePowerup = x : null)
        if (activePowerup) {
          if (detectCollision(player,activePowerup)) {
            Powerup.activate(activePowerup)
          }
        }
      }
    }


    const runDetections = () => {
        detectHitOnEnemy()
        detectPlayerDamage(enemyBullets, player, resetBullet)
        detectPlayerDamage(enemies, player, resetEnemy)
        detectPowerupCollected()
    }
    return {
      run: runDetections
    }
  };


  //========================== Set Game Objects ================================

  let Player
  let PlayerBullets
  let Enemies
  let EnemyBullets
  let Score
  let Powerup
  let Explosion
  let DetectAllCollisions
  let Background

  //========================== Game Loop ================================

  const GameFactory = () => {
    let req
    let isAnimating = false

    let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    const init = () => {
      Player = PlayerFactory()
      PlayerBullets = PlayerBulletFactory()
      Enemies = EnemyFactory()
      EnemyBullets = EnemyBulletFactory()
      Score = ScoreFactory()
      Powerup = PowerupFactory()
      Explosion = DrawSpriteFactory(spriteRepo.explosion, 46, 60)
      DetectAllCollisions = CollisionDetectionFactory(Player.get(), PlayerBullets.get(), Enemies.get(),EnemyBullets.get(),Powerup.get(), Explosion)
      Background = BackgroundAnimateFactory()
    }

    let setPlayIcon = () => {
      playPauseIcon.classList.remove('fa-pause')
      playPauseIcon.classList.add('fa-play')
    }

    let setPauseIcon = () => {
      playPauseIcon.classList.remove('fa-play')
      playPauseIcon.classList.add('fa-pause')
    }

    const gameloop = () => {
        isAnimating = true
        ctx.clearRect(0,0,cW,cH)
        Background.draw()
        Enemies.draw()
        PlayerBullets.shoot(Player.get(),Powerup.getIndex())
        EnemyBullets.shoot(Enemies.shoot())
        PlayerBullets.draw()
        EnemyBullets.draw()
        Player.draw()
        Powerup.generate()
        DetectAllCollisions.run()
        if (Player.get().health > 0) {
          req = requestAnimationFrame(gameloop)
        } else {
          isAnimating = false
          gameOverScreen.classList.remove('hidden')
          finalScoreText.innerText = `${Score.get()}`
          cancelAnimationFrame(req)
          setPauseIcon()
        }
    }

    let cancelRAF = () => {
      isAnimating = false
      cancelAnimationFrame(req)
    }

    const toggleGameLoop = () => {
      if (isAnimating) {
        cancelRAF()
        setPauseIcon()
      } else {
        gameloop()
        setPlayIcon()
      }
    }

    const toggleMutePage = () => {
      for (var key in audio) {
        audio[key].muted = !audio[key].muted
      }
      if (speakerIcon.classList.value.includes('fa-volume-up')) {
        speakerIcon.classList.remove('fa-volume-up')
        speakerIcon.classList.add('fa-volume-off')
      } else {
        speakerIcon.classList.remove('fa-volume-off')
        speakerIcon.classList.add('fa-volume-up')
      }
    }

    const loopStatus = () => {
      return isAnimating
    }

    return {
      init: init,
      loop: gameloop,
      status: loopStatus,
      toggleLoop: toggleGameLoop,
      toggleMute: toggleMutePage
    }
  };

  Game = GameFactory()

  //========================== DOM Manipulation ================================

  startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden')
    Game.init()
    Game.loop()

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 77) {
        Game.toggleMute()
      }
      if (e.keyCode === 80) {
        Game.toggleLoop()
      }
    })
  })

  pauseButton.addEventListener('click', Game.toggleLoop)

  restartButton.forEach(button => {
    button.addEventListener('click', () => {
      Game.toggleLoop()
      gameOverScreen.classList.add('hidden')
      Game.init()
      Game.loop()
    })
  })

  muteButton.addEventListener('click', Game.toggleMute)

  gameControllerIcon.addEventListener('click', () => {
      if (Game.status()) {
        Game.toggleLoop()
      }
      controlsTooltip.classList.remove('hidden')
    })

  gameControllerIcon.addEventListener('blur', () => {
    if (!Game.status()) {
      Game.toggleLoop()
    }
    controlsTooltip.classList.add('hidden')
    })

////////////////////////////////////////////////////////////////////
// END GAME CODE



// SERVICE FUNCTIONS
////////////////////////////////////////////////////////////////////

  this.getScore = function() {
    return Score.get()
  }



});

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("scoreService", ["$http", function($http) {

  this.getScores = function() {
    return $http({
      method: 'GET',
      url: '/api/scores'
    })
  }
  this.addScore = function(obj) {
    return $http({
      method: 'POST',
      url: '/api/scores',
      data: obj
    })
  }
  this.getAuth0Info = function() {
    return $http({
      method: 'GET',
      url: 'api/auth0'
    })
  }

}]);

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("goldenRatioCtrl", ["$scope", "goldenRatioService", function($scope, goldenRatioService) {

  goldenRatioService.generateContent()

  document.querySelector('nav').style.display = 'none'

  window.onbeforeunload = function() {
    document.querySelector('nav').style.display = 'inline'
  }

}]);

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("goldenRatioService", function() {

  this.generateContent = () => {

    const win = $(window)
    const spiral = $('.spiral')
    const sections = $('.section')

    const svgContainer = document.querySelector('#svgContainer')
    const svgElement = document.querySelector('#spiralSVG')
    const path = document.querySelector('#spiral-path')


    const canvas = document.querySelector('#spiral-canvas')
    const ctx = canvas.getContext('2d')

    const trumpImg = document.querySelector('#golden-spiral-trump')

    let startOver = false
    let shouldAnimate = false
    let currentSection = 0
    let rotate = 0
    let goldenRatio = 0.618033
    let axis = 0.7237
    let spiralOriginX
    let spiralOriginY
    let wW = window.innerWidth
    let wH = wW * goldenRatio
    let smallScreen
    let landscape
    let rotation = 0
    let sectionCount = sections.length
    let scale = 0
    let bounds
    let rotationRate = 2
    let chgInt = 178
    let createSpiral
    let spiralSpeed = 11

    let colorSchemes = {
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
        accent2: "#0E0B16",
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
    }



    let startingAnimation = (direction, animationTime, offSet) => {
      let w = window.innerWidth
      let h = window.innerHeight

      if (w < h) {
        svgElement.setAttribute('height', `${w}px`)
        svgElement.style.transform = `translateX(${w}px) rotate(90deg)`
      } else {
        svgElement.setAttribute('height', `${w*goldenRatio}px`)
        svgElement.style.transform = 'none'
      }

      path.style.transition = path.style.WebkitTransition = 'none'
      let length = path.getTotalLength()
      path.style.strokeDasharray = `${length} ${length}`
      path.style.strokeDashoffset = length
      path.getBoundingClientRect()
      path.style.transition = path.style.WebkitTransition =
        `stroke-dashoffset ${animationTime}s ease-in`
      // if (offSet) {
      //   console.log('forward');
        path.style.strokeDashoffset = `${length + (2*length*direction)}`
      // } else {
      //   path.style.strokeDashoffset = 0
      //   path.style.strokeDashoffset = `${length*direction}`
      //   console.log(path.style.strokeDashoffset);
      // }


      if (!startOver) {
        setTimeout(() => {
          path.setAttribute('stroke','#fff')
          svgContainer.style.opacity = '0'
          setTimeout(()=> {
            svgContainer.style.zIndex='-99'
          },1000)
        }, animationTime*1000/2)
        startOver = true
      }
    }

    startingAnimation(1,2,true)

    let animateCanvasSpirals = function() {
      let spiralSources = ['golden-curve','golden-curve-orange','golden-curve-purple']
      let spiralSourcesMobile = ['golden-curve-mobile']
      const spiralSVG = new Image()
      let resetSpiralSVG = () => {
        spiralSVG.src = `./app/routes/golden-ratio-site/img/golden-curve.svg `
        rotate = 0
      }
      resetSpiralSVG()

      let chooseSpiralSource = (i) => {
        spiralSVG.src = `./app/routes/golden-ratio-site/img/${spiralSources[i]}.svg `
      }

      let drawLine = (num) => {
        ctx.globalAlpha = 1;
        ctx.translate(spiralOriginX, spiralOriginY);
        ctx.rotate(num)
        ctx.translate( -spiralOriginX, -spiralOriginY);
        ctx.drawImage(spiralSVG, 0,0,wW,wW*goldenRatio);
      }

      drawLine(0)

      let animate = () => {
        rotate++
        if (rotate > chgInt * 3) {
          rotate = 0
          chooseSpiralSource(0)
        } else if (rotate > chgInt * 2) {
          chooseSpiralSource(2)
        } else if (rotate > chgInt*1 && rotate < chgInt * 2) {
          chooseSpiralSource(1)
        }
        drawLine(spiralSpeed)
      }

      win.on('wheel keydown click', (e) => {
        if(shouldAnimate && e.keyCode!==82) {
          animate()
        } else {
          ctx.resetTransform(1,0,0,1,0,0)
          ctx.clearRect(0,0,wW,wH)
          resetSpiralSVG()
          // startingAnimation(1,1, false)
        }
      })

      $('canvas').on('click', () => {
        currentSection = 0
        updateSpiral()
        ctx.resetTransform(1,0,0,1,0,0)
        ctx.clearRect(0,0,wW,wH)
        resetSpiralSVG()
        // startingAnimation(1,1, false)
      })
    }

      win.on('wheel', (e) => {
        let dY = e.originalEvent.deltaY
        if (dY > 0) {
          currentSection--
        } else if (dY < 0) {
          currentSection++
        }
        updateSpiral()
      })

      win.on('keydown', (e) => {
        if(e.keyCode === 38 || e.keyCode === 39) {
          currentSection++
          updateSpiral()
        } else if(e.keyCode === 37 || e.keyCode === 40) {
          currentSection--
          updateSpiral()
        } else if (e.keyCode === 82) {
          currentSection = 0
          updateSpiral()
        }
      })

    // win.on('click', () => {
    //   if
    // })

    // win.on('touchstart', (e) => {
    //   e.preventDefault()
    //   let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]
    //   touchStartX = touch.pageX
    //   thouchStartY = touch.pageY
    // })
    //
    // win.on('touchmove', (e) => {
    //   e.preventDefault()
    //   let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]
    //
    // })

    sections.each((i)=>{
      $(sections[i]).on('click',(e)=> {
        if (currentSection !== i) {
          currentSection = i
          updateSpiral()
        }
      })
    })


    let limitNums = (num) => {
      if (num > 10) {
        do {
          num = num - 10
        } while (num > 10)
      }
      return num
    }

    let changeColors = (section) => {;
      num = limitNums(section)
      num < 0 ? num = 0 : null
      let colors = colorSchemes[num]
      document.documentElement.style.setProperty('--gr-bg-color', colors.bg)
      document.documentElement.style.setProperty('--gr-accent-1-color', colors.accent1)
      document.documentElement.style.setProperty('--gr-accent-2-color', colors.accent2)
      document.documentElement.style.setProperty('--gr-text-color', colors.text)
    }

  // prevents strange artifacts when the page is zoomed out
    let trimZoomOut = (limit) => {
      if (currentSection == -limit+1) {
        spiral.addClass("hidden")
      }
      if (currentSection >= -limit+2) {
        spiral.removeClass("hidden")
      }
    }


    let showTrump = () => {
      if (currentSection >= sections.length-1) {
        trumpImg.style.opacity = 1
      } else {
        trumpImg.style.opacity = 0
      }
    }

  // callback function to move to the next or previous section (depending on currentSection)
  let updateSpiral = () => {
    let zoomOutLimit = 12
    trimZoomOut(zoomOutLimit)
    let inBounds = (currentSection > -zoomOutLimit && currentSection < sections.length + 3)
    if (inBounds) {
      if (currentSection < sections.length + 2 && currentSection >= -1)  {
        shouldAnimate = false
        changeColors(currentSection)
      } else {
        document.documentElement.style.setProperty('--gr-bg-color', '#18121E')
        shouldAnimate = true
      }
      spiral.css({
        'transform-origin': `${spiralOriginX}px ${spiralOriginY}px`,
        'transform': `rotate(${~~(-90*currentSection)}deg) scale(${1/Math.pow(goldenRatio,currentSection)})`
      })
    } else {
      currentSection > 0 ? currentSection-- : currentSection++
    }
    showTrump()
  }

  // generates spiral from all divs with class 'section'
    createSpiral = () => {
      let h
      let w
      if (!landscape) {
        spiralOrigin = `${(wW*(1-axis))}px ${(wW/goldenRatio) * axis}px`
        h = wW
        w = h
        spiral.css({
          'transform-origin': `${spiralOrigin}`,
          'backface-visiblity': 'hidden'
        })
      } else {
        spiralOrigin = `${(wW * axis)}px ${wW * goldenRatio * axis}px`
        h = wW * goldenRatio
        w = h
        spiral.css({
          'transform-origin': `${spiralOrigin}`,
          'backface-visiblity': 'hidden'
        })
      }
      sections.each((i) => {
        let myRot = ~~(90*i)
        let scale = Math.pow(goldenRatio, i)
        $(sections[i]).css({
          'width': `${w}`,
          'height': `${h}`,
          'transform-origin': `${spiralOrigin}`,
          'transform': `rotate(${myRot}deg) scale(${scale})`
        })
      })
      changeColors(currentSection)
    }


  // conditions: vertical or horizontal

  // initial rotation & spiral origin change


    let sizeApp = () => {
      wW = window.innerWidth
      wH = window.innerHeight
      if (wW < wH) {
        landscape = false
        spiralOriginX = (wW*(1-axis))
        spiralOriginY = ((wW/goldenRatio) * axis)
        canvas.width = wH
        canvas.height = wH
      } else {
        landscape = true
        spiralOriginX = (wW * axis)
        spiralOriginY = (wW * goldenRatio * axis)
        canvas.width = wW
        canvas.height = wW
      }
      createSpiral()
    }

    sizeApp()
    createSpiral()
    animateCanvasSpirals()

    window.addEventListener('resize', sizeApp)

  }

});

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("homeCtrl", ["$scope", "reusableFuncsService", function($scope, reusableFuncsService) {

  const nav = document.querySelector('#main-nav')

  let lastScrollTop = 0
  let navHeight = parseInt(getComputedStyle(nav).height)

  let navbarControl = () => {
    let distFromTop = window.scrollY
    let deltaScrollY = lastScrollTop - distFromTop
    if (deltaScrollY < 0) {
      if (distFromTop > navHeight) {
        nav.style.top = `-100%`
      }
    } else {
      nav.style.top = `0`
    }
    lastScrollTop = distFromTop
  }

  window.addEventListener('scroll', reusableFuncsService.debounce(navbarControl));


}]);

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("magnifyCtrl", ["$scope", "reusableFuncsService", function($scope, reusableFuncsService) {

  $scope.textInput
  $scope.radio1
  $scope.radio2
  $scope.checkbox1
  $scope.checkbox2
  $scope.checkbox3

  // VARIABLES
  // ============================================================


  const body = document.querySelector('body')
  const glass = document.querySelector('#magnifying-glass')

  const glassArt = document.querySelector('#magnifying-glass-art')
  const glassArtRim = document.querySelector('#glass-rim')
  const glassArtGlass = document.querySelector('#svg-glass-content')

  const original = document.querySelector('body').children[1]
  // creates a copy of the content to be applied to the magnifying glass div
  const content = document.querySelector('.container1')
  const clone = content.cloneNode(true)
  let zoomed


  // note: this may not be cross-browser comptatible
  let pageCenter = {
    w: document.body.scrollWidth/2,
    h: document.body.scrollHeight/2
  }


  let scale = 2   // scale is ratio of zoomed and original content
  let glassSize = 600
  let isMagnifying = false
  let shiftDown = false
  let corr = glassSize/2
  let artCorr = 31*scale // accounts for thickenss of rim on glass artwork


  // FUNCTIONS
  // ============================================================


  function init() {
    glass.style.width = glassArt.style.width = glassSize + 'px'
    glass.style.height = glassArt.style.height = glassSize + 'px'
    glass.style.clipPath = `circle(50% at 50% 50%)`
    glass.style.WebkitClipPath = `circle(50% at 50% 50%)`


    glassArt.style.transformOrigin = `29.0668% 29.0061%`
    glassArt.style.transform = `scale(${scale}) translate(${artCorr}px, ${artCorr}px)`

    // applies content copy to magnifying glass div
    glass.append(clone)
    zoomed = glass.children[0]

    // add classnames to differentiate original vs copied elements
    original.className += ' original'
    zoomed.className += ' zoomed'

    zoomed.style.transform = `scale(${scale})`
  }



  function toggleGlass() {
    if (isMagnifying) {
      glassArt.style.display = 'inline'
      glass.style.display = 'inline'
    } else {
      glassArt.style.display = 'none'
      glass.style.display = 'none'

    }
  }


  // event function to move mag-glass around zoomed conten t
  function moveGlass(e) {
    if (shiftDown && isMagnifying) {
      glass.style.cursor = 'none'

      if (pageCenter.w !== document.body.scrollWidth/2 || pageCenter.h !== document.body.scrollHeight/2) {
        pageCenter = {
          w: document.body.scrollWidth/2,
          h: document.body.scrollHeight/2
        }
      }

      mouse = {
          x: e.pageX,
          y: e.pageY
        }
      let centOffsetX = ((scale-1)*(mouse.x-pageCenter.w)/pageCenter.w)*pageCenter.w
      let centOffsetY = ((scale-1)*(mouse.y-pageCenter.h)/pageCenter.h)*pageCenter.h
      let distFromTop = document.querySelector('body').scrollTop
      // translate container div mith mouse move
      let divTranslateX = mouse.x - corr
      let divTranslateY = mouse.y - corr - distFromTop
      glassArt.style.transform = `scale(${scale}) translate(${artCorr + divTranslateX/scale}px, ${artCorr + divTranslateY/scale}px)`
      glass.style.transform = `translate(${divTranslateX}px, ${divTranslateY}px)`
      // correct container div translations
      // centOffsetX and centOffsetY account for the scaling difference between the original content and the zoom
      // scale maintains scaling of content in magnifying glass
      let glassTranslateX = -mouse.x - centOffsetX + corr
      let glassTranslateY = -mouse.y - centOffsetY + corr
      zoomed.style.transform = `translate(${glassTranslateX}px, ${glassTranslateY}px) scale(${scale})`
    } else {
      glass.style.cursor = 'default'
    }
    }

    function resizeGlass() {

    }


    // EVENT LISTENERS
    // ============================================================


  // initialized on load to prevent position issues with the magnified content
  window.addEventListener('load', init())


  window.addEventListener('resize', () => {
    pageCenter = {
      w: document.body.scrollWidth/2,
      h: document.body.scrollHeight/2
    }
  })

  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 16) {
      shiftDown = true
    }
    // keyboard shortcut (ctrl + shift + 'm') to toggle magnifying glass
    if (e.keyCode === 90 & e.shiftKey & e.ctrlKey) {
      isMagnifying = !isMagnifying
      toggleGlass()
    }
  })

  window.addEventListener('keyup', (e) => {
    if (e.keyCode === 16) {
      shiftDown = false
    }
  })

  window.addEventListener('mousemove', (e) => {
    moveGlass(e)
  })

  // window.addEventListener('scroll', reusableFuncsService.debounce(() => {
  //   console.log(getComputedStyle(zoomed));
  //   let distFromTop = document.querySelector('body').scrollTop
  //   // zoomed.style.transform = `translate(0px, ${-distFromTop}px) scale(${scale})`
  // }))

}]);


// document.addEventListener("DOMContentLoaded", function(event) {
//
// //------------------------------------------------------------------------------
// //            Variables
// //------------------------------------------------------------------------------
//
//   var artContainer = document.getElementById('artwork-container')
//
//
//   //------------------------------------------------------------------------------
//   //            timelines
//   //------------------------------------------------------------------------------
//
//   var tlTest = new TimelineMax({});
//
//   tlTest.to(artContainer, 5, {backgroundImage: `radial-gradient(circle at 0% 90%, #e3e5f3, #e38c59, #a33d4b,#46142b)`})
//
//// $('#btnPlay').on('click', () => tlTest.play());
// $('#btnPause').on('click', () => tlTest.pause());
// $('#btnResume').on('click', () => tlTest.resume());
// $('#btnReverse').on('click', () => tlTest.reverse());
// $('#btnSpeedUp').on('click', () => tlTest.timeScale(3));
// $('#btnSlowDown').on('click', () => tlTest.timeScale(0.2));
// $('#btnSeek').on('click', () => tlTest.seek(2));//goes to a labeled position or time in the animation
// $('#btnProgress').on('click', () => tlTest.progress(0.5));// goes to progress of animation (0-1 start-finish)
// $('#btnRestart').on('click', () => tlTest.restart());
//


// var setSunPosition = function(time) {
//   var hour = $scope.unixTo24Hour(time);
//   var timePositions = {
//     '0': [30, 48, "#00000c"],
//     '1': [50, 40, "#020111 85%,#191621 100%"],
//     '2': [60, 43, "#020111 60%,#20202c 100%"],
//     '3': [70, 48, "#020111 10%,#3a3a52 100%"],
//     '4': [80, 57, '#20202c 0%,#515175 100%'],
//     '5': [90, 69, '#40405c 0%,#6f71aa 80%,#8a76ab 100%'],
//     '6': [100, 80, '#4a4969 0%,#7072ab 50%,#cd82a0 100%'],
//     '7': [0, 150, '#757abf 0%,#8583be 60%,#eab0d1 100%'],
//     '8': [8, 69, '#82addb 0%,#ebb2b1 100%'],
//     '9': [16, 59, '#94c5f8 1%,#a6e6ff 70%,#b1b5ea 100%'],
//     '10': [25, 50, '#b7eaff 0%,#94dfff 100%'],
//     '11': [33, 44, '#9be2fe 0%,#67d1fb 100%'],
//     '12': [41, 41, '#90dffe 0%,#38a3d1 100%'],
//     '13': [50, 40, '#57c1eb 0%,#246fa8 100%'],
//     '14': [50, 40, '#2d91c2 0%,#1e528e 100%'],
//     '15': [58, 41, '#2473ab 0%,#1e528e 70%,#5b7983 100%'],
//     '16': [66, 44, '#1e528e 0%,#265889 50%,#9da671 100%'],
//     '17': [75, 50, '#1e528e 0%,#728a7c 50%,#e9ce5d 100%'],
//     '18': [83, 58, '#154277 0%,#576e71 30%,#e1c45e 70%,#b26339 100%'],
//     '19': [91, 68, '#163C52 0%,#4F4F47 30%,#C5752D 60%,#B7490F 80%, #2F1107 100%'],
//     '20': [100, 82, '#071B26 0%,#071B26 30%,#8A3B12 80%,#240E03 100%'],
//     '21': [100, 150, '#010A10 30%,#59230B 80%,#2F1107 100%'],
//     '22': [0, 80, '#090401 50%,#4B1D06 100%'],
//     '23': [10, 69, '#00000c 80%,#150800 100%'],
//     '24': [40, 43, '#00000c'],
//   };
//   return timePositions[hour];
//   }




// });

angular.module('portfolioApp').controller('weatherCtrl', ["$scope", "$q", "weatherService", function($scope, $q, weatherService) {

    // $scope.hidePreloader=false;
    //
    //
    // var togglePreloader = function() {
    //   $scope.hidePreloader = true;
    //   $('.loader-wrapper').remove()
    //   console.log("removed!")
    // }
    //
    // $scope.fadePreloader = function() {
    //   TweenMax.to($('.loader-wrapper'), 2, {opacity: 0, onComplete: togglePreloader})
    // }

    $scope.getWeatherDataFromSearch = function(search) {
        weatherService.getWeatherDataFromSearch(search)
            .then(function(results) {
                console.log('second weather API call', results)
                $scope.weather = results;
            })
    }

    $scope.getWeatherData = function() {
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(deferred.resolve);
        deferred.promise
            .then((res) => weatherService.getWeatherData(res.coords.latitude, res.coords.longitude))
            .then(function(results) {
                console.log(results)
                $scope.weather = results;
                $scope.daily = results.data.daily.data
                $scope.current = results.data.currently
                $scope.hourly = results.data.hourly.data
                $scope.hourly[1].icon = 'snow'
                $scope.hourly[1].windSpeed = 10
                $scope.hourly[1].precipIntensity = 1
                // $scope.fadePreloader();
                $scope.$watch('selectedTime', function(sliderTime) {

                    // Set variables for function

                    var current = $scope.hourly[sliderTime]
                    var time = current.time || 0
                    var config = findSunPosition(time)
                    var moveClouds = function() {
                        var tlCloudMovement = new TimelineMax();
                        tlCloudMovement.add('initial')
                        tlCloudMovement.to(pcLeftLarge, 1000 / current.windSpeed, {
                                x: "0vw",
                                repeat: -1,
                                yoyo: true
                            }, 'initial')
                            .to(pcLeftSmall, 500 / current.windSpeed, {
                                x: "150vw",
                                repeat: -1,
                                yoyo: true
                            }, 'initial')
                            .to(pcRightLarge, 100 / current.windSpeed, {
                                x: "100vw",
                                repeat: -1,
                                yoyo: true
                            }, 'initial')
                            .to(pcRightSmall, 300 / current.windSpeed, {
                                x: "250vw",
                                repeat: -1,
                                yoyo: true
                            }, 'initial')
                    }


                    // Toggle rain or snow depending on conditions

                    if (current.icon.includes('snow')) {
                        if (!isItSnowing) {
                            isItRaining = false;
                            isItSnowing = true;
                            setTimeout(() => makeItSnow(current.precipIntensity, current.windSpeed), 500);
                        }
                    } else if (current.icon.includes('rain')) {
                        if (!isItRaining) {
                            isItSnowing = false;
                            isItRaining = true;
                            setTimeout(() => makeItRain(current.precipIntensity, current.windSpeed), 500);
                        }
                    } else {
                        isItSnowing = false;
                        isItRaining = false;
                    }

                    // Toggle gray sky background if it is raining, snowing, or cloud cover is over 75%



                    if (current.cloudCover >= 0.7 || current.precipIntensity > 0.25) {
                        if (21 <= time || time < 6) {
                            tlHourChange.to(graySkyFilter, 0.5, {
                                opacity: 1,
                                backgroundImage: 'linear-gradient(0, #666, #444)'
                            }, 'initial')
                        } else if (21 > time || time >= 6) {
                            tlHourChange.to(graySkyFilter, 0.5, {
                                opacity: 1,
                                backgroundImage: 'linear-gradient(0, #ccc, #aaa)'
                            }, 'initial')
                        }
                    } else {
                        tlHourChange.to(graySkyFilter, 0.5, {
                            opacity: 0
                        }, 'initial')
                    }

                    // Show top rain cloud if it is raining or snowing

                    if (isItRaining || isItSnowing) {
                        tlHourChange.to(pcTop, 0.5, {
                            opacity: 1
                        }, 'initial')

                    } else if (!isItRaining && !isItSnowing) {
                        tlHourChange.to(pcTop, 0.5, {
                            opacity: 0
                        }, 'initial')
                    }

                    // Show background precipitation clouds if it is raining, snowing, or if the cloud cover is greater than 50%

                    if (!precipCloudsShown) {
                        if (current.cloudCover > 0.05 && current.cloudCover < 0.25) {
                            tlHourChange.to(pcLeftSmall, 0.5, {
                                left: "-10vw"
                            }, 'initial')
                        } else if (current.cloudCover > 0.25 && current.cloudCover < 0.5) {
                            tlHourChange.to(pcLeftSmall, 0.5, {
                                    left: "-10vw"
                                }, 'initial')
                                .to(pcRightSmall, 0.5, {
                                    right: "-20vw"
                                }, 'initial')
                        } else if (current.cloudCover > 0.5 || isItRaining || isItSnowing) {
                            tlHourChange.to(pcLeftLarge, 0.5, {
                                    left: "-20vw"
                                }, 'initial')
                                .to(pcLeftSmall, 0.5, {
                                    left: "-10vw"
                                }, 'initial')
                                .to(pcRightLarge, 0.5, {
                                    right: "-20vw"
                                }, 'initial')
                                .to(pcRightSmall, 0.5, {
                                    right: "-20vw",
                                    onComplete: moveClouds()
                                }, 'initial')
                            precipCloudsShown = true;
                        }
                    } else if (!isItRaining && !isItSnowing) {
                        if (current.cloudCover < 0.5) {
                            tlHourChange.to([pcLeftLarge, pcLeftSmall], 0.5, {
                                    left: '-250vw'
                                }, 'initial')
                                .to([pcRightSmall, pcRightLarge], 0.5, {
                                    right: '-200vw'
                                }, 'initial')
                            precipCloudsShown = false;
                        }
                    }


                    // Add wind if windSpeed > 2mph. Animation speed is determined by wind speed

                    if (current.windSpeed >= 3) {

                        var rand = function(range, min) {
                            return ~~(Math.random() * range + min)
                        }

                        tlHourChange.set(windPath1, {
                            strokeWidth: "0.1%",
                            strokeDasharray: '200 7000',
                            strokeDashoffset: '7000',
                            animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear reverse infinite'
                        }, 'initial')
                        tlHourChange.set(windPath3, {
                            strokeWidth: "0.1%",
                            strokeDasharray: '200 5000',
                            strokeDashoffset: '5000',
                            animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear reverse infinite'
                        }, 'initial')
                        tlHourChange.set(windPath2, {
                            strokeWidth: "0.1%",
                            strokeDasharray: '150 7000',
                            strokeDashoffset: '7000',
                            animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear forwards infinite'
                        }, 'initial')
                        tlHourChange.set(windPath4, {
                            strokeWidth: "0.1%",
                            strokeDasharray: '150 5000',
                            strokeDashoffset: '5000',
                            animation: 'wind ' + ~~rand(3, 30 / current.windSpeed) + 's linear forwards infinite'
                        }, 'initial')
                    } else if (current.windSpeed < 3) {
                        tlHourChange.set([windPath1, windPath2, windPath3, windPath4], {
                            strokeWidth: 0
                        }, 'initial')
                    }


                    // Change sun/moon position and colors of artwork

                    tlHourChange.to(artContainer, 0.2, {
                            ease: Linear.easeNone,
                            backgroundImage: `radial-gradient(circle at ${config[0]}% ${config[1]}%, ${config[2]}`
                        }, 'initial')
                        .to(mountains, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[3]
                        }, 'initial')
                        .to(mountainAccents, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[4]
                        }, 'initial')
                        .to(ground, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[5]
                        }, 'initial')
                        .to(groundAccent, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[6]
                        }, 'initial')
                        .to(mountainLeft, 0.2, {
                            ease: Linear.easeNone,
                            fill: config[7]
                        }, 'initial')

                    tlHourChange = new TimelineMax();

                })
            })
    }


    $scope.getWeatherData();

    $scope.unixToTime = function(time) {
        var date = new Date(time * 1000)
        return date;
    }

    $scope.unixTo24Hour = function(time) {
        var date = new Date(time * 1000).getHours();
        return date;
    }

    $scope.selectedTime = 0;

    var setCurrentState = function(sliderValue) {
        return $scope.hourly[sliderValue];
    }

    $scope.fiveDay = false;

    $scope.toggleFiveDay = function() {
        $scope.fiveDay = !$scope.fiveDay
        console.log($scope.fiveDay)
    }



    //------------------------------------------------------------------------------
    //            Variables
    //------------------------------------------------------------------------------

    var artContainer = $('#artwork-container');
    var sun = $('.sun');
    var pulse = $('.sun-pulse');
    var mountains = $('#mountains');
    var mountainAccents = $('#mountains-accents');
    var mountainLeft = $('#mountain-left');
    var ground = $('#ground');
    var groundAccent = $('#ground-accent');
    var timeSlider = $('#timeSlider');
    var slider = $('.slider')
    var graySkyFilter = $('.gray-sky')
    var precipClouds = $('.precip-cloud')
    var pcLeftLarge = ('#precip-cloud-left-large')
    var pcLeftSmall = ('#precip-cloud-left-small')
    var pcRightLarge = ('#precip-cloud-right-large')
    var pcRightSmall = ('#precip-cloud-right-small')
    var pcTop = $('#precip-cloud-top')
    var windPath1 = $('#windPath1')
    var windPath2 = $('#windPath2')
    var windPath3 = $('#windPath3')
    var windPath4 = $('#windPath4')




    var nightColors = "#ffffff 3%,#e3e5f3 5%,#64676b 8%,#3a3a3a,#282828,#101111";
    var duskColors = '#ffffff 3%,#e3e5f3 5%,#64676b 8%,#414345,#232526,#101111';
    var sunriseColors1 = '#ffdd93 3%,#64676b 8%,#cd82a0,#8a76ab,#3a3a52';
    var sunriseColors2 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#eab0d1,#cd82a0,#7072ab';
    var sunriseColors3 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#a6e6ff,#67d1fb,#eab0d1';
    var dayColors = "rgb(255,194,82) 3%,#e3e5f3 8%,#56CCF2,#4fa9ff,#008be2";
    var sunsetColors1 = 'rgb(255,194,82) 3%,#ffdd93 8%,#90dffe,#38a3d1,#154277';
    var sunsetColors2 = 'rgb(255,194,82) 3%,#e3e5f3 8%,#e38c59,#a33d4b,#46142b';
    var sunsetColors3 = 'rgb(255,194,82) 3%,#e9ce5d 8%,#B7490F,#8A3B12,#2F1107';



    var mountainFillDay = 'hsl(40,54%,35%)'
    var mountainAccentFillDay = 'hsl(40,85%,84%)'
    var groundFillDay = 'hsl(78,60%,42%)'
    var groundAccentFillDay = 'hsl(78,76%,72%)'
    var leftMountainFillDay = 'hsl(41,76%,22%)'

    var mountainFillSunrise3 = '#7f5f4c'
    var mountainAccentFillSunrise3 = '#FFE9AD'
    var groundFillSunrise3 = '#6c8c21'
    var groundAccentFillSunrise3 = '#a5b754'
    var leftMountainFillSunrise3 = '#724f0c'

    var mountainFillSunrise2 = '#704545'
    var mountainAccentFillSunrise2 = '#ffa100'
    var groundFillSunrise2 = '#af7700'
    var groundAccentFillSunrise2 = '#2e3a30'
    var leftMountainFillSunrise2 = '#333333'

    var mountainFillSunrise1 = '#5b343a'
    var mountainAccentFillSunrise1 = '#aa4419'
    var groundFillSunrise1 = '#50450b'
    var groundAccentFillSunrise1 = '#2e3a30'
    var leftMountainFillSunrise1 = '#333333'

    var mountainFillSunset1 = '#7f5f4c'
    var mountainAccentFillSunset1 = '#FFE9AD'
    var groundFillSunset1 = '#6c8c21'
    var groundAccentFillSunset1 = '#a5b754'
    var leftMountainFillSunset1 = '#724f0c'

    var mountainFillSunset2 = '#704545'
    var mountainAccentFillSunset2 = '#ffa100'
    var groundFillSunset2 = '#af7700'
    var groundAccentFillSunset2 = '#2e3a30'
    var leftMountainFillSunset2 = '#333333'

    var mountainFillSunset3 = '#5b343a'
    var mountainAccentFillSunset3 = '#aa4419'
    var groundFillSunset3 = '#50450b'
    var groundAccentFillSunset3 = '#2e3a30'
    var leftMountainFillSunset3 = '#333333'

    var mountainFillNight = 'hsl(278,7%,16%)'
    var mountainAccentFillNight = 'hsl(279,6%,12%)'
    var groundFillNight = 'hsl(130,11%,22%)'
    var groundAccentFillNight = 'hsl(130,6%,10%)'
    var leftMountainFillNight = 'hsl(0,0%,10%)'

    var tlHourChange = new TimelineMax();
    var isItRaining = false;
    var isItSnowing = false;
    var precipCloudsShown = false;
    var stars = false;


    //------------------------------------------------------------------------------
    //            Functions
    //------------------------------------------------------------------------------

    var findSunPosition = function(time) {
        var hour = $scope.unixTo24Hour(time);
        var timePositions = {
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
            '24': [30, 25, nightColors, mountainFillNight, mountainAccentFillNight, groundFillNight, groundAccentFillNight, leftMountainFillNight, stars = true],
        };
        return timePositions[hour];
    }


    var changeArt = function() {
        let config = findSunPosition(0)
        let shadowX = (config[0] - 50) / 5;
        TweenMax.to(artContainer, 1, {
            ease: Power2.easeOut,
            backgroundImage: `radial-gradient(circle at ${config[0]}% ${config[1]}%,` + config[2]
        })
    }


    var hexToHSL = function(hex) {
        hex = hex.replace(/^#/, "")
        r = parseInt(hex.substring(0, 2), 16) / 255;
        g = parseInt(hex.substring(2, 4), 16) / 255;
        b = parseInt(hex.substring(4, 6), 16) / 255;

        console.log(r, g, b)

        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [~~(h * 360), ~~(s * 100), ~~(l * 100)];
    }

    //------------------------------------------------------------------------------
    //            Time Change Animation
    //------------------------------------------------------------------------------

    tlHourChange.add('initial')

    // adds scope listener for changes to slider.
    // moves progress of timeline to progress position based on slider position
    // TweenMax makes movements between progress smooth


    //------------------------------------------------------------------------------
    //            Precipitation Canvas
    //------------------------------------------------------------------------------

    var makeItSnow = function(precipIntensity, windSpeed) {
        var ctx = document.getElementById('precipCanvas').getContext('2d');
        ctx.canvas.width = window.innerWidth * 2;
        ctx.canvas.height = window.innerHeight;
        var cW = ctx.canvas.width,
            cH = ctx.canvas.height;
        var particles = [];
        //  var maxParticles = precipIntensity * cW/2;
        var snowIntensity = precipIntensity;
        var windySnow = windSpeed;
        var maxParticles = snowIntensity * cW;

        function addParticle() {
            var s = ~~(Math.random() * 10) + 1;
            var yv = s;
            var xv = -1 + Math.random() * 2 + 0.5 + windySnow;
            var x = ~~(Math.random() * cW) + 1 - (cW / 2);
            var y = 0;
            particles.push({
                'x': x,
                'y': y,
                's': s,
                'yv': yv,
                'xv': xv
            })
        }

        function precip() {
            if (particles.length < maxParticles && isItSnowing) {
                addParticle();
            }
            for (var i = 0; i < particles.length; i++) {
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.beginPath();
                // arc(x,y,radius,startAndle,endAndle,anticlockwise)
                ctx.arc(particles[i].x += particles[i].xv, particles[i].y += particles[i].yv, particles[i].s * 0.5, 0, Math.PI * 2, false);
                ctx.fill();
                if (particles[i].y > cH && isItSnowing) {
                    particles[i].y = 0
                    particles[i].x = ~~(Math.random() * cW) - (cW / 2);
                } else if (particles[i].y > cH && !isItSnowing) {
                    particles[i].yv = 0;
                    particles[i].y = -5;
                } else if (!isItSnowing) {
                    particles[i].yv *= 3;
                }
            }
        }

        function animate() {

            ctx.save();
            ctx.clearRect(0, 0, cW, cH);
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, cW, cH);
            //rotates the canvas
            //  ctx.rotate(~~(-windySnow/10));
            precip();
            ctx.restore();

        }

        var animateInterval = setInterval(function() {
            animate();
            if (!isItSnowing) {
                setTimeout(() => clearInterval(animateInterval), 500)
            }
        }, 30);

    };


    var makeItRain = function(precipIntensity, windSpeed) {
        var ctx = document.getElementById('precipCanvas').getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        var w = ctx.canvas.width,
            h = ctx.canvas.height;
        ctx.strokeStyle = '#76b1e2';
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';


        //  var windyRain = Math.random()*5 + 2.5;
        var windyRain = windSpeed
        var rainIntensity = precipIntensity

        var particles = [];
        var maxParts = rainIntensity * w

        function addParticle() {

            particles.push({
                x: Math.random() * w,
                y: 0,
                l: Math.random() * 1,
                xs: -1 + Math.random() * 2 + 0.5 + windyRain,
                ys: Math.random() * 10 + 50 + rainIntensity * 2
            })
        }

        function draw() {

            if (particles.length < maxParts) {
                for (var a = 0; a < 5; a++) {
                    addParticle();
                }
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
                p.x += p.xs;
                p.y += p.ys;
                if (p.x > w && isItRaining || p.y > h && isItRaining) {
                    p.x = Math.random() * w;
                    p.y = -20;
                } else if (!isItRaining) {
                    ctx.globalAlpha -= 0.1;
                }



                //  (p.x > w && !isItRaining || p.y > h && !isItRaining){
                //    p.ys = 0;
                //    p.xs = 0;
                //    p.y = -5;
                //  } else if (!isItRaining) {
                //    p.ys *= 5;
                //  }
            }
        }

        var animateInterval = setInterval(function() {
            draw();
            if (!isItRaining) {
                setTimeout(() => clearInterval(animateInterval), 500)
            }
        }, 30);
    };

    //---------------------------------------------------------------------------
    //                 Stars Canvas
    //---------------------------------------------------------------------------

    // var starShine = function() {
    //                   var ctx = document.getElementById('starsCanvas').getContext('2d');
    //                   ctx.canvas.width = window.innerWidth;
    //                   ctx.canvas.height = window.innerHeight;
    //                   var cW = ctx.canvas.width, cH = ctx.canvas.height;
    //                   var starsTemp = [];
    //                   var stars2 = [];
    //                   var stars3 = [];
    //                   var stars4 = [];
    //                   var stars5 = [];
    //                   var maxStars = 150;
    //
    //                   function makeStar(arr) {
    //                     var x = ~~(Math.random()*cW)+1;
    //                     var y = ~~(Math.random()*cH)+1;
    //                     var s = ~~(Math.random()*2)+1;
    //                     var inc = true;
    //                     arr.push({'x':x,'y':y,'s':s})
    //                   }
    //
    //                   for (let j = 0; j < 5; j++) {
    //                     for (let i = 0; i < maxStars/5; i++) {
    //                       makeStar()
    //                     }
    //
    //                     for(let i = 0; i < stars[j].length; i++) {
    //                       ctx.fillStyle = 'rgb(255,255,255)';
    //                       ctx.beginPath();
    //                         // arc(x,y,radius,startAndle,endAndle,anticlockwise)
    //                       ctx.arc(stars[i].x,stars[i].y, stars[i].s*0.5, 0, Math.PI*2, false);
    //                       ctx.globalAlpha = stars[i].s
    //                       ctx.fill();
    //                      }
    //                    }
    //
    //
    //                   function twinkle(index) {
    //                      TweenMax.to(stars)
    //                   }
    //
    //
    // };

}])

angular.module('portfolioApp').service('weatherService', ["$http", "$q", function($http, $q) {

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

}]);
