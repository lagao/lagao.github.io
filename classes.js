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

	distBetweenNodes(u, v){

		var nodeU = this.nodes[u];
		var nodeV = this.nodes[v];

		var x1 = nodeU.x;
		var y1 = nodeU.y;
		var x2 = nodeV.x;
		var y2 = nodeV.y;

		return dist(x1, y1, x2, y2);

	}
}

class Node{
	//Add color and type later
	constructor(x, y, r, type, w, h){
		this.x = x;
		this.y = y;
		this.r = r;
		this.type = type; //type = 0 for round, 1 for rect
		this.w = w; //w = width for rect
		this.h = h; //h = height for rect
	}
}

class Edge{
	constructor(u, v, weight, type, wavelength, amplitude){
		this.u = u;
		this.v = v;
		this.weight = weight; //Weight of the edge (channel thickness)
		this.type = type; //Type of edge (straight channel, mixer, etc)
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
		for(var i = 0; i<collectionToDelete.channel.edges.length; i++){
			if (collectionToDelete.channel.edges == null) continue;
			console.log("i is");			
			console.log(i);
			console.log(collectionToDelete.channel.edges.length);
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
				console.log(uObj);
				console.log(vObj);
				console.log(localUIndex);
				console.log(localVIndex);			

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
						console.log(this.channel.edges[k][l]);
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
			console.log(i);
			console.log(this.channel.edges[i].length);
			console.log(this.channel.nodes[i].r);
			if (this.channel.edges[i].length == 0 && this.channel.nodes[i].r == 1){
				this.channel.edges[i] = null;
				this.channel.nodes[i] = null; 
				//TODO: need to add checks that things aren't null now, probably this breaks things
			}
		}
		console.log("final channel");
		console.log(this.channel);
		
	}
}
