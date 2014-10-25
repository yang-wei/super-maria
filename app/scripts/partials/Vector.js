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

