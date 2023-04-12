import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';
import GameServer from './game/GameServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 8080;

// create a route for the app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.use(express.static(path.resolve('dist')))
app.use(express.static(path.resolve('public')))
app.use('/game', express.static(path.resolve('src/game')))
app.use('/utils', express.static(path.resolve('src/utils')))

// make the server listen to requests
const server = app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});

let gameServer = new GameServer(server);