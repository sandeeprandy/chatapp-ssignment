// App.js

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Connect to the server and listen for events
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('updateUsers', (userList) => {
      setUsers(userList);
    });

    socket.on('chatHistory', (chatHistory) => {
      setMessages(chatHistory);
    });

    return () => {
      // Clean up on component unmount
      socket.disconnect();
    };
  }, []);

  const authenticateUser = () => {
    const username = prompt('Enter your username:');
    socket.emit('authenticate', username);
  };

  const sendMessage = () => {
    const user = 'You';
    const content = messageInput;

    socket.emit('message', { userId: user, content });
    setMessageInput('');
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <div className="user-list">
          <h3>Users Online</h3>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>
        <div className="chat-window">
          <div className="message-list">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <strong>{message.user}:</strong> {message.content}
              </div>
            ))}
          </div>
          <div className="input-section">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
      <button onClick={authenticateUser}>Authenticate</button> 
      
    </div>
  );
}

export default App;
