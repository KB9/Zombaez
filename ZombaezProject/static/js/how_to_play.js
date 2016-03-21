window.onload = function() {
				var c = document.getElementById("nav2");
				c.className += " active";
}
var number_of_images = 4;
var previous_index;
var index = 1;
function prev(){
	previous_index = index;
	index--;
	if (index < 1){
		index = number_of_images;
	}
	document.getElementById(index.toString()).classList.add("show");
	document.getElementById(previous_index.toString()).classList.remove("show");
	document.getElementById("p" + index.toString()).classList.add("show");
	document.getElementById("p" + previous_index.toString()).classList.remove("show");

}

function next(){
	previous_index = index;
	index++;
	if (index > number_of_images){
		index = 1;
	}
	document.getElementById(index.toString()).classList.add("show");
	document.getElementById(previous_index.toString()).classList.remove("show");
	document.getElementById("p" + index.toString()).classList.add("show");
	document.getElementById("p" + previous_index.toString()).classList.remove("show");
}