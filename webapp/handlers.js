///TODO: figure out what is a handler vs. what isn't!

// MOUSE LEAVE EVENT //

function scrollHandler(e){

	//console.log('Wheel Delta:');
	//console.log(e.wheelDelta);
	return;
}

function mouseLeaveHandler(e){
	return;
}

// MOUSE DRAG EVENT //
function mouseDragHandler(e){
	switch(cursorMode){
		case CursorModeEnum.OPERATE.MOVE:
			console.log("move drag litsener");
			moveDragListener(e);
	}
	return;
}

// MOUSE UP EVENT //
function mouseUpHandler(e){
	switch(cursorMode){
		case CursorModeEnum.OPERATE.MOVE:
			//cursorMode = CursorModeEnum.SELECT.POINTER;
			anchorMouseY = -1;
			anchorMouseX = -1; 
			moveMouseUpListener(e);
			//TODO: Make the button unselect itself

			break;

		case CursorModeEnum.PLACE.RECT:
			rectClickUpListener(e);

		case CursorModeEnum.SELECT.BOX:
			//cursorMode = CursorModeEnum.SELECT.POINTER;
			anchorMouseY2 = mouseY;
			anchorMouseX2 = mouseX;
			break;
	
		case CursorModeEnum.OPERATE.MEASURE:	
			measureMouseUpListener(e);
			break;

		case CursorModeEnum.OPERATE.RESIZE:
			resizeMouseUpListener(e);
			break;
			

		default:
			break;
	}	
	refreshCanvas();
}

function channelMoveHandler(e){
	
}

function rightClickHandler(e){
	switch(cursorMode){
		case CursorModeEnum.SELECT.POINTER:
			channelMoveHandler(e);
			break;
		default:
			break;
	}
}

// MOUSE DOWN EVENT //
function mouseDownHandler(e){
	if ((e.which && e.which == 3) || (e.button && e.button == 2)) {
		rightClickHandler(e);
		return;
	}

	switch(cursorMode) {

		//If the user is trying to place an object:
		case CursorModeEnum.PLACE.CHANNEL:
			console.log("channel");
			channelClickListener(e);
			break;
		case CursorModeEnum.PLACE.VERTEX:
			console.log("vertex");
			collectionRegionClickListener(e);
			break;
		case CursorModeEnum.PLACE.PILLAR:
			console.log("pillar");
			pillarClickListener(e);
			break;
		case CursorModeEnum.PLACE.RECT:
			console.log("rect");
			rectClickDownListener(e);
			break;
		case CursorModeEnum.PLACE.MIXER:	
			console.log("mixer");
			helixClickListener(e);
			break;
		//If the user is trying to select an object:
		case CursorModeEnum.SELECT.POINTER:
			console.log("ptr");
			pointerSelectClickListener(e);
			break;
		case CursorModeEnum.SELECT.BOX:
			console.log("box");
			boxSelectMouseDownListener(e);
			break;

		//If the user is trying to operate on a collection
		case CursorModeEnum.OPERATE.MOVE:
			console.log("move");
			//TODO: Add listener to deal with translation 
			moveMouseDownListener(e);
			break;
		case CursorModeEnum.OPERATE.MEASURE:
			console.log("Measure down");
			measureMouseDownListener(e);
			break;
		
		case CursorModeEnum.OPERATE.RESIZE:	
			console.log("resize down");
			resizeMouseDownListener(e);
			break;

		default:
			console.log("Unknown Cursor Status: " + cursorMode)
			break;
	}
	refreshCanvas(); //draws canvas again
	storeUndoState(); //pushes changes to new stack

}

