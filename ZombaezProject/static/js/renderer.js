// =============== TILED LEVELS ===============

var levelId = 0;

var Level = function(tilesetImage, baseImage, levelWidth, levelHeight, tileWidth, tileHeight) {
    this.id = levelId++;

    this.tiles = [];
    this.topTiles = [];
    
    this.tilesetImage = tilesetImage;
    this.baseImage = baseImage;

    // Data format: [[row, column, houseId], ...]
    this.doorData = [];

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
    var tileLayers = TileMaps[tiledJSMapName]["layers"];

    if (tileLayers[0] != null) {
        var layer1Tiles = tileLayers[0]["data"];
        for (var r = 0; r < this.levelHeight; r++) {
            this.tiles[r] = [];
            for (var c = 0; c < this.levelWidth; c++) {
                // Subtract 1 since Tiled maps are exported with 0 == no tile
                var index = (r * this.levelWidth) + c;
                this.tiles[r].push(layer1Tiles[index] - 1);
            }
        }
    }

    if (tileLayers[1] != null) {
        var layer2Tiles = tileLayers[1]["data"];
        for (var r = 0; r < this.levelHeight; r++) {
            this.topTiles[r] = [];
            for (var c = 0; c < this.levelWidth; c++) {
                // Subtract 1 since Tiled maps are exported with 0 == no tile
                var index = (r * this.levelWidth) + c;
                this.topTiles[r].push(layer2Tiles[index] - 1);
            }
        }
    } else {
        // Populate the topTiles with an empty array
        for (var r = 0; r < this.levelHeight; r++) {
            this.topTiles[r] = [];
            for (var c = 0; c < this.levelWidth; c++) {
                var index = (r * this.levelWidth) + c;
                this.topTiles[r].push(-1);
            }
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

Level.prototype.setDoorData = function(doorDataList) {
    this.doorData = doorDataList;
}

Level.prototype.getDoorIdInFrontOfPlayer = function(x, y) {
    x = Math.floor(x / this.tileWidth);
    y = Math.floor(y / this.tileHeight) - 1;   // -1 so that collision detection doesn't prevent entry
    for (var i = 0; i < this.doorData.length; i++) {
        var doorRow = this.doorData[i][0];
        var doorCol = this.doorData[i][1];
        var doorId = this.doorData[i][2];
        if (y == doorRow && x == doorCol) return doorId;
    }
    return null;
}

// =============== CHARACTERS ===============

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

Character.prototype.setLevel = function(newLevel, x, y) {
    this.level = newLevel;
    this.x = x;
    this.y = y;
}

// =============== MENUS ===============

var DialogMenu = function(title, optionsList, functionsList, x, y, width, height) {
    this.title = title;
    this.optionsList = optionsList;
    this.functionsList = functionsList;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;

    this.titleSize = 24;
    this.optionsSize = 16;
    this.optionsOffset = 50;

    this.cursorPos = 0;
}

// Title takes 1/4 of menu, options take bottom 1/2
DialogMenu.prototype.render = function(context) {
    context.fillStyle = "black";
    context.fillRect(this.x, this.y, this.width, this.height);

    context.font = this.titleSize + "px Arial";
    context.fillStyle = "red";
    context.fillText(this.title, this.x, this.y + 24);

    context.font = this.optionsSize + "px Arial";
    for (var i = 0; i < this.optionsList.length; i++) {
        var currentY = (this.y + this.halfHeight + this.optionsSize) + (i * (this.halfHeight / this.optionsList.length));
        if (i == this.cursorPos) {
            context.fillText("->", (this.x + this.optionsOffset) - (this.optionsOffset / 2), currentY);
        }
        context.fillText(this.optionsList[i], this.x + this.optionsOffset, currentY);
    }

    menuMode = true;
}

DialogMenu.prototype.onOptionSelected = function(position) {
    var func = this.functionsList[position];
    if (func != null) {
        this.cursorPos = 0;
        func();
    }
}

// =============== INITIALISATION AND GLOBALS ===============

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 480;
var HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
var HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;

var g_sources = {
    tileset: "../../static/images/tileset.png",
    character: "../../static/images/character.png",
    map_base_image: "../../static/images/citymap.png",
    hall_base_image: "../../static/images/hallmap.png"
};
var g_images = {};

var canvas;
var context;

var level;
var hallLevel;
var activeLevel;
var dialog;

var menuMode = false;

var player;
window.onbeforeunload = function(){
 $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "pickle_on_close"
        },
        success: function(data) {
            $("#play-button").html(data);
			
        },
		error: function (xmlHttpRequest, data) {
        if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) 
              return;
        else
              alert("actual error");
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
            "event_type": "unpickle_on_load"
        },
        success: function(data) {
            data = JSON.parse(data);
            updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);
			//console.log(data["player_party"])
			
			renderScene();
		}
    });
