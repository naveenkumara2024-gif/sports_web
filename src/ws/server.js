
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
            return;
        }
        client.send(JSON.stringify(msg));
    }
}

export function sendWebsocket(server) {
    const wss = new WebSocketServer({
        server,
        path:'/ws',
        maxRetries: 1024 * 1024,
    });
    wss.on('connection', (ws) => {
        sendJson(ws,{type: 'welcome'});
        ws.on('error', console.error);
    });
    function broadcastMatchCreated(match) {
        broadcast(wss,{type: 'match_created',data: match});
    }
    return {broadcastMatchCreated};
}