// MOUSE MOVE EVENT // 
function mouseMoveHandler(e){
//	console.log("moving mouse");
	//Track where the mouse is on the canvas
	mouseX = e.pageX - canvas.offsetLeft;
	mouseY = e.pageY - canvas.offsetTop;

	snappedMouseX = snapMouseCoord(mouseX, gridSize);
	snappedMouseY = snapMouseCoord(mouseY, gridSize);

	//Redraw preview collection when mouse moves
	previewCollection = moveCollection(previewCollection, e, true); //move clipboard collection to new location

	switch(cursorMode){

		case CursorModeEnum.SELECT.POINTER:
			pointerSelectHoverListener(e);
			break;

		case CursorModeEnum.SELECT.BOX:
			boxSelectMouseMoveListener(e);
			break;

		case CursorModeEnum.PLACE.RECT:
			rectClickMoveListener(e);
			break;

		case CursorModeEnum.OPERATE.MOVE:
			//moveDragListener(e);
			//storeUndoState(); //push things to undo stack
			break;

		default:
			break;
	}
	refreshCanvas(); //draws canvas again
}

function keyPressHandler(e){
	console.log(e.keyCode);
	if (e.keyCode == 13) e.preventDefault(); //don't refresh page when enter in box

	//Control or command entered
	if (e.keyCode == 17 || e.keyCode == 91){
		//Control or command
		commandControl = true;
	}

	//Ctrl X
	if (e.keyCode == 88) {
		if (commandControl) cut_handler(e);
		commandControl = false;
	}

	//Ctrl V
	if (e.keyCode == 86){
		if (commandControl) paste_handler(e);
		commandControl = false;
	}

	//Ctrl V
	if (e.keyCode == 67) {
		if (commandControl) copy_handler(e);
		commandControl = false;
	}
		
	//Press esc to revert to pointer mode
	if (e.keyCode == 27)	pointer_select_handler(e);

	//Press A to start and stop
	if (e.keyCode == 65)	channel_handler(e);

	//Press H to go into helix mode
	if (e.keyCode == 72) {
		cursorMode = CursorModeEnum.PLACE.MIXER;
	}

	//Press M to begin moving
	if (e.keyCode == 77)	move_handler(e);

	//Press delete to remove everything currently selected.
	if (e.keyCode == 8){
		console.log(collection);
		deleteListener(collection, selectedCollection, e);
		console.log(collection);
		firstInChannel = true; //not sure about this, should solve some problems
		selectedCollection = new Collection();
		previewCollection = new Collection();
		refreshCanvas();
	}

	//Press right arrow to rotate right
	if (e.keyCode == 39) {
		rotateAngle += 3.0*Math.PI/180;
	}
	//Press left arrow to rotate left
	if (e.keyCode == 37) {
		rotateAngle -= 3.0*Math.PI/180;	
	}

	//Press S to save
	if (e.keyCode == 83) {
		console.log(JSON.stringify(collection)); //Save this to server somehow? 
		//I think if we store the files in JSON they should be pretty easy to parse,
		//save serverside as JSON, and then turn into our OpenSCAD custom format - 
		//the output files look like this
	}
	//Press L to load a JSON file
	if (e.keyCode == 76) {
		var test = "{\"channel\":{\"nodes\":[[75,42],[183,62],[68,161],[20,130],[148,261]],\"nodeColors\":[],\"edges\":[[1,3],[0,2],[1,3,4],[2,3,3,0],[2]]},\"helix_list\":[],\"t_list\":[],\"cross_list\":[]}";
		collection = JSON.parse(test);
	}
	refreshCanvas();
}


//Fileio.js contains the overall file variable, it looks like this:
//var file = {channel_graph: [[], []], helix_list: [], t_list: [], cross_list: []};



//Things which should be done in response to any event (undo, update colection, redraw, save, etc)
function storeUndoState(){
	//console.log("stack");
	var c = JSON.parse(JSON.stringify(collection)); //want a copy of the value not the reference, this is a hacky way to do it
	undoStack.push(c);
	//console.log(undoStack);
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
		refreshCanvas();
	}
}

