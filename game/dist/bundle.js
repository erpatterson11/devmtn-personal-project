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


//========================== Canvas SetUp ================================

const canvas = document.querySelector('#gameCanvas')

let gameAspect = 1200 / 780
let screenW = window.innerWidth
let screenH = window.innerHeight
let userAspect = screenW / screenH

canvas.width = 900
canvas.height = 600

let cW = canvas.width
let cH = canvas.height

let ctx = canvas.getContext('2d')

// if (screenW < 900) {
//   console.log('scale');
//   ctx.scale(0.5*gameAspect, 0.5)
//   canvas.width = cW/2
//   canvas.height = cH/
// }

//========================== Background Canvas Setup ================================

const bgCanvas = document.querySelector('#bgCanvas')

bgCanvas.width = cW
bgCanvas.height = cH

let bgCtx = bgCanvas.getContext('2d')

//========================== Image Repo ================================

let images = new function() {
    this.spaceship = new Image()
    this.bullet = new Image()
    this.enemy = new Image()
    this.enemyBullet = new Image()
    this.explosion = new Image()
    this.bg = new Image()

    this.spaceship.src = 'img/ship.png'
    this.bullet.src = 'img/bullet.png'
    this.enemy.src = 'img/enemy.png'
    this.enemyBullet.src = 'img/bullet_enemy.png'
    this.explosion.src ='img/explosion.png'
    this.bg.src = 'img/bg.png'

    this.explosion.spriteWidth = this.explosion.width/50
    this.explosion.frameIndex = 0
}


//========================== Draw Background ================================

bgCtx.drawImage(images.bg, images.bg.width, images.bg.height)

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

//========================== Factory Functions ================================

  const BulletPoolInitialize = (max, speed, image) => {
    let arr = []
    for (let i = 0; i < max; i++) {
      let bullet = {
          alive: false,
          x: -10,
          y: -10,
          speed: speed,
          img: image
      }
      arr.push(bullet)
    }
    return arr
  }


//========================== Player ================================


const PlayerFactory = () => {
  let player = {
      x: 10,
      y: cH/2,
      width: images.spaceship.width,
      height: images.spaceship.height,
      img: images.spaceship,
      speed: 10,
      health: 4
  }

  const updatePlayerHealth = (num) => {
    player.health += num
  }

  const getPlayerInfo = () => {
    return player
  }

  const movePlayer = () => {
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
      // if (KeyStatus.up || KeyStatus.down || KeyStatus.left || KeyStatus.right) {
          ctx.clearRect(player.x, player.y - 2, player.width, player.height * 1.1)
          movePlayer()
          ctx.drawImage(images.spaceship, player.x, player.y)
      // }
  }

  return {
    changeHealth: updatePlayerHealth,
    getInfo: getPlayerInfo,
    movePlayer: movePlayer,
    drawPlayer: drawPlayer
  }
};


//========================== Player Bullets ================================


