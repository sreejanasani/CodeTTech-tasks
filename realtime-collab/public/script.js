const socket = io();

const editor = document.getElementById("editor");
const docTitle = document.getElementById("docTitle");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

const saveStatus = document.getElementById("saveStatus");
const lastSaved = document.getElementById("lastSaved");

// Load document from DB
socket.on("load-document", (data) => {
  editor.value = data.content;
  docTitle.value = data.title;
});

// Receive live changes
socket.on("receive-changes", (data) => {
  editor.value = data.content;
  docTitle.value = data.title;
});

// When typing (real-time sync)
editor.addEventListener("input", () => {
  saveStatus.textContent = "Unsaved Changes";
  saveStatus.style.color = "red";

  socket.emit("send-changes", {
    title: docTitle.value,
    content: editor.value
  });
});

// Title change sync
docTitle.addEventListener("input", () => {
  saveStatus.textContent = "Unsaved Changes";
  saveStatus.style.color = "red";

  socket.emit("send-changes", {
    title: docTitle.value,
    content: editor.value
  });
});

// Save button (manual save)
saveBtn.addEventListener("click", () => {
  socket.emit("save-document", {
    title: docTitle.value,
    content: editor.value
  });
});

// Clear button
clearBtn.addEventListener("click", () => {
  editor.value = "";
  socket.emit("send-changes", {
    title: docTitle.value,
    content: editor.value
  });
});

// When saved successfully
socket.on("document-saved", () => {
  saveStatus.textContent = "Saved ✅";
  saveStatus.style.color = "green";

  const now = new Date();
  lastSaved.textContent = now.toLocaleTimeString();
});