// =============== TILED LEVELS ===============

var Level = function(tilesetImage, baseImage, levelWidth, levelHeight, tileWidth, tileHeight) {
    this.tiles = [];
    this.topTiles = [];
    
    this.tilesetImage = tilesetImage;
    this.baseImage = baseImage;

    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.actualWidth = levelWidth * tileWidth;
    this.actualHeight = levelHeight * tileHeight;
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

Level.prototype.renderBaseImage = function() {
    context.drawImage(this.baseImage, -this.x, -this.y, 640, 480, 0, 0, 640, 480);
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
                    //context.font = "9px Arial";
                    //context.fillStyle = "magenta";
                    //context.fillText(tileIndex, tileX, tileY + 16);
                    //context.fillText(r + ",", tileX, tileY + 8);
                    //context.fillText(c, tileX, tileY + 16);
                }
            }
        }
    }
}

Level.prototype.getTileIndex = function(layer, x, y) {
    if (x < 0) return null;
    if (y < 0) return null;
    if (x > this.actualWidth) return null;
    if (y > this.actualHeight) return null;

    var row = Math.floor(y / this.tileHeight);
    var col = Math.floor(x / this.tileWidth);
    if (layer == 0) return this.tiles[row][col];
    return this.topTiles[row][col];
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
    character: "../../static/images/character.png",
    map_base_image: "../../static/images/citymap.png"
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
        level = new Level(g_images.tileset, g_images.map_base_image, 64, 64, 16, 16);
        player = new Character(g_images.character, level);

        level.loadLevel("citymap");
        renderScene();
    });
}

// =============== GAME RELATED FUNCTIONS/VARIABLES ===============

// Door coordinates (specific to level): [row, column]
var doorCoords = [
    [13,3], [13,4], [10,18], [10,25], [13,38], [13,45], [13,52],
    [29,42], [29,43], [28,51], [29,57],
    [45,9], [45,16], [45,23], [45,42], [45,43], [43,54], [44,60], [44,61],
    [61,3], [61,4], [58,11], [59,22], [61,49], [61,50]
];

// IDs of non-blocking tiles
var nonBlockingTiles = [751,714,831,832,794,795,823,822,789,747,741,710,821,857,858,900,748,711,746,820,859];

function isOnDoor(level, x, y) {
    x = Math.floor(x / level.tileWidth);
    y = Math.floor(y / level.tileHeight) - 1;   // -1 so that collision detection doesn't prevent entry
    for (var i = 0; i < doorCoords.length; i++) {
        if (y == doorCoords[i][0] && x == doorCoords[i][1]) return true;
    }
    return false;
}

function isNonBlockingTile(level, x, y) {
    return nonBlockingTiles.indexOf(level.getTileIndex(0, x, y)) > -1;
}

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

    //level.renderLayer(level.tiles);
    level.renderBaseImage();
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

        var prevPlayerX = player.x;
        var prevPlayerY = player.y;

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
        }

        // Stops the character walking out of the level
        if (player.x < 0) player.x = 0;
        if (player.y < 0) player.y = 0;
        if ((player.x + player.width) > level.actualWidth) player.x = level.actualWidth - player.width;
        if ((player.y + player.height) > level.actualHeight) player.y = level.actualHeight - player.height;

        // Gets center coordinates of player
        var playerCX = player.x + (player.width / 2);
        var playerCY = player.y + (player.height / 2);

        // Corrects player position if on a blocking tile
        if (!isNonBlockingTile(level, playerCX, playerCY)) {
            player.x = prevPlayerX;
            player.y = prevPlayerY;
        }

        // After position correction, allow player to enter house if they are in front of door
        if (charString == "enter") {
            if (isOnDoor(level, playerCX, playerCY)) {
                onEnterHouse();
            }
        }

        // Corrects the "camera" from scrolling outside the x-bounds of the level
        level.x = 320 - player.x;
        if (player.x - 320 < 0) level.x = 0;
        if (player.x + 320 > level.actualWidth) level.x = 640 - level.actualWidth;

        // Corrects the "camera" from scrolling outside the y-bounds of the level
        level.y = 240 - player.y;
        if (player.y - 240 < 0) level.y = 0;
        if (player.y + 240 > level.actualHeight) level.y = 480 - level.actualHeight;

        renderScene();
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