const PlayerBulletFactory = () => {
  let bulletParams = {
    maxBullets: 100,
    bulletSpeed: 15,
    fireRate: 50,
    lastFire: Date.now(),
    powerup: false
  }

  let bulletPool = BulletPoolInitialize(bulletParams.maxBullets,bulletParams.bulletSpeed,images.bullet)

  let moveBullet = (b) => {
    b.x += b.speed
    if (b.x >= cW) {
      b.alive = false
// TODO: add in function to update score after the bullet leaves the canvas
      // alterScore.bulletMissed()
    }
  }

  let fireOne = (player) => {
    let b = bullets[ 0]
    if (!b.alive) {
        b.alive = true
        b.x = player.x + player.width
        b.y = player.y + player.height / 2
        bullets.push(bullets.shift())
    }
  }

  let fireTwo = (player) => {
    let b = bullets[0]
    if (!b.alive) {
        b.alive = true
        b.x = player.x + player.width
        b.y = player.y + player.height * 0.25
        bullets.push(bullets.shift())
    }
    let bn = bullets[0]
    if (!bn.alive) {
        bn.alive = true
        bn.x = player.x + player.width
        bn.y = player.y + player.height * 0.75
        bullets.push(bullets.shift())
    }
  }

  const drawBullets = () => {
    for (var i = 0; i < bulletPool.length; i++) {
      let b = bulletPool[i]
      if (b.alive) {
        ctx.clearRect(b.x - 1, b.y - 1, b.img.width + 2, b.img.height + 2)
        moveBullet(b)
        ctx.drawImage(b.img, b.x, b.y, b.img.width, b.img.height)
      }
    }
  }

// TODO: add if (KeyStatus.space) condition where this is invoked!
  const shootBullets = (player) => {
    let now = Date.now()
    let dif = now - player.lastFire
    if (dif >= player.fireRate) {
      player.lastFire = now
      if (powerup) {
          fireTwo(player)
      } else {
          fireOne(player)
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
    drawBullets: drawBullets,
    shootBullets: shootBullets,
    changeBulletSpeed: updateBulletSpeed,
    accessPool: accessPool
  }
};

//========================== Enemies ================================

const EnemyFactory = () => {
  let enemyPool = []
  let maxEnemies = 20

  // automatically generate enemies when factory is run
    for (let i = 0; i < maxEnemies; i++) {
      let enemy = {
          alive: false,
          x: random(cW, cW*1.5),
          y: random(0, cH - images.enemy.height),
          speed: random(0.5,2),
          chance: random(0.05, 0.1),
          life: 3,
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
          ctx.clearRect(e.x - 2, e.y - 2, e.img.width + 2, e.img.height + 2)
          moveEnemy(e)
          ctx.drawImage(e.img, e.x, e.y, e.img.width, e.img.height)
      }
    }
  }

  const accessPool = () => {
    return enemyPool
  }

  return {
    spawnEnemies: spawnEnemies,
    shootBullets: shootBullets,
    drawEnemies: drawEnemies,
    accessPool: accessPool
  }
};


//========================== Enemy Bullets ================================


const EnemyBulletFactory = () => {
  let bulletParams = {
    maxBullets: 100,
    bulletSpeed: 15,
  }

  let enemyBulletPool = BulletPoolInitialize(bulletParams.maxBullets,bulletParams.bulletSpeed,images.enemyBullet)

  // automatically fills enemy bullet pool on factory invokation

  let moveEnemyBullet = (b) => {
    b.x -= b.speed
    b.x <= 0 - b.img.width ? b.alive = false : null
  }

  const drawEnemyBullets = () => {
    for (var i = 0; i < enemyBulletPool.length; i++) {
        let b = enemyBulletPool[i]
        if (b.alive) {
            ctx.clearRect(b.x - 1, b.y - 1, b.img.width + 2, b.img.height + 2)
            moveEnemyBullet(b)
            ctx.drawImage(b.img, b.x, b.y, b.img.width, b.img.height)
        }
    }
  }

  const fireBullets = (e) => {
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
    drawEnemyBullets: drawEnemyBullets,
    fireEnemyBullets: fireBullets,
    updateBulletSpeed: updateBulletSpeed,
    accessPool: accessPool
  }
};


//========================== Game Stat Factory ================================

const GameStatFactory = () => {
  let score = 0
  let level = 0


}



  // let explosions = []
  // let maxExplosion = maxEnemies
  //
  // let score = 0
  //
  // let level = 1








const Player = PlayerFactory()
// drawPlayer(), changeHealth(num), getInfo(), movePlayer()
const PlayerBullets = PlayerBulletFactory()
// drawBullets(), shootBullets(Player.getInfo()), updateBulletSpeed(num), accessPool()
const Enemies = EnemyFactory()
// drawEnemies(), spawnEnemies(), shootBullets(), accessPool()
const EnemyBullets = EnemyBulletFactory()
//drawEnemyBullets(), fireEnemyBullets(Enemy.shootBullets()), updateBulletSpeed(num), accessPool()

console.log(Player);
console.log(PlayerBullets);
console.log(Enemies);
console.log(EnemyBullets);

//========================== Sprite Explosions ================================

let generateExplosion = () => {

}


// let animateSprite = (sprite) => {
//   count = 0
//   for (let i = 0; i < sprite.)
// }

//========================== Collision Detection ================================

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

let enemyBulletCollision = (bullets, enemies) => {
  for(let i = 0; i < bullets.length; i++) {
    for(let j = 0; j < enemies.length; j++) {
      if (bullets[i].alive) {
        if (detectCollision(bullets[i], enemies[j])) {
          // alterScore.enemyKilled()
          resetEnemy(enemies[j])
          resetBullet(bullets[i])
        }
      }
    }
  }
}

let palyerBulletCollision = (enemyBullets,player) => {
  for (let i = 0; i < enemyBullets.length; i++) {
    if (detectCollision(enemyBullets[i], player)) {
      player.health--
      // alterScore.hitTaken()
      if (player.health === 0) {
        gameOver()
      }
    }
  }
}

let playerEnemyDetection = (enemies,player) => {
  for (let i = 0; i < enemies.length; i++) {
    if (detectCollision(enemies[i], player)) {
      player.health--
      // alterScore.hitTaken()
      if (player.health === 0) {
        gameOver()
      }
    }
  }
}

let detectAllCollisions = () => {
  enemyBulletCollision(PlayerBullets.accessPool(), Enemies.accessPool())
  palyerBulletCollision(EnemyBullets.accessPool(), Player.getInfo())
  playerEnemyDetection(Enemies.accessPool(), Player.getInfo())
}

let gameOver = () => {
  console.log('game over');
  cancelAnimationFrame(gameloop)
}

let resetEnemy = (e) => {
  // ctx.drawImage(img.explosion, )
  ctx.clearRect(e.x,e.y,e.img.width,e.img.height)
  e.x = random(cW, cW*1.5)
  e.y = random(0, cH - images.enemy.height)
}

let resetBullet = (b) => {
  b.alive = false
  ctx.clearRect(b.x - 1, b.y - 1, b.img.width + 2, b.img.height + 2)
  b.x = 0
  b.y = 0
}

//========================== Manipulate Score ================================
  //
  // let alterScore = {
  //   enemyKilled() {
  //     score += 100
  //     console.log(score);
  //   },
  //   hitTaken() {
  //     score -= 100
  //     console.log(score);
  //
  //   },
  //   bulletMissed() {
  //     score -= 1
  //     console.log(score);
  //   }
  // }

//========================== Game Loop ================================

let init = () => {
    Enemies.spawnEnemies()
}

let gameloop = () => {
    Enemies.drawEnemies()
    PlayerBullets.shootBullets(Player.getInfo())
    EnemyBullets.fireEnemyBullets(Enemies.shootBullets())
    PlayerBullets.drawBullets()
    EnemyBullets.drawEnemyBullets()
    Player.drawPlayer()
    detectAllCollisions()
    requestAnimationFrame(gameloop)
}

window.onload = () => {
    init()
    gameloop()
}
