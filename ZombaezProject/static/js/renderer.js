// =============== TILED LEVELS ===============

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
                    //context.font = "8px Arial";
                    //context.fillText(tileIndex, tileX, tileY);
                }
            }
        }
    }
}

Level.prototype.getTileIndex = function(layer, x, y) {
    if (x < 0) return null;
    if (y < 0) return null;
    if (x > (this.levelWidth * this.tileWidth)) return null;
    if (y > (this.levelHeight * this.tileHeight)) return null;

    var row = Math.floor(y / this.tileHeight);
    var col = Math.floor(x / this.tileWidth);
    if (layer == 0) return this.tiles[row][column];
    return this.topTiles[row][column];
}

// =============== CHARACTER ===============

var Character = function(charImage, level) {
    this.charImage = charImage;
    this.level = level;
    this.x = 0;
    this.y = 0;
    this.width = 16;
    this.height = 16;
}

Character.prototype.render = function(context) {
    context.drawImage(this.charImage, this.level.x + this.x, this.level.y + this.y, this.width, this.height);
}

// =============== INITIALISATION AND GLOBALS ===============

var g_sources = {
    tileset: "../../static/images/tileset.png",
    character: "../../static/images/character.png"
};
var g_images = {};

var canvas;
var context;

var level;
var player;
window.onunload = function(){
 $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "pickle_on_quit"
        },
        success: function(data) {
	alert("You quit")
            $("#play-button").html(data);
        },
        error: function(data) {
            alert("you failed quit")
        }
    });
}
window.onload = function() {

// Navigation bar code
    var c = document.getElementById("nav4");
    c.className += " active";
//Pickling code
    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "pickle_on_load"
        },
        success: function(data) {
		alert("You started")
            $("#play-button").html(data);
        },
        error: function(data) {
            alert("You failed load")
        }
    });
//Canvas/Game code
    canvas = document.getElementById("game_canvas");
    context = canvas.getContext("2d");

    loadImages(g_sources, function(g_images) {
        level = new Level(g_images.tileset, 64, 64, 16, 16);
        player = new Character(g_images.character, level);

        level.loadLevel("citymap");
        renderScene();
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

function renderScene() {
    clearCanvas();

    level.renderLayer(level.tiles);
    player.render(context);
    level.renderLayer(level.topTiles);
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

    // Carry out an action if the user presses a key in the dictionary
    if (charCode in charCodeStrings) {
        var charString = charCodeStrings[charCode];

        switch (charString) {
            case "up":
                player.y -= 5;
                break;
            case "left":
                player.x -= 5;
                break;
            case "down":
                player.y += 5;
                break;
            case "right":
                player.x += 5;
                break;
            case "enter":
                onEnterHouse();
                break;
        }

        // Stops the character walking out of the level
        if (player.x < 0) player.x = 0;
        if (player.y < 0) player.y = 0;
        if ((player.x + player.width) > (level.levelWidth * level.tileWidth)) player.x = (level.levelWidth * level.tileWidth) - player.width;
        if ((player.y + player.height) > (level.levelHeight * level.tileHeight)) player.y = (level.levelHeight * level.tileHeight) - player.height;

        // Corrects the "camera" from scrolling outside the x-bounds of the level
        level.x = 320 - player.x;
        if (player.x - 320 < 0) level.x = 0;
        if (player.x + 320 > (level.levelWidth * level.tileWidth)) level.x = 640 - (level.levelWidth * level.tileWidth);

        // Corrects the "camera" from scrolling outside the y-bounds of the level
        level.y = 240 - player.y;
        if (player.y - 240 < 0) level.y = 0;
        if (player.y + 240 > (level.levelHeight * level.tileHeight)) level.y = 480 - (level.levelHeight * level.tileHeight);

        renderScene();
    }
}

function inArray(value, array) {
    return array.indexOf(value) > -1;
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
