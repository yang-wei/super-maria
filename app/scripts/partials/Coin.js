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
