import { WebSocketMessages } from "./WebSocket.js";
import { bodyPartsPos } from "./BodyPartPositions.js";

const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d")
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
let pixel = imageData.data;

export function LoadCharacter(height, sides, bodyXP, bodyYP, legsXP, legsYP) {
     
    for (let i = 0; i < bodyPartsPos.length; i++) {
        if ((bodyPartsPos[i] > 1920 || bodyPartsPos[i] < 0) &&
            bodyPartsPos[i] != bodyPartsPos[4] &&
            bodyPartsPos[i] != bodyPartsPos[3] && bodyPartsPos[i] !=
            bodyPartsPos[5]) {
            console.log("Error: Body at a high position: ", bodyPartsPos[i]);
            bodyPartsPos[i] = 300;
            console.log("Legs y position: ", bodyPartsPos[4]);
        }
        else if (bodyPartsPos[i] == bodyPartsPos[4] &&
            (bodyPartsPos[i] < 0 || bodyPartsPos[i] > 1080)) {
            bodyPartsPos[i] = 850;
            console.log("Leg Y position fixed");
        }
        else if ((bodyPartsPos[i] > 1920 || bodyPartsPos[i] < 0) &&
            (bodyPartsPos[i] == bodyPartsPos[3] ||
                bodyPartsPos[i] == bodyPartsPos[5])) {

            bodyPartsPos[i] = 1920;
        }
        else {
            console.log("We good");
        }
    }

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

    console.log(bodyPartsPos[3], bodyPartsPos[4], "leg");
}

LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
    bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
pixel = imageData.data;

let pixels = 0;

for (let p in pixel) {
    pixels++;

    if (p == 255) {
        console.log("Blue pixel: ", pixel[p]);
    }
}

console.log("Blue pixel: ", pixel[64 * 4]);

let blockColour = 0;

function collision(positionX, positionY, positionC) {
    console.log("Pixel length: ", pixel.length);

    blockColour = (((positionY * canvas.width + positionX) * 4));

    if (pixel[blockColour] == 255) {
        console.log("Block found right: ", pixel[blockColour]);

        positionC = positionC -= 20;
    }
    else {
        for (let i = positionY; i < 1080; i++) {
            positionY++;
            console.log("Decreasing: ", positionY);
            ctx.clearRect(0, 0, 1920, 1080);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
        }
    }

    return positionC;
}

var j = 1170;

export function LoadObstacles() {
    j = 1170;
    ctx.fillStyle = "blue";
    for (let i = 200; i <= 1700; i += 400) {
        ctx.fillRect(i, j -= 150, 160, 50);
    }
}

LoadObstacles();
imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

var count = 0;

document.addEventListener("keydown", (event) => {
    if (event.key == " ") {
        for (let i = 5; i <= 350; i) {
            bodyPartsPos[0] -= i;
            bodyPartsPos[6] -= i;
            bodyPartsPos[4] -= i;
            console.log("Count: ", count);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
            WebSocketMessages.sendPosition();
            count += 5;
            if (count >= 350) {
                break;
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
            bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
        WebSocketMessages.sendPosition();
        count = 0;
        setTimeout(() => {
            for (let i = 5; i <= 350; i) {
                bodyPartsPos[0] = collision(bodyPartsPos[1],
                    bodyPartsPos[0] += i, 
                    bodyPartsPos[0] += i);

                bodyPartsPos[6] = collision(bodyPartsPos[6],
                    bodyPartsPos[6] += i, 
                    bodyPartsPos[6] += i);

                bodyPartsPos[4] = collision(bodyPartsPos[3],
                    bodyPartsPos[4] += i, 
                    bodyPartsPos[4] += i);

                console.log(count);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                LoadObstacles();
                LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                    bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
                WebSocketMessages.sendPosition();
                count += 5;
                if (count >= 350) {
                    break;
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
            WebSocketMessages.sendPosition();
        }, 1500);
    }
    else if (event.key == "d") {
        for (let i = 1; i <= 5; i += 2) {
            bodyPartsPos[i] = collision(bodyPartsPos[i] += 150,
                bodyPartsPos[i - 1],
                bodyPartsPos[i] += 150);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
            WebSocketMessages.sendPosition();
        }
        console.log("Head x position: ", bodyPartsPos[1]);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
            bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
        WebSocketMessages.sendPosition();
    }
    else if (event.key == "a") {
        for (let i = 1; i <= 5; i += 2) {
            bodyPartsPos[i] = collision(bodyPartsPos[i] -= 150,
                bodyPartsPos[i - 1],
                bodyPartsPos[i] -= 150);
        }
        console.log("Head x position: ", bodyPartsPos[1]);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
            bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
        WebSocketMessages.sendPosition();
    }
});
