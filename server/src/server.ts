import app from './app';
import http from 'http';
const server = http.createServer(app);
import connectSockets from './socket';

// Load enviroment variables
require('dotenv').config();

const PORT: string | number = process.env.PORT || 5000;

connectSockets(server);

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
