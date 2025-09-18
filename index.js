const express  = require('express');
const app = express();
const port = 8080;
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method')); // Middleware to support PUT and DELETE methods via query parameter

const mongoose = require('mongoose');
const Chat = require('./models/chat'); // Import the Chat model

app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
};

main()
    .then(console.log("connection is Successful with db"))
    .catch(err => console.log("error in mongoose db connection", err));
// show all chats
app.get('/chats', async (req, res) => { //async function to handle the async request
    let chats = await Chat.find({}); // Fetch all chat messages from the database
    res.render('index.ejs', { chats }); // Render the 'index' view and pass the chat messages
});
//new chat form route
app.get('/chats/new', (req, res) => {
    res.render('new.ejs');
});
//post new chat
app.post('/chats',(req, res)=>{
    let {from, to , message} = req.body;
    let newchat = new Chat({
        from : from,
        to : to,
        message : message,
        timestamp : new Date()
    });
    newchat.save()
    .then(()=>{
        res.redirect('/chats');
        console.log("chat created and saved successfully");
    })
    .catch((err)=>{
        console.log("error in saving chat", err);
        res.redirect('/chats/new');
    });
});
//edit chat route
app.get('/chats/:id/edit', async (req, res) => {
    const { id } = req.params;
    let chat = await Chat.findById(id);
    res.render('edit.ejs', { chat });
});
// update chat route
app.put('/chats/:id', async (req, res) => {
    const { id } = req.params;
    const {message : newmsg} = req.body;
    let chat = await Chat.findByIdAndUpdate(id, { message: newmsg }, { new: true });
    console.log(chat, "chat updated successfully");
    res.redirect('/chats');
});

//delete chat route post but we will write delete
app.delete("/chats/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const delpost = await Chat.findByIdAndDelete(id);
        if (!delpost) {
            console.log("No chat found with ID:", id);
            return res.status(404).send("Chat not found");
        }
        console.log("Chat Deleted Successfully:", delpost);
        res.redirect("/chats");
    } catch (err) {
        console.error("rror deleting chat:", err);
        res.status(500).send("Server error");
    }
});


//start the server  

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});





