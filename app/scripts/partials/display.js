    // helper function to create new element with class
    function elem(name, className) {
        var elt = document.createElement(name);
        if(className)
            elt.className = className;
        return elt;
    }

    function DOMDisplay(parent, level) {
        // create a display container
        var gameContainer = elem("div", "game");

        this.wrap = parent.appendChild(gameContainer);
        this.level = level;
        this.wrap.appendChild(this.drawBackground());
        this.actorLayer = null;
        this.drawFrame();
    }

    // set the scale to pixel to display element
    var sclae = 20;
 
    DOMDisplay.prototype.drawBackground = function() {
        var table = elem("table", "background");
        table.style.width = this.level.width * scale + "px";
        this.level.grid.forEach(function(line) {
            var row = table.appendChild("tr");
            row.style.height = scale + "px";
            line.forEach(function(type) {
                row.appendChild(elt("td", type))
            });
        });
        return table;
    }

   

