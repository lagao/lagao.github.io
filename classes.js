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

		//If this node doesn't exist,
		if(currNodeIndex == -1){
			console.log("Trying to delete a non-existant node!");
			return;
		}

		//If this node does exist,

/*		for(var i = 0; i<this.edges[currNodeIndex].length; i++){
			console.log('edge to delete: ');
			console.log(this);
			console.log(this.edges[currNodeIndex][i]);
			this.deleteEdge(this.edges[currNodeIndex][i]);
		}
		this.edges.splice(currNodeIndex, 1);
		this.nodes.splice(currNodeIndex, 1);
*/
	}

	deleteEdge(edgeToDelete){
		console.log("Now deleting edge");
		var forwardIndex = this.edges[edgeToDelete.u].indexOf(edgeToDelete);
		var reverseIndex = this.edges[edgeToDelete.v].indexOf(edgeToDelete.reverseEdge);

		this.edges[edgeToDelete.u].splice(forwardIndex);
		this.edges[edgeToDelete.v].splice(reverseIndex);

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
	addEdge(edgeToAdd){
		console.log("edgeToAdd:");
		console.log(edgeToAdd);

		var uIndex = this.addNode(edgeToAdd.u);
		var vIndex = this.addNode(this.nodes[edgeToAdd.v]);

		console.log("uIndex: " + uIndex + "| vIndex: " + vIndex);
		console.log(this);

		this.edges[uIndex].push(edgeToAdd);
		this.edges[vIndex].push(edgeToAdd.reverseEdge);

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
	constructor(x, y, r){
		this.x = x;
		this.y = y;
		this.r = r;
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
		return new Edge(v, u, weight, type, wavelength, amplitude);
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
