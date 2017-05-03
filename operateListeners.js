function moveMouseDownListener(e){
	//TODO: abstract away into collection method eventually
	anchorMouseX = mouseX;
	anchorMouseY = mouseY;
}

function moveDragListeners(e){

	if(anchorMouseX == -1 || anchorMouseY == -1)
	{
		return;
	}

	for(var i = 0; i<selectedCollection.channel.nodes.length; i++){


		//TODO: offer (but don't force) snap to grid?
               selectedCollection.channel.nodes[i].x = selectedCollection.channel.nodes[i].x + (mouseX - anchorMouseX);
               selectedCollection.channel.nodes[i].y = selectedCollection.channel.nodes[i].y + (mouseY - anchorMouseY);

	}

	//If the delta is too small, then don't reset the anchor
	anchorMouseX = mouseX;
	anchorMouseY = mouseY;

}

function deleteListener(e){

	collection.deleteCollection(selectedCollection);
	selectedCollection = new Collection();

	return;
}