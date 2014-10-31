;(function(window, undefined) {
    'use strict';


    // Augmenting Function.prototype to avoid typing too many prototypes
    Function.prototype.method = function(name, fn) {
        if(!this.prototype[name]) {
            this.prototype[name] = fn;
            return this;
        }
    };    

    // propertis of actor's action
    var opts = {
        scale: 20, // TODO: width of td is set in style.css because of unknown browser default behaviour
        maxStep : 0.05,
        wobbleSpeed : 10,
        wobbleDist: 0.05,
        playerXSpeed: 7,
        gravity: 30,
        jumpSpeed: 17
    };



    function Coin(pos) {
        this.basePos = this.pos = pos.plus(new Vector(0.1, 0.1));
        this.size = new Vector(0.6, 0.6);
        // prop used when give the coin some motion
        this.wobble = 2 * Math.PI * Math.random();

        this.type = "coin";
    }
    
    Coin.method("act", function(step) {
        this.wobble += step * opts.wobbleSpeed;
        var wobblePos = Math.sin(this.wobble) * opts.wobbleDist;
        this.pos = this.basePos.plus(new Vector(0, wobblePos)); 
    });

    // Lava type
    // moving horizontally -> =
    // moving vertically   -> |
    // dripping lava       -> v
    function Lava(pos, type) {
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.type = "lava";
        
        if (type === "=") {
            this.speed = new Vector(2, 0);
        } else if (type === "|") {
            this.speed = new Vector(0, 2); 
        } else if (type === "v") {
            this.speed = new Vector(0, 2);
            this.repeatPos = pos;
        }
    }    

    Lava.method("act", function(step, level){
        var newPos = this.pos.plus(this.speed.times(step));
        if(!level.isBlockedAt(newPos, this.size))
            this.pos = newPos;
        else if(this.repeatPos)
            this.pos = this.repeatPos; 
        else
            this.speed = this.speed.times(-1);
    });
    

    function Level(plan) {
            this.width = plan[0].length;
            this.height = plan.length;
            // a table which stores the static level plan
            this.grid = [];
            // a collection of moving characters on the level plan
            this.actors = [];
            // fill in grid and actors arrays 
            for (var y = 0; y < this.height; y++) {
                var line = plan[y], gridLine = [];
                for (var x = 0; x < this.width; x++) {

                    var character = line[x],
                    // check if character is property of actorChars 
                        Actor = actorChars[character],
                        type = null;
                    
                    if (Actor) {
                        // initial position of dynamic characters need to be stored
                        this.actors.push(new Actor(new Vector(x,y), character));
                    } else if (character === "x") {
                        type = "wall";
                    } else if (character === "!") {
                        type = "lava";
                    }
                    gridLine.push(type);
                }
                this.grid.push(gridLine);
            }
            // filter out the player
            this.player = this.actors.filter(function(actor) {
               return actor.type === "player";
            })[0];
            
            // game status (win or lose)
            this.status = this.finishDelay = null;
            
        }

        Level.method("isFinished", function() {
            return this.status !== null && this.finishDelay < 0;
        });
        
        // return the type of character in a position
        Level.method("isBlockedAt", function(pos, size) {
            var xStart = Math.floor(pos.x),
                xEnd = Math.ceil(pos.x + size.x),
                yStart = Math.floor(pos.y),
                yEnd = Math.ceil(pos.y + size.y);     

            if(xStart < 0 || xEnd > this.width || yStart < 0)
                return "wall";
            if(yEnd > this.height)
                return "lava";
            for(var y = yStart; y < yEnd; y++) {
                for(var x = xStart; x < xEnd; x++) {
                    // if its not space
                    var type = this.grid[y][x];
                    if(type) return type;
                }
            }
        });
        
        // function to check if 2 actor on same position 
        Level.method("actorAt", function(actor) {
            for(var i = 0; i < this.actors.length; i++) {
                var otherActor = this.actors[i];
                if( otherActor !== actor &&
                    actor.pos.x + actor.size.x > otherActor.pos.x &&
                    actor.pos.x < otherActor.pos.x + otherActor.size.x &&
                    actor.pos.y + actor.size.y > otherActor.pos.y &&
                    actor.pos.y < otherActor.pos.y + otherActor.size.y 
                  )
                return otherActor;    
            }
        });
        
        Level.method("animate", function(step, keys) {
            if(this.status != null)
               this.finishDelay -= step; 
            while(step > 0) {
               var thisStep = Math.min(step, opts.maxStep);
               this.actors.forEach(function(actor) {
                    actor.act(thisStep, this, keys);
               }, this);
               step -= thisStep;
           }
        });

        // react to what player had touch to decide win or lost
        Level.method("playerTouched", function(type, actor) {
            if(type === "lava" && this.status === null) {
                this.status = "lost";
                this.finishedDelay = 1;
            } else if(type === "coin") {
                // remove collected coin
                this.actors = this.actors.filter(function(other) {
                    return other !== actor;
                });
                // check if all coins are collected
                var allCoinsCollected = !this.actors.some(function(actor) {
                    return actor.type === "coin";
                });
                if(allCoinsCollected) {
                    this.status = "won";
                    this.finishedDelay = 1;
                }
            }
        });

    function Player(pos) {
        // player position 
        this.pos = pos.plus(new Vector(0, -0.5));

        // player size
        this.size = new Vector(0.8, 1.5);

        // set initial speed to 0
        this.speed = new Vector(0, 0);
        this.type = "player";
    }

    Player.method("moveX", function(step, level, keys) {
        this.speed.x = 0;
        if (keys.left) {
            this.speed.x -= opts.playerXSpeed;
        }
        if (keys.right) {
            this.speed.x += opts.playerXSpeed;
        }

        var motion = new Vector(this.speed.x * step, 0);
        var newPos = this.pos.plus(motion);
        var obstacle = level.isBlockedAt(newPos, this.size);
        if(obstacle) {
            level.playerTouched(obstacle);
        } else {
            this.pos = newPos;
        }
    });

    Player.method("moveY", function(step, level, keys) {
        this.speed.y += step * opts.gravity;
        var motion = new Vector(0, this.speed.y * step);
        var newPos = this.pos.plus(motion);
        var obstacle = level.isBlockedAt(newPos, this.size);
        if(obstacle) {
            level.playerTouched(obstacle);
            if(keys.up && this.speed.y > 0)
                this.speed.y = -opts.jumpSpeed;
            else
                this.speed.y = 0;
        } else {
            this.pos = newPos;
        }
    });

    Player.method("act", function(step, level, keys) {
        this.moveX(step, level, keys);
        this.moveY(step, level, keys);

        var otherActor = level.actorAt(this);    
        // player touches other actors
        if(otherActor)
            level.playerTouched(otherActor.type, otherActor);

        // Losing animation
        if(level.status === "lost") {
            this.pos.y += step;
            this.size.y -= step;
        }
    });

    function Vector(x,y) {
        this.x = x;
        this.y = y;
    }

    Vector.method("plus", function(step) {
        return new Vector(this.x + step.x, this.y + step.y);
    });

    Vector.method("times", function(factor) {
        return new Vector(this.x * factor, this.y * factor);
    });


    // helper function to create new element with class
    function elem(name, className) {
        var elt = document.createElement(name);
        if(className)
            elt.className = className;
        return elt;
    }

    function DisplayView(parent, level) {
        // create a display container
        var gameContainer = elem("div", "game");
        this.wrap = parent.appendChild(gameContainer);
        this.level = level;
        this.wrap.appendChild(this.drawBackground());
        this.actorLayer = null;
        this.drawFrame();
    }

    // set the scale to pixel to display element
    var scale = opts.scale;
    // draw static elements - wall, static lava, space 
    DisplayView.method("drawBackground", function() {
        var table = elem("table", "background");
        table.style.width = this.level.width * scale + "px";
        this.level.grid.forEach(function(line) {
            var row = table.appendChild(elem("tr"));
            row.style.height = scale + "px";
            line.forEach(function(type) {
                row.appendChild(elem("td", type))
            });
        });
        return table;
    });
    
    // draw dynamic elements - player, moving lava, coin
    DisplayView.method("drawActors", function() {
        var wrap = elem("div");
        this.level.actors.forEach(function(actor) {
            var actorElem = wrap.appendChild(elem("div", "actor " + actor.type));
            actorElem.style.width = actor.size.x * scale + "px";
            actorElem.style.height = actor.size.y * scale + "px";
            actorElem.style.left = actor.pos.x * scale + "px";
            actorElem.style.top = actor.pos.y * scale + "px";          
        });
        return wrap;
    });
   
    // draw frame
    DisplayView.method("drawFrame", function() {
        if(this.actorLayer) 
            this.wrap.removeChild(this.actorLayer);
        this.actorLayer = this.wrap.appendChild(this.drawActors()); 
        this.wrap.className = "game " + (this.level.status || ""); 
        this.scrollPlayerIntoView();
    });

    DisplayView.method("scrollPlayerIntoView", function() {
        var width = this.wrap.clientWidth,
            height = this.wrap.clientHeight,
            margin = width / 3;

        // view port
        var left = this.wrap.scrollLeft,
            top = this.wrap.scrollTop,
            right = left + width,
            bottom = top + height;
             
        // player position
        var player = this.level.player,
            center = player.pos.plus(player.size.times(0.5)).times(scale);
        // scrolling viewport according to player position
        if(center.x < left + margin)
            this.wrap.scrollLeft = center.x - margin;
        else if(center.x > right - margin)
            this.wrap.scrollLeft = center.x + margin -width;
        if(center.y < top + margin)
            this.wrap.scrollTop = center.y - margin;
        else if(center.y > bottom - margin)
            this.wrap.scrollTop = center.y + margin -height;
    });
    
    DisplayView.method("clear" ,function() {
        this.wrap.parentNode.removeChild(this.wrap);
    });


    // defined character for each symbol
    var actorChars = {
        "@": Player,
        "o": Coin,
        "=": Lava,
        "|": Lava,
        "v": Lava 
    };
    
        // keyboard tracking keys
    var keyboardCodes= {
        27: 'escape',
        32: 'spacebar',
        37: 'left',
        38: 'up',
        39: 'right'
    };

    function trackKeys(codes) {
       var keyPressed = Object.create(null);
       function handler(event) {
        if(codes.hasOwnProperty(event.keyCode)) {
            var down = event.type === "keydown";
            keyPressed[codes[event.keyCode]] = down;
            event.preventDefault();
        }
       }
      addEventListener("keydown", handler);
      addEventListener("keyup", handler); 
      return keyPressed;
    }

    var arrows = trackKeys(keyboardCodes);

    function displayWinMsg() {
        document.getElementById("win-msg").style.display = "block";
    }

    function hideWinMsg() {
        document.getElementById("win-msg").style.display = "none";
    }

    function runAnimation(frameFunc) {
        var start = null;

        function frame(timeStamp) {
            var stop = false;
            if(start !== null) {
                var progress = Math.min(timeStamp - start, 100) / 1000;
                stop = frameFunc(progress) === false;
            }
            start = timeStamp;
            if(!stop)
                requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    
    function runLevel(level, Display, callback) {
       var view = new DisplayView(document.body, level);
       runAnimation(function(step) {
            level.animate(step, arrows);
            view.drawFrame(step);
            if(level.isFinished()) {
                view.clear();
                if(callback)
                    callback(level.status);
                return false;
            } 
       }); 
    }

    function runGame(plans, Display) {
       function startLevel(n) { 
            runLevel(new Level(plans[n]), Display, function(status) {
                if (status === "lost") 
                    startLevel(n);
                else if (n < plans.length - 1)
                    startLevel(n + 1);
                else
                    displayWinMsg(); 
            }); 
       }
      startLevel(0); 
    }
    
    function startGame() {
        runGame(GAME_LEVELS, DisplayView);
    }

    // restart game after winning
    var restart = document.getElementsByClassName("restart-btn")[0];
    restart.addEventListener("click", function(){
        startGame();
        hideWinMsg();
    });

    startGame();

})(window);
