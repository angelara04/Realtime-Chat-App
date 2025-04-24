// Connect to the Socket.IO server
const socket = io('http://localhost:3000');

// DOM elements
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

// Prompt user for their name and notify server
const name = prompt('What is your name?');
socket.emit('new-user', name);

// Append "You joined" system message for the current user
appendSystemMessage(`${getTime()} - You joined`);

// Receive a chat message from another user
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`, 'received', data.time);
});

// Notify when a user connects to the chat
socket.on('user-connected', name => {
  appendSystemMessage(`${getTime()} - ${name} joined`);
});

// Notify when a user disconnects from the chat
socket.on('user-disconnected', name => {
  appendSystemMessage(`${getTime()} - ${name} disconnected`);
});

// Handle sending a message
messageForm.addEventListener('submit', e => {
  e.preventDefault(); // Prevent form from refreshing the page
  const message = messageInput.value;
  
  // Show the message in your chat window
  appendMessage(`You: ${message}`, 'sent', getTime());
  
  // Send the message to the server
  socket.emit('send-chat-message', message);
  
  // Clear the input box
  messageInput.value = '';
});

// Function to append a chat message to the chat window
function appendMessage(text, type, timestamp) {
  const messageElement = document.createElement('div');
  messageElement.classList.add(type); // 'sent' or 'received'
  messageElement.innerText = text;

  const timestampElement = document.createElement('div');
  timestampElement.classList.add('timestamp');
  timestampElement.innerText = timestamp;

  messageElement.appendChild(timestampElement);
  messageContainer.appendChild(messageElement);
}

// Function to display system messages (user joined/left)
function appendSystemMessage(text) {
  const systemMessage = document.createElement('div');
  systemMessage.classList.add('system-message');
  systemMessage.innerText = text;
  messageContainer.appendChild(systemMessage);
}

// Helper function to get the current time in HH:MM format
function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
