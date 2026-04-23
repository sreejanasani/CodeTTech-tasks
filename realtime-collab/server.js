const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const PORT = 3000;

// File where document is stored
const DATA_FILE = path.join(__dirname, "document.json");

// Default document
let documentData = {
  title: "Untitled Document",
  content: ""
};

// Load saved document from file (if exists)
if (fs.existsSync(DATA_FILE)) {
  const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
  documentData = JSON.parse(fileContent);
}

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send document to new user
  socket.emit("load-document", documentData);

  // Live sync changes
  socket.on("send-changes", (data) => {
    documentData.title = data.title;
    documentData.content = data.content;

    socket.broadcast.emit("receive-changes", documentData);
  });

  // Manual save (save to file)
  socket.on("save-document", (data) => {
    documentData.title = data.title;
    documentData.content = data.content;

    fs.writeFileSync(DATA_FILE, JSON.stringify(documentData, null, 2));
    io.emit("document-saved");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});