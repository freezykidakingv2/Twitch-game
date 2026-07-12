const wsUri = "ws://127.0.0.1/";
const websocket = new WebSocket(wsUri);
function initializeWebSocketListeners(websocket) { 
    websocket.addEventListener("open", () => {
        log("CONNECTED");
        pingInterval = setInterval(() => {
            log(`SENT: ping: ${counter}`);
            websocket.send("ping");
        }, 1000);
    });
    
    websocket.addEventListener("error", (e) => {
        log(`ERROR`);
    });
    
    const message = {
        iteration: counter,
        content: "ping",
    };
    websocket.send(JSON.stringify(message));
    
    
    websocket.addEventListener("message", (e) => {
        const message = JSON.parse(e.data);
        log(`RECIEVED: ${e.data}: ${counter}`);
        counter++;
    });
    
    websocket.addEventListener("close", (e) => {
        log("DISCONNECTED");
        clearInterval(pingInterval);
    
    });
    
    window.addEventListener("pagehide", () => {
        if (websocket) {
            log("CLOSING");
            websocket.close;
            websocket = null;
            window.clearInterval(pingInterval);
        }
    });
}

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        log("CLOSING");
        websocket = new WebSocket(wsuri);
        initializeWebSocketListeners(websocket);
    }
});

log("OPENING");
websocket = new WebSocket(wsUri);
initializeWebSocketListeners(websocket);