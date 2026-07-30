let websocket = new WebSocket("ws://localhost:8080");
import { bodyPartsPos } from "./BodyPartPositions.js";
import { LoadCharacter, LoadObstacles, ctx, boundaryX, boundaryY, setBoundaryPs, boundaryH, boundaryW, dead, canvas } from "./Drawings.js";
import { run } from "./site.js";

export class WebSocketMessages {
    static sendPosition() {
        if (websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({
                rotation: bodyPartsPos[2],
                bdryX: boundaryX,
                bdryY: boundaryY,   
                dd: dead
            }));
        }
    }
}

export let ISwebsocketBX = false;

function initializeWebSocketListeners(websocket) {
    websocket.addEventListener("open", () => {
        console.log("CONNECTED");
        run();
    });

    websocket.addEventListener("message", (e) => {
        if (dead == true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        else {
            if (event.data == null || event.data == " ") {
                console.log("Empty message received: ", event.data);
                return;
            }

            try {

                let player = JSON.parse(event.data);



                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);

                setBoundaryPs(player.bdryX, false, false, true);
                setBoundaryPs(player.bdryY, false, false, false);

                ctx.clearRect(boundaryX, boundaryY, boundaryW, boundaryH);
                LoadCharacter();
            }
            catch (error) {
                console.log("Not JSON: ", error);
            }
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
