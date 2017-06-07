function drawGrid(canvas, gridSize){
	var context = canvas.getContext("2d");
	context.strokeStyle = "#000000";
	for (var i = 0; i < canvas.width; i+=gridSize){
		for (var j = 0; j < canvas.height; j+=gridSize){
			context.fillRect(i, j, 2, 2);		
		}
	}
}

function drawChannel(channel, color){
	if (channel.nodes.length == 0) return;
	context.strokeStyle = color;
  	context.lineJoin = "round";
  	context.lineWidth = 5;
	context.globalAlpha = 0.8;

	//Iterates through the graph's nodes, then iterates through all nodes' neighbors to draw each edge. 
	for (var i = 0; i < channel.nodes.length; i++){
		//Draw a circle where the node is
		var node = channel.nodes[i];
		if (node == null) continue;

		if (node.type == 1) {
			//It is a rectangular collection region
			context.strokeStyle = "#aaaaaa";
			context.lineWidth = 2;
			//console.log("rectangle to write");
			//console.log(rectX1);
			//console.log(rectY1);
			//console.log(rectX2);
			//console.log(rectY2);
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
		if (channel.edges[i] == null || channel.edges[i].length == 0){ //Just draw a dot if there are no edges connected to the node
			//TODO: refactor this if...else... into a single if...

			//context.beginPath();
			///context.moveTo(channel.nodes[i].x-1, channel.nodes[i].y-1); //TODO: use fillRect() like in the drawGrid() function to clean this up
			//context.lineTo(channel.nodes[i].x, channel.nodes[i].y);
			//context.closePath();
			//context.stroke();
		} else { //Assuming there are edges connected to the node
			for (var j = 0; j < channel.edges[i].length; j++){ //For each edge connected to the node u
				var edge = channel.edges[i][j]; //edge object itself. An edge from u to v with weight w and type t is expressed as Edge(u, v, weight, type, wavelength) stored at index u of the edges list. 
				var u = channel.nodes[edge.u];
				var v = channel.nodes[edge.v]; //Index of the edge vertex
				if (u == null || v == null) continue;
				if (edge.type == 0) {
					//Straight channel
					drawChannelLine(u.x, u.y, v.x, v.y, edge.weight);
				} else if (edge.type == 1) {
					//Jagged mixer
					drawJaggedMixerLine(u.x, u.y, v.x, v.y, edge.wavelength, edge.weight, edge.amplitude); //change interval
				} else if (edge.type == 2) {
					//Rectangular mixer
					drawRectMixerLine(u.x, u.y, v.x, v.y, edge.wavelength, edge.weight, edge.amplitude);
				} else if (edge.type == 3){
					//Sinusoidal mixer
					drawSinusoidalMixerLine(u.x, u.y, v.x, v.y, edge.wavelength, edge.weight, edge.amplitude);
				}			
			}
		}
	}

}

function refreshCanvas(){

	gridSize = parseFloat(document.getElementById("grid_size_slider_box").value);

	context.clearRect(0, 0, context.canvas.width, context.canvas.height); //clears

	drawGrid(canvas, gridSize);

	//Draw the channels
	drawChannel(collection.channel, "#aaaaaa");

	//Draw selected and preview channels
	if (selectedCollection != null && selectedCollection.channel.nodes.length > 0) {
		drawChannel(selectedCollection.channel, "#dddddd");
	}

	if (previewCollection != null && previewCollection.channel.nodes.length > 0){
		drawChannel(previewCollection.channel, "#ff0000");
	}

	if (arrayPreviewCollection != null && arrayPreviewCollection.channel.nodes.length > 0){
		drawChannel(arrayPreviewCollection.channel, "#ff0000");
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
	//Draw the measurement outline
	if ((cursorMode == CursorModeEnum.OPERATE.MEASURE || cursorMode == CursorModeEnum.OPERATE.RESIZE) && measureX1 != -1) {
		console.log("measure x1, measure y1, measure x2, measure y2, mousex, mousey");
		console.log(measureX1);
		console.log(measureY1);
		console.log(measureX2);
		console.log(measureY2);
		console.log(mouseX);
		console.log(mouseY);
		context.setLineDash([5, 15]);
		context.strokeStyle = "#ff0000";
		context.lineWidth = 2;
		if (measureX2 == -1) {
			context.beginPath();
			context.moveTo(measureX1, measureY1);
			context.lineTo(mouseX, mouseY);
			context.closePath();
			context.stroke();
		} else {
			context.beginPath();
			context.moveTo(measureX1, measureY1);
			context.lineTo(measureX2, measureY2);
			context.closePath();
			context.stroke();
		}
		context.setLineDash([0,0]);
	}

	//Draw the square region outline
	if(cursorMode == CursorModeEnum.PLACE.RECT){
		if (rectX1 != -1) {
			context.strokeStyle = "#aaaaaa";
			context.lineWidth = 2;
			//console.log("rectangle to write");
			//console.log(rectX1);
			//console.log(rectY1);
			//console.log(rectX2);
			//console.log(rectY2);
			context.fillRect(rectX1, rectY1, rectX2-rectX1, rectY2-rectY1);
			context.setLineDash([0, 0]);
		}
	}


	

}

function drawChannelLine(x1, y1, x2, y2, weight){
	context.lineWidth = weight;
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
}

function drawJaggedMixerLine(x1, y1, x2, y2, interval, weight, amplitude){
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
	//console.log("mixer");
	//console.log(xint);
	//console.log(yint);
	//console.log(interval);
	//console.log(d);
	context.lineWidth = weight;
	var x3 = x1;
	var y3 = y1;
	var above = true;
	do {
		context.beginPath();
		if (above) {
			//context.moveTo(x3 - xint/2, y3 + yint/2);
			//context.lineTo(x3 - xint/2 + xint, y3 + yint/2 + yint);
			context.lineTo(x3, y3);
			context.moveTo(x3, y3);
			context.lineTo(x3 + costh*interval/2 - (sinth)*amplitude, y3  + sinth*interval/2+ (costh)*amplitude);
			context.moveTo(x3 + costh*interval/2 - (sinth)*amplitude, y3  + sinth*interval/2+ (costh)*amplitude);
			context.lineTo(x3 + xint, y3 + yint);
		} else {
			//context.moveTo(x3 + xint/2, y3 - yint/2);
			//context.lineTo(x3 + xint/2 + xint, y3 - yint/2 + yint);
			context.lineTo(x3, y3);
			context.moveTo(x3, y3);
			context.lineTo(x3 + costh*interval/2 + (sinth)*amplitude, y3  + sinth*interval/2 - (costh)*amplitude);
			context.moveTo(x3 + costh*interval/2 + (sinth)*amplitude, y3  + sinth*interval/2 - (costh)*amplitude);
			context.lineTo(x3 + xint, y3 + yint);
		}
		x3 = x3 + xint;
		y3 = y3 + yint;
		context.closePath();
		context.stroke();
		above = !above;
	} while (dist(x2, y2, x3, y3) > interval);	
}

function drawRectMixerLine(x1, y1, x2, y2, interval, weight, amplitude){
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
	//console.log("mixer");
	//console.log(xint);
	//console.log(yint);
	//console.log(interval);
	//console.log(d);
	context.lineWidth = weight;
	var x3 = x1;
	var y3 = y1;
	var above = true;
	do {
		context.beginPath();
		if (above) {
			//context.moveTo(x3 - xint/2, y3 + yint/2);
			//context.lineTo(x3 - xint/2 + xint, y3 + yint/2 + yint);
			context.lineTo(x3, y3);
			context.moveTo(x3, y3);
			
			//context.lineTo(x3 + costh*interval/2 - (sinth)*amplitude, y3  + sinth*interval/2+ (costh)*amplitude);
			//context.moveTo(x3 + costh*interval/2 - (sinth)*amplitude, y3  + sinth*interval/2+ (costh)*amplitude);
	
			context.lineTo(x3 - (sinth)*amplitude, y3 + (costh)*amplitude);
			context.moveTo(x3 - (sinth)*amplitude, y3 + (costh)*amplitude);
	
			context.lineTo(x3 + costh*interval - (sinth)*amplitude, y3  + sinth*interval+ (costh)*amplitude);
			context.moveTo(x3 + costh*interval - (sinth)*amplitude, y3  + sinth*interval+ (costh)*amplitude);
	
			context.lineTo(x3 + xint, y3 + yint);
		} else {
			//context.moveTo(x3 + xint/2, y3 - yint/2);
			//context.lineTo(x3 + xint/2 + xint, y3 - yint/2 + yint);
			context.lineTo(x3, y3);
			context.moveTo(x3, y3);
			//context.lineTo(x3 + costh*interval/2 + (sinth)*amplitude, y3  + costh*interval/2 - (costh)*amplitude);
			//context.moveTo(x3 + costh*interval/2 + (sinth)*amplitude, y3  + costh*interval/2 - (costh)*amplitude);

			context.lineTo(x3 + (sinth)*amplitude, y3 - (costh)*amplitude);
			context.moveTo(x3 + (sinth)*amplitude, y3 - (costh)*amplitude);

			context.lineTo(x3 + costh*interval + (sinth)*amplitude, y3  + sinth*interval - (costh)*amplitude);
			context.moveTo(x3 + costh*interval + (sinth)*amplitude, y3  + sinth*interval - (costh)*amplitude);
			
			context.lineTo(x3 + xint, y3 + yint);
		}
		x3 = x3 + xint;
		y3 = y3 + yint;
		context.closePath();
		context.stroke();
		above = !above;
	} while (dist(x2, y2, x3, y3) >= interval);
}

function drawSinusoidalMixerLine(x1, y1, x2, y2, interval, weight, amplitude){
	context.lineWidth = weight;
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
}
