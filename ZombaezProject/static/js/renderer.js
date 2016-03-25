/*
    Front end renderer for the Python zombie game engine.

    Levels were created using the Tiled Map Editor and exported as JS functions
    which create a global variable named TileMaps. TileMaps can then be accessed
    to retrieve the IDs of the tiles that make up a level, which are then used
    to render the level in the canvas.

    Tile IDs are also used for simple collision detection so as to prevent the
    player from walking through buildings.

    Map images are used instead of tiles for the tiles below the player's
    layer number as rendering all the tiles in this layer caused severe
    performance issues.

    Author: Kavan Bickerstaff
*/

// =============== TILED LEVELS ===============

// "Static" variable used to identify levels. Incremented in Level constructor.
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

    // Populate the upper layer with data (tile ID if present, -1 otherwise)
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

/*
    Renders a base image instead of base tiles so as to avoid performance
    issues with the sheer amount of tiles that need to be rendered.

    Images were generated using the Tiled Map Editor's image exporter.
*/
Level.prototype.renderBaseImage = function() {
    context.drawImage(this.baseImage, -this.x, -this.y, 640, 480, 0, 0, 640, 480);
}

Level.prototype.renderLayer = function(layerIndexList) {
    // Accounts for the spacing between tiles on the tilemap
    var realTileWidth = this.tileWidth + this.tileSpacing;
    var realTileHeight = this.tileHeight + this.tileSpacing;

    for (var r = 0; r < this.levelHeight; r++) {
        for (var c = 0; c < this.levelWidth; c++) {
            // Calculate the position of the tile relative to the level position
            var tileX = this.x + (c * this.tileWidth);
            var tileY = this.y + (r * this.tileHeight);

            // Check if the tiles are within the visible area; draw if they are.
            if (tileX < 640 && tileX + this.tileWidth > 0 && tileY < 480 && tileY + this.tileHeight > 0) {
                var tileIndex = layerIndexList[r][c];
                if (tileIndex >= 0) {
                    // Calculate where to clip the image from on the tilemap based on its tile ID
                    var clipX = (tileIndex % this.tilesetTileWidth) * realTileWidth;
                    var clipY = Math.floor(tileIndex / this.tilesetTileWidth) * realTileHeight;

                    context.drawImage(this.tilesetImage, clipX, clipY, this.tileWidth, this.tileHeight, tileX, tileY, this.tileWidth, this.tileHeight);
                }
            }
        }
    }
}

/*
    Gets the tile ID at the specified position in the level, on the specified
    layer.
*/
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

/*
    Checks the row and column of the tile in front of the coordinates specified
    against the list of stored door positions. If any of the row/columns
    matches, the tile ID (which is stored as the 3rd element) is returned.
    
    If no door can be found at the coordinates supplied, null is returned.
*/
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

/*
    Draws the character at a position relative to the level in which the player
    is currently in.
*/
Character.prototype.render = function(context) {
    context.drawImage(this.charImage, this.level.x + this.x, this.level.y + this.y, this.width, this.height);
}

Character.prototype.setLevel = function(newLevel, x, y) {
    this.level = newLevel;
    this.x = x;
    this.y = y;
}

// =============== MENUS ===============

/*
    DialogMenu class
    Has a title and a scrollable list of options which each correspond to a
    function which is called whenever the option is selected.
*/
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

/*
    Renders the DialogMenu. Also sets the global variable menuMode to true
    which affects how keyboard events are interpreted.

    Title takes 1/4 of menu, options take bottom 1/2
*/
DialogMenu.prototype.render = function(context) {
    context.fillStyle = "black";
    context.fillRect(this.x, this.y, this.width, this.height);

    context.font = this.titleSize + "px Arial";
    context.fillStyle = "white";
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

/*
    This should be called whenever an option in the DialogMenu is selected.
    If the corresponding variable is null, no action is taken. If the action
    is a function, that function is called.
*/
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

/*
    Before the window is unloaded, an AJAX call is made to the server
    to let that the game engine know that the user has stopped playing
    the game and that their game state should be saved (pickled) for
    when they next play the game.
*/
window.onbeforeunload = function() {
 $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "pickle_on_close"
        },
        success: function(data) {
			
        },
		error: function (xmlHttpRequest, data) {
        if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) 
              return;
        else
              alert("actual error");
        }
    });
}

