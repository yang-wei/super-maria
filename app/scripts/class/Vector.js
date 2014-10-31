    function Vector(x,y) {
        this.x = x;
        this.y = y;
    }

    Vector.method("plus", function(step) {
        return new Vector(this.x + step.x, this.y + step.y);
    });

    Vector.method("times", function(factor) {
        return new Vector(this.x * factor, this.y * factor);
    });

