const wsUri = "ws://127.0.0.1/";
let websocket = new WebSocket(wsUri);
let counter = 0;
let pingInterval;
import { bodyPartsPos } from "./BodyPartPositions.js";

function initializeWebSocketListeners(websocket) { 
    websocket.addEventListener("open", () => {
        console.log("CONNECTED");

        const message = {
            iteration: counter,
            content: "ping",
        };
        websocket.send(JSON.stringify(message));

        pingInterval = setInterval(() => {
            console.log(`SENT: ping: ${counter}`);
            websocket.send("ping");
        }, 1000);
    });
    
    websocket.addEventListener("error", (e) => {
        console.log(`ERROR`);
    });
    
    websocket.addEventListener("message", (e) => {
        const message = JSON.parse(e.data);
        console.log(`RECIEVED: ${e.data}: ${counter}`);
        counter++;
    });
    
    websocket.addEventListener("close", (e) => {
        console.log("DISCONNECTED");
        clearInterval(pingInterval);
    
    });
    
    window.addEventListener("pagehide", () => {
        if (websocket) {
            console.log("CLOSING");
            websocket.close();
            websocket = null;
            window.clearInterval(pingInterval);
        }
    });
}

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        console.log("CLOSING");
        websocket = new WebSocket(wsUri);
        initializeWebSocketListeners(websocket);
    }
});

console.log("OPENING");
websocket = new WebSocket(wsUri);
initializeWebSocketListeners(websocket);

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
    console.log("Connected to server");
};

export class WebSocketMessages {
    static {
        WebSocketMessages.test = "test";
    }

    static testing() {
        console.log(WebSocketMessages.test);
    }

    static sendPosition() {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
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

socket.onmessage = (event) => {

    if (event.data == null) {
        console.log("Empty message received");
        return;
    }
    else {

        let player = JSON.parse(event.data);
    }

    bodyPartsPos[1] = player.x;
    bodyPartsPos[0] = player.y;
    bodyPartsPos[2] = player.rotation;
    bodyPartsPos[5] = player.bx;
    bodyPartsPos[6] = player.by;
    bodyPartsPos[3] = player.lx;
    bodyPartsPos[4] = player.ly;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    LoadObstacles();
    LoadCharacter(bodyPartsPos[0], bodyPartsPos[1], bodyPartsPos[5],
        bodyPartsPos[6], bodyPartsPos[3], bodyPartsPos[4]);
    imageData = ctx.getImageData(0, 1080, 1920, 1080);
};
