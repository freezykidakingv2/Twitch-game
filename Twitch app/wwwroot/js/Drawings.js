import { bodyPartsPos } from "./BodyPartPositions.js";

const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

export let boundaryX = 200;
export let boundaryY = 820;
export let boundaryW = 120;
export let boundaryH = 220;

export function setBoundaryPs(value, incrementP, increaseP, isXP) {
    if (isXP == true) {
        if (incrementP == true) {
            if (increaseP == true) {
                boundaryX += value;
                console.log("boundary X position: ", boundaryX, "Adding: ", value);
            }
            else {
                boundaryX -= value;
            }
        }
        else {
            boundaryX = value;
        }
    }
    else {
        if (incrementP == true) {
            if (increaseP == true) {
                boundaryY += value;
            }
            else {
                boundaryY -= value;
            }
        }
        else {
            boundaryY = value;
        }
    }
}

export function LoadCharacter() {
    console.log("Boundary X position: ", boundaryX);

    ctx.lineWidth = "10";
    ctx.strokeStyle = "green";
    ctx.strokeRect(boundaryX, boundaryY, boundaryW, boundaryH);

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
    ctx.arc(bodyPartsPos[1], bodyPartsPos[0], 30, 0, Math.PI * 2)
    ctx.fillStyle = "orange";
    ctx.fill();

    //body
    ctx.fillRect(bodyPartsPos[5], bodyPartsPos[6], 20, 130);

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

var j = 1170;

export function LoadObstacles() {
    j = 1170;
    ctx.fillStyle = "blue";
    for (let i = 200; i <= 1700; i += 400) {
        ctx.fillRect(i, j -= 150, 160, 50);
    }
}