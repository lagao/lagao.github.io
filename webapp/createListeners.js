function channelClickListener(e){
	paint = true;
	var r = parseFloat(document.getElementById("channel_width_box").value)/2;
	var type = 0;
	var w = 0;
	var h = 0;
	addVertex(snappedMouseX, snappedMouseY, r, type, w, h);
	refreshCanvas(); //command to update the function
}

function helixClickListener(e){	
 	paint = true;
	var r = parseFloat(document.getElementById("mixer_width_box").value)/2;
	var type = 0;
	var w = 0;
	var h = 0;
 	addVertex(snappedMouseX, snappedMouseY, r, type, w, h); //arguments: the inputs you put into a function (addClick). addClick is currently being called. 
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
	var x = (rectX1 + rectX2)/2;
	var y = (rectY1 + rectY2)/2;
	var r = 0;
	var type = 1;
	var w = Math.abs(rectX2 - rectX1);
	var h = Math.abs(rectY2 - rectY1);
	var tempRadius = w/2 < h/2 ? w/2 : h/2; //not perfect but ok for now min(w/2, h/2)
	var nearestNode = findNearestNode(x, y, tempRadius); //TODO: fix this so find nearest node can input a rectangle as well
	if (nearestNode == null){
		addVertex(x, y, r, type, w, h);
	} else {
		//Change the nearest node to being the rectangle
		nearestNode.x = x;
		nearestNode.y = y;
		nearestNode.r = r;
		nearestNode.type = type;
		nearestNode.w = w;
		nearestNode.h = h;
	}
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
	var type = 0;
	var w = 0;
	var h = 0;
	if (nearestNode == null){
		addVertex(snappedMouseX, snappedMouseY, radius, type, w, h);
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