function redo_handler(event){
	hideAllSliders();
	if (redoStack.length >= 1){
		collection = redoStack.pop();
		storeUndoState();
		refreshCanvas();
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
	
	//Preview collection
	previewCollection = new Collection();
	previewCollection.channel.addChannel(clipboardCollection.channel);

	refreshCanvas(); //Draw preview collection

	return;
}

function copy_handler(event) {
	console.log("copy");
	//Clear the current clipboard
	clipboardCollection = new Collection();

	//Add the current selection to the clipboard
	clipboardCollection.channel.addChannel(selectedCollection.channel);
	console.log("selected collection cut");
	console.log(selectedCollection.channel);
	console.log("clipboard collection cut");
	console.log(clipboardCollection.channel);
	
	//Add preview collection
	previewCollection = new Collection();
	previewCollection.channel.addChannel(clipboardCollection.channel);

	refreshCanvas();

	return;
}

function paste_handler(event){
	console.log("paste");

	//Move clipboard collection to the desired location
	clipboardCollection = moveCollection(clipboardCollection, event, true); //move clipboard collection to new location

	console.log(clipboardCollection.channel); //has the location moved?
	//Add the current clipboard to the preview
	
	console.log("clipboard collection");
	console.log(clipboardCollection.channel);
	console.log("preview collection");
	console.log(previewCollection.channel);

	//Shift everything in the preview collection by mouse position
	collection.channel.addChannel(previewCollection.channel);
	
	refreshCanvas();
	//Clear the collection
	clipboardCollection = new Collection();
	previewCollection = new Collection();

	refreshCanvas();
	isCutPaste = false; //done pasting

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
		hideAllSliders();
		console.log('channel');
		document.getElementById('channel_sliders').style.display = 'block';
	}
	
}

function mixer_handler(event){
	cursorMode = CursorModeEnum.PLACE.MIXER;
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
	document.getElementById('measurement').style.display = 'none';
	document.getElementById('array').style.display = 'none';
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
		refreshCanvas();
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
	var result = confirm("This will delete all information on the page. Do you want to continue?");
	if (result) {
		hideAllSliders();
		cursorMode = CursorModeEnum.SELECT.POINTER;
		collection = new Collection();
		selectedCollection = new Collection();
		refreshCanvas();
	}
}

//When you click down on the measurement handler
function measurement_handler(){
	hideAllSliders();
	cursorMode = CursorModeEnum.OPERATE.MEASURE;
	document.getElementById('measurement').style.display = 'block';
}

function resize_handler(){
	hideAllSliders();
	cursorMode = CursorModeEnum.OPERATE.RESIZE;
	document.getElementById('measurement').style.display = 'block';
}

function array_handler(){
	hideAllSliders();
	cursorMode = CursorModeEnum.SELECT.POINTER;
	document.getElementById('channel_sliders').style.display = 'none';
	document.getElementById('array').style.display = 'block';
	
}


function array_change_handler(){
	console.log("copy");
	
	//Add preview collection
	arrayPreviewCollection = new Collection();
	
	//Add the current selection to the clipboard
	for (var i = 0; i < parseInt(document.getElementById("x_num_reps_slider").value); i++){
		for (var j = 0; j < parseInt(document.getElementById("y_num_reps_slider").value); j++){
			var tmpCollection = new Collection();
			tmpCollection.channel.addChannel(selectedCollection.channel);
				for (var k = 0; k < tmpCollection.channel.nodes.length; k++){
					var x = tmpCollection.channel.nodes[k].x + i*parseInt(document.getElementById("x_dist_slider").value);
					var y = tmpCollection.channel.nodes[k].y + j*parseInt(document.getElementById("y_dist_slider").value);
					var r = tmpCollection.channel.nodes[k].r;
					tmpCollection.channel.nodes[k] = new Node(x, y, r);
				}
			arrayPreviewCollection.channel.addChannel(tmpCollection.channel);
		}
	}

	/*console.log("x reps, y reps, x dist, ydist");
	console.log(parseInt(document.getElementById("x_num_reps_slider").value));
	console.log(parseInt(document.getElementById("y_num_reps_slider").value));
	console.log(parseInt(document.getElementById("x_dist_slider").value));
	console.log(parseInt(document.getElementById("y_dist_slider").value));
	console.log("array preview collection");
	console.log(arrayPreviewCollection);*/
	refreshCanvas();

	return;
}

function array_stamp_handler(){
	collection.channel.addChannel(arrayPreviewCollection.channel);
	selectedCollection = new Collection();
	arrayPreviewCollection = new Collection();
	pointer_select_handler();
	refreshCanvas();
}

function reflect_handler(){

}
