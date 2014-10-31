    // helper function to create new element with class
    function elem(name, className) {
        var elt = document.createElement(name);
        if(className)
            elt.className = className;
        return elt;
    }

    function DisplayView(parent, level) {
        // create a display container
        var gameContainer = elem("div", "game");
        this.wrap = parent.appendChild(gameContainer);
        this.level = level;
        this.wrap.appendChild(this.drawBackground());
        this.actorLayer = null;
        this.drawFrame();
    }

    // set the scale to pixel to display element
    var scale = opts.scale;
    // draw static elements - wall, static lava, space 
    DisplayView.method("drawBackground", function() {
        var table = elem("table", "background");
        table.style.width = this.level.width * scale + "px";
        this.level.grid.forEach(function(line) {
            var row = table.appendChild(elem("tr"));
            row.style.height = scale + "px";
            line.forEach(function(type) {
                row.appendChild(elem("td", type))
            });
        });
        return table;
    });
    
    // draw dynamic elements - player, moving lava, coin
    DisplayView.method("drawActors", function() {
        var wrap = elem("div");
        this.level.actors.forEach(function(actor) {
            var actorElem = wrap.appendChild(elem("div", "actor " + actor.type));
            actorElem.style.width = actor.size.x * scale + "px";
            actorElem.style.height = actor.size.y * scale + "px";
            actorElem.style.left = actor.pos.x * scale + "px";
            actorElem.style.top = actor.pos.y * scale + "px";          
        });
        return wrap;
    });
   
    // draw frame
    DisplayView.method("drawFrame", function() {
        if(this.actorLayer) 
            this.wrap.removeChild(this.actorLayer);
        this.actorLayer = this.wrap.appendChild(this.drawActors()); 
        this.wrap.className = "game " + (this.level.status || ""); 
        this.scrollPlayerIntoView();
    });

    DisplayView.method("scrollPlayerIntoView", function() {
        var width = this.wrap.clientWidth,
            height = this.wrap.clientHeight,
            margin = width / 3;

        // view port
        var left = this.wrap.scrollLeft,
            top = this.wrap.scrollTop,
            right = left + width,
            bottom = top + height;
             
        // player position
        var player = this.level.player,
            center = player.pos.plus(player.size.times(0.5)).times(scale);
        // scrolling viewport according to player position
        if(center.x < left + margin)
            this.wrap.scrollLeft = center.x - margin;
        else if(center.x > right - margin)
            this.wrap.scrollLeft = center.x + margin -width;
        if(center.y < top + margin)
            this.wrap.scrollTop = center.y - margin;
        else if(center.y > bottom - margin)
            this.wrap.scrollTop = center.y + margin -height;
    });
    
    DisplayView.method("clear" ,function() {
        this.wrap.parentNode.removeChild(this.wrap);
    });

