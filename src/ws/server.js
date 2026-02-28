
import {WebSocketServer, WebSocket} from "ws";

function sendJson(socket,msg) {
    if(socket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify(msg));
    }
    else{
        return;
    }
}
function broadcast(wss,msg) {
    for( const client of wss.clients ){
        if( client.readyState !== WebSocket.OPEN ){
            continue;
        }
        client.send(JSON.stringify(msg));
    }
}

export function sendWebsocket(server) {
    const wss = new WebSocketServer({
        server,
        path:'/ws',
        maxPayload: 1024 * 1024,
    });


    wss.on('connection', (ws) => {
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        })
        sendJson(ws,{type: 'welcome'});
        ws.on('error', console.error);
    });
    const interval = setInterval(() => {
        wss.clients.forEach((client) => {
            if(client.isAlive===false){
                return client.terminate();
            }
            client.isAlive = false;
            client.ping();
        })
    },30000);
    wss.on('close', () => {
        clearInterval(interval);
    })
    function broadcastMatchCreated(match) {
        broadcast(wss,{type: 'match_created',data: match});
    }
    return {broadcastMatchCreated};
}