var myGamePiece;
var myObstacles = [];
var myScore;
var numLights = 20;
var cellLength = 20;
var context;

function startGame() {
    myCanvas.start();
}


var myCanvas = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 1080;
        this.canvas.height = 500;
        var ph = this.canvas.height / cellLength;
        var pw = this.canvas.width / cellLength;
        this.context = this.canvas.getContext("2d");
        context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        setLights(this.canvas.width, this.canvas.height)


    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Light {
    constructor(xPos, yPos) {
        this.x = xPos;
        this.y = yPos;
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
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
        x *= cellLength
        y *= cellLength
        cl = new Light(x, y)
        var isRepeat = false
        for (var i = 0; i < lset.length; i++) {
            if (comparePos(cl, lset[i])) {
                console.log(cl.x)
                isRepeat = true
                break;
            }
        }
        if (isRepeat) {
            i--;
            continue;
        }
        lset.push(cl)
    }
    console.log("exitloop")
    var c = document.getElementsByTagName("canvas")[0];
    console.log(c)
    ctx = c.getContext("2d");

    for (var i = 0; i < lset.length; i++) {
        let img = new Image()
        img.className = String(i)
        img.src = "/assets/meLight.png"
        console.log(img)
        let x = lset[i].getX()
        let y = lset[i].getY()
        console.log(x)
        console.log(y)
        img.onload = function() {
            ctx.drawImage(img, x, y)

        }
        ctx.beginPath();
        ctx.arc(980, 1000, 20, 0, 2 * Math.PI);
        ctx.stroke();
        //    console.log("drawing")
    }
}