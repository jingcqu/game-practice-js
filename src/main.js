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

var boardGraph = {
    make: function(width, height, lightList) {
        //console.log("enter make board graph")
        this.collection = [];
        //console.log(width)
        //console.log(height)
        for (var iX = 0; iX < width; iX += cellLength) {
            for (iY = 0; iY < height; iY += cellLength) {
                var cCell = new Node(iX, iY);
                this.collection.push(cCell);
            }
        }
        maxX = Math.floor(width / cellLength);
        maxY = Math.floor(width / cellLength);
        //console.log(this.collection.length)
        for (var i = 0; i < this.collection.length; i++) {
            let x = i % maxX;
            let y = Math.floor(i / maxX);
            let currInd = posToCol(x, y);
            /** connect board -------------------------------------------------------------- */
            if ((y - 1) >= 0) {
                let ind = posToCol(x, y - 1);
                //let pos = colToPos(ind)
                //console.log(x, y, ind, x, pos.y)
                this.collection[currInd].setTop(this.collection[ind]);
                this.collection[ind].setBot(this.collection[currInd]);
            }
            if ((x - 1) >= 0) {
                let ind = posToCol(x - 1, y);
                this.collection[currInd].setLeft(this.collection[ind]);
                this.collection[ind].setRight(this.collection[currInd]);
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

/** end of graph--------------------- */

var player = {
    place: function(x, y) {
        this.x = x;
        this.y = y;
        playerPlaced = true;
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
        //temp for testing
        console.log(boardGraph.collection[index].isAvailable())

        return;
    }
    ctx.fillRect(mouseX, mouseY, cellLength, cellLength)


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