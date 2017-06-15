var CursorModeEnum = {

	PLACE: {
		CHANNEL: 'PLACE.CHANNEL',
		MIXER: 'PLACE.MIXER',
		VERTEX: 'PLACE.VERTEX',
		PILLAR: 'PLACE.PILLAR',
		RECT: 'PLACE.RECT'
	},

	SELECT: {
		POINTER: 'SELECT.POINTER',
		BOX: 'SELECT.BOX'
	},

	OPERATE: {
		MOVE: 'OPERATE.MOVE',
		REFLECT: 'OPERATE.REFLECT', 
		ROTATE: 'OPERATE.ROTATE', 
		ARRAY: 'OPERATE.ARRAY'
	}
};

//Global collection of selected items
var selectedCollection = new Collection();

//Global collection for preview
var previewCollection = new Collection(); //moves with selection
var clipboardCollection = new Collection();
var arrayPreviewCollection = new Collection(); //does not move with selection

// VARIABLES //

var rotateX = -1;
var rotateY = -1;

var currZoom = 1.00; //Track the current zoom level

var zoomIncrement = 0.10; // Amount the zoom changes per scroll

var thresh = 20; //Beneath this threshold points will snap to earlier points on a grid

var gridSize = 20;

//Variables for devices currently in use
var channel = new Channel(); //True when series of points being clicked for channel

//If img src is set during mouse move, it interferes with mousedown
var cursorMode = CursorModeEnum.SELECT.POINTER; //Enum tells you what CursorMode is in use at a time out of a limited set

var rotateAngle = 0.0; //Angle that a CursorMode rotates in (only @ z axis for now)

var collection = new Collection();

var firstInChannel = false;

var prevNodeIndex = 0; //Most recently used node

var hel = false;

var rectX1 = -1, rectY1 = -1, rectX2 = -1, rectY2 = -1;

// PREVENT BOX ENTER FROM REFRESHING PAGE

var commandControl = false;

var mouseX = 0;
var mouseY = 0;

var snappedMouseX = 0;
var snappedMouseY = 0;

//TODO: make into local variables

var anchorMouseX = -1;
var anchorMouseY = -1;
var anchorMouseX2 = -1;
var anchorMouseY2 = -1;

var boxMouseX = -1;
var boxMouseY = -1;
var boxMouseX2 = -1;
var boxMouseY2 = -1;

var isCutPaste = false; //starts out to not cut and paste

//Stack to enable undos
//When you undo, pop something off the undo stack and onto the redo stack
//When you redo, pop something off the redo stack and onto the undo stack
//These have to have some sort of maximum size or it will probably fail but scalability is for a later version of me :)

var undoStack = new Array();
var redoStack = new Array();

// CREATE CANVAS //

var canvasDiv = document.getElementById('canvasDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', 800);
canvas.setAttribute('height', 700);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");

// ENABLING FILE INPUT

var upload = document.createElement("INPUT"); //creates an input button
upload.setAttribute("id", "fileInput");
upload.setAttribute("type", "file");
upload.addEventListener("change", handleFiles, false);
var left = document.getElementById("left");
left.appendChild(upload);
upload.style.display = 'none';

/// SET UP LISTENERS //

window.addEventListener("keydown", keyPressHandler, false);
window.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener('mousedown', mouseDownHandler, false);
canvas.addEventListener('mouseup', mouseUpHandler, false);
canvas.addEventListener('mouseleave', mouseLeaveHandler, false);
canvas.addEventListener('drag', mouseDragHandler, false);
canvas.addEventListener('mousewheel', scrollHandler, false);

//Ensure that data is not deleted

//Menu button drawing
var saveBtn = document.getElementById("save-btn");
var collectBtn = document.getElementById("collection-btn");
var transformBtn = document.getElementById("transformation-btn");
var jsonBtn = document.getElementById("json-btn");
var pngBtn = document.getElementById("png-btn");
var reflectBtn = document.getElementById("reflect-btn");
var rotateBtn = document.getElementById("rotate-btn");
var arrayBtn = document.getElementById("array-btn");

function menu_button_changer(button, on){
	var saveBtn = document.getElementById("save-btn");
	var collectBtn = document.getElementById("collection-btn");
	var transformBtn = document.getElementById("transformation-btn");

	saveBtn.style.background = "#6093e7";
	collectBtn.style.background = "#6093e7";
	transformBtn.style.background = "#6093e7";

	if (on){
		button.style.background = "#bcd7ea";
	} else {
		button.style.background = "#6093e7";
	}

}


// ADD VERTEX //
// TODO: remove in favor of addNode? //
function addVertex(x, y, r, type, w, h) {
	console.log("add vertex");

	//Keep track of the current node within threshold distance
	var currNodeIndex = collection.channel.nodes.indexOf(findNearestNode(x, y, r));
	console.log("nearest node is");
	console.log(currNodeIndex);

	//If there isn't one, your currIndex is one more than curr # of nodes
	//And you should add a new node to your graph
	if(currNodeIndex == -1 || collection.channel.edges[prevNodeIndex] == null || collection.channel.edges[currNodeIndex] == null){
		currNodeIndex = collection.channel.nodes.length;
		collection.channel.nodes.push(new Node(x, y, r, type, w, h)); //Adds node to graph
		collection.channel.edges.push([]); //Create empty list of edges to be filled by new node
	}

	//If you're not at the start of a new channel and the previous node was not deleted)
	//add an edge back to the previous node
	if (!firstInChannel){
		console.log("not first in channel");
			if (cursorMode == CursorModeEnum.PLACE.VERTEX) {
				collection.channel.nodes[currNodeIndex].r = r;
			} else {
				
				if (cursorMode == CursorModeEnum.PLACE.CHANNEL) {

					var weight = parseInt(document.getElementById("channel_width_box").value);

					//Find the length of the channel
					//var newChannelLength = collection.channel.distBetweenNodes(prevNodeIndex, currNodeIndex);
					//console.log(newChannelLength);

					collection.channel.edges[prevNodeIndex].push(new Edge(prevNodeIndex, currNodeIndex, weight, 0)); //weight 1, type 0, default for now
					collection.channel.edges[currNodeIndex].push(new Edge(currNodeIndex, prevNodeIndex, weight, 0)); //doing directed for now with double edges 0 = channel

				} else if (cursorMode == CursorModeEnum.PLACE.MIXER) {
					var weight = parseInt(document.getElementById("mixer_width_box").value);
					var wavelength = parseInt(document.getElementById("mixer_wavelength_box").value);
					var amplitude = parseInt(document.getElementById("mixer_amplitude_box").value);
					var type = 0;
					if (document.getElementById("mixer_type1").checked) type = 1;	
					else if (document.getElementById("mixer_type2").checked) type = 2;
					else type = 3;
					collection.channel.edges[currNodeIndex].push(new Edge(currNodeIndex, prevNodeIndex, weight, type, wavelength, amplitude)); //doing directed for now with double edges 1 = helix
				} 
			}
			
	}
	firstInChannel = false;	//Assume next time won't be the start of a new channel
	prevNodeIndex = currNodeIndex;	//Updates to most recently used node
}
