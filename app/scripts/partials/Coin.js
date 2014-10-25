    function Coin(pos) {
        this.basePos = this.pos = pos.plus(new Vector(0.1, 0.1));
        this.size = new Vector(0.6, 0.6);
        // prop used when give the coin some motion
        this.wobble = 2 * Math.PI * Math.random();
    }

    Coin.prototype.type = "coin";

