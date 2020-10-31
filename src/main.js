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
        set: function(x, y) {
            this.x = x
            this.y = y
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
}

var boardGraph = {
    make: function(width, height, lightList) {
        this.collection = [];
        for (var iX = 0; iX < width; iX += cellLength) {
            for (iY = 0; iY < height; iY += cellLength) {
                var cCell = new Node(iX, iY)
                this.collection.push(cCell)
            }
        }
        maxX = Math.floor(width / cellLength)
        maxY = Math.floor(width / cellLength)
        for (var i = 0; i < this.collection.length; i++) {
            let x = i % maxX;
            let y = Math.floor(i / maxX)

        }
    },
    checkCell: function(x, y) { //false - unavailable
        if ((x < 0) || (y < 0) || (x >= boardWidth) || (y >= boardHeight)) {
            return false
        } else {
            let index = Math.floor(y / cellLength) * Math.floor(boardWidth / cellLength)
            index += Math.floor(x / cellLength)

        }
    }
}

/** end of graph--------------------- */

var player = {
    place: function(x, y) {
        this.x = x
        this.y = y
    },
    moveL: function() {
        this.x -= cellLength
    },
    moveR: function() {
        this.x += cellLength
    },
    moveU: function() {
        this.y -= cellLength
    },
    moveD: function() {
        this.y += cellLength
    }
}


var myCanvas = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 1080;
        this.canvas.height = 500;
        boardWidth = this.canvas.width
        boardHeight = this.canvas.height
        this.canvas.click
        this.context = this.canvas.getContext("2d");
        context = this.canvas.addEventListener("mousedown", place)

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        setLights(this.canvas.width, this.canvas.height);
        drawGrid(this.canvas.width, this.canvas.height);
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
    } else if (placeEvil) {
        ctx.fillStyle = "red";
        if (sourcePlaced) {
            return;
        }
        sourcePlaced = true;
    } else if (brickBool) {
        ctx.fillStyle = "brown";
    } else if ((placeChar === false) && (placeEvil === false) && (brickBool === false)) {
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
        cl = new Light(x, y);
        var isRepeat = false
        for (var i = 0; i < lset.length; i++) {
            if (comparePos(cl, lset[i])) {
                console.log(cl.x);
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
    console.log("exitloop");
    var c = document.getElementsByTagName("canvas")[0];
    console.log(c);
    ctx = c.getContext("2d");

    for (var i = 0; i < lset.length; i++) {
        let img = new Image();
        img.className = String(i);
        img.src = "/assets/meLight.png";
        console.log(img);
        let x = lset[i].getX();
        let y = lset[i].getY();
        console.log(x);
        console.log(y);
        img.onload = function() {
                ctx.drawImage(img, x, y);

            }
            //    console.log("drawing")
    }
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
    console.log("brick clicked")
}

function placeCharButton() {
    brickBool = false;
    placeChar = true;
    placeEvil = false;
    startButt = false;
    viewPath = false;
    console.log("char clicked")
}

function placeEvilButton() {
    brickBool = false;
    placeChar = false;
    placeEvil = true;
    startButt = false;
    viewPath = false;
    console.log("evil clicked")
}

function startButton() { //place holder
    brickBool = false;
    placeChar = false;
    placeEvil = false;
    startButt = true;
    viewPath = false;
    console.log("start clicked")
}

function viewPathButton() {
    brickBool = false;
    placeChar = false;
    placeEvil = false;
    startButt = false;
    viewPath = true;
    console.log("view path clicked")
}