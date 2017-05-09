
function drawGrid(canvas, gridSize){
	var context = canvas.getContext("2d");
	context.strokeStyle = "#000000";
	for (var i = 0; i < canvas.width; i+=gridSize){
		for (var j = 0; j < canvas.height; j+=gridSize){
			context.fillRect(i, j, 2, 2);		
		}
	}
}

function draw(collection, color){
	if (collection.channel.nodes.length == 0) return;
	context.strokeStyle = color;
  	context.lineJoin = "round";
  	context.lineWidth = 5;
	context.globalAlpha = 0.8;

	//Iterates through the graph's nodes, then iterates through all nodes' neighbors to draw each edge. 
	for (var i = 0; i < collection.channel.nodes.length; i++){
		//Draw a circle where the node is
		var node = collection.channel.nodes[i];
		if (node == null) continue;

		if (node.type == 1) {
			//It is a rectangular collection region
			context.strokeStyle = "#aaaaaa";
			context.lineWidth = 2;
			console.log("rectangle to write");
			console.log(rectX1);
			console.log(rectY1);
			console.log(rectX2);
			console.log(rectY2);
			context.fillRect(node.x, node.y, node.w, node.h);
			context.setLineDash([0, 0]);
			continue;
		}

	        context.beginPath();
	        context.arc(node.x, node.y, node.r, 0, 2 * Math.PI, false);
	        context.fillStyle = color;
	        context.fill();
	        context.lineWidth = 5;
	        context.stroke();		
		if (collection.channel.edges[i] == null || collection.channel.edges[i].length == 0){ //Just draw a dot if there are no edges connected to the node
			//context.beginPath();
			///context.moveTo(collection.channel.nodes[i].x-1, collection.channel.nodes[i].y-1); //TODO: use fillRect() like in the drawGrid() function to clean this up
			//context.lineTo(collection.channel.nodes[i].x, collection.channel.nodes[i].y);
	//		context.closePath();
	//		context.stroke();
		} else { //Assuming there are edges connected to the node
			for (var j = 0; j < collection.channel.edges[i].length; j++){ //For each edge connected to the node u
				var edge = collection.channel.edges[i][j]; //edge object itself. An edge from u to v with weight w and type t is expressed as Edge(u, v, weight, type, wavelength) stored at index u of the edges list. 
				var u = collection.channel.nodes[edge.u];
				var v = collection.channel.nodes[edge.v]; //Index of the edge vertex
				if (u == null || v == null) continue;
				if (edge.type == 0) {
					drawChannelLine(u.x, u.y, v.x, v.y, edge.weight);
				} else if (edge.type == 1) {
					drawMixerLine(u.x, u.y, v.x, v.y, edge.wavelength, edge.weight, edge.amplitude); //change interval
				}			
			}
		}
	}

}

