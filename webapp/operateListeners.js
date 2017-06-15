function moveMouseDownListener(e){
	cut_handler(e);
	return;

}

function moveMouseUpListener(e){
	paste_handler(e);
	selectedCollection = new Collection();
	clipboardCollection = new Collection();
	return;
}


//TODO: move this to be a method of channel (or collection)
function moveCollection(coll, e, isCutPaste){

	var newColl = new Collection();
	newColl.channel = new Channel();

	if(!isCutPaste && (anchorMouseX == -1 || anchorMouseY == -1)) {
		console.log("no anchoring");
		return;
	}

	if (isCutPaste) {
	//Move command wants to move as an offset from original position defined in moveMouseDownListener()
	//Copy-paste wants to move relative to the original position of the nodes, not of the mouse
		var i = coll.channel.nodes.length - 1;
		while (coll.channel.nodes[i] == null && i > 0) i--;
		if (coll.channel.nodes[i] != null) {
			anchorMouseX = coll.channel.nodes[i].x;
			anchorMouseY = coll.channel.nodes[i].y; //set anchor
		}
	}

	for(var i = 0; i<coll.channel.nodes.length; i++){
	//TODO: offer (but don't force) snap to grid?
	        var x = coll.channel.nodes[i].x + (mouseX - anchorMouseX);
	        var y = coll.channel.nodes[i].y + (mouseY - anchorMouseY);
		var r = coll.channel.nodes[i].r;
		var type = coll.channel.nodes[i].type;
		var width = coll.channel.nodes[i].width;
		var height = coll.channel.nodes[i].height;
		newColl.channel.nodes[i] = new Node(x, y, r, type, width, height);
		//Will have to add type as well	
	}

	for (var i = 0; i < coll.channel.nodes.length; i++){
		newColl.channel.edges[i] = [];
		for (var j = 0; j < coll.channel.edges[i].length; j++){
			newColl.channel.edges[i][j] = coll.channel.edges[i][j];
		} 
	}

	//If the delta is too small, then don't reset the anchor
	anchorMouseX = mouseX;
	anchorMouseY = mouseY;	

	return newColl;
}

function moveDragListener(e){
	console.log("move drag listener");
	console.log("preview collection");
	console.log(previewCollection.channel);
	//selectedCollection = moveCollection(selectedCollection, e, false);
	previewCollection = moveCollection(selectedCollection, e, false);
	refreshCanvas();
}

var reflectX1 = -1; //To start
var reflectY1 = -1; //To start
var reflectX2 = -1;
var reflectY2 = -1;

//TODO: Get it to work on boxes
function reflectMouseDownListener(e){
	console.log("mouse down");
	reflectX1 = mouseX;
	reflectY1 = mouseY;
	reflectX2 = -1;
	reflectY2 = -1;
}

function resizeMouseDownListener(e){
	document.getElementById('measurement_num').onchange = function(){return;}; //Do nothing
	measureMouseDownListener(e);
}

function resizeMouseUpListener(e){
	console.log("mouse up");
	measureX2 = mouseX;
	measureY2 = mouseY;
	if (measureX1 < 0 || measureY1 < 0){
		console.log("error, mouse down not measured");
	} else {
		var gridSize = 20; //?????
		var u = findNearestNode(measureX1, measureY1, gridSize); 
		var v = findNearestNode(measureX2, measureY2, gridSize); 
		var ans = "";
		if (u == null) { //Nothing selected
			console.log("No node selected!");
			ans = "";
		} else if (v == null || u.equals(v)){ 	//If the nodes are the same, give radius of node
			console.log(u.r);
			ans = u.r;
			
			document.getElementById('measurement_num').value = ans;
			//On change			
			document.getElementById('measurement_num').onchange = function(){
				u.r = document.getElementById('measurement_num').value; //pass by ref or val?
			};

		} else { //Else display distance between two nodes, whether or not there is an edge between them
			console.log(Math.sqrt(dist2(u, v))); 
			ans = Math.sqrt(dist2(u, v));
			
			document.getElementById('measurement_num').value = ans;
			//On change
			document.getElementById('measurement_num').onchange = function(){
				v.x = u.x + document.getElementById('measurement_num').value*(v.x - u.x)/ans;
				v.y = u.y + document.getElementById('measurement_num').value*(v.y - u.y)/ans;
			};
		}
	}

	refreshCanvas();

	//Clear
	measureX1 = -1;
	measureY1 = -1;	
	measureX2 = -1;
	measureY2 = -1;
	
}


function reflectMouseUpListener(e){
	console.log("mouse up");
	reflectX2 = mouseX;
	reflectY2 = mouseY;
	
}

function rotateMouseDownListener(e){
	rotateX = mouseX;
	rotateY = mouseY;
}

function deleteListener(coll, selectedColl, e){
	console.log("Collection before");
	console.log(coll);
	console.log("Selected collection before");		
	console.log(selectedColl);

	coll.deleteCollection(selectedColl);
	//coll.channel.removeChannel(selectedColl.channel);

	console.log("Collection after");
	console.log(coll);
	selectedColl = new Collection();

	return;
}
