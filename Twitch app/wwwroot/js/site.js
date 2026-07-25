import { WebSocketMessages } from "./WebSocket.js";
import { bodyPartsPos } from "./BodyPartPositions.js";
import { LoadCharacter, LoadObstacles, ctx, boundaryX, boundaryY, setBoundaryPs, boundaryH, boundaryW } from "./Drawings.js";

LoadObstacles();
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
let pixel = imageData.data;
export let increment = false;
let blockColour = 0;
export let increase = false;
export let isX = false;

export function run () {

    WebSocketMessages.sendPosition();

    LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
        bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4], boundaryX, boundaryY);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    function fall(Yposition) {
        blockColour = ((((bodyPartsPos[4] + 1) * canvas.width + bodyPartsPos[3]) * 4));

        for (let i = Yposition; i < 1080; i++) {
            if (pixel[blockColour] == 255) {
                break;
            }

            Yposition++;
            setBoundaryPs(1, true, true, false);

            console.log("Decreasing: ", Yposition);
            console.log("Boundary Y position: ", boundaryY);
            ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
            LoadObstacles();
            LoadCharacter();
            WebSocketMessages.sendPosition();
        }
    }

    function collision(positionX, positionY, positionC, increase) {
        blockColour = (((positionY * canvas.width + positionX) * 4));

        if (pixel[blockColour] == 255) {
            console.log("Block found: ", pixel[blockColour]);

            if (increase == true) {
                positionC = positionC += 20;
                console.log("Collision increase: ", positionC);
            }
            else {
                positionC = positionC -= 20;
                console.log("Collision decrease: ", positionC);
            }
        }
        return positionC;
    }

    var count = 0;

    document.addEventListener("keydown", (event) => {
        if (event.key == " ") {
            increase = false;
            increment = true;
            isX = false;

            for (let i = 5; i <= 350; i) {
                bodyPartsPos[0] -= i;
                bodyPartsPos[6] -= i;
                bodyPartsPos[4] -= i;
                setBoundaryPs(i, increment, increase, isX);

                console.log("Count: ", count);
                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                LoadObstacles();
                LoadCharacter();
                WebSocketMessages.sendPosition();

                count += 5;
                if (count >= 350) {
                    break;
                }
            }
            ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);

            WebSocketMessages.sendPosition();
            count = 0;
            increase = false;
            setTimeout(() => {
                fall(bodyPartsPos[0]);
                fall(bodyPartsPos[4]);
                fall(bodyPartsPos[6]);
            }, 1500);

        }
        else if (event.key == "d") {
            fall(bodyPartsPos[0]);
            fall(bodyPartsPos[4]);
            fall(bodyPartsPos[6]);

            increase = true;
            increment = true;
            isX = true;

            for (let i = 1; i <= 5; i += 2) {
                bodyPartsPos[i] = collision(bodyPartsPos[i] += 150,
                    bodyPartsPos[i - 1],
                    bodyPartsPos[i] += 150, increase);
                setBoundaryPs(150, increment, increase, isX);
                console.log("Boundary X position: ", boundaryX);

                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                LoadObstacles();
                LoadCharacter();

                fall(bodyPartsPos[0]);
                fall(bodyPartsPos[4]);
                fall(bodyPartsPos[6]);

                WebSocketMessages.sendPosition();
            }
            console.log("Head x position: ", bodyPartsPos[1]);

            console.log(boundaryX - 20);
            ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
            LoadObstacles();
            LoadCharacter();

            WebSocketMessages.sendPosition();
        }
        else if (event.key == "a") {
            fall(bodyPartsPos[0]);
            fall(bodyPartsPos[4]);
            fall(bodyPartsPos[6]);

            increase = false;
            increment = true;
            isX = true;

            for (let i = 1; i <= 5; i += 2) {
                bodyPartsPos[i] = collision(bodyPartsPos[i] -= 150,
                    bodyPartsPos[i - 1],
                    bodyPartsPos[i] -= 150, increase);
                setBoundaryPs(150, increment, increase, isX);

                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                LoadObstacles();
                LoadCharacter();
                WebSocketMessages.sendPosition();

                fall(bodyPartsPos[0]);
                fall(bodyPartsPos[4]);
                fall(bodyPartsPos[6]);

            }
            console.log("Head x position: ", bodyPartsPos[1]);

            ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
            LoadObstacles();
            LoadCharacter();
            WebSocketMessages.sendPosition();
        }
    });
}
