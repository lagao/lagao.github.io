//Fileio.js contains the overall file variable, it looks like this:
//var file = {channel_graph: [[], []], helix_list: [], t_list: [], cross_list: []};

var CursorModeEnum = {

	PLACE: {
		CHANNEL: 'PLACE.CHANNEL',
		HELIX: 'PLACE.HELIX',
		T_JUNCT: 'PLACE.T_JUNCT',
		CROSS_JUNCT: 'PLACE.CROSS_JUNCT',
		VERTEX: 'PLACE.VERTEX',
		PILLAR: 'PLACE.PILLAR',
		RECT: 'PLACE.RECT'
	},

	SELECT: {
		POINTER: 'SELECT.POINTER',
		BOX: 'SELECT.BOX'
	},

	OPERATE: {
		MOVE: 'OPERATE.MOVE'
	}

};

//Things which should be done in response to any event (undo, update colection, redraw, save, etc)
function storeUndoState(){
	console.log("stack");
	var c = JSON.parse(JSON.stringify(collection)); //want a copy of the value not the reference, this is a hacky way to do it
	undoStack.push(c);
	console.log(undoStack);
}

function undo_handler(event){
	hideAllSliders();
	if (undoStack.length >= 0) {
		var c = undoStack.pop(collection);
		var refCollection = JSON.parse(JSON.stringify(c));
		redoStack.push(refCollection);
		collection = undoStack[undoStack.length - 1];
		console.log("stack after undo");
		console.log(undoStack);
		console.log("collection after undo");
		console.log(collection);
		redraw();
	}
}

function redo_handler(event){
	hideAllSliders();
	if (redoStack.length >= 1){
		collection = redoStack.pop();
		storeUndoState();
		redraw();
	}
}


function cut_handler(event){
	console.log("cut");
	//Clear the current clipboard
	clipboardCollection = new Collection();

	//Add the current selection to the clipboard
	clipboardCollection.channel.addChannel(selectedCollection.channel);

	//Remove the current selection from the overall pattern
	collection.deleteCollection(clipboardCollection); //delete clipboard collection 

	console.log("selected collection cut");
	console.log(selectedCollection.channel);
	console.log("clipboard collection cut");
	console.log(clipboardCollection.channel);

	return;
}

function copy_handler(event) {
	console.log("cut");
	//Clear the current clipboard
	clipboardCollection = new Collection();

	//Add the current selection to the clipboard
	clipboardCollection.channel.addChannel(selectedCollection.channel);
	console.log("selected collection cut");
	console.log(selectedCollection.channel);
	console.log("clipboard collection cut");
	console.log(clipboardCollection.channel);

	return;
}

function paste_handler(event){
	console.log("paste");

	//Move clipboard collection to the desired location
	clipboardCollection = moveCollection(clipboardCollection, event, true); //move clipboard collection to new location

	console.log(clipboardCollection.channel); //has the location moved?
	//Add the current clipboard to the preview
	var previewCollection = new Collection();
	previewCollection.channel.addChannel(clipboardCollection.channel);
	console.log("clipboard collection");
	console.log(clipboardCollection.channel);
	console.log("preview collection");
	console.log(previewCollection.channel);

	//Shift everything in the preview collection by mouse position

	collection.channel.addChannel(previewCollection.channel);

	return;
}

function move_handler(event){
	hideAllSliders();
	if (!isEquivalent(new Collection(), selectedCollection)){
		cursorMode = CursorModeEnum.OPERATE.MOVE;
		document.getElementById("canvasDiv").style.cursor = "move";

	}
	else
	{
		cursorMode = CursorModeEnum.OPERATE.MOVE;
		console.log("Nothing to move!");
	}
}

function pointer_select_handler(event){
	hideAllSliders();
	cursorMode = CursorModeEnum.SELECT.POINTER;
	document.getElementById("canvasDiv").style.cursor = "auto";
}

function box_select_handler(event){
	hideAllSliders();
	if(cursorMode == CursorModeEnum.PLACE.BOX){
		cursorMode = CursorModeEnum.SELECT.POINTER;
	}
	else{
		cursorMode = CursorModeEnum.SELECT.BOX;
	}
	document.getElementById("canvasDiv").style.cursor = "crosshair";
}

function channel_handler(event){
	console.log("channel handler clicked!");
	//If we were already in this mode, toggle out of it
	if(cursorMode == CursorModeEnum.PLACE.CHANNEL){
		cursorMode = CursorModeEnum.SELECT.POINTER;
	}
	//If we weren't already in this mode
	else{
		//Start a new channel
		firstInChannel = true;

		//Toggle into the PLACE CHANNEL mode
		cursorMode = CursorModeEnum.PLACE.CHANNEL;
		document.getElementById("canvasDiv").style.cursor = "url('channel'), auto";
	}
	hideAllSliders();
	console.log('channel');
	document.getElementById('channel_sliders').style.display = 'block';
}

function helical_mixer(event){
	cursorMode = CursorModeEnum.PLACE.HELIX;
	hideAllSliders();
	document.getElementById('mixer_sliders').style.display = 'block';		
}

function t_junction(event){
	cursorMode = CursorModeEnum.PLACE.T_JUNCT;
	document.getElementById("canvasDiv").style.cursor = "url('t_junct'), auto";
	img.src = 't_junct';
}

function cross_junction(event){
	cursorMode = CursorModeEnum.PLACE.CROSS_JUNCT;
	document.getElementById("canvasDiv").style.cursor = "url('cross_junct'), auto";
	img.src = 'cross_junct';
}

function collection_region_handler(event){
	cursorMode = CursorModeEnum.PLACE.VERTEX;	
 	//document.getElementById("collection").style.display="none";
	hideAllSliders();
	document.getElementById('collection_sliders').style.display = 'block';
}

function rect_region_handler(event){
	cursorMode = CursorModeEnum.PLACE.RECT;
	hideAllSliders();
}

function pillar_handler(event){
	cursorMode = CursorModeEnum.PLACE.PILLAR;
	//document.getElementById("collection").style.display="none";
	hideAllSliders();
	document.getElementById('pillar_sliders').style.display = 'block';
}

function hideAllSliders(){
	document.getElementById('sliders').style.display='block';
	document.getElementById('collection_sliders').style.display = 'none';
	document.getElementById('channel_sliders').style.display = 'none';
	document.getElementById('mixer_sliders').style.display = 'none';		
	document.getElementById('pillar_sliders').style.display = 'none';
	document.getElementById('fileInput').style.display = 'none';
}

function upload_handler(){
	hideAllSliders();
	document.getElementById('fileInput').style.display = 'block';
}

function handleFiles(){
	console.log("handle files");
	var newFile = this.files[0];
	var r = new FileReader();
	var contents;
	r.onload = function(e){
		console.log("read files");
		contents = r.result;
		console.log(contents);
		collection = JSON.parse(contents);
		redraw();
	}
	r.readAsText(newFile);
	document.getElementById("fileInput").style.display = "none";
}

function download_handler(){
	hideAllSliders();
	var jsonString = JSON.stringify(collection);
	//Adapted from: http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server; supposedly only works in Chrome (ok for now??)
	  var element = document.createElement('a');
	  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonString));
	  var filename = 'test.json';
	  element.setAttribute('download', filename);
	  element.style.display = 'none';
	  document.body.appendChild(element);

	  element.click();

	  document.body.removeChild(element);
	
}

function new_handler(){
	hideAllSliders();
	collection = new Collection();
	selectedCollection = new Collection();
	redraw();
}