function redraw(){
	var context = canvas.getContext("2d");

	context.clearRect(0, 0, context.canvas.width, context.canvas.height); //clears

	var gridSize = 20;

	drawGrid(canvas, gridSize);

	//Draw the box select box outline
	if(cursorMode == CursorModeEnum.SELECT.BOX && anchorMouseX != -1){
		context.setLineDash([5, 15]);
		context.strokeStyle = "#FF0000";
		context.lineWidth = 2;
		if(anchorMouseX2 == -1){
			context.strokeRect(anchorMouseX, anchorMouseY, mouseX - anchorMouseX, mouseY - anchorMouseY);
		}
		else{
			context.strokeRect(anchorMouseX, anchorMouseY, anchorMouseX2 - anchorMouseX, anchorMouseY2 - anchorMouseY);
		}
		context.setLineDash([0, 0]);
	}

	//Draw the square collection region outline
	if(cursorMode == CursorModeEnum.PLACE.RECT){
		if (rectX1 != -1) {
			context.strokeStyle = "#aaaaaa";
			context.lineWidth = 2;
			console.log("rectangle to write");
			console.log(rectX1);
			console.log(rectY1);
			console.log(rectX2);
			console.log(rectY2);
			context.fillRect(rectX1, rectY1, rectX2-rectX1, rectY2-rectY1);
			context.setLineDash([0, 0]);
		}
	}


	//Draw the channels
	draw(collection, "#aaaaaa");

	if (selectedCollection != null) {
		draw(selectedCollection, "#dddddd");
	}

	//drawMixerLine(10, 100, 100, 10, 10);


	//Draw the pillar lists
	context.strokeStyle = "#bbbbbb";
  	context.lineJoin = "round";
  	context.lineWidth = 5;
	context.globalAlpha = 0.8;
	//Iterates through the pillars of the graph
	for (var i = 0; i < collection.pillar_list.length; i++){
		var pillar = collection.pillar_list[i];
 		context.beginPath();
	        context.arc(pillar.x, pillar.y, pillar.r, 0, 2 * Math.PI, false);
	        context.fillStyle = "#ffffff";
	        context.fill();
	        context.lineWidth = 1;
	        context.stroke();
	}
	
	context.strokeStyle = "#000000";
	context.fillStyle = "#000000";


	//TODO: delete the unnecessary for loops below?
	for (var i = 0; i < collection.helix_list.length; i++){
		console.log("helix list");
		var h = collection.helix_list[i];
		var tempCanvas = document.createElement('canvas');
		tempCanvas.setAttribute('id', 'canvas');
		if(typeof G_vmlCanvasManager != 'undefined') {
			tempCanvas = G_vmlCanvasManager.initElement(tempCanvas);
		}
		tempContext = tempCanvas.getContext("2d");
		tempContext.rotate(rotateAngle);
		tempContext.drawImage(img, 0,0);
		context.drawImage(tempCanvas, h.x-canvas.offsetLeft, h.y-canvas.offsetTop);
	}
	for (var i = 0; i < collection.t_list.length; i++){
		console.log("t list");
		var t = collection.t_list[i];
		var img = new Image();
		var tempCanvas = document.createElement('canvas');
		tempCanvas.setAttribute('id', 'canvas');
		if(typeof G_vmlCanvasManager != 'undefined') {
			tempCanvas = G_vmlCanvasManager.initElement(tempCanvas);
		}
		tempContext = tempCanvas.getContext("2d");
		tempContext.rotate(rotateAngle);
		tempContext.drawImage(img, 0,0);
		context.drawImage(tempCanvas, t.x-canvas.offsetLeft, t.y-canvas.offsetTop);
		console.log(t[0]);
	}
	for (var i = 0; i < collection.cross_list.length; i++){
		console.log("cross list");
		var x = collection.cross_list[i];
		var img = new Image();
		var tempCanvas = document.createElement('canvas');
		tempCanvas.setAttribute('id', 'canvas');
		if(typeof G_vmlCanvasManager != 'undefined') {
			tempCanvas = G_vmlCanvasManager.initElement(tempCanvas);
		}
		tempContext = tempCanvas.getContext("2d");
		tempContext.rotate(rotateAngle);
		tempContext.drawImage(img, 0,0);
		context.drawImage(tempCanvas, x.x-canvas.offsetLeft, x.y-canvas.offsetTop);
	}
}

function dist(x1, y1, x2, y2){
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function drawChannelLine(x1, y1, x2, y2, weight){
	context.lineWidth = weight;
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
}

function drawMixerLine(x1, y1, x2, y2, interval, weight, amplitude){
	var d = dist(x1, y1, x2, y2);
	//Draw the start line
	//context.lineWidth = weight; //just to have the overall line in the middle?
	//context.beginPath();
	//context.moveTo(x1, y1);
	//context.lineTo(x2, y2);
	//context.closePath();
	//context.stroke();
	var costh = (x2-x1)/d;
	var sinth = (y2-y1)/d;
	var xint = costh*interval;
	var yint = sinth*interval;
	console.log("mixer");
	console.log(xint);
	console.log(yint);
	console.log(interval);
	console.log(d);
	context.lineWidth = weight;
	var x3 = x1;
	var y3 = y1;
	var above = true;
	do {
		context.beginPath();
		if (above) {
			//context.moveTo(x3 - xint/2, y3 + yint/2);
			//context.lineTo(x3 - xint/2 + xint, y3 + yint/2 + yint);
			context.moveTo(x3, y3);
			context.lineTo(x3 + costh*interval/2 - (sinth)*amplitude, y3  + sinth*interval/2+ (costh)*amplitude);
			context.moveTo(x3 + costh*interval/2 - (sinth)*amplitude, y3  + sinth*interval/2+ (costh)*amplitude);
			context.lineTo(x3 + xint, y3 + yint);
		} else {
			//context.moveTo(x3 + xint/2, y3 - yint/2);
			//context.lineTo(x3 + xint/2 + xint, y3 - yint/2 + yint);
			context.moveTo(x3, y3);
			context.lineTo(x3 + costh*interval/2 + (sinth)*amplitude, y3  + costh*interval/2 - (costh)*amplitude);
			context.moveTo(x3 + costh*interval/2 + (sinth)*amplitude, y3  + costh*interval/2 - (costh)*amplitude);
			context.lineTo(x3 + xint, y3 + yint);
		}
		x3 = x3 + xint;
		y3 = y3 + yint;
		context.closePath();
		context.stroke();
		above = !above;
	} while (dist(x2, y2, x3, y3) > interval);	
}


