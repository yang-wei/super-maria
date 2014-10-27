    function Player(pos) {
        // player position 
        this.pos = pos.plus(new Vector(0, -0.5));

        // player size
        this.size = new Vector(0.8, 1.5);

        // set initial speed to 0
        this.speed = new Vector(0, 0);
    }

    Player.prototype.type = "player";
