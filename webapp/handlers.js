///TODO: figure out what is a handler vs. what isn't!

function scrollHandler(e){

	//Set the global zoom based on the user's scroll
	currZoom = currZoom - e.wheelDelta/(Math.abs(e.wheelDelta)) * zoomIncrement;

	//Make sure zoom can't go to zero
	if(currZoom < zoomIncrement) currZoom = currZoom + zoomIncrement;

	return;
}

function mouseLeaveHandler(e){
	return;
}

// MOUSE DRAG EVENT //
function mouseDragHandler(e){
	if(cursorMode == CursorModeEnum.OPERATE.MOVE){
		pointer_select_handler(e);
		return;
	}
	switch(cursorMode){
		case CursorModeEnum.OPERATE.MOVE:
			console.log("move drag litsener");
			moveDragListener(e);
			break;
		case CursorModeEnum.SELECT.BOX:	
			console.log("box select drag listener");
			boxSelectMouseDragListener(e);
			break;
		default:
			break;
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
			break;

		case CursorModeEnum.SELECT.BOX:
			boxSelectMouseUpListener(e);
			break;

		case CursorModeEnum.OPERATE.REFLECT:		
			reflectMouseUpListener(e);
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

		case CursorModeEnum.OPERATE.REFLECT:
			reflectMouseDownListener(e);
			break;

		case CursorModeEnum.OPERATE.ROTATE:
			rotateMouseDownListener(e);
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
			boxSelectMouseDragListener(e);
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
	if (e.keyCode == 72)	mixer_handler(e);

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
	pointer_select_handler(event);
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
	pointer_select_handler(event);
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
	if(cursorMode == CursorModeEnum.OPERATE.MOVE){
		pointer_select_handler(event);
		return;
	}
	hideAllSliders();
	if (!isEquivalent(new Collection(), selectedCollection)){
		cursorMode = CursorModeEnum.OPERATE.MOVE;
		document.getElementById("canvasDiv").style.cursor = "move";

	}
	else
	{
		pointer_select_handler(event);
		alert("Nothing to move!");
		console.log("Nothing to move!");
	}
}

function pointer_select_handler(event){
	console.log("pointer select handler");
	hideAllSliders();
	cursorMode = CursorModeEnum.SELECT.POINTER;
	document.getElementById("canvasDiv").style.cursor = "auto";
	display_sliders(true);
}

function box_select_handler(event){
	hideAllSliders();
	if(cursorMode == CursorModeEnum.PLACE.BOX){
		pointer_select_handler(event);
		return;
	}
	else{
		cursorMode = CursorModeEnum.SELECT.BOX;
		boxMouseX = -1;
		boxMouseY = -1;
		boxMouseX2 = -1;
		boxMouseY2 = -1;
	}
	document.getElementById("canvasDiv").style.cursor = "crosshair";
}

function channel_handler(event){
	console.log("channel handler clicked!");
	//If we were already in this mode, toggle out of it
	if(cursorMode == CursorModeEnum.PLACE.CHANNEL){
		pointer_select_handler(event);
		return;
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
	if(cursorMode == CursorModeEnum.PLACE.MIXER){
		pointer_select_handler(event);
		return;
	}
	firstInChannel = true; //forgot this!!!
	cursorMode = CursorModeEnum.PLACE.MIXER;
	hideAllSliders();
	document.getElementById('mixer_sliders').style.display = 'block';		
}

function t_junction(event){
	if(cursorMode == CursorModeEnum.PLACE.T_JUNCT){
		pointer_select_handler(event);
		return;
	}
	cursorMode = CursorModeEnum.PLACE.T_JUNCT;
	document.getElementById("canvasDiv").style.cursor = "url('t_junct'), auto";
	img.src = 't_junct';
}

function cross_junction(event){
	if(cursorMode == CursorModeEnum.PLACE.CROSS_JUNCT){
		pointer_select_handler(event);
		return;
	}
	cursorMode = CursorModeEnum.PLACE.CROSS_JUNCT;
	document.getElementById("canvasDiv").style.cursor = "url('cross_junct'), auto";
	img.src = 'cross_junct';
}

function collection_region_handler(event){
	if(cursorMode == CursorModeEnum.PLACE.VERTEX){
		pointer_select_handler(event);
		return false;
	}
	cursorMode = CursorModeEnum.PLACE.VERTEX;	
 	//document.getElementById("collection").style.display="none";
	hideAllSliders();
	//document.getElementById('collection_sliders').style.display = 'block';
	return true;
}

function rect_region_handler(event){
	if(cursorMode == CursorModeEnum.PLACE.RECT){
		pointer_select_handler(event);
		return false; //RETURN FALSE IF IT WAS ALREADY THERE
	}
	cursorMode = CursorModeEnum.PLACE.RECT;
	hideAllSliders();
	return true; //RETURN TRUE IF IT WAS NOT
}

function pillar_handler(event){
	if(cursorMode == CursorModeEnum.PLACE.PILLAR){
		pointer_select_handler(event);
		return;
	}
	cursorMode = CursorModeEnum.PLACE.PILLAR;
	//document.getElementById("collection").style.display="none";
	hideAllSliders();
	document.getElementById('pillar_sliders').style.display = 'block';
}

function hideAllSliders(){
	document.getElementById('sliders').style.display='block';
	document.getElementById('collection_sliders').style.display = 'none';
	document.getElementById('collection_fix').style.display = 'none';
	document.getElementById('channel_sliders').style.display = 'none';
	document.getElementById('channel_fix').style.display = 'none';
	document.getElementById('channel_length_sliders').style.display = 'none';
	document.getElementById('channel_length_fix').style.display = 'none';
	document.getElementById('mixer_sliders').style.display = 'none';	
	document.getElementById('mixer_fix').style.display = 'none';	
	document.getElementById('pillar_sliders').style.display = 'none';
	document.getElementById('pillar_fix').style.display = 'none';	
	document.getElementById('fileInput').style.display = 'none';
 	document.getElementById('array').style.display = 'none';
    document.getElementById('download_png').style.display = 'none';
	document.getElementById('rect_sliders').style.display = 'none';
	document.getElementById('rect_fix').style.display = 'none';
	document.getElementById('reflection_div').style.display = 'none';
	document.getElementById('rotation_div').style.display = 'none';
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

function download_png_handler(){
    
    hideAllSliders();
    document.getElementById('download_png').style.display = 'block';
    var dataURL = canvas.toDataURL();
    document.getElementById('canvasImg').src = dataURL;
    
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
		pointer_select_handler();
		collection = new Collection();
		selectedCollection = new Collection();
		arrayPreviewCollection = new Collection();
		previewCollection = new Collection();
		refreshCanvas();
	}
}

function display_sliders(isResize){
	hideAllSliders();
	//pointer_select_handler(); //Enum tells you what CursorMode is in use at a time
	console.log(selectedCollection.channel);

	for (var i = 0; i < selectedCollection.channel.nodes.length; i++){
		if (selectedCollection.channel.nodes[i] == null) continue;
		var nodeIsPossiblyCollectionRegion = false;
		for (var j = 0; j < selectedCollection.channel.edges[i].length; j++){
			if (selectedCollection.channel.edges[i] == null) continue;
			if (selectedCollection.channel.edges[i][j] == null) continue;
			if (selectedCollection.channel.nodes[i].type == 0 &&
				 selectedCollection.channel.nodes[i].r * 2 > selectedCollection.channel.edges[i][j].weight) {
					console.log("node could be collection region");
					nodeIsPossiblyCollectionRegion = true; //node is bigger than surrounding edges
			}
			if (selectedCollection.channel.edges[i][j].type == 0) {
				document.getElementById('channel_sliders').style.display = 'block';
				document.getElementById('channel_width_box').value = selectedCollection.channel.edges[i][j].weight;
				if (isResize) document.getElementById('channel_fix').style.display = 'block';
			} else {
				document.getElementById('mixer_sliders').style.display = 'block';
				document.getElementById('mixer_wavelength_box').value = selectedCollection.channel.edges[i][j].wavelength;
				document.getElementById('mixer_amplitude_box').value = selectedCollection.channel.edges[i][j].amplitude;
				document.getElementById('mixer_width_box').value = selectedCollection.channel.edges[i][j].weight;
				if (isResize) document.getElementById('mixer_fix').style.display = 'block';
				switch (selectedCollection.channel.edges[i][j].type) {
					case 1:
						document.getElementById("mixer_type1").checked = true;
						break;
					case 2:		
						document.getElementById("mixer_type2").checked = true;
						break;
					case 3:	
						document.getElementById("mixer_type3").checked = true;
						break;
					default:
						break;
				}
			}
			document.getElementById('channel_length_sliders').style.display = 'block';
			document.getElementById('channel_length_box').value = selectedCollection.channel.distBetweenNodes(i, j);
			if (isResize) document.getElementById('channel_length_fix').style.display = 'block';
		}		
		
		nodeIsPossiblyCollectionRegion = nodeIsPossiblyCollectionRegion || selectedCollection.channel.edges[i].length == 0;
		console.log(collection);
		console.log("is node collection region?");
		console.log(nodeIsPossiblyCollectionRegion);

		if (selectedCollection.channel.nodes[i].type == 0 && nodeIsPossiblyCollectionRegion) {
			document.getElementById('collection_sliders').style.display = 'block';
			document.getElementById('collection_region_size_box').value = selectedCollection.channel.nodes[i].r;
			if (isResize) document.getElementById('collection_fix').style.display = 'block';
		}
		if (selectedCollection.channel.nodes[i].type == 1){
			console.log("found rectangular region");
			document.getElementById('rect_sliders').style.display = 'block';
			document.getElementById('rect_collection_region_width_box').value = selectedCollection.channel.nodes[i].w;
			document.getElementById('rect_collection_region_height_box').value = selectedCollection.channel.nodes[i].h;
			if (isResize) document.getElementById('rect_fix').style.display = 'block';
		}
	}

}

//When you click down on the measurement handler
function measurement_handler(event){
	pointer_select_handler(event);
}

function resize_handler(event){
	pointer_select_handler(event);
}

function array_handler(){
	if (cursorMode == CursorModeEnum.OPERATE.ARRAY) {
		pointer_select_handler();
		return false;	
	}
	hideAllSliders();
	//pointer_select_handler();
	document.getElementById('channel_sliders').style.display = 'none';
	document.getElementById('array').style.display = 'block';
	cursorMode = CursorModeEnum.OPERATE.ARRAY;
	return true;
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
					var type = tmpCollection.channel.nodes[k].type;
					var w = tmpCollection.channel.nodes[k].w;
					var h = tmpCollection.channel.nodes[k].h;
					tmpCollection.channel.nodes[k] = new Node(x, y, r, type, w, h);
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
	//pointer_select_handler();
	refreshCanvas();
}


function snapMouseCoord(mousePos, gridSize)
{
	return gridSize*Math.round(mousePos/gridSize);
}

//RESIZING HANDLERS

function collection_fix_handler(){
	
	for (var i = 0; i < selectedCollection.channel.nodes.length; i++){
		if (selectedCollection.channel.nodes[i] == null) continue;
		var nodeIsPossiblyCollectionRegion = false;
		for (var j = 0; j < selectedCollection.channel.edges[i].length; j++){
			if (selectedCollection.channel.edges[i] == null) continue;
			if (selectedCollection.channel.edges[i][j] == null) continue;
			if (selectedCollection.channel.nodes[i].type == 0 &&
				 selectedCollection.channel.nodes[i].r * 2 > selectedCollection.channel.edges[i][j].weight) {
					console.log("node could be collection region");
					nodeIsPossiblyCollectionRegion = true; //node is bigger than surrounding edges
			}
		}		
		if (selectedCollection.channel.nodes[i].type == 0 && nodeIsPossiblyCollectionRegion) {
			selectedCollection.channel.nodes[i].r = parseFloat(document.getElementById("collection_region_size_box").value);
			collection.channel.nodes[collection.channel.idxOf(selectedCollection.channel.nodes[i])].r = parseFloat(document.getElementById("collection_region_size_box").value);
		}
	}


	refreshCanvas(); //Draw preview collection
	resize_handler(); //refresh collection in nodes
}

function rect_fix_handler(){
	
	for (var i = 0; i < selectedCollection.channel.nodes.length; i++){
		if (selectedCollection.channel.nodes[i] == null) continue;		
		if (selectedCollection.channel.nodes[i].type == 1) {
			selectedCollection.channel.nodes[i].w = parseFloat(document.getElementById("rect_collection_region_width_box").value);
			selectedCollection.channel.nodes[i].h = parseFloat(document.getElementById("rect_collection_region_height_box").value);
			collection.channel.nodes[collection.channel.idxOf(selectedCollection.channel.nodes[i])].w = parseFloat(document.getElementById("rect_collection_region_width_box").value);
			collection.channel.nodes[collection.channel.idxOf(selectedCollection.channel.nodes[i])].h = parseFloat(document.getElementById("rect_collection_region_height_box").value);
		}
	}

	
	refreshCanvas(); //Draw preview collection
	resize_handler(); //refresh collection in nodes
}

function channel_fix_handler(){
	for (var i = 0; i < selectedCollection.channel.nodes.length; i++){
		if (selectedCollection.channel.nodes[i] == null) continue;	
		if (selectedCollection.channel.edges[i] == null) continue;	
		for (var j = 0; j < selectedCollection.channel.edges[i].length; j++){
			if (selectedCollection.channel.edges[i][j] == null) continue;
			console.log("working on edge");
			var edge = selectedCollection.channel.edges[i][j];
			if (edge.type == 0) {
				var u = collection.channel.idxOfU(selectedCollection, edge);
				var v = collection.channel.idxOfV(selectedCollection, edge);
				if (selectedCollection.channel.nodes[edge.u].r * 2 == edge.weight) {
					selectedCollection.channel.nodes[edge.u].r = parseFloat(document.getElementById('channel_width_box').value)/2;
					selectedCollection.channel.nodes[edge.v].r = parseFloat(document.getElementById('channel_width_box').value)/2;
					collection.channel.nodes[u].r = parseFloat(document.getElementById('channel_width_box').value)/2;
					collection.channel.nodes[v].r = parseFloat(document.getElementById('channel_width_box').value)/2;
				}
				selectedCollection.channel.setEdgeWeight(edge.u, edge.v, parseFloat(document.getElementById('channel_width_box').value));
				collection.channel.setEdgeWeight(u, v, parseFloat(document.getElementById('channel_width_box').value));
			}
		}
	}

	refreshCanvas(); //Draw preview collection
	resize_handler(); //refresh collection in nodes
}

function channel_length_fix_handler(){
	for (var i = 0; i < selectedCollection.channel.nodes.length; i++){
		if (selectedCollection.channel.nodes[i] == null) continue;	
		if (selectedCollection.channel.edges[i] == null) continue;	
		for (var j = 0; j < selectedCollection.channel.edges[i].length; j++){	
			if (selectedCollection.channel.edges[i][j] == null) continue;
			var edge = selectedCollection.channel.edges[i][j];
			var u = collection.channel.idxOfU(selectedCollection, edge);
			var v = collection.channel.idxOfV(selectedCollection, edge);
			selectedCollection.channel.setEdgeLength(edge.u, edge.v, parseFloat(document.getElementById('channel_length_box').value));
			collection.channel.setEdgeLength(u, v, parseFloat(document.getElementById('channel_length_box').value));
			console.log("selected collection");
			console.log(selectedCollection);
			console.log(edge.u);
			console.log(edge.v);
			console.log("collection");	
			console.log(collection);
			console.log(u);
			console.log(v);
		}
	}

	refreshCanvas(); //Draw preview collection
	resize_handler(); //refresh collection in nodes

}

function mixer_fix_handler(){
	for (var i = 0; i < selectedCollection.channel.nodes.length; i++){
		if (selectedCollection.channel.nodes[i] == null) continue;		
		for (var j = 0; j < selectedCollection.channel.edges[i].length; j++){
			if (selectedCollection.channel.edges[i] == null) continue;
			if (selectedCollection.channel.edges[i][j] == null) continue;
			if (selectedCollection.channel.edges[i][j].type > 0) {
				var edge = selectedCollection.channel.edges[i][j];
				var type = document.getElementById("mixer_type1").checked ? 1 :
						document.getElementById("mixer_type2").checked ? 2: 3;

				var u = collection.channel.idxOfU(selectedCollection, selectedCollection.channel.edges[i][j]);
				var v = collection.channel.idxOfV(selectedCollection, selectedCollection.channel.edges[i][j]);

				if (selectedCollection.channel.nodes[edge.u].r * 2 == edge.weight) {
					selectedCollection.channel.nodes[edge.u].r = parseFloat(document.getElementById('channel_width_box').value)/2;
					selectedCollection.channel.nodes[edge.v].r = parseFloat(document.getElementById('channel_width_box').value)/2;
					collection.channel.nodes[u].r = parseFloat(document.getElementById('channel_width_box').value)/2;
					collection.channel.nodes[v].r = parseFloat(document.getElementById('channel_width_box').value)/2;
				}

				selectedCollection.channel.setEdgeType(edge.u, edge.v, type, parseFloat(document.getElementById("mixer_wavelength_box").value), parseFloat(document.getElementById("mixer_amplitude_box").value));
				selectedCollection.channel.setEdgeWeight(edge.u, edge.v, parseFloat(document.getElementById("mixer_width_box").value));
				collection.channel.setEdgeType(u, v, type, parseFloat(document.getElementById("mixer_wavelength_box").value), parseFloat(document.getElementById("mixer_amplitude_box").value));
				collection.channel.setEdgeWeight(u, v, parseFloat(document.getElementById("mixer_width_box").value));
			}
		}
	}

	refreshCanvas(); //Draw preview collection
	resize_handler(); //refresh collection in nodes
}

function pillar_fix_handler(){
	alert("Not yet implemented :/");
}


function reflection_handler(){
	if(cursorMode == CursorModeEnum.OPERATE.REFLECT){
		pointer_select_handler();
		return false;
	}
	console.log("reflect clicked");
	hideAllSliders();
	document.getElementById('reflection_div').style.display = 'block';
	cursorMode = CursorModeEnum.OPERATE.REFLECT;
	return true;
}

function reflection_fix_handler(){
	console.log("reflection fix handler");

	var x1 = reflectX1;
	var y1 = reflectY1;
	var x2 = reflectX2;
	var y2 = reflectY2;
	var dx = x2 - x1;
	var dy = y2 - y1;
	var m = dy/dx;
	var b = y2 - m*x2;
	console.log(y1);
	console.log(y2);

	var reflectedCollection = new Collection();
	for (var i = 0; i < selectedCollection.channel.nodes.length; i++){
		if (selectedCollection.channel.nodes[i] == null) continue;
		
		var node = selectedCollection.channel.nodes[i];
		var x = node.x;
		var y = node.y;
		var m2 = -dx/dy;
		var b2 = y - m2*x;

		var reflectX = x;
		var reflectY = y;
		//For a vertical line
		if (dx == 0){
			var dist = x1 - x;
			reflectX = x1 + dist;
			reflectY = y;	
		} else if (dy == 0) {
			var dist = y1 - y;
			reflectX = x;
			reflectY = y1 + dist; 
		} else {
		 	reflectX = (b2 - b) / (m - m2);
			reflectY = m*reflectX + b;
			reflectX += (reflectX - x);
			reflectY += (reflectY - y);
		}

		console.log("printing!");
		console.log(x);
		console.log(y);
		console.log(reflectX);
		console.log(reflectY);

		reflectedCollection.channel.nodes[i] = new Node(reflectX, reflectY, node.r, node.type, node.w, node.h);

		reflectedCollection.channel.edges[i] = [];
		for (var j = 0; j < selectedCollection.channel.edges[i].length; j++){
			reflectedCollection.channel.edges[i][j] = selectedCollection.channel.edges[i][j];
		} 

	}	
	collection.channel.addChannel(reflectedCollection.channel);
	console.log("added reflectedcollection");
	console.log(selectedCollection.channel);
	console.log(reflectedCollection.channel);
	console.log(collection.channel);

	selectedCollection = new Collection();
	reflectedCollection = new Collection();

	refreshCanvas();
	
	reflectX1 = -1;
	reflectY1 = -1;
	reflectX2 = -1;
	reflectY2 = -1;
}

function rotation_handler(){
	if(cursorMode == CursorModeEnum.OPERATE.ROTATE){
		pointer_select_handler();
		return false;
	}
	console.log("rotate clicked");
	hideAllSliders();
	document.getElementById('rotation_div').style.display = 'block';
	cursorMode = CursorModeEnum.OPERATE.ROTATE;
	return true;
}

function rotation_fix_handler(){

	console.log("rotation fix handler");

	var px = rotateX;
	var py = rotateY;
	var theta = parseFloat(document.getElementById('angle').value);
	console.log(theta);

	var rotatedCollection = new Collection();
	for (var i = 0; i < selectedCollection.channel.nodes.length; i++){
		if (selectedCollection.channel.nodes[i] == null) continue;
		
		var node = selectedCollection.channel.nodes[i];
		var x = node.x;
		var y = node.y;
		var d = dist(px, py, x, y);
		var x1 = d*Math.cos(theta*3.14159/180.0);
		var y1 = d*Math.sin(theta*3.14159/180.0);

		var theta2 = Math.atan2(y - py, x - px);
		console.log(theta2);
		
		var c = Math.cos(theta2);
		var s = Math.sin(theta2);
		console.log(c);
		console.log(s);
		
		var x2 = px + x1*c + y1*s;
		var y2 = py - (-x1*s + y1*c); //reverse direction bc pixel coordinate frame

		console.log("printing!");
		console.log(x);
		console.log(y);
		console.log(x2);
		console.log(y2);

		rotatedCollection.channel.nodes[i] = new Node(x2, y2, node.r, node.type, node.w, node.h);

		rotatedCollection.channel.edges[i] = [];
		for (var j = 0; j < selectedCollection.channel.edges[i].length; j++){
			rotatedCollection.channel.edges[i][j] = selectedCollection.channel.edges[i][j];
		} 

	}	
	collection.channel.addChannel(rotatedCollection.channel);
	console.log("added reflectedcollection");
	console.log(selectedCollection.channel);
	console.log(rotatedCollection.channel);
	console.log(collection.channel);

	selectedCollection = new Collection();
	rotatedCollection = new Collection();

	refreshCanvas();
	

	rotateX = -1;
	rotateY = -1;
}


