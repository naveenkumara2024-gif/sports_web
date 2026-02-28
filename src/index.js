import express from 'express';
import http from 'http';
import {sendWebsocket} from './ws/server.js';
import {MatchRouter} from "./Routes/matches.js";
const app = express();
const PORT = Number(process.env.PORT || 8000);
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
