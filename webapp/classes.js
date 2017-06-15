class Channel{
	constructor(){ //Adjacency list representation
		this.nodes = []; //At index i in the array, there is an x position, a y position, and a rotation angle for the node
		this.edges = []; //At index i in the array, has a list of indices that node i in this.nodes is connected to
	}

	deleteNode(nodeToDelete){
		console.log("nodeToDelete:");
		console.log(nodeToDelete);

		//TODO: how to handle duplicate nodes w/ different radii?

		//Check if this is already a node
		var currNodeIndex = this.nodes.indexOf(nodeToDelete);

		console.log("currNodeIndex: " + currNodeIndex);

		//If this node doesn't exist, don't delete it
		if(currNodeIndex == -1){
			console.log("Trying to delete a non-existent node!");
			return;
		}

		//If this node does exist, delete it
		this.edges[currNodeIndex] = null;
		this.nodes[currNodeIndex] = null;

		/*for(var i = 0; i<this.nodes.length; i++){
			if (this.edges[i] == null) continue; //if it is null, do not try to delete it
			for (var j = 0; j < this.edges[i].length; j++){
				if (this.edges[i][j].v == currNodeIndex || this.edges[i][j].u == currNodeIndex){
					this.edges[i].splice(j, 1); //If either of the vertices connected to the edge is the vertex to remove, splice that edge
				}
			}

		}
		this.edges[currNodeIndex] = null; //there has got to be a better fix than this
		this.nodes[currNodeIndex] = null;

		for (var i = 0; i < this.nodes.length; i++){
			if (this.edges[i] == null) continue;
			if (this.edges[i].length == 0){
				this.edges[i] = null; //if no edges left to attach to a node
				this.nodes[i] = null; //set the node and its edge list to null (avoid index)
			}
		}*/
		
		/*this.edges.splice(currNodeIndex, 1);
		this.nodes.splice(currNodeIndex, 1); //delete the node
		console.log("nodes");
		console.log(this.nodes);
		console.log("edges");
		console.log(this.edges);*/

	}

	deleteEdge(edgeToDelete){
		if (edgeToDelete == null) return;
		console.log("Now deleting edge");
		
		console.log(edgeToDelete.u);
		console.log(edgeToDelete.v);

		var forwardIndex = this.edges[edgeToDelete.u].indexOf(edgeToDelete);
		var reverseIndex = this.edges[edgeToDelete.v].indexOf(edgeToDelete.reverseEdge());

		console.log("u fwd v rev");
		console.log(edgeToDelete);
		console.log(this.edges[edgeToDelete.u]);
		console.log(edgeToDelete.reverseEdge());
		console.log(this.edges[edgeToDelete.v]);

		this.edges[edgeToDelete.u][forwardIndex] = null; //need to fix this
		this.edges[edgeToDelete.v][reverseIndex] = null; //don't want to fill data with nulls
		//this.edges[edgeToDelete.u].splice(forwardIndex);
		//this.edges[edgeToDelete.v].splice(reverseIndex);

	}

	addNode(nodeToAdd){
		//console.log("nodeToAdd:");
		//console.log(nodeToAdd);

		//TODO: how to handle duplicate nodes w/ different radii?
		//RESOLVED: they don't exist: nodes are replaced when they are changed

		//Check if this is already a node
		var currNodeIndex = this.nodes.indexOf(nodeToAdd);


		//If this node doesn't exist,
		if(currNodeIndex == -1){

			//Note the new index
			currNodeIndex = this.nodes.length;

			//Add this node
			this.nodes.push(nodeToAdd);

			//console.log("New Node: " + currNodeIndex);

			//And the corresponding edge list
			this.edges.push([]);
		}

		//console.log("currNodeIndex: " + currNodeIndex);

		//If this node already exists
		return currNodeIndex;
	}


	//TODO: Not usable yet. Have to pass in collection arg
	//See selectListeners.js pointerSelectClickListener as e.g.
	addEdge(channel, edgeToAdd){

		var uIndex = this.addNode(channel.nodes[edgeToAdd.u]);
		var vIndex = this.addNode(channel.nodes[edgeToAdd.v]);

		var newEdge = new Edge(uIndex, vIndex, edgeToAdd.weight, edgeToAdd.type, edgeToAdd.wavelength, edgeToAdd.amplitude);
		
		this.edges[uIndex].push(newEdge);
		this.edges[vIndex].push(newEdge.reverseEdge());

	}

	//Removes edge from a channel
	removeEdge(channel, edgeToRemove){
		//Get the actual nodes from channel
		var uNode = channel.nodes[edgeToRemove.u];
		var vNode = channel.nodes[edgeToRemove.v];
		//Identify edge within this, not channel
		var localUIndex = this.nodes.indexOf(uNode);	
		var localVIndex = this.nodes.indexOf(vNode);
		if (localUIndex == -1 || localVIndex == -1){
			console.log("could not delete non-existent edge");
		}
		//Delete constructed edge
		var edge = new Edge(localUIndex, localVIndex, edgeToRemove.weight, edgeToRemove.type, edgeToRemove.wavelength, edgeToRemove.amplitude);
		this.deleteEdge(edge);	//Deletes a local edge
	
	}

	addChannel(channel){
		for (var i = 0; i < channel.nodes.length; i++){
			if (channel.edges[i].length == 0) this.addNode(channel.nodes[i]); //add if no edges
			for (var j = 0; j < channel.edges[i].length; j++){
				this.addEdge(channel, channel.edges[i][j]);
			}
		}
	}

	removeChannel(channel) {
		//Remove all the edges that have been selected
		for (var i = 0; i < channel.nodes.length; i++){
			if (channel.edges[i] == null) continue;
			for (var j = 0; j < channel.edges[i].length; j++){
				console.log("removing this edge");
				console.log(channel.edges[i][j]);
				this.removeEdge(channel, channel.edges[i][j]);
			}
		}

		for (var i = 0; i < channel.nodes.length; i++){
			if (channel.edges[i] == null) continue;
			if (channel.edges[i].length == 0) {
				console.log("Deleting a node");
				this.deleteNode(channel.nodes[i]); //if all the edges are disconnected from a node, remove the node
			}
		}
		console.log("Removed all edges, have channel left");
		console.log(this);
		
	}

	setEdgeType(u, v, newType, newWavelength, newAmplitude){
		for (var i = 0; i < this.edges[u].length; i++){
			var edge = this.edges[u][i];
			if (edge.v == v) {
				edge.type = type; //Type of edge (straight channel =0, jagged mixer=1, rectangular mixer=2, sinusoidal mixer=3, etc)
				edge.wavelength = wavelength; //Size of zig zags in a mixer (0 by default if not a mixer)
				edge.amplitude = amplitude; //height of zig zags in a mixer (0 by default if not a mixer)
			}
		}
		for (var i = 0; i < this.edges[v].length; i++){
			var edge = this.edges[v][i];
			if (edge.v == u){
				edge.type = type; //Type of edge (straight channel =0, jagged mixer=1, rectangular mixer=2, sinusoidal mixer=3, etc)
				edge.wavelength = wavelength; //Size of zig zags in a mixer (0 by default if not a mixer)
				edge.amplitude = amplitude; //height of zig zags in a mixer (0 by default if not a mixer)
			}
		}
		
		return 0;
	}

	setEdgeWeight(u, v, newWeight){
		for (var i = 0; i < this.edges[u].length; i++){
			var edge = this.edges[u][i];
			if (edge.v == v) {
				edge.weight = newWeight; 
			}
		}
		for (var i = 0; i < this.edges[v].length; i++){
			var edge = this.edges[v][i];
			if (edge.v == u){
				edge.weight = newWeight;
			}
		}
		
		return 0;
	}

	setEdgeLength(uIdx, vIdx, newLength){
		var u = this.nodes[uIdx]; 
		var v = this.nodes[vIdx];

		var scaleFactor = newLength/dist(u.x, u.y, v.x, v.y);

		var midpointX = (u.x + v.x)/2;
		var midpointY = (u.y + v.y)/2;

		this.nodes[uIdx].x = midpointX+scaleFactor*(u.x-midpointX);
		this.nodes[uIdx].y = midpointY+scaleFactor*(u.y-midpointY);

		this.nodes[vIdx].x = midpointX+scaleFactor*(v.x-midpointX);
		this.nodes[vIdx].y = midpointY+scaleFactor*(v.y-midpointY);

		return 0;
	}

	distBetweenNodes(u, v){

		var nodeU = this.nodes[u]; //make sure not buggy in deletion case
		var nodeV = this.nodes[v]; //in that case could be this.nodes[this.edges[u][v].u]; and this.nodes[this.edges[u][v].v];

		var x1 = nodeU.x;
		var y1 = nodeU.y;
		var x2 = nodeV.x;
		var y2 = nodeV.y;

		return dist(x1, y1, x2, y2);

	}

	containsNode(node) {
		for (var i = 0; i < this.nodes.length; i++){
			if (this.nodes[i] == null) continue;
			if (this.nodes[i].equals(node)) return true;
		}	
		return false;
	}

	idxOf(node){
		if (!this.containsNode(node)) return -1;
		for (var i = 0; i < this.nodes.length; i++){
			if (this.nodes[i] == null) continue;
			if (this.nodes[i].equals(node)) return i;
		}	
	}

	containsEdge(collection, edge){
		var u = collection.channel.nodes[edge.u];
		var v = collection.channel.nodes[edge.v];
		for (var i = 0; i < this.nodes.length; i++){
			if (this.nodes[i] == null) continue;
			for (var j = 0; j < this.edges[i].length; j++){
				if (this.edges[i] == null) continue;
				if (this.edges[i][j] == null) continue;
				var u2 = this.nodes[this.edges[i][j].u];
				var v2 = this.nodes[this.edges[i][j].v];
				if (u.equals(u2) && v.equals(v2)) return true;
				if (v.equals(u2) && u.equals(v2)) return true;
			}		
		}
	}

	idxOfU(collection, edge){
		if (!this.containsEdge(collection, edge)) return -1;
		var u = collection.channel.nodes[edge.u];
		var v = collection.channel.nodes[edge.v];
		for (var i = 0; i < this.nodes.length; i++){
			if (this.nodes[i] == null) continue;
			for (var j = 0; j < this.edges[i].length; j++){
				if (this.edges[i] == null) continue;
				if (this.edges[i][j] == null) continue;
				var u2 = this.nodes[this.edges[i][j].u];
				var v2 = this.nodes[this.edges[i][j].v];
				if (u.equals(u2) && v.equals(v2)) return i;
			}		
		}
		return -1;
	}

	idxOfV(collection, edge){
		if (!this.containsEdge(collection, edge)) return -1;
		var u = collection.channel.nodes[edge.u];
		var v = collection.channel.nodes[edge.v];
		for (var i = 0; i < this.nodes.length; i++){
			if (this.nodes[i] == null) continue;
			for (var j = 0; j < this.edges[i].length; j++){
				if (this.edges[i] == null) continue;
				if (this.edges[i][j] == null) continue;
				var u2 = this.nodes[this.edges[i][j].u];
				var v2 = this.nodes[this.edges[i][j].v];
				if (u.equals(v2) && v.equals(u2)) return i;
			}		
		}
		return -1;
	}
}

