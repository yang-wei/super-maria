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
