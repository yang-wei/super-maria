;(function(window, undefined) {
    'use strict';


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
                    var Actor = actorChars[character], type;
                    
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

        Level.prototype.isFinished = function() {
            return this.status != null && this.finishedDelay < 0;
        };

    function Player(pos) {
        // player position 
        this.pos = pos.plus(new Vector(0, -0.5));

        // player size
        this.size = new Vector(0.8, 1.5);

        // set initial speed to 0
        this.speed = new Vector(0, 0);
    }

    Player.prototype.type = "player";

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
    var scale = 20;
    // draw static elements - wall, static lava, space 
    DisplayView.prototype.drawBackground = function() {
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
    };
    
    // draw dynamic elements - player, moving lava, coin
    DisplayView.prototype.drawActors = function() {
        var wrap = elem("div");
        this.level.actors.forEach(function(actor) {
            var actorElem = wrap.appendChild(elem("div", "actor " + actor.type));
            actorElem.style.width = actor.size.x * scale + "px";
            actorElem.style.height = actor.size.y * scale + "px";
            actorElem.style.left = actor.pos.x * scale + "px";
            actorElem.style.top = actor.pos.y * scale + "px";          
        });
        return wrap;
    };
   
    // draw frame
    DisplayView.prototype.drawFrame = function() {
        if(this.actorLayer) 
            this.wrap.removeChild(this.actorLayer);
        this.actorLayer = this.wrap.appendChild(this.drawActors()); 
        this.wrap.className = "game " + (this.level.status || ""); 
        this.scrollPlayerIntoView();
    };

    DisplayView.prototype.scrollPlayerIntoView = function() {
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
    };
    
    DisplayView.prototype.clear = function() {
        this.wrap.parentNode.removeChild(this.wrap);
    };


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

    // init
    var simpleLevel = new Level(simpleLevel);
    // console.log(simpleLevel.width, 'x', simpleLevel.height);
    var display = new DisplayView(document.body, simpleLevel); 

})(window);
