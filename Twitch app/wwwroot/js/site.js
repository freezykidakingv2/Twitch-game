import { WebSocketMessages } from "./WebSocket.js";
import { bodyPartsPos } from "./BodyPartPositions.js";
import { LoadCharacter, LoadObstacles, ctx, boundaryX, boundaryY, setBoundaryPs } from "./Drawings.js";

LoadObstacles();
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
let pixel = imageData.data;
export let increment = false;
let blockColour = 0;
let increase = false;

export function run () {

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

            console.log("Decreasing: ", Yposition);
            ctx.clearRect(0, 0, 1920, 1080);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
            WebSocketMessages.sendPosition();
        }
    }

    fall(bodyPartsPos[0]);
    fall(bodyPartsPos[4]);
    fall(bodyPartsPos[6]);

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

    fall(bodyPartsPos[0]);
    fall(bodyPartsPos[4]);
    fall(bodyPartsPos[6]);

    var count = 0;

    document.addEventListener("keydown", (event) => {
        if (event.key == " ") {
            for (let i = 5; i <= 350; i) {
                bodyPartsPos[0] -= i;
                bodyPartsPos[6] -= i;
                bodyPartsPos[4] -= i;
                boundaryY -= i;

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

            fall(bodyPartsPos[0]);
            fall(bodyPartsPos[4]);
            fall(bodyPartsPos[6]);

            WebSocketMessages.sendPosition();
            count = 0;
            increase = false;
            setTimeout(() => {
                for (let i = 5; i <= 350; i) {
                    bodyPartsPos[0] = collision(bodyPartsPos[1],
                        bodyPartsPos[0] += i,
                        bodyPartsPos[0] += i, increase);

                    bodyPartsPos[6] = collision(bodyPartsPos[6],
                        bodyPartsPos[6] += i,
                        bodyPartsPos[6] += i, increase);

                    bodyPartsPos[4] = collision(bodyPartsPos[3],
                        bodyPartsPos[4] += i,
                        bodyPartsPos[4] += i, increase);

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

                fall(bodyPartsPos[0]);
                fall(bodyPartsPos[4]);
                fall(bodyPartsPos[6]);

                WebSocketMessages.sendPosition();
            }, 1500);
        }
        else if (event.key == "d") {
            increase = false;
            increment = true;

            for (let i = 1; i <= 5; i += 2) {
                bodyPartsPos[i] = collision(bodyPartsPos[i] += 150,
                    bodyPartsPos[i - 1],
                    bodyPartsPos[i] += 150, increase);
                setBoundaryPs(boundaryX, 150, increment, increase);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                LoadObstacles();
                LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                    bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4], boundaryX, boundaryY);

                WebSocketMessages.sendPosition();

                fall(bodyPartsPos[0]);
                fall(bodyPartsPos[4]);
                fall(bodyPartsPos[6]);

                WebSocketMessages.sendPosition();
            }
            console.log("Head x position: ", bodyPartsPos[1]);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4], boundaryX, boundaryY);

            WebSocketMessages.sendPosition();

            fall(bodyPartsPos[0]);
            fall(bodyPartsPos[4]);
            fall(bodyPartsPos[6]);

            WebSocketMessages.sendPosition();
        }
        else if (event.key == "a") {
            increase = true;
            increment = true;
            for (let i = 1; i <= 5; i += 2) {
                bodyPartsPos[i] = collision(bodyPartsPos[i] -= 150,
                    bodyPartsPos[i - 1],
                    bodyPartsPos[i] -= 150, increase);

                setBoundaryPs(boundaryX, 150, increment, increase);
            }
            console.log("Head x position: ", bodyPartsPos[1]);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4], boundaryX, boundaryY);

            WebSocketMessages.sendPosition();

            fall(bodyPartsPos[0]);
            fall(bodyPartsPos[4]);
            fall(bodyPartsPos[6]);

            WebSocketMessages.sendPosition();
        }
    });
}
