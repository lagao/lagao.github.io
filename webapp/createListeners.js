function channelClickListener(e){
	paint = true;
	addVertex(snappedMouseX, snappedMouseY);
	refreshCanvas(); //command to update the function
}

function helixClickListener(e){	
 	paint = true;
 	addVertex(snappedMouseX, snappedMouseY); //arguments: the inputs you put into a function (addClick). addClick is currently being called. 
 	refreshCanvas(); //command to update the function	
 	//context.drawImage(tempCanvas, e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop);
 	//collection.helix_list.push(new Helix(e.pageX, e.pageY, rotateAngle));
}

function rectClickDownListener(e){
	document.getElementById("canvasDiv").style.cursor = "crosshair";
	paint = true;
	rectX1 = snappedMouseX;
	rectY1 = snappedMouseY;
	refreshCanvas(); //command to update the function
}

function rectClickMoveListener(e){
	console.log("click move");
	paint = true;
	rectX2 = snappedMouseX;
	rectY2 = snappedMouseY;
	refreshCanvas();
}

function rectClickUpListener(e){
	paint = true;
	rectX2 = snappedMouseX;
	rectY2 = snappedMouseY;
	console.log("rect 1, 2");	
	console.log(rectX1);
	console.log(rectY1);
	console.log(rectX2);
	console.log(rectY2);
	var node = new Node(rectX1, rectY1, 0, 1, rectX2 - rectX1, rectY2 - rectY1);
	collection.channel.nodes.push(node);
	collection.channel.edges.push([]);
	console.log(collection.channel);
	refreshCanvas();
	rectX1 = -1;
	rectX2 = -1;
	rectY1 = -1;
	rectY2 = -1;
	//Add vertex to the graph
}


function collectionRegionClickListener(e){
	paint = true;
	var radius = parseFloat(document.getElementById("collection_region_size_box").value);
	var nearestNode = findNearestNode(mouseX, mouseY, radius);
	if (nearestNode == null){
		addVertex(snappedMouseX, snappedMouseY);
	} else {
		nearestNode.r = radius;
	}
	refreshCanvas(); //command to update the function
}

function pillarClickListener(e){
	var height = 1;
	var radius = parseInt(document.getElementById("pillar_width_box").value);
	collection.pillar_list.push(new Pillar(snappedMouseX, snappedMouseY, height, radius));
	paint = true;
	refreshCanvas(); //command to update the function
}
