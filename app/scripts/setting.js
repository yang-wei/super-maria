    // Augmenting Function.prototype to avoid typing too many prototypes
    Function.prototype.method = function(name, fn) {
        if(!this.prototype[name]) {
            this.prototype[name] = fn;
            return this;
        }
    };    

    // propertis of actor's action
    var opts = {
        maxStep : 0.05,
        wobbleSpeed : 8,
        wobbleDist: 0.05,
        playerXSpeed: 7,
        gravity: 30,
        jumpSpeed: 17
    };

    // keyboard tracking keys
    var keyboardCodes= {
        27: 'escape',
        32: 'spacebar',
        37: 'left',
        38: 'up',
        39: 'right'
    };

    function trackKeys(codes) {
       var keyPressed = Object.create(null);
       function handler(event) {
        if(codes.hasOwnProperty(event.keycode)) {
            var down = event.type === "keydown";
            keyPressed[codes[event.keycode]] = "down";
            event.preventDefault();
        }
       }
      addEventListener("keydown", handler);
      addEventListener("keyup", handler); 
      return keyPressed;
    }

