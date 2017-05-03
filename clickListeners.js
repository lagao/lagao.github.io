function snapMouseCoord(mousePos, gridSize)
{
	return gridSize*Math.round(mousePos/gridSize);
}

function channelClickListener(e){
	var gridSize = 20; //TODO: set globally and import so it can be dynamically changed
	var mouseX = snapMouseCoord(e.pageX-canvas.offsetLeft, gridSize);
	var mouseY = snapMouseCoord(e.pageY-canvas.offsetTop, gridSize);
	paint = true;
	addVertex(mouseX, mouseY);
	redraw(); //command to update the function
}

function helixClickListener(e){	
	var gridSize = 20; //TODO: set globally and import so it can be dynamically changed
	var mouseX = snapMouseCoord(e.pageX-canvas.offsetLeft, gridSize);
	var mouseY = snapMouseCoord(e.pageY-canvas.offsetTop, gridSize);
	paint = true;
	addVertex(mouseX, mouseY); //arguments: the inputs you put into a function (addClick). addClick is currently being called. 
	redraw(); //command to update the function	
	//context.drawImage(tempCanvas, e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop);
	//collection.helix_list.push(new Helix(e.pageX, e.pageY, rotateAngle));
}

function tJunctClickListener(e){
	var tempCanvas = document.createElement('canvas');
	tempCanvas.setAttribute('id', 'canvas');
	if(typeof G_vmlCanvasManager != 'undefined') {
		tempCanvas = G_vmlCanvasManager.initElement(tempCanvas);
	}
	tempContext = tempCanvas.getContext("2d");
	tempContext.rotate(rotateAngle);
	tempContext.drawImage(img, 0,0);
	context.drawImage(tempCanvas, e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop);
//	collection.t_list.push(new T_Junction(e.pageX, e.pageY, rotateAngle));
}

function crossJunctClickListener(e){
	var tempCanvas = document.createElement('canvas');
	tempCanvas.setAttribute('id', 'canvas');
	if(typeof G_vmlCanvasManager != 'undefined') {
		tempCanvas = G_vmlCanvasManager.initElement(tempCanvas);
	}
	tempContext = tempCanvas.getContext("2d");
	tempContext.rotate(rotateAngle);
	tempContext.drawImage(img, 0, 0);
	context.drawImage(tempCanvas, e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop);
//	collection.cross_list.push(new Cross_Junction(e.pageX, e.pageY, rotateAngle));
}

function collectionRegionClickListener(e){
	var gridSize = 20; //TODO: set globally and import so it can be dynamically changed
	var mouseX = snapMouseCoord(e.pageX-canvas.offsetLeft, gridSize);
	var mouseY = snapMouseCoord(e.pageY-canvas.offsetTop, gridSize);
	paint = true;
	var radius = parseFloat(document.getElementById("collection_region_size_box").value);
	var nearestNode = findNearestNode(mouseX, mouseY, radius);
	if (nearestNode == null){
		addVertex(mouseX, mouseY);
	} else {
		nearestNode.r = radius;
	}
	redraw(); //command to update the function
}

function pillarClickListener(e){
	var gridSize = 20; //TODO: set globally and import so it can be dynamically changed
	var mouseX = snapMouseCoord(e.pageX-canvas.offsetLeft, gridSize);
	var mouseY = snapMouseCoord(e.pageY-canvas.offsetTop, gridSize);
	var height = 1;
	var radius = parseInt(document.getElementById("pillar_width_box").value);
	collection.pillar_list.push(new Pillar(mouseX, mouseY, height, radius));
	paint = true;
	redraw(); //command to update the function
}
