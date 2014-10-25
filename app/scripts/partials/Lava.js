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

