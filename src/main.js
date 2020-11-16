var myGamePiece;
var myObstacles = [];
var myScore;
var numLights = 20;
var cellLength = 20;
var context;
var boardWidth;
var boardHeight;
var brickBool = false;
var placeChar = false;
var placeEvil = false;
var startButt = false;
var viewPath = false;
var playerPlaced = false;
var sourcePlaced = false;
var evil = {
        place: function(x, y) {
            this.x = x
            this.y = y
            sourcePlaced = true
        }
    }
    /** ---------Graph-------------- */
class Node {

    constructor(xPos, yPos) {
        this.available = true;
        this.isLight = false;
        this.isTarget = false;
        this.isSource = false;
        this.top = null;
        this.bottom = null;
        this.left = null;
        this.right = null;
        this.x = xPos;
        this.y = yPos;
        // values for algorithem -> objects that are reset with undoGraph()
        this.visited = false;
        this.dist = null;
        this.index = null; //index in minQueue
        this.prevNode = null;
        // following variables for Astar
        this.heuristic = null;
        this.distTraveled = null;
    }
    makeUnavailable() {
        this.available = false;
    }
    makeIsLight() {
        this.isLight = true;
    }
    setLeft(lNeigh) {
        this.left = lNeigh;
    }
    setRight(rNeigh) {
        this.right = rNeigh;
    }
    setTop(tNeigh) {
        this.top = tNeigh;
    }
    setBot(bNeigh) {
        this.bottom = bNeigh;
    }
    isAvailable() {
        return this.available;
    }
    turnOnSource() {
        this.isSource = true;
    }
    turnOffSource() {
        this.isSource = false;
    }
    turnOnTarget() {
        this.isTarget = true;
    }
    turnOffTarget() {
        this.isTarget = false;
    }
    getNeighbors() {
        return [this.top, this.bottom, this.left, this.right]
    }
}

/**
 * posToCol - converting position on canvas to index in board.colletion
 * colToPos - the inverse operation
 */

function posToCol(x, y) {
    return (y * Math.floor(boardWidth / cellLength)) + x
}

function colToPos(index) {
    return {
        x: index % Math.floor(boardWidth / cellLength),
        y: Math.floor(index / Math.floor(boardWidth / cellLength))
    };
}



var player = {
    place: function(x, y) {
        this.x = x;
        this.y = y;
        playerPlaced = true;
        index = posToCol(x, y)
        console.log("target is: ", boardGraph.collection[index])
        boardGraph.collection[index].isTarget = true
    },
    moveL: function() {
        this.x -= cellLength;
    },
    moveR: function() {
        this.x += cellLength;
    },
    moveU: function() {
        this.y -= cellLength;
    },
    moveD: function() {
        this.y += cellLength;
    }
}


