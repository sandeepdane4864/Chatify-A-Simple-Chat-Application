const express = require('express');
const app = express();
const port = 8080;

const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const http = require('http');

const Chat = require('./models/chat');

// SERVER + SOCKET
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// DATABASE
mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// ROUTES
app.get('/chats', async (req, res) => {
    const chats = await Chat.find({});
    res.render('index', { chats });
});

app.get('/chats/new', (req, res) => {
    res.render('new');
});

app.post('/chats', async (req, res) => {
    const chat = new Chat({
        ...req.body,
        timestamp: new Date()
    });

    await chat.save();
    io.emit("receive-message", chat); // realtime
    res.redirect('/chats');
});

app.get('/chats/:id/edit', async (req, res) => {
    const chat = await Chat.findById(req.params.id);
    res.render('edit', { chat });
});

app.put('/chats/:id', async (req, res) => {
    await Chat.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/chats');
});

app.delete('/chats/:id', async (req, res) => {
    await Chat.findByIdAndDelete(req.params.id);
    res.redirect('/chats');
});

// SOCKET
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
});

// START
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/chats`);
});
