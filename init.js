const mongoose = require('mongoose');
const Chat = require('./models/chat'); // Import the Chat model

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
};

main()
    .then(console.log("connection is Successful with db"))
    .catch(err => console.log("error in mongoose db connection", err));


let allchats = [
    {
        message: "Hii,Prasanna", 
        from: "sandeep", 
        to: "Prasanna",
        timestamp: new Date()
    },
    { message: "Hii,Sandeep", 
        from: "varun", 
        to: "sandeep",
        timestamp: new Date()
    },    
    { message: "How are you?", 
    from: "priya", 
    to: "Pradeep" ,
    timestamp: new Date()
    },
    { message: "I am fine",
    from: "dipak", 
    to: "sandy",
    timestamp: new Date()
    }
]


Chat.insertMany(allchats)
    .then(function(){
        console.log("Data inserted")  // Success    
    })
    .catch(function(error){
        console.log(error)      // Failure
    });
