var Level = function(tilesetImage, levelWidth, levelHeight, tileWidth, tileHeight) {
    this.tiles = [];
    this.topTiles = [];
    
    this.tilesetImage = tilesetImage;
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.x = 0;
    this.y = 0;
    this.tileSpacing = 1;
    // 628 + 1 to round it up to the next tile size
    this.tilesetTileWidth = Math.floor((628 + this.tileSpacing) / (tileWidth + this.tileSpacing));
}

Level.prototype.generateLevel = function() {
    var count = 0;
    for (var r = 0; r < this.levelHeight; r++) {
        this.tiles[r] = [];
        for (var c = 0; c < this.levelWidth; c++) {
            this.tiles[r].push(count++);
        }
    }
}

Level.prototype.loadLevel = function(tiledJSMapName) {
    var layer1Tiles = TileMaps[tiledJSMapName]["layers"][0]["data"];
    var layer2Tiles = TileMaps[tiledJSMapName]["layers"][1]["data"];

    for (var r = 0; r < this.levelHeight; r++) {
        this.tiles[r] = [];
        for (var c = 0; c < this.levelWidth; c++) {
            // Subtract 1 since Tiled maps are exported with 0 == no tile
            var index = (r * this.levelWidth) + c;
            this.tiles[r].push(layer1Tiles[index] - 1);
        }
    }

    for (var r = 0; r < this.levelHeight; r++) {
        this.topTiles[r] = [];
        for (var c = 0; c < this.levelWidth; c++) {
            // Subtract 1 since Tiled maps are exported with 0 == no tile
            var index = (r * this.levelWidth) + c;
            this.topTiles[r].push(layer2Tiles[index] - 1);
        }
    }
}

Level.prototype.render = function(context) {
    clearCanvas();

    this.renderLayer(this.tiles);
    this.renderLayer(this.topTiles);
}

Level.prototype.renderLayer = function(layerIndexList) {
    var realTileWidth = this.tileWidth + this.tileSpacing;
    var realTileHeight = this.tileHeight + this.tileSpacing;

    for (var r = 0; r < this.levelHeight; r++) {
        for (var c = 0; c < this.levelWidth; c++) {
            var tileX = this.x + (c * this.tileWidth);
            var tileY = this.y + (r * this.tileHeight);

            if (tileX < 640 && tileX + this.tileWidth > 0 && tileY < 480 && tileY + this.tileHeight > 0) {
                var tileIndex = layerIndexList[r][c];
                if (tileIndex >= 0) {
                    var clipX = (tileIndex % this.tilesetTileWidth) * realTileWidth;
                    var clipY = Math.floor(tileIndex / this.tilesetTileWidth) * realTileHeight;

                    context.drawImage(this.tilesetImage, clipX, clipY, this.tileWidth, this.tileHeight, tileX, tileY, this.tileWidth, this.tileHeight);
                }
            }
        }
    }
}

var g_sources = {
    tileset: "../../static/images/tileset.png"
};
var g_images = {};

var canvas;
var context;

var level;

window.onload = function() {
    canvas = document.getElementById("game_canvas");
    context = canvas.getContext("2d");

    loadImages(g_sources, function(g_images) {
        level = new Level(g_images.tileset, 64, 64, 16, 16);
        //level.generateLevel();
        level.loadLevel("citymap");
        level.render(context);
    });
}

// =============== GAME RELATED FUNCTIONS ===============

function onEnterHouse() {
    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "house_entered"
        },
        success: function(data) {
            $("#play-button").html(data);
        },
        error: function(data) {
            alert("Failed to connect to engine!")
        }
    });
}

// =============== CANVAS RELATED FUNCTIONS ===============

function debugDrawText(text) {
    clearCanvas();

    context.font = "30px Arial";
    context.fillText(text, 10, 50);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function onKeyPressed(charCode) {
    // W, A, S, D, E
    var charCodeStrings = {"119": "up", "97": "left", "115": "down", "100": "right", "101": "enter"};

    if (charCode in charCodeStrings) {
        var charString = charCodeStrings[charCode];

        switch (charString) {
            case "up":
                level.y += 5;
                break;
            case "left":
                level.x += 5;
                break;
            case "down":
                level.y -= 5;
                break;
            case "right":
                level.x -= 5;
                break;
            case "enter":
                onEnterHouse();
                break;
        }

        level.render(context);
    }
}

// =============== UTILITY FUNCTIONS ===============

function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;

    // get num of sources
    for(var src in sources) {
        numImages++;
    }

    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}
