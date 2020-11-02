//var boardWidth;
//var boardHeight;
function testPosToCol() {
    index = 0
    fucked = false
    for (var y = 0; y < boardHeight; y += 20) {
        for (var x = 0; x < boardWidth; x += 20) {
            if (posToCol(x / 20, y / 20) == index) {
                console.log("po2col passed: ", x / 20, y / 20)
            } else {
                console.log("pos2col fucked at: ", x / 20, y / 20)
                console.log(posToCol(x / 20, y / 20))
                console.log(index)
                fucked = true
                break
            }
            a = colToPos(index)
            if ((a.x === (x / 20)) && (a.y === (y / 20))) {
                console.log("col2pos passed: ", x / 20, y / 20)
            } else {
                console.log("pos2col fucked at: ", x / 20, y / 20)
                console.log(colToPos(index))
                console.log(index)
                fucked = true
                break
            }
            index += 1
        }
        if (fucked) {
            break
        }
    }
}

function testFindTargetNode() {
    for (var i = 0; i < boardGraph.collection.length; i++) {
        if (boardGraph.collection[i].isTarget) {
            console.log("found: ", boardGraph.collection[i])
        }
    }
}