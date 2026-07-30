import { bodyPartsPos } from "./BodyPartPositions.js";

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

export let boundaryX = 200;
export let boundaryY = 800;
export let boundaryW = 120;
export let boundaryH = 220;
export let dead = false;

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
            console.log("Boundary X position initialized: ", boundaryX);
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
            console.log("Boundary Y position initialized: ", boundaryY);
        }
    }
}

export function LoadCharacter() {
    if (dead == true) {
        dead = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Dead");
        return;
    }

    // ctx.lineWidth = "10";
    // ctx.strokeStyle = "green";
    // ctx.strokeRect(boundaryX, boundaryY, boundaryW, boundaryH);

    if (boundaryY < 0) {
        boundaryY = 0;
        console.log("Y position fixed: ", boundaryY);
    }
    else if (boundaryY >= 1080) {
        boundaryY = 1080;
        dead = true;
        console.log("Dead", dead);
    }

    if (boundaryX < 0) {
        boundaryX = 0;
        console.log("X position fixed: ", boundaryX);
    }
    else if (boundaryX > 1920) {
        boundaryX = 1920;
        console.log("X position fixed:", boundaryX);
    }

    ctx.beginPath();
    ctx.arc(boundaryX + 50, boundaryY + 30, 30, 0, Math.PI * 2)
    ctx.fillStyle = "orange";
    ctx.fill();

    //body
    ctx.fillRect(boundaryX + 45, boundaryY + 30, 20, 130);

    //first leg
    ctx.save();
    ctx.translate(boundaryX + 65, boundaryY + 130);
    ctx.rotate(Math.PI / 1.7);
    ctx.fillRect(0, 0, 90, 20);
    ctx.restore();

    //second leg
    ctx.save();
    ctx.translate(boundaryX + 65, boundaryY + 130);
    ctx.rotate(bodyPartsPos[2]);
    ctx.fillRect(0, 0, 90, 20);
    ctx.restore();

    console.log(boundaryX + 65, boundaryY + 130, "leg");
}

var j = 1170;

export function LoadObstacles() {
    j = 1170;
    ctx.fillStyle = "blue";
    for (let i = 200; i <= 1700; i += 400) {
        ctx.fillRect(i, j -= 150, 160, 50);
    }

    ctx.fillRect(1750, 400, 160, 50);
    ctx.fillStyle = "brown";
    ctx.fillRect(1880, 100, 20, 300);
    ctx.fillStyle = "white";
    ctx.fillRect(1720, 100, 160, 140);
}