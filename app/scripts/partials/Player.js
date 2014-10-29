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