class Node{
	//Add color and type later
	constructor(x, y, r, type, w, h){
		this.x = x; //center for round nodes AND rect
		this.y = y; //center for round nodes AND rect
		this.r = r; //radius for round nodes
		this.type = type; //type = 0 for round, 1 for rect
		this.w = w; //w = width for rect
		this.h = h; //h = height for rect
		this.fixed = false; //by default
	}
	equals(otherNode){
		return (this.x == otherNode.x && this.y == otherNode.y && this.r == otherNode.r); //Sufficient for now
	}

	setRadius(r) {
		if (this.type == 0) this.r = r;
	}
	
	setWidth(w){
		if (this.type == 1) this.w = w;
	}

	setLength(l){
		if (this.type == 1) this.l = l;	
	}
}

class Edge{
	constructor(u, v, weight, type, wavelength, amplitude){
		this.u = u;
		this.v = v;
		this.weight = weight; //Weight of the edge (channel thickness)
		this.type = type; //Type of edge (straight channel =0, jagged mixer=1, rectangular mixer=2, sinusoidal mixer=3, etc)
		this.wavelength = wavelength; //Size of zig zags in a mixer (0 by default if not a mixer)
		this.amplitude = amplitude; //height of sig zags in a mixer (0 by default if not a mixer)
	}

