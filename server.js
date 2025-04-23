// Import and initialize Socket.IO on port 3000
const io = require('socket.io')(3000);

// Create an object to store connected users
const users = {};

// Listen for new client connections
io.on('connection', socket => {
  
  // When a new user joins, store their name using their socket ID
  socket.on('new-user', name => {
    users[socket.id] = name;

    // Notify all other clients that a new user has connected
    socket.broadcast.emit('user-connected', name);
  });

  // When a user sends a chat message
  socket.on('send-chat-message', message => {
    // Get the current time as a readable timestamp (e.g. "09:45 AM")
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Broadcast the message to all other users along with the sender's name and timestamp
    socket.broadcast.emit('chat-message', {
      message: message,
      name: users[socket.id],
      time: timestamp
    });
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    // Notify others that the user has left
    socket.broadcast.emit('user-disconnected', users[socket.id]);

    // Remove the user from the users object
    delete users[socket.id];
  });

});
