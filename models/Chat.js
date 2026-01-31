const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {type: String, required: true,maxlength: 30},
    from : {type: String, required: true},
    to : {type: String, required: true},
    timestamp: { type: Date, default: Date.now , required: true}
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat; // Export the model to use it in other files