function moveMouseDownListener(e){
	pointerSelectClickListener(e); //select and move at the same time
	//TODO: abstract away into collection method eventually
	anchorMouseX = mouseX;
	anchorMouseY = mouseY;
}

function moveCollection(coll, e, isCutPaste){

	var newColl = new Collection();
	newColl.channel = new Channel();

	if(!isCutPaste && (anchorMouseX == -1 || anchorMouseY == -1)) {
		console.log("no anchoring");
		return;
	}
	console.log("mouseX");
	console.log(mouseX);
	console.log("mouseY");
	console.log(mouseY);

	if (isCutPaste) {
	//Move command wants to move as an offset from original position defined in moveMouseDownListener()
	//Copy-paste wants to move relative to the original position of the nodes, not of the mouse
		var i = coll.channel.nodes.length - 1;
		while (coll.channel.nodes[i] == null) i--;
		anchorMouseX = coll.channel.nodes[i].x;
		anchorMouseY = coll.channel.nodes[i].y; //set anchor
	}

	for(var i = 0; i<coll.channel.nodes.length; i++){
	//TODO: offer (but don't force) snap to grid?
		newColl.channel.nodes[i] = new Node(0, 0, 0);
	        newColl.channel.nodes[i].x = coll.channel.nodes[i].x + (mouseX - anchorMouseX);
	        newColl.channel.nodes[i].y = coll.channel.nodes[i].y + (mouseY - anchorMouseY);
		newColl.channel.nodes[i].r = coll.channel.nodes[i].r;	
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

function moveDragListeners(e){
	moveCollection(selectedCollection, e, false);
}

function deleteListener(e){

	collection.deleteCollection(selectedCollection);
	selectedCollection = new Collection();

	return;
}
