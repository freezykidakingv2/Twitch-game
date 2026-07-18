let websocket = new WebSocket("ws://localhost:8080");
import { bodyPartsPos } from "./BodyPartPositions.js";
import { LoadCharacter, LoadObstacles, ctx } from "./site.js";

export class WebSocketMessages {
    static sendPosition() {
        if (websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({
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
}

function initializeWebSocketListeners(websocket) {
    websocket.addEventListener("open", () => {
        console.log("CONNECTED");
    });

    websocket.addEventListener("message", (e) => {
        console.log("OBS: Message Recieved");

        if (event.data == null || event.data == " ") {
            console.log("Empty message received: ", event.data);
            return;
        }

        try {

            let player = JSON.parse(event.data);

            bodyPartsPos[1] = player.x;
            bodyPartsPos[0] = player.y;
            bodyPartsPos[2] = player.rotation;
            bodyPartsPos[5] = player.bx;
            bodyPartsPos[6] = player.by;
            bodyPartsPos[3] = player.lx;
            bodyPartsPos[4] = player.ly;

            ctx.clearRect(0, 0, 1920, 1080);
            LoadObstacles();
            LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
                bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
        }
        catch (error) {
            console.log("Not JSON: ", error);
        }
    })

    websocket.addEventListener("close", (e) => {
        console.log("DISCONNECTED");
    
    });
    
    websocket.onerror = (error) => {
        console.log("Error occured: ", error);
    }

    window.addEventListener("pagehide", () => {
        if (websocket) {
            console.log("CLOSING");
            websocket.close();
            websocket = null;
        }
    });
}

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        console.log("CLOSING");
        initializeWebSocketListeners(websocket);
    }
});

console.log("OPENING");
initializeWebSocketListeners(websocket);
