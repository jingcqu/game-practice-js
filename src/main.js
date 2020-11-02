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
        this.visited = false;
        this.dist = null;
        this.index = null;
        this.prevNode = null
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

function posToCol(x, y) {
    return (y * Math.floor(boardWidth / cellLength)) + x
}

function colToPos(index) {
    return {
        x: index % Math.floor(boardWidth / cellLength),
        y: Math.floor(index / Math.floor(boardWidth / cellLength))
    };
}



/** end of graph--------------------- */

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
    make: function(width, height, lightList) { //--------------fucked
        console.log("enter make board graph")
        this.collection = [];
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
            //console.log("setting neighbors: ", x, y)
            ///console.log("index: ", i)
            let currInd = posToCol(x, y);
            //console.log("calculated-index: ", currInd)
            /** connect board -------------------------------------------------------------- */
            if ((y - 1) >= 0) {
                let ind = posToCol(x, y - 1);
                //let pos = colToPos(ind)
                //console.log(x, y, ind, x, pos.y)
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
    dijkstra: function() {
        class superNode {
            constructor(node, dist) {
                this.node = node;
                this.dist = dist;
                this.index = null;
            }
            equalTo(sNode) {
                return (this.node.x === sNode.node.x) && (this.node.y === this.node.y)
            }
        }

        var minBinQueue = {
                make: function() {
                    this.top = null;
                    //console.log("this.collection in mbq", this.collection)
                    this.collection = [];
                    this.numNodes = 0;
                },
                bubbleUp: function(i) {
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
                },
                weighDown: function(i) {
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
                },
                push: function(sNode) { //---------This is fucked------------------------------*------------fixed
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
                },
                pop: function() {
                    if (this.collection.length === 0) {
                        return null;
                    }
                    this.numNodes -= 1;
                    retNode = this.collection[0]

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
                },
                isEmpty: function() {
                    return this.numNodes === 0;
                },
                updateNode: function(i, new_dist) {
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
            }
            /*//-----------------test----------------------------------------------------------

        console.log("push test")
        testArray = [15, 24, 321, 1, 3, 632, 32, 642, 342, 2, 3, 5, 8, 10]
        minBinQueue.make()
        for (let i = 0; i < testArray.length; i++) {
            newSNode = new Node(null, null)
            newSNode.dist = testArray[i]
            minBinQueue.push(newSNode)
        }
        for (let i = 0; i < minBinQueue.collection.length; i++) {
            console.log(minBinQueue.collection[i].dist)
        }
        //console.log("pop test")
        //minBinQueue.pop()
        //for (let i = 0; i < minBinQueue.collection.length; i++) {
        //    console.log(minBinQueue.collection[i].dist)
        //}

        console.log("stringent Pop test")
        for (var i = 0; i < testArray.length; i++) {
            p = minBinQueue.pop()
            console.log("popped", p.dist)
            for (let j = 0; j < minBinQueue.collection.length; j++) {
                console.log(minBinQueue.collection[j].dist)
            }
        }

        console.log("update test")
        minBinQueue.updateNode(5, 0)

        for (let i = 0; i < minBinQueue.collection.length; i++) {
            console.log(minBinQueue.collection[i].dist)
        }
        console.log("update test - 2")
        minBinQueue.updateNode(1, 100)

        for (let i = 0; i < minBinQueue.collection.length; i++) {
            console.log(minBinQueue.collection[i].dist)
        }

        //---------------end of test----------------------------------------------*/
            //---------dijkstras----------------
        var found = false;
        source = this.collection[posToCol(evil.x, evil.y)]

        console.log("x:", evil.x)
        console.log("y:", evil.y)
        console.log("source:", source)
        console.log("index:", posToCol(evil.x, evil.y))
        source.visited = true
        minBinQueue.make()

        source.dist = 0
        minBinQueue.push(source)
        targetNode = null
        updated = false
        while ((minBinQueue.isEmpty() === false)) {
            curr = minBinQueue.pop()
            console.log(minBinQueue.numNodes, curr)
                //-----------------------------------------------------
            neighbors = curr.getNeighbors()
                //console.log("wrapper dist", curr.dist)
            for (let i = 0; i < neighbors.length; i++) {
                if (neighbors[i] != null) {
                    if (neighbors[i].isAvailable()) {
                        if (neighbors[i].visited === false) {
                            //console.log(neighbors[i])
                            neighbors[i].prevNode = curr
                                //console.log("inner dist", curr.dist + 1)
                            neighbors[i].dist = curr.dist + 1
                            minBinQueue.push(neighbors[i])
                            neighbors[i].visited = true
                                /*    //------------------------------------test
                                pn = neighbors[i]
                                ctx = myCanvas.canvas.getContext("2d")
                                if ((pn != null) && (pn.isSource == false)) {
                                    ctx.fillStyle = "green"
                                    ctx.fillRect(pn.x * 20, pn.y * 20, 20, 20)
                                }
                                //---------------------------------------------------*/
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
        }
        //--------------------draw path---------------------------
        //console.log("targetNode", targetNode)
        //console.log("target position", targetNode.isTarget)
        if (targetNode != null) {
            curr = targetNode
            ctx = myCanvas.canvas.getContext("2d")
            ctx.fillStyle = "green"
            curr = curr.prevNode
            while ((curr != null) && (curr.isSource === false)) {
                //console.log(curr.x * cellLength, curr.y * cellLength, cellLength, cellLength)
                ctx.fillRect(curr.x * cellLength, curr.y * cellLength, cellLength, cellLength)
                curr = curr.prevNode
            }
        }
        return {
            isFound: found,
            node: targetNode
        }; //*/
    },
    astar: function() {

    },
    bfs: function() {

    },
    grassfire: function() {

    },
    dfs: function() {

    },
    pathing: function(strategy) {
        switch (strategy) {
            case "dijkstra":
                console.log("dijkstra")
                this.dijkstra()
                break;
            case "astar":
                console.log("astar")
                this.astar()
                break;
            case "bfs":
                console.log("bfs")
                this.bfs()
                break;
            case "grassFire":
                console.log("grassfire")
                this.grassfire()
                break;
            case "dfs":
                console.log("dfs")
                this.dfs()
                break;
        }
    }
}