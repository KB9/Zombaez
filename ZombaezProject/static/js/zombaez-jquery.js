$(document).ready(function() {
    
    $("#play-button").click(function(event) {
        $.ajax({
            type: "GET",
            url: "/zombaez/game_event/",
            data: {"var": "dank game started"},
            success: function(data) {
                $("#play-button").html(data);
            },
            error: function(data) {
                alert("Failed to connect to engine!")
            }
        });
    });

    $(document).keypress(function(event) {
        onKeyPressed(event.charCode);
    });

});

