import { WebSocketMessages } from "./WebSocket.js";
import { bodyPartsPos } from "./BodyPartPositions.js";
import { LoadCharacter, LoadObstacles, ctx, boundaryX, boundaryY, setBoundaryPs, boundaryH, boundaryW, dead } from "./Drawings.js";

LoadObstacles();
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
let pixel = imageData.data;
let blockColour = 0;
let j = 1170;
let timerWorking = false;
let jump = false;

export function run () {

    if (dead === true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    WebSocketMessages.sendPosition();

    LoadCharacter();

    let collisionDetected = false;

    function collision(positionX, positionY, positionC, increase) {
        j = 1170;
        collisionDetected = false;

        for (let i = 200; i <= positionC; i += 400) {
            j -= 150;

            if (positionC === positionY) {
                console.log("Checking positions: ", "Position changing"
                    , positionC, "Position X: ", positionX, "Position Y: ",
                    positionY, " Position i: ", i, "Position j: ", j);
                   if ((positionC == j - 220) && (positionX >= i &&
                       positionX <= i + 160)) {

                       console.log("Checking positions: ", "Position changing"
                           , positionC, "Position X: ", positionX, "Position Y: ",
                           positionY, " Position i: ", i, "Position j: ", j);

                       console.log("Block found: ", j);
                       collisionDetected = true;
                       positionC = j - 220;
                       return positionC;
                   }
            }
            else {

                console.log("Checking collision");
                if (increase === true) {
                    console.log("Checking positions: ", "Position changing"
                        , positionC + 120, "Position X: ", positionX, "Position Y: ",
                        positionY + 10, " Position i: ", i, "Position j: ", j);

                    if ((positionC + 120 == i || positionC <= i + 79) &&
                        (positionY + 10 >= j && positionY + 210 >= j + 220)) {

                        console.log("Block found: ", i, j);
                        console.log("Checking positions:",
                            "Position changing",
                            positionC + 10,
                            "PositionX:", positionX,
                            "Position Y:",
                            positionY + 10, "Position j: ", j);

                        collisionDetected = true;
                        positionC = i;
                        console.log("Collision happened:", positionC);
                        return positionC;
                    }
                }
                else
                {
                    if ((positionC == i || positionC >= i + 80) &&
                        (positionY + 50 >= j && positionY - 50 <= j + 220)) {

                        console.log("Block found: ", i, j);
                        console.log("Checking positions:",
                            "Position changing",
                            positionC + 20,
                            "PositionX:", positionX,
                            "Position Y:",
                            positionY + 50, "Position j: ", j);

                        collisionDetected = true;
                        positionC = i;
                        console.log("Collisionhappened:", positionC);
                        return positionC;
                    }
                }
                   
            }
        }

        collisionDetected = false;
        console.log("Block Not found");
        return positionC;
    }

    function fall() {
        collisionDetected = false;
        setTimeout(() => {
            for (let i = boundaryY; i <= 1080; i++) {
                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);

                if (collisionDetected === true) {
                    console.log("Collision detected: ", collisionDetected, "Loop: ", i);

                    ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);

                    setBoundaryPs(i, false, false, false);

                    ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                    LoadCharacter();
                    WebSocketMessages.sendPosition();
                    break;
                    console.log(i);
                }

                setBoundaryPs(collision(boundaryX, boundaryY + 1,
                    boundaryY + 1, true), false, false, false);

                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                LoadCharacter();
                WebSocketMessages.sendPosition();
            }
            timerWorking = false;
        }, 1500);
        
        return;
    }

    var count = 0;

    document.addEventListener("keydown", (event) => {
        if (event.key == " ") {
            if (dead != true) {
                jump = true;

                for (let i = 5; i <= 350; i) {
                    ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                    setBoundaryPs(5, true, false, false);

                    ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                    LoadCharacter();
                    WebSocketMessages.sendPosition();

                    count += 5;
                    if (count >= 350) {
                        break;
                    }
                }
                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                LoadCharacter();
                WebSocketMessages.sendPosition();
                count = 0;

                fall();

                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                LoadCharacter();
                WebSocketMessages.sendPosition();
                timerWorking = false;

                if (boundaryY >= 1080) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    console.log("Dead");
                    return;
                }

            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                console.log("Dead");
                return;
            }
        }
        else if (event.key == "d") {
            if (dead != true) {
                console.log("Dead: ", dead);
                console.log("Collision: ", collisionDetected);
                timerWorking = true;
                jump = false;

                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                setBoundaryPs(collision(boundaryX + 150, boundaryY,
                    boundaryX + 150, true), false, true, true);

                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                LoadCharacter();
                WebSocketMessages.sendPosition();

                // fall();

                if (boundaryY >= 1080) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    console.log("Dead");
                    return;
                }

            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                console.log("Dead");
                return;
            }
        }
        else if (event.key == "a") {
            if (dead != true) {
                timerWorking = true;
                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                setBoundaryPs(collision(boundaryX - 150, boundaryY,
                    boundaryX - 150, false), false, false, true);

                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                LoadCharacter();
                WebSocketMessages.sendPosition();

                // fall();

                if (boundaryY >= 1080) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    console.log("Dead");
                    return;
                }
            }
            else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                console.log("Dead");
                return;
            }
        }
    });

    if (dead === true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
}
