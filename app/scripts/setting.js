    // Augmenting Function.prototype to avoid typing too many prototypes
    Function.prototype.method = function(name, fn) {
        if(!this.prototype[name]) {
            this.prototype[name] = fn;
            return this;
        }
    };    

    // propertis of actor's action
    var opts = {
        scale: 20, // TODO: width of td is set in style.css because of unknown browser default behaviour
        maxStep : 0.05,
        wobbleSpeed : 10,
        wobbleDist: 0.05,
        playerXSpeed: 7,
        gravity: 30,
        jumpSpeed: 17
    };


