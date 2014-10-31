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
    
