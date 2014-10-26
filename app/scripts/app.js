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

    // init
     var simpleLevel = new Level(simpleLevel);
     console.log(simpleLevel.width, 'x', simpleLevel.height);
