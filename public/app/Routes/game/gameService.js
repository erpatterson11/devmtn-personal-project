// INITILIZE SERVICE
// ============================================================
angular.module("portfolioApp").service("gameService", function(reusableFuncsService) {


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

  const gameContainer = document.querySelector('#game-container')
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

      this.scaleImages = function(scaleX, scaleY) {
        let keys = Object.keys(this)
        keys.map(img => {
          if (typeof images[img] === 'object') {
            images[img].width = images[img].naturalWidth * scaleX
            images[img].height = images[img].naturalHeight * scaleY
          }
        })
      }
  }

  //========================== Spritesheet Repo ================================

  const spriteRepo = new function() {
    this.explosion = new Image()
    this.explosion2 = new Image()

    this.explosion.src = "app/routes/game/media/img/explosion.png"
    this.explosion2.src = "app/routes/game/media/img/explosion-2.png"

    this.scaleImages = function(scaleX, scaleY) {
      let keys = Object.keys(this)
      keys.map(sprite => {
        if (typeof spriteRepo[sprite] === 'object') {
          spriteRepo[sprite].width = spriteRepo[sprite].naturalWidth * scaleX
          spriteRepo[sprite].height = spriteRepo[sprite].naturalHeight * scaleY
        }
      })
    }
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


  //========================== Canvas SetUp ================================

  let ctx = gameCanvas.getContext('2d')

  //========================== Background Canvas Setup ================================

  let bgCtx = bgCanvas.getContext('2d')

  //========================== Explosion Canvas Setup ================================

  let explCtx = explosionCanvas.getContext('2d')

  //========================== Canvas Sizing ================================
    let gameW = 1200
    let gameH = 780
    let gameAspect = gameW / gameH
    let cW
    let cH
    let imgScaleX
    let imgScaleY

  function sizeGame() {
    let screenW = window.innerWidth
    let screenH = window.innerHeight
    let userAspect = screenW / screenH
    if (userAspect > gameAspect) {
      cW = screenH * gameAspect
      cH = screenH
    } else if ( userAspect < gameAspect ) {
      cW = screenW
      cH = screenW / gameAspect
    }
    gameCanvas.width = bgCanvas.width = explosionCanvas.width = cW
    gameCanvas.height = bgCanvas.height = explosionCanvas.height = cH
    gameContainer.style.width = gameCanvas.style.width = bgCanvas.style.width = explosionCanvas.style.width = cW + 'px'
    gameContainer.style.height = gameCanvas.style.height = bgCanvas.style.height = explosionCanvas.style.height = cH + 'px'

    imgScaleX = cW / gameW
    imgScaleY = (cW / gameAspect) / gameH
    images.scaleImages(imgScaleX,imgScaleY)
    spriteRepo.scaleImages(imgScaleX,imgScaleY)
  }

  sizeGame()

  window.addEventListener('resize', reusableFuncsService.debounce(sizeGame))

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
      ctx.drawImage(obj.img, obj.x, obj.y, obj.img.width, obj.img.height)
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

    const DrawSpriteFactory = (totalFrames, frameRate) => {
        let sp = spriteRepo.explosion
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
           explCtx.drawImage(sp,spriteRepo.explosion.width/totalFrames*currentFrame,0,spriteRepo.explosion.width/totalFrames,spriteRepo.explosion.height/totalFrames,x,y,frameWidth,sp.height)
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



    const drawPlayer = () => {
      DrawObject(player,movePlayer)
    }

    return {
      changeHealth: updateHealth,
      get: getPlayerInfo,
      draw: drawPlayer
    }
  }

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
        b.x = player.x + player.img.width
        b.y = player.y + player.img.height / 2
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
        b.x = player.x + player.img.width
        b.y = player.y + player.img.height * 0.25
        bulletPool.push(bulletPool.shift())
      }
      let bn = bulletPool[0]
      if (!bn.alive) {
        audio.laser2.currentTime=0;
        audio.laser2.play()
        bn.alive = true
        bn.x = player.x + player.img.width
        bn.y = player.y + player.img.height * 0.75
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
        b.x = player.x + player.img.width
        b.y = player.y + player.img.height * 0.25
        bulletPool.push(bulletPool.shift())
      }
      let bn = bulletPool[0]
      if (!bn.alive) {
        audio.laser2.currentTime=0;
        audio.laser2.play()
        bn.alive = true
        bn.x = player.x + player.img.width
        bn.y = player.y + player.img.height * 0.75
        bulletPool.push(bulletPool.shift())
      }
      let by = bulletPool[0]
      if (!by.alive) {
        audio.laser3.currentTime=0;
        audio.laser3.play()
        by.alive = true
        by.x = player.x + player.img.width
        by.y = player.y
        bulletPool.push(bulletPool.shift())
      }
      let bz = bulletPool[0]
      if (!bz.alive) {
        bz.alive = true
        bz.x = player.x + player.img.width
        bz.y = player.y + player.img.height
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
      Explosion = DrawSpriteFactory(46, 60)
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
      toggleMute: toggleMutePage,
      stop: cancelRAF
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

  this.stopGame = function() {
    return Game.stop()
  }



});
