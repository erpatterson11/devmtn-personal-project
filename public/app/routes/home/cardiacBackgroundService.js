angular.module('portfolioApp').service('pulseParticlesService', function() {

this.bloody = function(canv) {
//                
            let particleSize = 20,
                particleCount = 110,
                interval = 200,
                W = window.innerWidth,
                H = window.innerHeight,
                ctx, //ctx stands for context and is the "curso" of our canvas element.
                particles = []; //this is an array which will hold our particles Object/Class

                let canvas = canv;
                canvas.width = W;
                canvas.height = H;

                window.addEventListener('resize', function() {
                    console.log('resyzed')
                    W = window.innerWidth
                    H = window.innerHeight
                    canvas.width = W
                    canvas.height = H
                })


                ctx = canvas.getContext("2d"); // settng the context to 2d rather than the 3d WEBGL
                ctx.globalCompositeOperation = "lighter";
                let mouse = {
                x: 0, 
                y: 0,
                rx:0,
                ry:0,
                speed:45,
                delta:0
                };

                let counter = 0;
            
                function randomNorm(mean, stdev) {
                
                return Math.abs(Math.round((Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1))*stdev)+mean;
                }

                //Setup particle class
                function Particle() {
                    //using hsl is easier when we need particles with similar colors
                    this.h=parseInt(360,10);
                    this.s=parseInt(55 * Math.random() + 50,10);
                    this.l=parseInt(25 * Math.random() + 50,10);
                    this.a=0.5*Math.random() ;
                
                    this.color = "hsla("+ this.h +","+ this.s +"%,"+ this.l +"%,"+(this.a)+")";
                    this.shadowcolor = "hsla("+ this.h +","+ this.s +"%,"+ this.l +"%,"+parseFloat(this.a-0.55)+")";
                

                    
                    this.x = Math.random() * W;
                    this.y = Math.random() * H;
                    this.direction = {
                        "x": -1 + Math.random() * 2,
                        "y": -1 + Math.random() * 2
                    };
                    // this.radius = 9 * ((Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1)+3);
                    this.radius = randomNorm(0,particleSize); //PARTICLE SIZE
                    this.scale=0.8*Math.random()+0.5;
                    this.rotation=Math.PI/4*Math.random();
                
                    this.grad=ctx.createRadialGradient( this.x, this.y, this.radius, this.x, this.y, 0 );
                    this.grad.addColorStop(0,this.color);
                    this.grad.addColorStop(1,this.shadowcolor);
                
                    this.vx = (2 * Math.random() + 1)*.01*this.radius;
                    this.vy = (2 * Math.random() + 1)*.01*this.radius;
                    this.defaultx = this.vx;
                    this.defaulty = this.vy;

                    this.speedup = function(){
                        this.vx += .1;
                        this.vy += .1;
                    }

                    this.slowdown = function(){
                        this.vx -= .02;
                        this.vy -= .02;

                        if(this.vx < this.defaultx) this.vx = this.defaultx;
                        if(this.vy < this.defaulty) this.vy = this.defaulty;
                    }
                    
                    this.valpha = 0.01*Math.random()-0.02;
                    
                    this.move = function () {
                        this.x += this.vx * this.direction.x ;
                        this.y += this.vy * this.direction.y ;
                        this.rotation+=this.valpha;
                        //this.radius*= Math.abs((this.valpha*0.01+1));

                    };
                    this.changeDirection = function (axis) {
                        this.direction[axis] *= -1;
                        this.valpha *= -1;
                    };
                    this.draw = function () {
                        ctx.save();
                        ctx.translate(this.x+mouse.rx/-20*this.radius,this.y+mouse.ry/-20*this.radius);  
                    ctx.rotate(this.rotation);  
                    ctx.scale(1,this.scale);
                        
                        this.grad=ctx.createRadialGradient( 0, 0, this.radius, 0, 0, 0 );
                        this.grad.addColorStop(1,this.color);
                        this.grad.addColorStop(0,this.shadowcolor);
                        ctx.beginPath();
                        ctx.fillStyle = this.grad;
                        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
                        ctx.fill();
                        ctx.restore();

                        
                    };
                    this.boundaryCheck = function () {
                        if (this.x >= W*1.2) {
                            this.x = W*1.2;
                            this.changeDirection("x");
                        } else if (this.x <= -W*0.2) {
                            this.x = -W*0.2;
                            this.changeDirection("x");
                        }
                        if (this.y >= H*1.2) {
                            this.y = H*1.2;
                            this.changeDirection("y");
                        } else if (this.y <= -H*0.2) {
                            this.y = -H*0.2;
                            this.changeDirection("y");
                        }
                    };
                } //end particle class

                function clearCanvas() {
                    ctx.clearRect(0, 0, W, H);
                } //end clear canvas

                function createParticles() {
                    for (let i = particleCount - 1; i >= 0; i--) {
                        let p = new Particle();
                        particles.push(p);
                    }
                } // end createParticles

                function drawParticles() {
                    for (let i = particleCount - 1; i >= 0; i--) {
                        let p = particles[i];
                        p.draw();
                    }

                
                } //end drawParticles

                function updateParticles() {
                    for (let i = particles.length - 1; i >= 0; i--) {
                        let p = particles[i];
                        p.move();
                        p.boundaryCheck();

                    }
                } //end updateParticles

                function heartBeat(){
                counter ++

                if (counter < interval) return
                if (counter >= interval && counter < interval + 15) {
                for (let i = particleCount - 1; i >= 0; i--) {
                        let p = particles[i];
                        p.speedup(); }
                } else if(counter >= interval + 15 && counter < interval + 90) {
                for (let i = particleCount - 1; i >= 0; i--) {
                        let p = particles[i];
                        p.slowdown(); }
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
                    heartBeat()
                    drawParticles();
                    updateParticles();
                    requestAnimationFrame(animateParticles);
                }
            
                initParticleSystem();
                requestAnimationFrame(animateParticles);  
            
            }  



})
