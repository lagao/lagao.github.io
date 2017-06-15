//Pointer Select Listeners

function pointerSelectHoverListener(e){

	//Check if there are any nodes or edges within thresh of the mouse
	nearestNode = findNearestNode(mouseX, mouseY, 0);
	nearestEdge = findNearestEdge(mouseX, mouseY, 0);

	//If you're near a node or edge, display a cell cursor
	if(nearestNode != null || nearestEdge != null) {
		document.getElementById("canvasDiv").style.cursor = "cell";
	}
	//If you're not near anything, display a normal cursor
	else{
		document.getElementById("canvasDiv").style.cursor = "auto";
	}	

}

function pointerSelectClickListener(e){
	//Check if there are any nodes or edges within thresh of the mouse
	nearestNode = findNearestNode(mouseX, mouseY, 0);
	console.log(nearestNode);
	nearestEdge = findNearestEdge(mouseX, mouseY, 0);

	//console.log(selectedCollection);

	//If you're near a node, select it
	if(nearestNode != null) {

		selectedCollection.channel.addNode(nearestNode);

	}

	//If you're not near a node, but you are near an edge:
	else if (nearestEdge != null)
	{
		console.log("Selecting edge:" + nearestEdge);
		//TODO: maybe replace the "push" function with something that
		//TODO: --SOLN: Have to pass in srcCollection as argument
		//selectedCollection.channel.addEdge(nearestEdge);

		var u = collection.channel.nodes[nearestEdge.u];
		var v = collection.channel.nodes[nearestEdge.v];

		indexU = selectedCollection.channel.addNode(u);
		indexV = selectedCollection.channel.addNode(v);

		selectedCollection.channel.edges[indexU].push(new Edge(indexU, indexV, nearestEdge.weight, nearestEdge.type));
		selectedCollection.channel.edges[indexV].push(new Edge(indexV, indexU, nearestEdge.weight, nearestEdge.type));
	
	}
	//If you're near no edges or nodes, clear the selected collection!
	else{
		selectedCollection = new Collection();
	}
	//Change width of selected collection

	//Add or remove elements as necessary from the display ever time you change the collection
	display_sliders(true);

}

//Box Select Listeners
/*
function boxSelectMouseDownListener(e){
	console.log("mouse down listener");
	//if(cursorMode == CursorModeEnum.SELECT.BOX){
	//	cursorMode = CursorModeEnum.SELECT.POINTER;
	//} else{
		anchorMouseX = mouseX;
		anchorMouseY = mouseY;
		anchorMouseX2 = -1;
		anchorMouseY2 = -1;
		console.log(anchorMouseX);
		console.log(anchorMouseY);
		console.log(anchorMouseX2);
		console.log(anchorMouseY2);
		refreshCanvas();
	//}
}*/
/*
function boxSelectMouseDragListener(e){
	console.log("mouse drag listener");

	//If there's no box selection started, don't do anything
	if(anchorMouseX == -1){
		return;
	}
	console.log(anchorMouseX);
	console.log(anchorMouseY);
	console.log(anchorMouseX2);
	console.log(anchorMouseY2);
	//If a box selection's started, but not finished, use mouse's X & Y
	if(anchorMouseX !=1 && anchorMouseX2 == -1){
		selectedCollection = findBoxSelection(anchorMouseX, anchorMouseY, mouseX, mouseY);
		//Add or remove elements as necessary from the display ever time you change the collection
		display_sliders(true);
	}
	//If there's a finished box selection, use anchorMouse's X & Y
	else{
		selectedCollection = findBoxSelection(anchorMouseX, anchorMouseY, anchorMouseX2, anchorMouseY2);
		//Add or remove elements as necessary from the display ever time you change the collection
		display_sliders(true);
	}
	refreshCanvas();

}*/

/*
function boxSelectMouseUpListener(e){
	console.log("mouse up listener");
	console.log(cursorMode);
	//cursorMode = CursorModeEnum.SELECT.POINTER;
	anchorMouseY2 = mouseY;
	anchorMouseX2 = mouseX;
	refreshCanvas();

	
}*/


function boxSelectMouseDownListener(e){
	console.log("mouse down listener");
	mouseX = e.pageX - canvas.offsetLeft;
	mouseY = e.pageY - canvas.offsetTop;
	boxMouseX = mouseX;
	boxMouseY = mouseY;
	boxMouseX2 = -1;
	boxMouseY2 = -1;
	refreshCanvas(); //command to update the function
}

function boxSelectMouseDragListener(e){
	console.log("mouse drag listener");
	if (boxMouseX == -1) return;

	mouseX = e.pageX - canvas.offsetLeft;
	mouseY = e.pageY - canvas.offsetTop;

	//If a box selection's started, but not finished, use mouse's X & Y
	if(boxMouseX !=1 && boxMouseX2 == -1){
		
	}
	//If there's a finished box selection, use anchorMouse's X & Y
	else{
		
	}
	
	selectedCollection = findBoxSelection(boxMouseX, boxMouseY, boxMouseX2, boxMouseY2);
	//Add or remove elements as necessary from the display ever time you change the collection
	display_sliders(true);
	refreshCanvas();

}

function boxSelectMouseUpListener(e){
	mouseX = e.pageX - canvas.offsetLeft;
	mouseY = e.pageY - canvas.offsetTop;

	boxMouseX2 = mouseX;
	boxMouseY2 = mouseY;

	refreshCanvas();



}


