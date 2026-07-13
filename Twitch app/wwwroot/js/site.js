const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
    console.log("Connected to server");
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")
const imageData = ctx.getImageData(0, 1080, 1920, 1080);
const pixel = imageData.data;

console.log("Pixel length: ", pixel.length);

const bodyPartsPos = [];

var jump = 850;
var RandL = 250;
var rotate = true;
var rotation = Math.PI / 3;
var legsX = 265;
var legsY = 950;
var bodyX = 245;
var bodyY = 850;
var bodyC = false;
var legsC = false;

bodyPartsPos.push(jump);// 0
bodyPartsPos.push(RandL);// 1
bodyPartsPos.push(rotation);// 2
bodyPartsPos.push(legsX);// 3
bodyPartsPos.push(legsY);// 4
bodyPartsPos.push(bodyX);// 5
bodyPartsPos.push(bodyY);// 6

console.log("Body part count: ", bodyPartsPos.length);
console.log("Body x position: ", bodyPartsPos[5]);

function collision() {

    let obstacleLoc = 936000;

    console.log("Pixel location: ", pixel[obstacleLoc]);

    if (pixel[bodyPartsPos[3] - 9] != 0 ||
        pixel[bodyPartsPos[3] + 9] != 0) {

        console.log("Block found Left: ", pixel[bodyPartsPos[3] - 9],
            "Block found Right: ", pixel[bodyPartsPos[3] + 9]);
        legsC = true;
    }
    else if (pixel[bodyPartsPos[4] - 9] != 0 ||
        pixel[bodyPartsPos[4] + 9] != 0) {

        legsC = true;
    }
    else if (pixel[bodyPartsPos[5] - 9] != 0 ||
        pixel[bodyPartsPos[5] + 9] != 0) {

        bodyC = true;
    }
}

collision();

function LoadCharacter(height, sides, bodyXP, bodyYP, legsXP, legsYP) {
     
    for (const bodyPart in bodyPartsPos) {
        if (bodyPart > 900) {
            bodyPart = 300;
            console.log("Error: Body at a high position");
        }
        console.log("Test");
    }

    if (bodyPartsPos[4] > 900) {
        bodyPartsPos[4] = 300;
    }

    console.log(rotate);
    ctx.beginPath();
    ctx.arc(sides, height, 30, 0, Math.PI * 2)
    ctx.fillStyle = "orange";
    ctx.fill();

    //body
    ctx.fillRect(bodyXP, bodyYP, 20, 130);

    //first leg
    ctx.save();
    ctx.translate(bodyPartsPos[3], bodyPartsPos[4]);
    ctx.rotate(Math.PI / 1.7);
    ctx.fillRect(0, 0, 90, 20);
    ctx.restore();

    //second leg
    ctx.save();
    ctx.translate(bodyPartsPos[3], bodyPartsPos[4]);
    ctx.rotate(bodyPartsPos[2]);
    ctx.fillRect(0, 0, 90, 20);
    ctx.restore();

    rotate = false;
    console.log(bodyPartsPos[2]);
    console.log(bodyPartsPos[3], bodyPartsPos[4], "leg");
}

LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
    bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);

var j = 1170;

function LoadObstacles() {
    j = 1170;
    ctx.fillStyle = "blue";
    for (let i = 200; i <= 1700; i += 400) {
        ctx.fillRect(i, j -= 150, 160, 50);
    }
}

LoadObstacles();

var count = 0;

document.addEventListener("keydown", (event) => {
    if (event.key == " ") {
        collision();
        for (let i = 5; i <= 350; i) {
            bodyPartsPos[0] -= i;
            bodyPartsPos[6] -= i;
            bodyPartsPos[4] -= i;
            console.log("Count: ", count);
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
            sendPosition();
            count += 5;
            if (count >= 350) {
                break;
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
            bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
        sendPosition();
        count = 0;
        setTimeout(() => {
            for (let i = 5; i <= 350; i) {
                bodyPartsPos[0] += i;
                bodyPartsPos[6] += i;
                bodyPartsPos[4] += i;
                console.log(count);
                LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                    bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
                sendPosition();
                count += 5;
                if (count >= 350) {
                    break;
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
            sendPosition();
            console.log("waited");
        }, 1500);
    }
    else if (event.key == "d") {
        bodyPartsPos[1] += 150;
        collision();
        bodyPartsPos[3] += 150 - collision();
        bodyPartsPos[5] += 150 - collision();
        console.log("Head x position: ", RandL);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
            bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
        sendPosition();
    }
    else if (event.key == "a") {
        collision();
        bodyPartsPos[1] -= 150 - collision();
        bodyPartsPos[3] -= 150 - collision();
        bodyPartsPos[5] -= 150 - collision();
        console.log("Head x position: ", RandL);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
            bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
        sendPosition();
    }
});

function sendPosition() {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            x: bodyPartsPos[1],
            y: bodyPartsPos[0],
            bx: bodyPartsPos[5],
            by: bodyPartsPos[6],
            lx: bodyPartsPos[3],
            ly: bodyPartsPos[4],
            rotation: bodyPartsPos[2]
        }));
    }
}

socket.onmessage = (event) => {

    if (event.data == null) {
        console.log("Empty message received");
        return;
    }

    let player = JSON.parse(event.data);

    bodyPartsPos[1] = player.x;
    bodyPartsPos[0] = player.y;
    bodyPartsPos[2] = player.rotation;
    bodyPartsPos[5] = player.bx;
    bodyPartsPos[6] = player.by;
    bodyPartsPos[3] = player.lx;
    bodyPartsPos[4] = player.ly;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    LoadObstacles();
    LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
        bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
};