	reverseEdge(){
		return new Edge(this.v, this.u, this.weight, this.type, this.wavelength, this.amplitude);
	}

	equals(otherEdge){
		return (this.u == otherEdge.u && this.v == otherEdge.v && this.weight == otherEdge.weight && this.type == otherEdge.type);
	}

}


class Pillar{
	constructor(x, y, z, r){
		this.x = x;
		this.y = y;
		this.z = z;
		this.r = r;
	}
}


class Collection{
	
	constructor(){
		this.channel = new Channel();
		this.pillar_list = [];
		this.helix_list = [];
		this.t_list = [];
		this.cross_list = [];
	}

	deleteCollection(collectionToDelete){
		//If only individual nodes are being deleted
		//Assume all the edges connected to those nodes are also being deleted
		
		//Conventionally, if you try to delete a node and some edges,
		//it will only delete the selected edges
	
		//Deleting single nodes

		
			


		var tempToDeleteCollection = new Collection();
		console.log("nodes and edges");
		console.log(collectionToDelete.channel.nodes);
		console.log(collectionToDelete.channel.edges);
		
		var hasEdges = false;
		for (var i = 0; i < collectionToDelete.channel.edges.length; i++){
			if (collectionToDelete.channel.edges[i].length > 0) hasEdges = true;
		}

		if (!hasEdges && collectionToDelete.channel.nodes != null) {
			console.log("Deleting only nodes");
			for (var i = 0; i < collectionToDelete.channel.nodes.length; i++){
				var node = this.channel.nodes.indexOf(collectionToDelete.channel.nodes[i]); //Index of node in original channel
				//tempToDeleteCollection.channel.addNode(collectionToDelete.channel, collectionToDelete.channel.nodes[i]); //Add all nodes
				tempToDeleteCollection.channel.addNode(collectionToDelete.channel.nodes[i]);				
				//Find all the edges connected to that node 
				if (node < 0 || node >= this.channel.edges.length) continue;
				for (var j = 0; j < this.channel.edges[node].length; j++){
					var edge = this.channel.edges[node][j];
					tempToDeleteCollection.channel.addEdge(this.channel, edge); //Add all edges
					
				}
			}
		
			console.log("Collection for deletion");
			console.log(tempToDeleteCollection);
			//Deleting all else
			collectionToDelete = tempToDeleteCollection;
		}
		
		for(var i = 0; i<collectionToDelete.channel.edges.length; i++){
			if (collectionToDelete.channel.edges == null) continue;
			//console.log("i is");			
			//console.log(i);
			//console.log(collectionToDelete.channel.edges.length);
			var array = collectionToDelete.channel.edges[i]; //will it become an array?
			console.log("collection to delete edge is");
			console.log(array);
			for(var j = 0; j<array.length; j++){
				console.log("Collection to delete");
				console.log(collectionToDelete);

				var edgeToDelete = collectionToDelete.channel.edges[i][j];
				console.log(edgeToDelete);

				var uObj = collectionToDelete.channel.nodes[edgeToDelete.u];
				var vObj = collectionToDelete.channel.nodes[edgeToDelete.v];

				var localUIndex = this.channel.nodes.indexOf(uObj); //index of the object in Uindex
				var localVIndex = this.channel.nodes.indexOf(vObj);
				//console.log(uObj);
				//console.log(vObj);
				//console.log(localUIndex);
				//console.log(localVIndex);			

				var reconstructedFwdEdge = new Edge(localUIndex, localVIndex, edgeToDelete.weight, edgeToDelete.type);
				var reconstructedRevEdge = new Edge(localVIndex, localUIndex, edgeToDelete.weight, edgeToDelete.type);

				var localForwardEdgeIndex = -1;
				var localReverseEdgeIndex = -1;
				console.log("fwd and rev edges");
				console.log(reconstructedFwdEdge);
				console.log(reconstructedRevEdge);
			
				//IndexOf doesn't work - it checks equality by reference
				for (var k = 0; k < this.channel.edges.length; k++){
					if (this.channel.edges[k] == null) continue;
					for (var l = 0; l < this.channel.edges[k].length; l++){
						//console.log(this.channel.edges[k][l]);
						if (this.channel.edges[k][l].equals(reconstructedFwdEdge)) {
							localForwardEdgeIndex = k;
							console.log("removing at local forward edge index");
							console.log(k);
							this.channel.edges[k].splice(l, 1);
						} else if (this.channel.edges[k][l].equals(reconstructedRevEdge)){
							localReverseEdgeIndex = k;
							console.log("removing at local reverse edge index");
							console.log(l);	
							this.channel.edges[k].splice(l, 1);
						}
					}
				}							
			}

			//TODO: Bug where whenever there's an edge between two edges to be deleted, it's deleted too
			//FIXED: Overrode equals() function, indexOf() was not working and splice(-1) has strange undefined behavior
			//TODO: Enable deleting nodes, not just edges.
		}
		
		//Deleting nodes as well
		//So as not to break the invariant that the index of a node is the same as the u or v value from an edge
		//The node itself won't be actually deleted but set to null
		for (var i = 0; i < this.channel.nodes.length; i++){
			if (this.channel.edges[i] == null) {
				this.channel.nodes[i] = null; //set null
				continue;
			}
			//If all the edges connected to a node have been deleted
			//And the node is not an obviously large collection region
			//Delete the node
			//console.log(i);
			//console.log(this.channel.edges[i].length);
			//console.log(this.channel.nodes[i].r);

			//INVARIANT: IF ALL THE EDGES CONNECTED TO A NODE HAVE BEEN DELETED THE NODE SHOULD BE DELETED AS WELL
			//IN ANY CASE
			//WE CAN CHANGE THIS IF NEEDED
			//not sure if this is the desired behavior for collection regions
			/*if (this.channel.edges[i].length == 0){
				this.channel.edges[i] = null;
				this.channel.nodes[i] = null; 
				//TODO: need to add checks that things aren't null now, probably this breaks things
			}*/

		}

		//Delete single nodes in the collection
		for (var i = 0; i < collectionToDelete.channel.nodes.length; i++){
			var node = collectionToDelete.channel.nodes[i];
			var localNodeIdx = this.channel.nodes.indexOf(node);
			if (localNodeIdx >= 0 && localNodeIdx < this.channel.nodes.length) {
				if (this.channel.edges[localNodeIdx] == 0) { //If length is 0
					this.channel.nodes[localNodeIdx] = null;
					this.channel.edges[localNodeIdx] = null;
				}
			}
		}
		

		console.log("final channel");
		console.log(this.channel);
		
	}
}