var myCanvas = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 1080;
        this.canvas.height = 500;
        boardWidth = this.canvas.width
        boardHeight = this.canvas.height
        this.context = this.canvas.getContext("2d");
        this.mouseDown = false;
        this.canvas.addEventListener("mousedown", function() { this.mouseDown = true })
        this.canvas.addEventListener("mousedown", place)
        this.canvas.addEventListener("mousemove", function(event) {
            if (this.mouseDown) {
                place(event)
            }
        })
        this.canvas.addEventListener("mouseup", function() {
            console.log("mouseDown")
            this.mouseDown = false
        })


        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        lset = setLights(this.canvas.width, this.canvas.height);
        drawGrid(this.canvas.width, this.canvas.height);
        //console.log("exited drawGrid")
        boardGraph.make(boardWidth, boardHeight)
        boardGraph.setLights(lset)
            /** --------set light cells to be unavailable-------------------------- */
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function place(event) {
    var client = myCanvas.canvas.getBoundingClientRect();
    var mouseX = event.clientX - client.left;
    var mouseY = event.clientY - client.top;
    mouseX = mouseX - (mouseX % cellLength);
    mouseY = mouseY - (mouseY % cellLength);
    var ctx = myCanvas.canvas.getContext("2d");
    index = posToCol(mouseX / cellLength, mouseY / cellLength)
    if ((boardGraph.collection[index].isAvailable() === false) || (boardGraph.collection[index].isTarget === true) || (boardGraph.collection[index].isSource === true)) {
        return
    }
    /**
     * var brickBool = false;
    var placeChar = false;
    var placeEvil = false;
    var startButt = false;
    var viewPath = false;
     */
    if (placeChar) {
        ctx.fillStyle = "blue";
        if (playerPlaced) {
            return;
        }
        playerPlaced = true;
        boardGraph.collection[index].turnOnTarget()
        console.log("placedchar at ", boardGraph.collection[index])
        player.place(mouseX / cellLength, mouseY / cellLength)
    } else if (placeEvil) {
        ctx.fillStyle = "red";
        if (sourcePlaced) {
            return;
        }
        sourcePlaced = true;
        boardGraph.collection[index].turnOnSource()
        evil.place(mouseX / cellLength, mouseY / cellLength)
    } else if (brickBool) {
        ctx.fillStyle = "brown";
        boardGraph.collection[index].makeUnavailable();
    } else if ((placeChar === false) && (placeEvil === false) && (brickBool === false)) {
        //temp for testi
        console.log(boardGraph.collection[index].isAvailable())
        ctx.fillStyle = "blue";
        neighbors = boardGraph.collection[index].getNeighbors()
        console.log("neighbors:")
        for (let i = 0; i < neighbors.length; i++) {
            console.log(neighbors[i])
            if (neighbors[i] != null) {
                console.log("pos: ", neighbors[i].x, neighbors[i].y)
                ctx.fillRect(neighbors[i].x * 20, neighbors[i].y * 20, cellLength, cellLength)
            }
        } //*/

        return;
    }
    console.log(boardGraph.collection[index].isAvailable())
    console.log("pos: ", boardGraph.collection[index].x, boardGraph.collection[index].y)
    ctx.fillRect(boardGraph.collection[index].x * 20, boardGraph.collection[index].y * 20, cellLength, cellLength)


}

function makeBoard() {
    myCanvas.start();
}

function updateGame() {

}

