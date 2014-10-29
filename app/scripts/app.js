    // level
    var simpleLevel = [
        "                     ",
        "                 =x  ",
        "   x         oo   x  ",
        "   x@       xxxx  x  ",
        "   xxxxxx         x  ",
        "        x!!!!!!!!!x  ",
        "        xxxxxxxxxxx  ",
        "                     "
    ];

    // defined character for each symbol
    var actorChars = {
        "@": Player,
        "o": Coin,
        "=": Lava,
        "|": Lava,
        "v": Lava 
    };
    
    var arrows = trackKeys(keyboardCodes);

    // init
    //var simpleLevel = new Level(simpleLevel);
    // console.log(simpleLevel.width, 'x', simpleLevel.height);
    //var display = new DisplayView(document.body, simpleLevel); 

    function runAnimation(frameFunc) {
        var lastTime = null;

        function frame(time) {
            var stop = false;
            if(lastTime !== null) {
                var timeStep = Math.min(time - lastTime, 100) / 1000;
                stop = frameFunc(timeStep) === false;
            }
            lastTime = time;
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
                    alert("You win !");
            }); 
       }
      startLevel(0); 
    }


    runGame(GAME_LEVELS, DisplayView);