/*
    Starting point for the renderer.
    The canvas and canvas context are initialized first and then the images
    which the game relies on are loaded. Once these images are loaded, the
    client-side game is initialised and an AJAX call is made to retrieve
    the game state (via unpickling strings).
*/
window.onload = function() {

    // Navigation bar code
    var c = document.getElementById("nav4");
    c.className += " active";

    //Canvas/Game code
    canvas = document.getElementById("game_canvas");
    context = canvas.getContext("2d");

    // Show loading text so users know the game is being initialised
    clearCanvas();
    showLoadingText();

    // Load all images first then continue
    loadImages(g_sources, function(images) {

        // Initialise the street level with its tile and door data
        level = new Level(images.tileset, images.map_base_image, 64, 64, 16, 16);
        level.loadLevel("citymap");
        level.setDoorData([
            [13,3,0], [13,4,0], [13,9,1], [13,10,1], [10,18,2], [10,25,3], [13,38,4], [13,45,5], [13,52,6],
            [29,42,7], [29,43,7], [28,51,8], [29,57,9],
            [45,9,10], [45,16,11], [45,23,12], [45,42,13], [45,43,13], [43,54,14], [44,60,15], [44,61,15],
            [61,3,16], [61,4,16], [58,11,17], [59,22,18], [61,49,19], [61,50,19]
        ]);

        // Initialise the player character
        player = new Character(images.character, level);
        player.x = 31 * level.tileWidth;
        player.y = 31 * level.tileHeight;

        // Initialise the hall level which leads to the rooms
        hallLevel = new Level(images.tileset, images.hall_base_image, 64, 64, 16, 16);
        hallLevel.loadLevel("hallmap");

        // Set the active level to the street level
        activeLevel = level;
        
        // Once images loaded and game set up, unpickle the last saved game
        $.ajax({
            type: "GET",
            url: "/zombaez/game_event/",
            data: {
                "event_type": "unpickle_on_load"
            },
            success: function(data) {
                // Update global player stats from returned JSON data
                data = JSON.parse(data);
                updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);
			
                updateCamera();
		        renderScene();
	        }
        });
    });
}

// =============== GAME RELATED FUNCTIONS/VARIABLES ===============

var level;
var hallLevel;
var activeLevel;
var dialog;

var player;

var menuMode = false;

var playerParty;
var playerAmmo;
var playerTime;
var playerDay;
var playerFood;
var playerKills;

// IDs of non-blocking tiles
var nonBlockingTiles = [751,714,831,832,794,795,823,822,789,747,741,710,821,857,858,900,748,711,746,820,859,709];

// Used to return the player to their last position in the street before they
// entered a house.
var playerLastStreetX;
var playerLastStreetY;

/*
    Checks to see if a tile is within the global array of non-blocking tiles.
*/
function isNonBlockingTile(level, x, y) {
    return nonBlockingTiles.indexOf(level.getTileIndex(0, x, y)) > -1;
}

/*
    Should be nearest to the last call made within renderScene() so that the
    HUD is displayed over all other images on the screen.
*/
function renderHUD() {
    context.fillStyle = "black";
    context.fillRect(0, 0, 150, 100);

    context.font = "16px Arial";
    context.fillStyle = "white";

    context.fillText("Party: " + playerParty, 0, 16, 150);
    context.fillText("Ammo: " + playerAmmo, 0, 32, 150);
    context.fillText("Time: " + playerTime, 0, 48, 150);
    context.fillText("Day: " + playerDay, 0, 64, 150);
    context.fillText("Food: " + playerFood, 0, 80, 150);
    context.fillText("Kills: " + playerKills, 0, 96, 150);
}

/*
    Determines if the game is over depending on the number of people in the
    player's party. This value can be retrieved using an AJAX call and parsing
    the returned JSON data.
    If the size is <0, the game is over and the necessary calls are made to
    start a new game.
*/
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

