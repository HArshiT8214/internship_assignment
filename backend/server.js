require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/internship_assignment';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Attach io to app for access in controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
});

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
