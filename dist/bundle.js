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
      .state('space-game', {
        url: '/space',
        templateUrl: 'app/routes/game/gameTmpl.html',
        controller: 'gameCtrl'
      })

    // ASSIGN OTHERWISE
    // ============================================================
    $urlRouterProvider.otherwise('/')
  }]);

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("mainCtrl", ["$scope", "mainService", function($scope, mainService) {



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
          console.log(sp.count, frameSpeed, currentFrame, totalFrames);
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
          console.log(sp.count, isAnimating);
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
angular.module("portfolioApp").controller("homeCtrl", ["$scope", function($scope) {

  const nav = document.querySelector('#main-nav')

  function debounce(func) {
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

  window.addEventListener('scroll', debounce(navbarControl));


}]);

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("magnifyCtrl", ["$scope", function($scope) {

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
  const glassArtRim = document.querySelector('#glass-circle-art')

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

    console.log(getComputedStyle(glassArtRim).width);


    glassArt.style.transformOrigin = `29.0668% 29.0061%`
    glassArt.style.transform = `scale(${scale}) translate(${62}px, ${62}px)`

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
      }
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
      // body.style.cursor = 'default'
    }
  })

  window.addEventListener('mousemove', (e) => {
    moveGlass(e)
  })

  window.addEventListener('scroll', (e) => {

  })


}]);

