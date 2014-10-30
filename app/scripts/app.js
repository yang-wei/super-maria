    // defined character for each symbol
    var actorChars = {
        "@": Player,
        "o": Coin,
        "=": Lava,
        "|": Lava,
        "v": Lava 
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
        if(codes.hasOwnProperty(event.keyCode)) {
            var down = event.type === "keydown";
            keyPressed[codes[event.keyCode]] = down;
            event.preventDefault();
        }
       }
      addEventListener("keydown", handler);
      addEventListener("keyup", handler); 
      return keyPressed;
    }

    var arrows = trackKeys(keyboardCodes);

    function displayWinMsg() {
        document.getElementById("win-msg").style.display = "block";
    }

    function hideWinMsg() {
        document.getElementById("win-msg").style.display = "none";
    }

    function runAnimation(frameFunc) {
        var start = null;

        function frame(timeStamp) {
            var stop = false;
            if(start !== null) {
                var progress = Math.min(timeStamp - start, 100) / 1000;
                stop = frameFunc(progress) === false;
            }
            start = timeStamp;
            if(!stop)
                requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    
    function runLevel(level, Display, callback) {
       var view = new DisplayView(document.body, level);
       runAnimation(function(step) {
            level.animate(step, arrows);
            view.drawFrame(step);
            if(level.isFinished()) {
                view.clear();
                if(callback)
                    callback(level.status);
                return false;
            } 
       }); 
    }

    function runGame(plans, Display) {
       function startLevel(n) { 
            runLevel(new Level(plans[n]), Display, function(status) {
                if (status === "lost") 
                    startLevel(n);
                else if (n < plans.length - 1)
                    startLevel(n + 1);
                else
                    displayWinMsg(); 
            }); 
       }
      startLevel(0); 
    }
    
    function startGame() {
        runGame(GAME_LEVELS, DisplayView);
    }

    // restart game after winning
    var restart = document.getElementsByClassName("restart-btn")[0];
    restart.addEventListener("click", function(){
        startGame();
        hideWinMsg();
    });

    startGame();
