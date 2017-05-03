function pointerSelectHoverListener(e){

	//Check if there are any nodes or edges within thresh of the mouse
	nearestNode = findNearestNode(mouseX, mouseY);
	nearestEdge = findNearestEdge(mouseX, mouseY);

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
	nearestNode = findNearestNode(mouseX, mouseY);
	nearestEdge = findNearestEdge(mouseX, mouseY);

	console.log(selectedCollection);

	//If you're near a node, select it
	if(nearestNode != null) {

		selectedCollection.channel.addNode(nearestNode);

	}

	//If you're not near a node, but you are near an edge:
	else if (nearestEdge != null)
	{
//		selectedCollection.channel.addEdge(nearestEdge);

		console.log("Selecting edge:" + nearestEdge);
		//TODO: maybe replace the "push" function with something that
		//TODO: --SOLN: Have to pass in srcCollection as argument

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
}

function boxSelectMouseDownListener(e){

	if(cursorMode == CursorModeEnum.PLACE.CHANNEL){
		cursorMode = CursorModeEnum.SELECT.POINTER;
	}
	else{
		anchorMouseX = mouseX;
		anchorMouseY = mouseY;
		anchorMouseX2 = -1;
		anchorMouseY2 = -1;
	}
}

function boxSelectMouseMoveListener(e){

	//If there's no box selection started, don't do anything
	if(anchorMouseX == -1){
		return;
	}

	//If a box selection's started, but not finished, use mouse's X & Y
	if(anchorMouseX2 == -1){
		selectedCollection = findBoxSelection(anchorMouseX, anchorMouseY, mouseX, mouseY);
	}
	//If there's a finished box selection, use anchorMouse's X & Y
	else{
		selectedCollection = findBoxSelection(anchorMouseX, anchorMouseY, anchorMouseX2, anchorMouseY2);
	}

}

function boxSelectMouseUpListener(e){
	//cursorMode = CursorModeEnum.SELECT.POINTER;
	anchorMouseY2 = mouseY;
	anchorMouseX2 = mouseX;
}