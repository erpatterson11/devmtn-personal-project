// CONFIG
  // ============================================================
  angular.module("portfolioApp",['ui.router']).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    // INITILIZE STATES
    // ============================================================
    $stateProvider
      // HOME STATE
      .state('home', {
        url: '/',
        templateUrl: 'app/routes/home/homeTmpl.html',
        controller: 'mainCtrl'
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
angular.module("portfolioApp").controller("mainCtrl", ["$scope", function($scope) {
  // VARIABLES
  // ============================================================
  
  // FUNCTIONS
  // ============================================================
}]);

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("collectionService", ["$http", function($http) {
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

angular.module("portfolioApp").controller("gameCtrl", ["$scope", "gameService", function($scope, gameService) {

  $scope.finalScore

  // invoked in the gameOver function on the Game object
  $scope.submitFinalScore = () => {

  }


// Flying shooter game
// Features:
//    Login to save/load scores

// GAME CODE
//==============================================================


//========================== Custom Functions ================================


function random(min, max) {
    return (Math.random() * (max - min)) + min
}

//========================== Target DOM Elements ================================

const gameCanvas = document.querySelector('#gameCanvas')
const bgCanvas = document.querySelector('#bgCanvas')

const canvasContainer = document.querySelector('.canvas-container')
const statsBar = document.querySelector('#stats-bar')

const startScreen = document.querySelector('#start-screen')
const gameOverScreen = document.querySelector('#game-over-screen')
const healthBarFill = document.querySelector('#health-bar-fill')
const healthText = document.querySelector('#health-text')
const scoreText = document.querySelector('#score')

const startButton = document.querySelector('#start-button')
const restartButton = document.querySelector('#restart-game')
const pauseButton = document.querySelector('#pause-button')
const muteButton = document.querySelector('#mute-button')

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
    e.preventDefault()
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

  const InitializeBulletPool = (max, speed, image) => {
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

  const NewPowerup = (image, interval) => {
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

  let bulletPool = InitializeBulletPool(bulletParams.maxBullets,bulletParams.bulletSpeed,images.bullet)

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

  let enemyBulletPool = InitializeBulletPool(bulletParams.maxBullets,bulletParams.bulletSpeed,images.enemyBullet)

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

  let powerup1 = NewPowerup(images.powerup1, 10)
  let powerup2 = NewPowerup(images.powerup2, 15)
  let powerup3 = NewPowerup(images.powerup3, 20)
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
    console.log(index);
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
    console.log('powerup spawned!');
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


const CollisionDetectionFactory = (player, bullets, enemies, enemyBullets, powerup) => {
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
    // ctx.drawImage(img.explosion, )
    // ctx.clearRect(e.x,e.y,e.img.width,e.img.height)
    e.x = random(cW, cW*1.5)
    e.y = random(0, cH - images.enemy.height)
  }

  let resetBullet = (b) => {
    b.alive = false
    // ctx.clearRect(b.x - 1, b.y - 1, b.img.width + 2, b.img.height + 2)
    b.x = -100
    b.y = -100
  }

  let playerDamaged = (arr, player, callback) => {
    for (let i = 0; i < arr.length; i++) {
      if (detectCollision(arr[i], player)) {
        Player.changeHealth(-1)
        Powerup.reset()
        Score.change(-100)
        callback(arr[i])
        audio.explosion.currentTime = 0
        audio.explosion.play()
        if (player.health <= 0) {
          Game.over()
        }
      }
    }
  }

  const runDetections = () => {
    // enemy - bullet detection
      for(let i = 0; i < bullets.length; i++) {
        for(let j = 0; j < enemies.length; j++) {
          if (bullets[i].alive) {
            if (detectCollision(bullets[i], enemies[j])) {
              Score.change(100)
              audio.explosion.currentTime = 0
              audio.explosion.play()
              resetEnemy(enemies[j])
              resetBullet(bullets[i])
            }
          }
        }
      }

    // player - enemy bullet detection
      playerDamaged(enemyBullets, player, resetBullet)

    // player - enemy detection
      playerDamaged(enemies, player, resetEnemy)

    // player - powerup detection
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
    DetectAllCollisions = CollisionDetectionFactory(Player.get(), PlayerBullets.get(), Enemies.get(),EnemyBullets.get(),Powerup.get())
    Background = BackgroundAnimateFactory()
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
      req = requestAnimationFrame(gameloop)
  }

  let cancelRAF = () => {
    isAnimating = false
    cancelAnimationFrame(req)
  }

  const pauseGame = () => {
    if (isAnimating) {
      cancelRAF()
    } else {
      gameloop()
    }
  }

  const toggleMutePage = () => {
    console.log('mute!');
    for (var key in audio) {
      audio[key].muted = !audio[key].muted
    }
  }

  const gameOver = () => {
    cancelRAF()
    gameOverScreen.classList.remove('hidden')
  }

  return {
    init: init,
    loop: gameloop,
    pause: pauseGame,
    mute: toggleMutePage,
    over: gameOver
  }
};

const Game = GameFactory()


//==========================  ================================



// let determineLoading = () => {
//   let imageCount = 0
//   let imagesLoaded = 0
//   let audioCount = 0
//   let audioLoaded = 0
//
//   let onImageLoad = () => {
//     imagesLoaded()
//   }
//
//   let onAudioLoad = () => {
//     audioLoaded()
//   }
//
//   for (let keys in images) {
//     imageCount++
//   }
//   for (let keys in audio) {
//     audioCount++
//   }
//
//   for (let keys in images) {
//     images[keys].onLoad = () => {
//
//     }
//   }
// }

//========================== DOM Manipulation ================================

startButton.addEventListener('click', () => {
  startScreen.classList += 'hidden'
  Game.init()
  Game.loop()
})

pauseButton.addEventListener('click', Game.pause)

restartButton.addEventListener('click', () => {
  gameOverScreen.classList += 'hidden'
  Game.init()
  Game.pause()
  Game.loop()
})

muteButton.addEventListener('click', Game.mute)


//==========================  ================================


}]);

// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("gameService", ["$http", function($http) {

  this.getUsers = function() {
    return $http({
      method: 'GET',
      url: '/api/collection'
    })
  }
  this.getScores = function() {
    return $http({
      method: 'GET',
      url: '/api/collection?_id='
    })
  }
  this.addScore = function(score) {
    return $http({
      method: 'POST',
      url: '/api/collection',
      data: score
    })
  }
  this.addUser = function(user) {
    return $http({
      method: 'POST',
      url: "/api/collection/",
      data: collection
    })
  }
  this.deleteCollection = function() {
    return $http({
      method: 'DELETE',
      url: '/api/collection/'
    })
  }


}]);

// // INITILIZE SERVICE
// // ============================================================
// angular.module("portfolioApp").service("goldenRatioCanvasService", function($http) {
//   // CRUD FUNCTIONS
//   // ============================================================
//
//   // OTHER FUNCTIONS
//   // ============================================================
// 
// const win = $(window)
// const spiral = $('.spiral')
// const sections = $('.section')
// const canvas = $('#canvas')
//
// let shouldAnimate = false
// let currentSection = 0
// let rotate = 0
// let spiralOrigin
// let _winW = window.innerWidth;
// let _winH = window.innerHeight;
// let smallScreen
// let landscape
// let goldenRatio = 0.618033
// let axis = 0.7237
// let rotation = 0
// let sectionCount = sections.length
// let touchStartY = 0
// let touchStartX = 0
// let scale = 0
// let bounds
// let rotationRate = 2
// let chgInt = 120
//
// let animateCanvasSpirals = function() {
//
//   const canvas = document.getElementById('canvas')
//   const ctx = canvas.getContext('2d')
//
//   let w = window.innerWidth
//   let h = window.innerHeight
//
//   canvas.width = w
//   canvas.height = h
//
//   let spiralOriginX = ~~(_winW * axis)
//   let spiralOriginY = ~~_winW * goldenRatio * axis
//   let colors = ['orange','black','purple', 'green', 'yellow', 'orange']
//
//   let drawLine = (color) => {
//     ctx.beginPath();
//   	ctx.lineJoin = 'round';
//   	ctx.strokeStyle = color
//   	ctx.lineCap = 'round';
//   	ctx.miterLimit = 4;
//   	ctx.lineWidth = 1;
//     ctx.translate(w/2, w/2);
//     ctx.moveTo(248.169100, 326.385170);
//   	ctx.bezierCurveTo(267.912090, 326.385180, 283.905100, 310.347180, 283.885100, 290.611180);
//   	ctx.moveTo(283.885100, 290.611180);
//   	ctx.bezierCurveTo(283.885100, 258.737180, 258.000090, 232.909180, 226.124100, 232.935180);
//   	ctx.moveTo(226.124100, 232.935180);
//   	ctx.bezierCurveTo(174.539090, 232.935180, 132.713100, 274.753180, 132.713100, 326.339180);
//   	ctx.moveTo(132.713100, 326.339180);
//   	ctx.bezierCurveTo(132.713100, 409.837170, 200.399100, 477.530220, 283.897100, 477.530220);
//   	ctx.moveTo(283.897100, 477.530220);
//   	ctx.bezierCurveTo(419.006080, 477.530190, 528.546060, 368.005180, 528.546060, 232.889180);
//   	ctx.moveTo(528.546060, 232.889180);
//   	ctx.bezierCurveTo(528.546060, 14.262183, 351.309100, -162.982820, 132.674090, -162.974820);
//   	ctx.moveTo(132.674090, -162.974820);
//   	ctx.bezierCurveTo(-221.082910, -162.974820, -507.863940, 123.805190, -507.857890, 477.562200);
//     ctx.translate(-w/2, -w/2);
//   	ctx.stroke();
//   }
//
// let animate = () => {
//   let i;
//   rotate += 1
//   if (rotate < chgInt*1) {
//     i = 0
//
//   } else if (rotate > chgInt*1 && rotate < chgInt * 2) {
//     i = 1
//   } else if (rotate > chgInt * 2) {
//     i = 2
//   }
//
//   if (rotate > chgInt*3) {
//     rotate = 0
//
//   }
//   ctx.translate(spiralOriginX,spiralOriginY)
//   ctx.rotate(rotationRate)
//   ctx.translate(-spiralOriginX,-spiralOriginY)
//   drawLine(colors[i])
// }
//
//
// $(window).on('wheel keydown', () => {
//   if(shouldAnimate) {
//     animate()
//   } else {
//     ctx.resetTransform(1,0,0,1,0,0)
//     ctx.clearRect(0,0,w,h)
//   }
// })
//
//
// window.addEventListener('click', () => {
//   ctx.resetTransform(1,0,0,1,0,0)
//   ctx.clearRect(0,0,w,h)
// })
//
// };
//
// animateCanvasSpirals();
//
// });

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("goldenRatioCtrl", ["$scope", function($scope) {
  // VARIABLES
  // ============================================================

  // FUNCTIONS
  // ============================================================


//========================== Variables ================================

(function() {

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
  let wW = window.innerWidth;
  let wH = wW * goldenRatio
  let smallScreen
  let landscape
  let rotation = 0
  let sectionCount = sections.length
  let touchStartY = 0
  let touchStartX = 0
  let scale = 0
  let bounds
  let rotationRate = 2
  let chgInt = 178
  let createSpiral
  let spiralSpeed = 11

  let colorSchemes = {
    0: {
      bg: "#4ABDAC",
      accent1: "#FC4A1A",
      accent2: "#F78733",
      text: "#DFDCE3"
    },
    1: {
      bg: "#C0B283",
      accent1: "#DCD0C0",
      accent2: "#F4F4F4",
      text: "#373737"
    },
    2: {
      bg: "#0E0B16",
      accent1: "#A239CA",
      accent2: "#4717F6",
      text: "#E7DFDD"
    },
    3: {
      bg: "#000000",
      accent1: "#062F4F",
      accent2: "#813772",
      text: "#B82601"
    },
    4: {
      bg: "#CAEBF2",
      accent1: "#A9A9A9",
      accent2: "#FF3B3F",
      text: "#EFEFEF"
    },
    5: {
      bg: "#D7CEC7",
      accent1: "#565656",
      accent2: "#76323F",
      text: "#C09F80"
    },
    6: {
      bg: "#18121E",
      accent1: "#233237",
      accent2: "#984B43",
      text: "#EAC67A"
    },
    7: {
      bg: "#94618E",
      accent1: "#49274A",
      accent2: "#F4DECB",
      text: "#F8EEE7"
    },
    8: {
      bg: "#E37222",
      accent1: "#07889B",
      accent2: "#66B9BF",
      text: "#EEAA7B"
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
          svgContainer.style.opacity = '1'
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
      e.preventDefault()
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
      currentSection = i
      updateSpiral()
    })
  })


  let changeColors = (num) => {
    !num ? num = ~~(Math.random()*8) : null
    let colors = colorSchemes[num]
    document.documentElement.style.setProperty('--gr-bg-color', colors.accent1)
    document.documentElement.style.setProperty('--gr-accent-1-color', colors.bg)
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
      changeColors()
    } else {
      document.documentElement.style.setProperty('--gr-bg-color', 'black')
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
    // changeColors()
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

})()

}]);



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

// INITILIZE CONTROLLER
// ============================================================
angular.module("portfolioApp").controller("magnifyCtrl", ["$scope", function($scope) {
  // VARIABLES
  // ============================================================

  // FUNCTIONS
  // ============================================================



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


// event function to move mag-glass around zoomed content
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


}]);

