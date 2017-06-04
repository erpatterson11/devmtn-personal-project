// Flying shooter game
// Features:
//    Map moves automatically
//    Player can move up, down, left, right anywhere on screen
//    3 different types of enemies
//        - Jet
//        - Helicopter
//        - Bomber
//    Play has health bar
//    3 Different powerups that change the way you shoot
//    Keeps track of score
//         - Enemies killed
//         - Damage taken
//         - Accuracy
//    Login to save/load scores




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

//========================== Image Repo ================================

let images = new function() {
    this.spaceship = new Image()
    this.bullet = new Image()
    this.enemy = new Image()
    this.enemyBullet = new Image()

    this.spaceship.src = 'img/ship.png'
    this.bullet.src = 'img/bullet.png'
    this.enemy.src = 'img/enemy.png'
    this.enemyBullet.src = 'img/bullet_enemy.png'
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

//========================== Game State ================================

let player = {
    x: 10,
    y: cH/2,
    width: images.spaceship.width,
    height: images.spaceship.height,
    img: images.spaceship,
    speed: 10
}

let bullets = []
let maxBullets = 100
let bulletSpeed = 15
let fireRate = 50
let lastFire = Date.now()
let powerup = false

let enemies = []
let maxEnemies = 20
let enemyBullets = []
let enemyBulletSpeed = 15

let score = 0
// let scoreElement = document.querySelector('#score')


//========================== Re-usable Functions ================================


function random(min, max) {
    return (Math.random() * (max - min)) + min
}

//========================== Player ================================

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

let drawPlayer = () => {
    // if (KeyStatus.up || KeyStatus.down || KeyStatus.left || KeyStatus.right) {
        ctx.clearRect(player.x, player.y - 2, player.width, player.height * 1.1)
        movePlayer()
        ctx.drawImage(images.spaceship, player.x, player.y)
    // }
}

//========================== Player Bullets ================================

let generateBulletPool = (maxBullets) => {
    for (let i = 0; i < maxBullets; i++) {
        let bullet = {
            alive: false,
            x: 0,
            y: 0,
            speed: bulletSpeed,
            img: images.bullet
        }
        bullets.push(bullet)
    }
}

let fireOne = () => {
    let b = bullets[ 0]
    if (!b.alive) {
        b.alive = true
        b.x = player.x + player.width
        b.y = player.y + player.height / 2
        bullets.push(bullets.shift())
    }
}

let fireTwo = () => {
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


let shootBullets = () => {
    if (KeyStatus.space) {
      let now = Date.now()
      let dif = now - lastFire
      if (dif >= fireRate) {
        lastFire = now
        if (powerup) {
            fireTwo()
        } else {
            fireOne()
        }
      }

    }
}

let moveBullet = (b) => {
    b.x += b.speed
    b.x >= cW ? b.alive = false : null
}


let drawBullets = () => {
    for (var i = 0; i < bullets.length; i++) {
        let b = bullets[i]
        if (b.alive) {
            ctx.clearRect(b.x - 1, b.y - 1, b.img.width + 2, b.img.height + 2)
            moveBullet(b)
            ctx.drawImage(b.img, b.x, b.y, b.img.width, b.img.height)
        }
    }
}

//========================== Enemies ================================

let generateEnemies = (maxEnemies) => {
    for (let i = 0; i < maxEnemies; i++) {
        let enemy = {
            alive: false,
            x: random(cW, cW*1.5),
            y: random(0, cH - images.enemy.height),
            speed: random(0.5,2),
            chance: random(0.05, 0.1),
            img: images.enemy
        }
        enemies.push(enemy)
    }
}

let spawnEnemies = () => {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].alive = true
    }
}

let drawEnemies = () => {
    for (var i = 0; i < enemies.length; i++) {
        let e = enemies[i]
        if (e.alive) {
            ctx.clearRect(e.x - 2, e.y - 2, e.img.width + 2, e.img.height + 2)
            moveEnemy(e)
            ctx.drawImage(e.img, e.x, e.y, e.img.width, e.img.height)
        }
    }
}

let moveEnemy = (e) => {
  e.x -= e.speed
  e.x <= 0 ? e.x = random(cW, cW*1.5) : null
}

//========================== Enemy Bullets ================================

let generateEnemeyBulletPool = (maxBullets) => {
    for (let i = 0; i < maxBullets; i++) {
        let bullet = {
            alive: false,
            x: 0,
            y: 0,
            speed: enemyBulletSpeed,
            img: images.enemyBullet
        }
        enemyBullets.push(bullet)
    }
}

let fireEnemybullet = (e) => {
    let b = enemyBullets[0]
    if (!b.alive) {
        b.alive = true
        b.x = e.x + e.img.width
        b.y = e.y + e.img.height / 2
        enemyBullets.push(enemyBullets.shift())
    }
}

let shootEnemyBullets = () => {
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i]
    let chance = random(0,50)
    if (chance < e.chance) {
      fireEnemybullet(e)
    }
  }
}

let moveEnemyBullet = (b) => {
    b.x -= b.speed
    b.x <= 0 - b.img.width ? b.alive = false : null
}

let drawEnemyBullets = () => {
    for (var i = 0; i < enemyBullets.length; i++) {
        let b = enemyBullets[i]
        if (b.alive) {
            ctx.clearRect(b.x - 1, b.y - 1, b.img.width + 2, b.img.height + 2)
            moveEnemyBullet(b)
            ctx.drawImage(b.img, b.x, b.y, b.img.width, b.img.height)
        }
    }
}

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

let gameOver = () => {
  console.log('game over');
  cancelAnimationFrame(gameloop)
}

let resetEnemy = (e) => {
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

let enemyBulletCollision = () => {
  for(let i = 0; i < bullets.length; i++) {
    for(let j = 0; j < enemies.length; j++) {
      if (bullets[i].alive) {
        if (detectCollision(bullets[i], enemies[j])) {
          score += 10
          console.log(score);
          resetEnemy(enemies[j])
          resetBullet(bullets[i])
        }
      }
    }
  }
}

let palyerBulletCollision = () => {
  for (let i = 0; i < enemyBullets.length; i++) {
    if (detectCollision(enemyBullets[i], player)) {
      // console.log('playerBulletCollision');
      gameOver()
    }
  }
}

let playerEnemyDetection = () => {
  for (let i = 0; i < enemies.length; i++) {
    if (detectCollision(enemies[i], player)) {
      gameOver()
    }
  }
}

let detectAllCollisions = () => {
  enemyBulletCollision()
  palyerBulletCollision()
  playerEnemyDetection()
}



//========================== Game Loop ================================

let init = () => {
    generateBulletPool(maxBullets)
    generateEnemeyBulletPool(maxBullets)
    generateEnemies(maxEnemies)
    spawnEnemies()
}

let gameloop = () => {
    drawEnemies()
    shootBullets()
    shootEnemyBullets()
    drawBullets()
    drawEnemyBullets()
    drawPlayer()
    detectAllCollisions()
    requestAnimationFrame(gameloop)
}

window.onload = () => {
    init()
    gameloop()
}
