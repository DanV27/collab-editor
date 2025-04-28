const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

let documents = {
    "doc1": { content: "Start writing here..." }
};

app.get('/', (req, res) => {
    res.send('Real-Time Collaboration Backend');
});

// WebSocket logic here!
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinDoc', (docId) => {
        console.log(`Client joined document: ${docId}`);
        socket.join(docId);

        if (!documents[docId]) {
            documents[docId] = { content: "" };
        }
        console.log(`Sending document content: ${documents[docId].content}`);

        socket.emit('loadDoc', documents[docId]);

        socket.on('editDoc', (data) => {
            console.log(`Received edit: ${data}`);
            documents[docId].content = data;
            socket.to(docId).emit('receiveChanges', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
});

server.listen(5002, () => {
    console.log('Server running on http://localhost:5002');
});