//Canvas/Game code
    canvas = document.getElementById("game_canvas");
    context = canvas.getContext("2d");

    loadImages(g_sources, function(g_images) {
        level = new Level(g_images.tileset, g_images.map_base_image, 64, 64, 16, 16);
        level.loadLevel("citymap");
        level.setDoorData([
            [13,3,0], [13,4,0], [13,9,1], [13,10,1], [10,18,2], [10,25,3], [13,38,4], [13,45,5], [13,52,6],
            [29,42,7], [29,43,7], [28,51,8], [29,57,9],
            [45,9,10], [45,16,11], [45,23,12], [45,42,13], [45,43,13], [43,54,14], [44,60,15], [44,61,15],
            [61,3,16], [61,4,16], [58,11,17], [59,22,18], [61,49,19], [61,50,19]
        ]);

        player = new Character(g_images.character, level);
        player.x = 31 * level.tileWidth;
        player.y = 31 * level.tileHeight;

        hallLevel = new Level(g_images.tileset, g_images.hall_base_image, 64, 64, 16, 16);
        hallLevel.loadLevel("hallmap");

        activeLevel = level;

        updateCamera();
        renderScene();
    });
}

// =============== GAME RELATED FUNCTIONS/VARIABLES ===============

var playerParty;
var playerAmmo;
var playerTime;
var playerDay;
var playerFood;
var playerKills;

// IDs of non-blocking tiles
var nonBlockingTiles = [751,714,831,832,794,795,823,822,789,747,741,710,821,857,858,900,748,711,746,820,859,709];

var playerLastStreetX;
var playerLastStreetY;

function isNonBlockingTile(level, x, y) {
    return nonBlockingTiles.indexOf(level.getTileIndex(0, x, y)) > -1;
}

function renderHUD() {
    context.fillStyle = "black";
    context.fillRect(0, 0, 150, 100);

    context.font = "16px Arial";
    context.fillStyle = "red";

    context.fillText("Party: " + playerParty, 0, 16, 150);
    context.fillText("Ammo: " + playerAmmo, 0, 32, 150);
    context.fillText("Time: " + playerTime, 0, 48, 150);
    context.fillText("Day: " + playerDay, 0, 64, 150);
    context.fillText("Food: " + playerFood, 0, 80, 150);
    context.fillText("Kills: " + playerKills, 0, 96, 150);
}

function checkGameOver(partySize) {
    if (partySize <= 0) {
        dialog = new DialogMenu(
            "game_over",
            [
                "You have died! Game over!"
            ],
            [
                function() {
                    onGameOver();
					
                },
            ],
            0, 0, canvas.width, canvas.height
        );
        dialog.render(context);
        return true;
    }
    return false;
}

function startNewGame()
{
    menuMode = false;

    activeLevel = level;
    player.setLevel(activeLevel, 31 * activeLevel.tileWidth, 31 * activeLevel.tileHeight);
    updateCamera();
    renderScene();
}

function updatePlayerStats(party, ammo, time, day, food, kills) {
    playerParty = party;
    playerAmmo = ammo;
    playerTime = time;
    playerDay = day;
    playerFood = food;
    playerKills = kills;
}

