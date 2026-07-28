import { WebSocketMessages } from "./WebSocket.js";
import { bodyPartsPos } from "./BodyPartPositions.js";
import { LoadCharacter, LoadObstacles, ctx, boundaryX, boundaryY, setBoundaryPs, boundaryH, boundaryW } from "./Drawings.js";

LoadObstacles();
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
let pixel = imageData.data;
let blockColour = 0;

export function run () {

    WebSocketMessages.sendPosition();

    LoadCharacter();
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    function fall() {
        for (let i = bodyPartsPos[4]; i <= 1080; i++) {
            blockColour = ((bodyPartsPos[4] * canvas.width + bodyPartsPos[3]) * 4);

            if (pixel[blockColour + 2] == 255) {
                break;
            }

            bodyPartsPos[4]++;
            bodyPartsPos[0]++;
            bodyPartsPos[6]++;
            
            setBoundaryPs(1, true, true, false);
            console.log("Decreasing: ", bodyPartsPos[4]);
            console.log("Boundary Y position: ", boundaryY);
            ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
            LoadCharacter();
            WebSocketMessages.sendPosition();
        }
    }

    function collision(positionX, positionY, positionC, increase) {
        blockColour = (((positionY * canvas.width + positionX) * 4));



        // for (let pix in pixel) {
        //     if (pixel[pix] === 255) {
        //         console.log("Pixel number: ", pix / 4);
        //         break;
        //     }
        // }

        if (pixel[blockColour + 2] === 255) {
            console.log("Block found: ", pixel[blockColour]);

            if (increase == true) {
                setBoundaryPs(20, true, true, true);
                positionC = positionC += 20;
                console.log("Collision increase: ", positionC);
                return;
            }
            else {
                setBoundaryPs(20, true, true, true);
                positionC = positionC -= 20;
                console.log("Collision decrease: ", positionC);
            }
        }

        return positionC;
    }

    var count = 0;

    document.addEventListener("keydown", (event) => {
        if (event.key == " ") {

            for (let i = 5; i <= 350; i) {
                bodyPartsPos[0] = collision(bodyPartsPos[1],
                    bodyPartsPos[0] -= i, bodyPartsPos[0] -= i, false);

                bodyPartsPos[4] = collision(bodyPartsPos[3],
                    bodyPartsPos[4] -= i, bodyPartsPos[4] -= i, false);

                bodyPartsPos[6] = collision(bodyPartsPos[5],
                    bodyPartsPos[6] -= i, bodyPartsPos[6] -= i, false);

                console.log("Count: ", count);
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
            setTimeout(() => {
                fall();
                console.log("1.5 seconds passed");
            }, 1500);

        }
        else if (event.key == "d") {
            ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
            for (let i = 1; i <= 5; i += 2) {
                bodyPartsPos[i] = collision(bodyPartsPos[i] + 150,
                    bodyPartsPos[i - 1],
                    bodyPartsPos[i] + 150, true);
                console.log("Boundary X position: ", boundaryX);
            }

            ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
            LoadCharacter();
            WebSocketMessages.sendPosition();
        }
        else if (event.key == "a") {
            for (let i = 1; i <= 5; i += 2) {
                bodyPartsPos[i] = collision(bodyPartsPos[i] - 150,
                    bodyPartsPos[i - 1],
                    bodyPartsPos[i] - 150, false);
            }
            console.log("Head x position: ", bodyPartsPos[1]);

            ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
            LoadCharacter();
            WebSocketMessages.sendPosition();
        }
    });
}