/*
    When a new game is started, the player is returned to the center of the
    street level & menu mode is disabled in case it was enabled when the user
    died.
*/
function startNewGame()
{
    menuMode = false;

    activeLevel = level;
    player.setLevel(activeLevel, 31 * activeLevel.tileWidth, 31 * activeLevel.tileHeight);
    updateCamera();
    renderScene();
}

/*
    Updates the global variables which store info about the current player state.
    These variables are displayed in the HUD.
*/
function updatePlayerStats(party, ammo, time, day, food, kills) {
    playerParty = party;
    playerAmmo = ammo;
    playerTime = time;
    playerDay = day;
    playerFood = food;
    playerKills = kills;
}

/*
    Used to notify the user that an AJAX call has been made and the renderer is
    waiting for a response from the Python game engine on the server before it
    can continue.
    This text is not explicitly hidden after the next scene has been rendered
    as the screen will be cleared before the next render call anyway.
*/
function showLoadingText()
{
    var loadingText = "Loading...";
    var textWidth = context.measureText(loadingText).width;

    context.fillStyle = "black";
    context.fillRect(HALF_SCREEN_WIDTH - (textWidth / 2) - 5, HALF_SCREEN_HEIGHT - 16, textWidth + 10, 32);

    context.font = "16px Arial";
    context.fillStyle = "white";
    context.fillText(loadingText, HALF_SCREEN_WIDTH - (textWidth / 2), HALF_SCREEN_HEIGHT + 8);
}

/*
    Renders the level, character, layered level tiles and the HUD to the
    game canvas.
*/
function renderScene() {
    clearCanvas();

    // Base image is used to prevent performance issues caused by sheer amount
    // of tiles that need to be rendered.
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
                    if (activeLevel.id == 0) {
                        onEnterHouse(doorId);
                    }
                    else if (activeLevel.id == 1) {
                        onEnterRoom(doorId);
                    }
                }
            } else {
                updateCamera();
                renderScene();
            }
        } else {
            // Controls the movement of the cursor in the menu
            switch (charString) {
                case "up":
                    if (dialog.cursorPos > 0) dialog.cursorPos--;
                    break;
                case "down":
                    if (dialog.cursorPos < dialog.optionsList.length - 1) dialog.cursorPos++;
                    break;
            }

            dialog.render(context);

            // Choices are made when the user presses the 'enter' key
            if (charString == "enter") {
                dialog.onOptionSelected(dialog.cursorPos);
            }
        }
    }
}

/*
    Modifies the coordinates of the level so as to give the illusion that
    a camera is following the player through the level. Keeps focus on the
    player.
*/
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

// =============== AJAX CALLS ===============

function onEnterHouse(houseId) {
    showLoadingText();

    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "house_entered",
            "house_id": houseId
        },
        success: function(data) {
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
    showLoadingText();

    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "house_exited",
        },
        success: function(data) {
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
    showLoadingText();

    if (roomId > -1) {
        $.ajax({
            type: "GET",
            url: "/zombaez/game_event/",
            data: {
                "event_type": "room_entered",
                "room_id": roomId
            },
            success: function(data) {
                data = JSON.parse(data);
				updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);

                if(checkGameOver(data["player_party"])) return;

                if (data["room_zombies"] > 0) {
                    // Show zombae fight/run DialogMenu
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
                    // Show items found DialogMenu
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
    showLoadingText();

    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "room_exited",
        },
        success: function(data) {
			data = JSON.parse(data);
			updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);

            if(checkGameOver(data["player_party"])) return;

            renderScene();
        }
    });
}

function onFightZombie() {
    showLoadingText();

    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "zombie_fight"
        },
        success: function(data) {
			data = JSON.parse(data);
			updatePlayerStats(data["player_party"], data["player_ammo"], data["time_left"], data["player_day"], data["player_food"], data["player_kills"]);

            // If the game isn't over after fighting a zombae, show collected
            // items.
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
    showLoadingText();

    $.ajax({
        type: "GET",
        url: "/zombaez/game_event/",
        data: {
            "event_type": "zombie_run"
        },
        success: function(data) {
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
    showLoadingText();

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
