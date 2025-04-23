// Connect to the Socket.IO server running at localhost on port 3000
const socket = io('http://localhost:3000');

// Select the message container, form, and input field from the DOM
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

// Prompt the user for their name when they join the chat
const name = prompt('What is your name?');

// Display a message indicating that the user has joined
appendMessage('You joined');

// Notify the server about the new user
socket.emit('new-user', name);

// Listen for incoming chat messages from other users
socket.on('chat-message', data => {
  // Display the message with the sender's name and timestamp (if provided)
  appendMessage(`${data.time || getTime()} - ${data.name}: ${data.message}`);
});

// Listen for notification when a new user connects
socket.on('user-connected', name => {
  appendMessage(`${getTime()} - ${name} connected`);
});

// Listen for notification when a user disconnects
socket.on('user-disconnected', name => {
  appendMessage(`${getTime()} - ${name} disconnected`);
});

// Handle form submission (when the user sends a message)
messageForm.addEventListener('submit', e => {
  e.preventDefault(); // Prevent the form from refreshing the page
  const message = messageInput.value; // Get the input value
  appendMessage(`${getTime()} - You: ${message}`); // Display the message in the chat
  socket.emit('send-chat-message', message); // Send the message to the server
  messageInput.value = ''; // Clear the input field
});

// Function to add a message element to the message container
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

// Function to get the current time formatted as "hh:mm AM/PM"
function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
