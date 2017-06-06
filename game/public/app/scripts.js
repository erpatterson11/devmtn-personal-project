// Flying shooter game
// Features:
//    Map moves automatically
//    Player can move up, down, left, right anywhere on screen
//    3 different types of enemies
//    Player has health bar
//    3 Different powerups that change the way you shoot
//    Keeps track of score
//         - Enemies killed
//         - Damage taken
//         - Accuracy
//    Login to save/load scores


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
canvasContainer.style.height = `${cH}px`

console.log(canvasContainer.width, canvasContainer.height);

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

    this.spaceship.src = 'img/ship.png'
    this.bullet.src = 'img/bullet.png'
    this.enemy.src = 'img/enemy.png'
    this.enemyBullet.src = 'img/bullet_enemy.png'
    this.explosion.src ='img/explosion.png'
    this.bg.src = 'img/spr_stars01.png'
    this.bg2.src = 'img/spr_stars02.png'
    this.powerup1.src = 'img/powerup1.png'
    this.powerup2.src = 'img/powerup2.png'
    this.powerup3.src = 'img/powerup3.png'
}

//========================== Audio Repo ================================

const audio = new function() {
  this.laser1 = new Audio()
  this.laser2 = new Audio()
  this.laser3 = new Audio()

  this.explosion = new Audio()
  this.explosion2 = new Audio()

  this.laser1.src = 'audio/laser.wav'
  this.laser2.src = 'audio/turret-1.wav'
  this.laser3.src = 'audio/wlkrsht2.wav'
  this.explosion.src = 'audio/explosion.wav'
  this.explosion2.src = 'audio/explosion2.wav'

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

  healthText.innerText = `Health: ${player.maxHealth}`
  healthBarFill.style.width = '0%'

  const updateHealth = (num) => {
    player.health += num

    let healthPercent = 100 - (100 * player.health/player.maxHealth)
    healthText.innerText = `Health: ${player.health}`
    healthBarFill.style.width = `${healthPercent}%`
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
    b.x = 0
    b.y = 0
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