function renderScene() {
    clearCanvas();

    //activeLevel.renderLayer(activeLevel.tiles);
    activeLevel.renderBaseImage();

    player.render(context);

    if (activeLevel.topTiles.length > 0) {
        activeLevel.renderLayer(activeLevel.topTiles);
    }

    renderHUD();
}

// =============== CANVAS RELATED FUNCTIONS ===============

function clearCanvas() {
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fill();
}

function onKeyPressed(charCode) {
    // W, A, S, D, E
    var charCodeStrings = {"119": "up", "97": "left", "115": "down", "100": "right", "101": "enter", "108": "coords"};

    // Carry out an action if the user presses a key in the dictionary
    if (charCode in charCodeStrings) {
        var charString = charCodeStrings[charCode];

        if (!menuMode) {
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
            if ((player.x + player.width) > activeLevel.actualWidth) player.x = activeLevel.actualWidth - player.width;
            if ((player.y + player.height) > activeLevel.actualHeight) player.y = activeLevel.actualHeight - player.height;

            // Gets center coordinates of player
            var playerCX = player.x + (player.width / 2);
            var playerCY = player.y + (player.height / 2);

            // Corrects player position if on a blocking tile
            if (!isNonBlockingTile(activeLevel, playerCX, playerCY)) {
                player.x = prevPlayerX;
                player.y = prevPlayerY;
            }

            // After position correction, allow player to enter house if they are in front of door
            if (charString == "enter") {
                var doorId = activeLevel.getDoorIdInFrontOfPlayer(playerCX, playerCY);
                if (doorId != null) {
                    // EW, FIX THIS!!!!!
                    if (activeLevel.id == 0) onEnterHouse(doorId);
                    if (activeLevel.id == 1) onEnterRoom(doorId);
                }
            }

            // DEBUG
            if (charString == "coords") alert("Position: " + "(" + player.x + ", " + player.y + ")" + " [" + Math.floor(player.x / 16) + ", " + Math.floor(player.y / 16) + "]");

            updateCamera();
            renderScene();
        } else {
            switch (charString) {
                case "up":
                    if (dialog.cursorPos > 0) dialog.cursorPos--;
                    break;
                case "down":
                    if (dialog.cursorPos < dialog.optionsList.length - 1) dialog.cursorPos++;
                    break;
            }

            dialog.render(context);

            if (charString == "enter") {
                dialog.onOptionSelected(dialog.cursorPos);
            }
        }
    }
}

function updateCamera() {
    // Corrects the "camera" from scrolling outside the x-bounds of the level
    activeLevel.x = HALF_SCREEN_WIDTH - player.x;
    if (player.x - HALF_SCREEN_WIDTH < 0) activeLevel.x = 0;
    if (player.x + HALF_SCREEN_WIDTH > activeLevel.actualWidth) activeLevel.x = SCREEN_WIDTH - activeLevel.actualWidth;

    // Corrects the "camera" from scrolling outside the y-bounds of the level
    activeLevel.y = HALF_SCREEN_HEIGHT - player.y;
    if (player.y - HALF_SCREEN_HEIGHT < 0) activeLevel.y = 0;
    if (player.y + HALF_SCREEN_HEIGHT > activeLevel.actualHeight) activeLevel.y = SCREEN_HEIGHT - activeLevel.actualHeight;
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

function fromJSON(jsonData) {
    return JSON.parse(jsonData);
}

// =============== AJAX CALLS ===============

function onEnterHouse(houseId) {
    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "house_entered",
            "house_id": houseId
        },
        success: function(data) {
            $("#play-button").html(data);
            data = JSON.parse(data);
            var roomCount = data["num_of_rooms"];

            activeLevel = hallLevel;

            // Add the exit door with a unique ID of -1
            var doorsList = [[35, 31, -1]];
            for (var i = 0; i < 13; i++) {
                var r = 24;
                var c = 19 + (i * 2);
                // Adds the door link to the level if it is included
                if (i < roomCount) doorsList.push([r, c, i]);
                // Resets doors then redraws the doors if they're included
                activeLevel.topTiles[r][c] = i < roomCount ? 986 : -1;
            }
            activeLevel.setDoorData(doorsList);

            playerLastStreetX = player.x;
            playerLastStreetY = player.y;

            updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);

            if(checkGameOver(data["player_party"])) return;

            player.setLevel(activeLevel, 31 * activeLevel.tileWidth, 36 * activeLevel.tileHeight);
            updateCamera();
            renderScene();
        }
    });
}

