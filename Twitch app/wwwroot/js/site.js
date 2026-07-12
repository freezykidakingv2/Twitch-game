const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
    console.log("Connected to server");
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")
const imageData = ctx.getImageData(0, 1080, 1920, 1080);
const pixel = imageData.data;

console.log(pixel.length);

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

function collision() {

    for (let i = 1; i <= 4; i += 4) {
        if (pixel[legsX - i] != 0 || pixel[legsX + i] != 0) {
            legsC = true;
            return i;
        }
        else if (pixel[legsY - i] != 0 || pixel[legsY + i] != 0) {
            legsC = true;
            return i;
        }
        else if (pixel[bodyX - i] != 0 || pixel[bodyX + i] != 0) {
            bodyC = true;
            return i;
        }
    }
}

function LoadCharacter(height, sides,bodyXP, bodyYP, legsXP, legsYP) {
    console.log(rotate);
    ctx.beginPath();
    ctx.arc(sides, height, 30, 0, Math.PI * 2)
    ctx.fillStyle = "orange";
    ctx.fill();

    //body
    ctx.fillRect(bodyXP, bodyYP, 20, 130);

    //first leg
    ctx.save();
    ctx.translate(legsX, legsY);
    ctx.rotate(Math.PI / 1.7);
    ctx.fillRect(0, 0, 90, 20);
    ctx.restore();

    //second leg
    ctx.save();
    ctx.translate(legsX, legsY);
    ctx.rotate(rotation);
    ctx.fillRect(0, 0, 90, 20);
    ctx.restore();

    rotate = false;
    console.log(rotation);
    console.log(legsX, legsY, "leg");
}

LoadCharacter(jump, RandL,bodyX, bodyY, legsX, legsY);

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
            jump -= i;
            bodyY -= i;
            legsY -= i;
            bodyY -= i;
            console.log(count);
            LoadCharacter(jump, RandL, bodyX, bodyY, legsX, legsY);
            sendPosition();
            count += 5;
            if (count >= 350) {
                break;
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(jump, RandL, bodyX, bodyY, legsX, legsY);
        sendPosition();
        count = 0;
        setTimeout(() => {
            for (let i = 5; i <= 350; i) {
                jump += i;
                legsY += i;
                bodyY += i;
                console.log(count);
                LoadCharacter(jump, RandL, bodyX, bodyY, legsX, legsY);
                sendPosition();
                count += 5;
                if (count >= 350) {
                    break;
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            LoadObstacles();
            LoadCharacter(jump, RandL, bodyX, bodyY, legsX, legsY);
            sendPosition();
            console.log("waited");
        }, 1500);
    }
    else if (event.key == "d") {
        RandL += 150 - collision();
        legsX += 150 - collision();
        bodyX += 150 - collision();
        console.log(RandL);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(jump, RandL, bodyX, bodyY, legsX, legsY);
        sendPosition();
    }
    else if (event.key == "a") {
        collision();
        RandL -= 150 + collision();
        legsX -= 150 + collision();
        bodyX -= 150 + collision();
        console.log(RandL);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(jump, RandL, bodyX, bodyY, legsX, legsY);
        sendPosition();
    }
});

function sendPosition() {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            x: RandL,
            y: jump,
            bx: bodyX,
            by: bodyY,
            lx: legsX,
            ly: legsY,
            rotation: rotation
        }));
    }
}

socket.onmessage = (event) => {

    if (event.data == null) {
        console.log("Empty message received");
        return;
    }

    let player = JSON.parse(event.data);

    RandL = player.x;
    jump = player.y;
    rotation = player.rotation;
    bodyX = player.bx;
    bodyY = player.by;
    legsX = player.lx;
    legsY = player.ly;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    LoadObstacles();
    LoadCharacter(jump, RandL, bodyX, bodyY, legsX, legsY);
};