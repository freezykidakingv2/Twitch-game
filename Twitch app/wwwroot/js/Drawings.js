import { bodyPartsPos } from "./BodyPartPositions.js";

const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

export let boundaryX = 200;
export let boundaryY = 820;
export let boundaryW = 120;
export let boundaryH = 220;

export function setBoundaryPs(value, incrementP, increaseP, isXP) {

    console.log("Boundary Initializer working");

    if (isXP == true) {
        if (incrementP == true) {
            if (increaseP == true) {
                boundaryX += value;
                console.log("boundary X position: ",
                    boundaryX, "Adding: ", value);
            }
            else {
                boundaryX -= value;
                console.log("boundary X position: ",
                    boundaryX, "Subtracting: ", value);
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
                console.log("boundary Y position: ",
                    boundaryY, "Adding: ", value);
            }
            else {
                boundaryY -= value;
                console.log("boundary Y position: ",
                    boundaryY, "Subtracting: ", value);
            }
        }
        else {
            boundaryY = value;
        }
    }
}

export function LoadCharacter() {
    // ctx.lineWidth = "10";
    // ctx.strokeStyle = "green";
    // ctx.strokeRect(boundaryX, boundaryY, boundaryW, boundaryH);

    for (let bodyPart in bodyPartsPos) {
        if (bodyPart < 0) {
            bodyPart = 0;
            console.log("Y position fixed: ", bodypart);
        }
        else if (bodyPart > 1920) {
            bodyPart = 1920;
            console.log("X position fixed:", bodyPart);
        }
    }

    if (bodyPartsPos[3] != bodyPartsPos[5] + 20) { 

        bodyPartsPos[3] = bodyPartsPos[5] + 20;
        console.log("Leg X position aligned with body X position");
    }
    else if (bodyPartsPos[0] != bodyPartsPos[6]) {
        bodyPartsPos[0] = bodyPartsPos[6];
        console.log("Head Y position aligned with body Y position");
    }
    else if (bodyPartsPos[4] != bodyPartsPos[6] + 100) {
        bodyPartsPos[4] = bodyPartsPos[6] + 100;
    }
    else if (bodyPartsPos[1] != bodyPartsPos[5] + 5) {

        bodyPartsPos[1] = bodyPartsPos[5] + 5;
    }
    else if (boundaryX != bodyPartsPos[1] - 50) {
        boundaryX = bodyPartsPos[1] - 50;
        console.log("Boundary X position fixed: ", boundaryX);
    }
    else if (boundaryY != bodyPartsPos[0] - 30) {
        boundaryY = bodyPartsPos[0] - 30;
        console.log("Boundary X position fixed:",boundaryX);
    }
    else {
        console.log("We good");
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