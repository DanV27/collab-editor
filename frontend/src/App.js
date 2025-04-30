import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create socket OUTSIDE component to persist across re-renders
const socket = io('http://localhost:5002', {
    transports: ['polling'], // You can test removing this after
    withCredentials: true
});


function App() {
    const [content, setContent] = useState('');
    const docId = 'doc1';

    useEffect(() => {
      console.log("Attempting to connect to WebSocket...");
  
      socket.on('connect', () => {
          console.log("✅ WebSocket connected! Socket ID:", socket.id);
          socket.emit('joinDoc', docId);
          console.log("➡️ Emitted joinDoc for:", docId);
      });
  
      socket.on('connect_error', (err) => {
          console.error("❌ Connection failed:", err.message);
      });
  
      socket.on('loadDoc', (doc) => {
          console.log("📄 Loaded document from server:", doc);
          setContent(doc.content);
      });
  
      socket.on('receiveChanges', (newContent) => {
          console.log("🔄 Received changes from other client:", newContent);
          setContent(newContent);
      });
  
      return () => {
          // Remove disconnect for now
          // console.log("🚪 Disconnecting socket...");
          // socket.disconnect();
      };
  }, []);
  
  

    const handleChange = (e) => {
        const newValue = e.target.value;
        setContent(newValue);
        socket.emit('editDoc', newValue);
        console.log("Emitted editDoc with:", newValue);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Real-Time Collaborative Editor</h1>
            <textarea
                value={content}
                onChange={handleChange}
                rows={20}
                cols={80}
                style={{ fontSize: "16px", width: "100%" }}
            />
        </div>
    );
}

export default App;