class Light {
    constructor(xPos, yPos) {
        this.x = xPos;
        this.y = yPos;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

function comparePos(l1, l2) {
    if ((l1.x === l2.x) && (l1.y === l2.y)) {
        return true;
    }
    return false
}

function setLights(width, height) {
    //console.log(height)
    radius = cellLength / 2;
    max = Math.floor(width / cellLength) * Math.floor(height / cellLength);
    lset = [];
    for (var i = 0; i < numLights; i++) {
        rn = Math.floor(Math.random() * Math.floor(max));
        x = Math.floor(rn % Math.floor(width / cellLength));
        y = Math.floor(rn / Math.floor(width / cellLength));
        x *= cellLength;
        y *= cellLength;
        cl = new Light(x / cellLength, y / cellLength);
        var isRepeat = false
        for (var i = 0; i < lset.length; i++) {
            if (comparePos(cl, lset[i])) {
                //console.log(cl.x);
                isRepeat = true;
                break;
            }
        }
        if (isRepeat) {
            i--;
            continue;
        }
        lset.push(cl);
    }
    //console.log("exitloop");
    var c = document.getElementsByTagName("canvas")[0];
    //console.log(c);
    ctx = c.getContext("2d");

    for (var i = 0; i < lset.length; i++) {
        let img = new Image();
        img.className = String(i);
        img.src = "/assets/meLight.png";
        //console.log(img);
        let x = lset[i].getX() * cellLength;
        let y = lset[i].getY() * cellLength;
        //console.log(x);
        //console.log(y);
        img.onload = function() {
                ctx.drawImage(img, x, y);
            }
            //    console.log("drawing")
    }
    return lset
}

function drawGrid(width, height) {
    var c = document.getElementsByTagName("canvas")[0];
    ctx = c.getContext("2d");
    for (var i = 0; i < width; i += cellLength) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
    for (var i = 0; i < height; i += cellLength) {
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
}

function placeBrickButton() {
    brickBool = true;
    placeChar = false;
    placeEvil = false;
    startButt = false;
    viewPath = false;
    //console.log("brick clicked")
}

function placeCharButton() {
    brickBool = false;
    placeChar = true;
    placeEvil = false;
    startButt = false;
    viewPath = false;
    //console.log("char clicked")
}

function placeEvilButton() {
    brickBool = false;
    placeChar = false;
    placeEvil = true;
    startButt = false;
    viewPath = false;
    //console.log("evil clicked")
}

function startButton() { //place holder
    brickBool = false;
    placeChar = false;
    placeEvil = false;
    startButt = true;
    viewPath = false;
    //console.log("start clicked")
    if ((playerPlaced === false) || (sourcePlaced === false)) {
        return;
    }
}

function viewPathButton() {
    brickBool = false;
    placeChar = false;
    placeEvil = false;
    startButt = false;
    viewPath = true;
    console.log("view path clicked")

    if ((playerPlaced === false) || (sourcePlaced === false)) {
        return;
    }
    strategy = document.getElementById("strategy").value
        //console.log(document.getElementById("strategy"))
    boardGraph.pathing(strategy)
}

var boardGraph = {
    make: function(width, height, lightList) { //--------------fucked----------------------fixed
        console.log("enter make board graph")
        this.collection = [];
        this.maxDist = 0;
        console.log(width)
        console.log(height)
        for (var iY = 0; iY < height; iY += cellLength) {
            for (iX = 0; iX < width; iX += cellLength) {
                var cCell = new Node(iX / cellLength, iY / cellLength);
                this.collection.push(cCell);
            }
        }
        console.log(this.collection.length)
        maxX = Math.floor(width / cellLength);
        maxY = Math.floor(height / cellLength);
        //console.log(this.collection.length)
        for (var i = 0; i < this.collection.length; i++) {
            pos = colToPos(i)
            let x = pos.x;
            let y = pos.y;
            let currInd = posToCol(x, y);
            /** connect board -------------------------------------------------------------- */
            if ((y - 1) >= 0) {
                let ind = posToCol(x, y - 1);
                this.collection[currInd].setTop(this.collection[ind]);
                //  console.log("setting top: ", this.collection[ind].x, this.collection[ind].y)
                this.collection[ind].setBot(this.collection[currInd]);
                //console.log("setting bot: ", this.collection[currInd].x, this.collection[currInd].y)
            }
            if ((x - 1) >= 0) {
                let ind = posToCol(x - 1, y);
                this.collection[currInd].setLeft(this.collection[ind]);
                ///console.log("setting left: ", this.collection[ind].x, this.collection[ind].y)
                this.collection[ind].setRight(this.collection[currInd]);
                //console.log("setting right: ", this.collection[currInd].x, this.collection[currInd].y)
                //if (i === 1) {
                //    console.log("brief: ", this.collection[1].x, this.collection[1].y)
                // }
            }
        }
    },
    checkCell: function(x, y) { //false - unavailable
        if ((x < 0) || (y < 0) || (x >= Math.floor(boardWidth / cellLength)) || (y >= Math.floor(boardHeight / cellLength))) {
            return false;
        } else {
            /**check cell if available------------------------------------ */
            index = posToCol(x, y);
            return this.collection[index].isAvailable();
        }
    },
    setLights: function(lset) {
        //console.log(this.collection.length);
        //console.log(this.collection[0]);
        for (var i = 0; i < lset.length; i++) {
            x = lset[i].getX();
            y = lset[i].getY();
            index = posToCol(x, y);
            //console.log(x);
            //console.log(y);
            //console.log(index);
            this.collection[index].makeUnavailable();
            this.collection[index].makeIsLight();
        }
    },
    minQueue: class {
        /**
         * requires a collection of unlayered nodes
         * used by dijkstras and astar
         * in the case of astar, the dist value of the base node class will be set to 
         * heuristic + distTraveled
         */
        constructor() {
            this.top = null;
            //console.log("this.collection in mbq", this.collection)
            this.collection = [];
            this.numNodes = 0;
        }
        bubbleUp(i) {
            while ((Math.ceil(i / 2) - 1) >= 0) {
                let j = Math.ceil(i / 2) - 1
                    //console.log(i, j)
                if (this.collection[i].dist < this.collection[j].dist) {
                    let temp = this.collection[j]
                        //console.log("temp:", temp)
                    this.collection[j] = this.collection[i]
                    this.collection[i] = temp
                    this.collection[j].index = j
                    this.collection[i].index = i
                } else {
                    break;
                }
                i = j
            }
        }
        weighDown(i) {
            while (((i * 2) + 1) < this.collection.length) { //-----------------------fucked-------------------------*fixed
                let left = (i * 2) + 1
                let right = (i * 2) + 2
                let j = 0
                if (this.collection[i].dist > this.collection[left].dist) {
                    if (right >= this.collection.length) {
                        j = left
                    } else if (this.collection[i].dist > this.collection[right].dist) {
                        if (this.collection[left].dist > this.collection[right].dist) {
                            j = right
                        } else {
                            j = left
                        }
                    } else {
                        j = left
                    }
                } else {
                    break
                }
                this.collection[i].index = j
                this.collection[j].index = i
                let temp = this.collection[i]
                this.collection[i] = this.collection[j]
                this.collection[j] = temp
                i = j
            }
        }
        push(sNode) { //---------This is fucked------------------------------*------------fixed
            //console.log("pushing; ", sNode.dist)
            if (this.top === null) {
                this.top = sNode
                sNode.index = 0
                this.collection.push(sNode)
                this.numNodes += 1;
                for (let i = 0; i < this.collection.length; i++) {
                    console.log(this.collection[i].dist)
                }
                return
            }
            this.collection.push(sNode)
            let i = this.collection.length - 1
            this.collection[i].index = this.collection.length - 1
            this.bubbleUp(i)
            this.numNodes += 1;
            /*for (let i = 0; i < this.collection.length; i++) {
                console.log(this.collection[i].dist)
            }//*/
        }
        pop() {
            if (this.collection.length === 0) {
                return null;
            }
            this.numNodes -= 1;
            let retNode = this.collection[0]

            retNode.index = null;
            this.collection[0] = this.collection[this.collection.length - 1]
            this.collection.pop()
            if (this.collection.length === 0) {
                return retNode;
            }
            this.collection[0].index = 0;
            //console.log("length:", this.collection.length, ", node:", this.collection[0])
            this.weighDown(0)
            return retNode
        }
        isEmpty() {
            return this.numNodes === 0;
        }
        updateNode(i, new_dist) {
            //console.log("updateNode: ", this.collection[i])
            //console.log("index", i)
            //console.log(this.collection)
            this.collection[i].dist = new_dist
            let prevIndex = Math.ceil(i / 2) - 1
            if (this.collection[i].dist < this.collection[prevIndex].dist) {
                this.bubbleUp(i)
            } else {
                this.weighDown(i)
            }
        }
    },
    dijkstraIteration: function(view) {
        curr = minBinQueue.pop()
        console.log(minBinQueue.numNodes, curr)
        neighbors = curr.getNeighbors()
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i] != null) {
                if (neighbors[i].isAvailable()) {
                    if (neighbors[i].visited === false) {
                        neighbors[i].prevNode = curr
                        neighbors[i].dist = curr.dist + 1
                        minBinQueue.push(neighbors[i])
                        neighbors[i].visited = true
                        if (neighbors[i].isTarget) {
                            found = true
                            targetNode = neighbors[i]
                        }
                    } else if (neighbors.index != null) {
                        if ((curr.dist + 1) < neighbors[i].dist) {
                            neighbors[i].prevNode = curr
                            minBinQueue.updateNode(neighbors[i].index, curr.dist + 1)
                        }
                    }
                }
            }
        }
        if (view) {
            this.viewPathing()
        }
    },
    dijkstra: function(view = false) {
        /**
         * view - boolean value one whether this is for view pathing
         */
        minBinQueue = new this.minQueue()
            //---------dijkstras----------------
        found = false;
        source = this.collection[posToCol(evil.x, evil.y)]
        source.visited = true;
        source.dist = 0;
        minBinQueue.push(source);
        targetNode = null;
        let numIterations = 0;
        while ((minBinQueue.isEmpty() === false)) {
            this.dijkstraIteration(false);
            numIterations += 1;
        }
        if (view) {
            this.undoGraph()
            minBinQueue = new this.minQueue()
            found = false;
            source = this.collection[posToCol(evil.x, evil.y)]
            source.visited = true;
            source.dist = 0;
            minBinQueue.push(source);
            targetNode = null;
            for (let i = 0; i < numIterations; i++) {
                setTimeout(() => {
                    this.dijkstraIteration(view)
                }, (i + 1) * 20);
            }
            setTimeout(() => {
                this.printPath(targetNode)
            }, (numIterations + 1) * 20);
        }
        //--------------------draw path---------------------------
        //console.log("targetNode", targetNode)
        //console.log("target position", targetNode.isTarget)
        return {
            isFound: found,
            node: targetNode
        }; //*/
    },
    astarHeuristic: function(node1, node2) {
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y)
    },
    astarIteration: function(view) {
        curr = minBinQueue.pop()
        neighbors = curr.getNeighbors()
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i] != null) {
                if (neighbors[i].isAvailable()) {
                    if (neighbors[i].visited === false) {
                        neighbors[i].prevNode = curr;
                        neighbors[i].distTraveled = curr.distTraveled + 1;
                        neighbors[i].heuristic = this.astarHeuristic(neighbors[i], target);
                        neighbors[i].dist = neighbors[i].heuristic + neighbors[i].distTraveled;
                        neighbors[i].visited = true;
                        minBinQueue.push(neighbors[i]);
                        if (neighbors[i].isTarget) {
                            found = true;
                            targetNode = neighbors[i];
                        }
                    } else if (neighbors.index != null) {
                        if ((curr.distTraveled + 1) < neighbors[i].distTraveled) {
                            neighbors[i].distTraveled = curr.distTraveled + 1;
                            minBinQueue.updateNode(neighbors[i].index, neighbors[i].heuristic + neighbors[i].distTraveled);
                        }
                    }
                    /*
                    if ((view === true)) {
                        this.viewPathing(neighbors[i])
                    }//*/
                }
            }
        }
        if (view) {
            this.viewPathing()
        }
    },
    astar: function(view = false) {
        /**
         * view - boolean value one whether this is for view pathing
         */
        /**
         * the heuristic in thie case will be waaaaayyyy (it will simply be |xc-xt| +|yc-yt| 
         * (xc,yc) being the coordinates of the node ur getting the heuristic of and (xt,yt)
         * being the coodinates of the target/player ) too accurate considering that 
         * the distance is so predicatable however this will serve as a good proof of concept
         * It will always be an underestimate due to obstacles
         */
        found = false;
        source = this.collection[posToCol(evil.x, evil.y)];
        source.visited = true;
        target = this.collection[posToCol(player.x, player.y)];
        minBinQueue = new this.minQueue();
        targetNode = null;
        updated = false;
        source.distTraveled = 0;
        source.heuristic = this.astarHeuristic(source, target);
        source.dist = source.distTraveled + source.heuristic;
        minBinQueue.push(source);
        let numIterations = 0;
        while (minBinQueue.isEmpty() === false) {
            this.astarIteration(false)
            numIterations += 1
        }
        if (view) {
            this.undoGraph()
            found = false
            source = this.collection[posToCol(evil.x, evil.y)];
            source.visited = true;
            target = this.collection[posToCol(player.x, player.y)];
            minBinQueue = new this.minQueue();
            targetNode = null;
            updated = false;
            source.distTraveled = 0;
            source.heuristic = this.astarHeuristic(source, target);
            source.dist = source.distTraveled + source.heuristic;
            minBinQueue.push(source);
            for (let i = 0; i < numIterations; i++) {
                setTimeout(() => {
                    this.astarIteration(true)
                }, (i + 1) * 20);
            }
        }
        if (view) {
            setTimeout(() => {
                if (targetNode != null) {
                    this.printPath(targetNode);
                }
            }, (numIterations + 1) * 20);
        }

        return {
            isFound: found,
            node: targetNode
        };
    },
    nodeContainer: class {
        constructor(node) {
            this.node = node;
            this.prev = null; //reference used for linked list as opposed to search
        }
    },
    Queue: class {
        constructor() {
            this.head = null;
            this.tail = null;
            this.len = 0;
        }
        push(cNode) {
            this.len += 1;
            if (this.head == null) {
                this.head = cNode;
                this.tail = cNode;
                return;
            }
            this.head.prev = cNode;
            this.head = cNode;
        }
        pop() {
            if (this.len === 0) {
                return null;
            }
            var retNode = this.tail;
            this.tail = this.tail.prev;
            if (this.tail == null) {
                this.head = null;
            }
            this.len -= 1
            return retNode;
        }
        isEmpty() {
            return this.len === 0;
        }

    },
    bfsIteration: function(view) {
        var curr = llQueue.pop()
            //console.log("popped: ", curr)
        let neighbors = curr.node.getNeighbors();
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i] != null) {
                //console.log("not null", neighbors[i])
                if (neighbors[i].isAvailable()) {
                    //console.log("isAvailable", neighbors[i].isAvailable())
                    if (neighbors[i].visited === false) {
                        console.log("is not visited", neighbors[i].visited)
                        neighbors[i].visited = true;
                        let newNode = new this.nodeContainer(neighbors[i]);
                        newNode.node.prevNode = curr.node;
                        newNode.node.dist = curr.node.dist + 1;
                        if (newNode.node.isTarget) {
                            //console.log("found")
                            found = true;
                            targetNode = newNode;
                            break;
                        }
                        llQueue.push(newNode);
                        //console.log("pushing: ", newNode)
                        /*
                        if ((view === true)) {
                            this.viewPathing(neighbors[i])
                        }//*/
                    }
                }
            }
        }
        if (view) {
            this.viewPathing()
        }
    },
    bfs: function(view = false) {
        /**
         * view - boolean value one whether this is for view pathing
         */
        llQueue = new this.Queue();
        found = false;
        targetNode = null;
        let source = this.collection[posToCol(evil.x, evil.y)];
        source.visited = true;
        source.dist = 0;
        let sourceCont = new this.nodeContainer(source);
        llQueue.push(sourceCont);
        //-------------------clean up----------------------------------

        let numIterations = 0

        while ((llQueue.isEmpty() === false) && (found === false)) {
            console.log(numIterations)
            this.bfsIteration(false)
            numIterations += 1
        }
        //
        if (view) { //-------get number of iterations required then printing pathing at each iteration
            console.log("view on")
            this.undoGraph()
            llQueue = new this.Queue();

            found = false;
            targetNode = null;
            source = this.collection[posToCol(evil.x, evil.y)];
            source.visited = true;
            source.dist = 0;
            sourceCont = new this.nodeContainer(source);
            llQueue.push(sourceCont);
            for (let i = 0; i < numIterations; i++) {
                console.log(i, numIterations)
                setTimeout(() => {
                    this.bfsIteration(true)
                }, (i + 1) * 20);
            }
        } //*/

        //------------print the path found by bfs---------------------------------------------
        if (view) {
            setTimeout(() => {
                if (targetNode != null) {
                    console.log(targetNode)
                    console.log(found)
                    targetNode = targetNode.node
                    this.printPath(targetNode)
                }
            }, (numIterations + 1) * 20);
        }
        //-------------done printing bfs --------------------------------------------------------
        return {
            isFound: found,
            node: targetNode
        }
    },
    grassfireIteration: function(view) {
        let curr = llQueue.pop()
            //console.log("popped: ", curr.node)
        let neighbors = curr.node.getNeighbors()
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i] != null) {
                if (neighbors[i].isAvailable()) {
                    if (neighbors[i].visited === false) {

                        /***********view pathing code here */
                        neighbors[i].visited = true
                        let newNode = new this.nodeContainer(neighbors[i])
                        if (newNode.node.isSource) {
                            console.log("found")
                            found = true;
                            sourceNode = newNode
                        } else {
                            newNode.node.prevNode = curr.node
                            newNode.node.dist = curr.node.dist + 1
                            llQueue.push(newNode)
                        }
                    }
                }
            }
        }
        if (view) {
            this.viewPathing(true)
        }
    },
    grassfire: function(view = false) {
        /**
         * view - boolean value one whether this is for view pathing
         */
        target = this.collection[posToCol(player.x, player.y)]
        llQueue = new this.Queue()
        found = false;
        sourceNode = null
        target.visited = true
        target.dist = 0
        maxDist = 0
        targetCont = new this.nodeContainer(target)
        llQueue.push(targetCont)
        let numIterations = 0
        while ((llQueue.isEmpty() === false)) {
            this.grassfireIteration(false)
            numIterations += 1
        }
        if (view) {
            this.undoGraph()
            target = this.collection[posToCol(player.x, player.y)]
            llQueue = new this.Queue()
            found = false;
            sourceNode = null
            target.visited = true
            target.dist = 0
            maxDist = 0
            targetCont = new this.nodeContainer(target)
            llQueue.push(targetCont)
            for (let j = 0; j < numIterations; j++) {
                console.log("numiterations:", numIterations)
                setTimeout(() => {
                    this.grassfireIteration(view)
                }, ((j + 1) * 20));
            }
            setTimeout(() => {
                console.log("numIterations - printing:", numIterations)
                if (sourceNode.node != null) {
                    var path = []
                    let curr = sourceNode.node
                    path.push(curr)
                    while ((curr.isTarget === false)) {
                        //console.log("looping", curr.dist)
                        let neighbors = curr.getNeighbors()
                        minDist = Number.MAX_VALUE
                        minInd = -1
                        for (let i = 0; i < neighbors.length; i++) {
                            if (neighbors[i] != null) {
                                if (neighbors[i].isAvailable()) {
                                    if (neighbors[i].isTarget) {
                                        minInd = i
                                        break
                                    } else if ((neighbors[i].dist < minDist) && (neighbors[i].dist != null)) {
                                        minDist = neighbors[i].dist
                                        minInd = i
                                    }
                                }
                            }
                        }
                        if (minInd == -1) {
                            break
                        }
                        curr = neighbors[minInd]
                        curr.prevNode = path[path.length - 1]
                        path.push(curr)
                    }
                    this.printPath(path[path.length - 1])
                }
            }, (numIterations + 1) * 20); //*/
        }

        return {
            isFound: found,
            node: target
        }
    },
    dfsIteration: function(view) {
        curr = stack.pop()
            //console.log("popped: ", curr)
        neighbors = curr.getNeighbors()
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i] != null) {
                if (neighbors[i].isAvailable()) {
                    if (neighbors[i].visited === false) {
                        neighbors[i].visited = true
                        neighbors[i].prevNode = curr
                        neighbors[i].dist = curr.dist + 1
                            /**update max dist for case of viewing pathing */
                        if (neighbors[i].isTarget) {
                            //console.log("found")
                            found = true;
                            targetNode = neighbors[i]
                            break
                        }
                        stack.push(neighbors[i])
                            //console.log("pushing: ", neighbors[i])
                            /*
                            if ((view === true)) {
                                this.viewPathing(neighbors[i])
                            }//*/
                    }
                }
            }
        }
        if (view) {
            this.viewPathing()
        }
    },
    dfs: function(view = false) {
        /**
         * view - boolean value one whether this is for view pathing
         */
        stack = []
        found = false
        targetNode = null
        source = this.collection[posToCol(evil.x, evil.y)]
        source.visited = true
        source.dist = 0
        maxDist = 0
        stack.push(source)
        let numIterations = 0
        while ((stack.length != 0) && (found === false)) {
            this.dfsIteration(false)
            numIterations += 1
        }

        if (view) {
            this.undoGraph()
            stack = []
            found = false
            targetNode = null
            source = this.collection[posToCol(evil.x, evil.y)]
            source.dist = 0
            maxDist = 0
            stack.push(source)
            for (let i = 0; i < numIterations; i++) {
                setTimeout(() => {
                    this.dfsIteration(true)
                }, (i + 1) * 20);
            }
        }
        if (view) {
            setTimeout(() => {
                if (targetNode != null) {
                    this.printPath(targetNode)
                }
            }, (numIterations + 1) * 20);
        }
        return {
            isFound: found,
            node: targetNode
        }
    },
    pathing: function(strategy) {
        switch (strategy) {
            case "dijkstra":
                console.log("dijkstra")
                this.dijkstra(true)
                break;
            case "astar":
                console.log("astar")
                this.astar(true)
                break;
            case "bfs":
                console.log("bfs")
                this.bfs(true)
                break;
            case "grassFire":
                console.log("grassfire")
                this.grassfire(true)
                break;
            case "dfs":
                console.log("dfs")
                this.dfs(true)
                break;
        }
    },
    viewPathing: function(gf = false) {

        ctx = myCanvas.canvas.getContext("2d")
        for (let i = 0; i < this.collection.length; i++) {
            if ((this.collection[i].visited === true) && (this.collection[i].isSource === false) && (this.collection[i].isTarget == false)) {
                if (this.collection[i].dist > this.maxDist) {
                    this.maxDist = this.collection[i].dist
                }
            }
        }

        for (let i = 0; i < this.collection.length; i++) {
            if ((this.collection[i].visited === true) && (this.collection[i].isSource === false) && (this.collection[i].isTarget == false)) {

                if (gf) {
                    ctx.fillStyle = `rgb(
                        ${Math.floor(255-(this.collection[i].dist/(this.maxDist))*255)},
                        0,
                        ${Math.floor(255-(this.collection[i].dist/(this.maxDist))*255)})`;
                } else {
                    ctx.fillStyle = `rgb(
                        0,
                        ${Math.floor(255-(this.collection[i].dist/(this.maxDist))*255)},
                        0)`;
                }
                ctx.fillRect(this.collection[i].x * cellLength, this.collection[i].y * cellLength, cellLength, cellLength);
            }
        }
    },
    printPath: function(targetNode) {
        if (targetNode != null) {
            //console.log("in if")
            curr = targetNode
            ctx = myCanvas.canvas.getContext("2d")
            ctx.fillStyle = "rgb(255,255,255)"
            curr = curr.prevNode
                //console.log("curr", curr)
            while ((curr != null) && (curr.isSource === false)) {
                console.log(curr.x * cellLength, curr.y * cellLength, cellLength, cellLength)
                ctx.fillRect(curr.x * cellLength, curr.y * cellLength, cellLength, cellLength)
                curr = curr.prevNode
            }
        }
    },
    undoGraph: function() {
        for (let i = 0; i < this.collection.length; i++) {
            if (this.collection[i].isAvailable()) {
                this.collection[i].visited = false;
                this.collection[i].dist = null;
                this.collection[i].heuristic = null;
                this.collection[i].distTraveled = null;
                this.collection[i].index = null;
                this.collection[i].prevNode = null;
                this.maxDist = 0
            }
        }
    }
}