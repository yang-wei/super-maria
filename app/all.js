;(function(window, undefined) {
    'use strict';


    // level
    var simpleLevel = [
        "                     ",
        "                 =x  ",
        "   x         oo   x  ",
        "   x@       xxxx  x  ",
        "   xxxxxx         x  ",
        "        x!!!!!!!!!x  ",
        "        xxxxxxxxxxx  ",
        "                     "
    ];

    // defined character for each symbol
    var actorChars = {
        "@": Player,
        "o": Coin,
        "=": Lava,
        "|": Lava,
        "v": Lava 
    };

    function Coin(pos) {
        this.basePos = this.pos = pos.plus(new Vector(0.1, 0.1));
        this.size = new Vector(0.6, 0.6);
        // prop used when give the coin some motion
        this.wobble = 2 * Math.PI * Math.random();
    }

    Coin.prototype.type = "coin";


    // Lava type
    // moving horizontally -> =
    // moving vertically   -> |
    // dripping lava       -> v
    function Lava(pos, type) {
        this.pos = pos;
        this.size = new Vector(1, 1);

        if (type === "=") {
            this.speed = new Vector(2, 0);
        } else if (type === "|") {
            this.speed = new Vector(0, 2); 
        } else if (type === "v") {
            this.speed = new Vector(0, 2);
            this.repeatPos = pos;
        }
    }    

    Lava.prototype.type = "Lava";


    function Level(plan) {
            this.width = plan[0].length;
            this.height = plan.length;
            // a table which stores the static level plan
            this.grid = [];
            // a collection of moving characters on the level plan
            this.actors = [];
             
            for (var y = 0; y < this.height; y++) {
                var line = plan[y], gridLine = [];
                for (var x = 0; x < this.width; x++) {
                    var character = line[x];
                    // check if character is property of actorChars 
                    var Actor = actorChars[character];
                    
                    if (Actor) {
                        // initial position of dynamic characters need to be stored
                        this.actors.push(Actor)
                    } else if (character === "x") {
                        type = "wall"; 
                    } else if (character === "!") {
                        type = "lava";
                    }
                    gridLine.push(type);
                }
                this.grid.push(gridline);
            }
            // filter out the player
            this.player = this.actors.filter(function(actor) {
               return actor.type === "player";
            })[0];
            
            // game status (win or lose)
            this.status = this.finishDelay = null;
            
        }

        Level.prototype.isFinished = function() {
            return this.status != null && this.finishedDelay < 0;
        };

    function Player(pos) {
        // player position 
        this.pos = pos.plus(new Vector(0, -0.5));

        // player size
        this.size = pos.times(new Vector(0.8, 1.5));

        // set initial speed to 0
        this.speed = new Vector(0, 0);
    }

    Player.prototype.type = "Player";

    function Vector(x,y) {
        this.x = x;
        this.y = y;
    }

    Vector.prototype.plus = function(step) {
        return new Vector(this.x + step.x, this.y + step.y);
    };

    Vector.prototype.times = function(factor) {
        return new Vector(this.x * factor, this.y * factor);
    };


})(window);