function onExitHouse() {
    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "house_exited",
        },
        success: function(data) {
            $("#play-button").html(data);
			data = JSON.parse(data);
			updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);

            if(checkGameOver(data["player_party"])) return;

            activeLevel = level;
            player.setLevel(activeLevel, playerLastStreetX, playerLastStreetY);
            updateCamera();
			
            renderScene();
        }
    });
}

function onEnterRoom(roomId) {
    if (roomId > -1) {
        $.ajax({
            type: "GET",
            url: "/zombaez/game_event/",
            data: {
                "event_type": "room_entered",
                "room_id": roomId
            },
            success: function(data) {
                $("#play-button").html(data);
                data = JSON.parse(data);
				updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);

                if(checkGameOver(data["player_party"])) return;

                if (data["room_zombies"] > 0) {
                    var zombaeCount = data["room_zombies"];
                    var pluralExt = (zombaeCount > 1 ? "z" : "");
                    var title = "You have encountered " + zombaeCount + " zombae" + pluralExt;
                    var fightOption = "Fight the " + zombaeCount + " zombae" + pluralExt;
                    var runOption = "Run from the zombae" + pluralExt;
                    dialog = new DialogMenu(
                        title,
                        [
                            fightOption,
                            runOption
                        ],
                        [
                            function() {
                                onFightZombie();
                            },
                            function() {
                                onRunFromZombie();
                            },
                        ],
                        0, 0, canvas.width, canvas.height
                    );
                    dialog.render(context);
                } else {
                    dialog = new DialogMenu(
                        "You have found:",
                        [
                            "Food: " + data["room_food"],
                            "People: " + data["room_people"],
                            "Ammo: "+ data["room_ammo"],
                            "",
                            "OK"
                        ],
                        [
                            null,
                            null,
                            null,
                            null,
                            function() {
                                menuMode = false;
                                onExitRoom();
                            }
                        ],
                        0, 0, canvas.width, canvas.height
                    );
                    dialog.render(context);
                }
            }
        });
    } else {
        onExitHouse();
    }
}

function onExitRoom() {
    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "room_exited",
        },
        success: function(data) {
            $("#play-button").html(data);
			data = JSON.parse(data);
			updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);

            if(checkGameOver(data["player_party"])) return;

            renderScene();
        }
    });
}

function onFightZombie() {
    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "zombie_fight"
        },
        success: function(data) {
            $("#play-button").html(data);
			data = JSON.parse(data);
			updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);

			
            if (!checkGameOver(data["player_party"])) {
				dialog = new DialogMenu(
                    "You have found:",
                    [
                        "Food: " + data["room_food"],
                        "People: " + data["room_people"],
                        "Ammo: "+ data["room_ammo"],
						"Kills: " + data["start_zombies"],
                        "",
                        "OK"
                    ],
                    [
                        null,
                        null,
                        null,
                        null,
						null,
                        function() {
                            menuMode = false;
                            onExitRoom();
                        }
                    ],
                    0, 0, canvas.width, canvas.height
                );
                dialog.render(context);

            } else {
                onExitRoom();
                dialog.render(context);
            }
        }
    });
}

function onRunFromZombie() {
    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "zombie_run"
        },
        success: function(data) {
            $("#play-button").html(data);
			data = JSON.parse(data);
			updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);
            menuMode = false;

            if(checkGameOver(data["player_party"])) return;
            
            activeLevel = level;
            player.setLevel(activeLevel, playerLastStreetX, playerLastStreetY);
            updateCamera();
            renderScene();
        }
    });
}

function onGameOver() {
    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "game_over"
        },
        success: function(data) {
			data = JSON.parse(data);
			updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);
			startNewGame();
        }
    });
}
