(function() {

    'use strict';

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

})
