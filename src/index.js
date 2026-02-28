import express from 'express';
import http from 'http';
import {sendWebsocket} from './ws/server.js';
import {MatchRouter} from "./Routes/matches.js";
const app = express();
const DEFAULT_PORT = 8000;
let PORT = Number(process.env.PORT || DEFAULT_PORT);

if (!Number.isSafeInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.warn(`Invalid PORT value: ${process.env.PORT}. Falling back to default: ${DEFAULT_PORT}`);
  PORT = DEFAULT_PORT;
}
const HOST = process.env.HOST || '0.0.0.0';
const server = http.createServer(app);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.use('/Matches',MatchRouter);
const {broadcastMatchCreated}= sendWebsocket(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
server.listen(PORT,HOST, () => {
  const baseurl = HOST==='0.0.0.0'?`http://localhost:${PORT}`:`http://${HOST}:${PORT}`;
  console.log(`Server is running on ${baseurl}`);
  console.log(`Websocket server is running on ${baseurl.replace('http','ws')}/ws`);
});
