angular.module('portfolioApp').service('weatherCanvasService', function() {

  //------------------------------------------------------------------------------
  //            Precipitation Canvas
  //------------------------------------------------------------------------------

  let isItRaining
  let isItSnowing
  let reqR
  let reqS

  this.setRainBool = (bool) => {
    isItRaining = bool
  }

  this.setSnowBool = (bool) => {
    isItSnowing= bool
  }


  this.makeItSnow = (precipIntensity, windSpeed) => {
    let ctx = document.getElementById('precipCanvas').getContext('2d');

    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth*2;
    let w = ctx.canvas.width,
        h = ctx.canvas.height;
        console.log(w,h, ctx.canvas.style.width, ctx.canvas.style.height);
    ctx.strokeStyle = '#76b1e2';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';


    let particles = [];
    let snowIntensity = precipIntensity;
    let windySnow = windSpeed;
    let maxParts = snowIntensity * w/4;
    let shouldAnimate = true

    function addParticle() {
      let s = (Math.random() * 5) + 0.5;
      let x = Math.random() * w;
      let y = 0;
      let xs =Math.random() * 2 - 0.5 + windySnow;
      let ys = (Math.random() * 2.5) + 2.5;
      particles.push({ 's': s, 'x': x, 'y': y, 'xs': xs, 'ys': ys })
    }

    function draw() {
      if (particles.length < maxParts) {
        for (let a = 0; a < 5; a++) {
          addParticle()
        }
      }
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < particles.length; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.beginPath()
        // arc(x,y,radius,startAndle,endAndle,anticlockwise)
        ctx.arc(particles[i].x, particles[i].y, particles[i].s, 0, Math.PI * 2, false)
        ctx.fill()
      }
        move()
    }

    function move() {
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i]
        if (isItSnowing) {
          p.x += Math.random() * 2 - 0.5 + windySnow/2;
          p.y += p.ys
        }
        if (p.y > h && isItSnowing) {
          p.y = 0
          p.x = ~~(Math.random()*w) - (h/2)
        } else if (p.y > h && !isItSnowing || p.x > w && !isItSnowing){
          p.ys = 0
          p.y = -5
        } else if (!isItSnowing) {
          p.ys *= 3
        }
      }
  }


  function animate() {
    if (!isItSnowing) {
      setTimeout(() => {
        shouldAnimate = false
        particles = []
        cancelAnimationFrame(reqS)
        ctx.clearRect(0,0,w,h)
      },500)
    }
    draw()
    if (shouldAnimate) {
      reqS = requestAnimationFrame(animate)
    } else {
      return
    }
  }

  if (shouldAnimate) {
    animate()
  }


  }; //---------------------------------------------------------------------------


  // Rain function

  this.makeItRain = function(precipIntensity, windSpeed) {
    let ctx = document.getElementById('precipCanvas').getContext('2d')

    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    let w = ctx.canvas.width,
        h = ctx.canvas.height;
    ctx.strokeStyle = '#76b1e2';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    let windyRain = windSpeed;
    let rainIntensity = precipIntensity;
    let particles = [];
    let maxParts = rainIntensity * w;
    let shouldAnimate = isItRaining

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
        for (let a = 0; a < 5; a++) {
          addParticle()
        }
      }
      ctx.clearRect(0, 0, w, h)
      for (let c = 0; c < particles.length; c++) {
        let p = particles[c]
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys)
        ctx.stroke()
      }
      if (!isItRaining) {
        shouldAnimate = false;
        particles = []
      } else if (isItRaining) {
        move()
      }
    }


    function move() {
      for (let b = 0; b < particles.length; b++) {
        let p = particles[b];
        p.x += p.xs;
        p.y += p.ys;
        if (p.x > w && isItRaining || p.y > h && isItRaining) {
          p.x = Math.random() * w;
          p.y = -20;
        }
      }
    }


    function animate() {
      draw()
      if (isItRaining) {
        reqR = requestAnimationFrame(animate)
      } else {
        return
      }
    }

    if (isItRaining) {
      animate()
    } else {
      cancelAnimationFrame(reqR)
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
  //   let totalStars = 300;
  //   let starArray = []
  //
  //   for (let i = 0; i < totalStars; i++) {
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
  //         return cancelAnimationFrame(isItNight);
  //       }, 500);
  //     }
  //   }
  //   animation()
  // }

}) //-------------------------------------------------------------
