require('dotenv').config();

// const express = require('cors'): This is like trying to build a house using the "No Trespassing" sign as the foundation. You need the actual express library to build the server structure.
const express = require('express');//fixed
const cors = require('cors');
const { default: mongoose } = require('mongoose');// npm install mongoose

// THE DEV DEBUG PROTOCOL
console.log("Cheaking the sacred keys...");
console.log("Is MONGO_URI present?", !!process.env.MONGO_URI)

//initialise the express app
const app = express();
const PORT = process.env.PORT || 5001;

//THE BOUNCERS
app.use(cors()); //allows react to talk to this server
app.use(express.json()); //allows the server to read incoming json data

const sacredKey = process.env.MONGO_URI; //LOCAL CONSTANT CAUSE I'M TIRED OF BEING GASLIT BY MY CONSOLE

console.log("--- Connection Ritual Starting ---");
console.log("Sacred Key detected:", sacredKey ? "YIP YIP (String length: " + sacredKey.length + ")" : "NIPE (undefined)");

if (!sacredKey){
    console.error("💀 ERROR: The MONGO_URI is missing from your .env file");
    process.exit(1); //kills the serever immidietly so i only get my heart broken by errors once T-T
} 

//DATABASE CONNECTION
mongoose.connect(sacredKey)
    .then(() => console.log("🏰 Connected to the Cloud Domain (MongoDB)"))
    .catch((err) => console.error("💀 Database connection failed:", err))

//PULSE CHEAK >:D
//when the browser visits the url, the server sends back json response
app.get('/api/health', (req, res) => {
    res.json({messege: "The Bouncers are ready to bounce"});
});

const User = require('./models/User'); //Importing the user cookie cutter(blueprint) (node and js speak the same language so you don't need the extention ".js" to introduce them <33)

//THE SAVE PROGRESS PORTAL 
app.post('/api/save-progress', async (req, res) => {
    console.log("🔔 Ding Dong! Someone is at the door!");
    console.log("Request Body:", req.body);
    try{
        const { email, pp, wp, completedTasks } = req.body;

        //find user by email and update stats
        //{ upsert: true } means "If they dont exist, create them o7"
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { pp, wp, completedTasks },
            { new: true, upsert: true }
        );

        res.json({ message: "✨Progress synced to the Cloud Domain✨", user: updatedUser });
    } catch (err) {
        res.status(500).json({message: "💀 The save spell failed", error: err.message})
    }
})

//SERVER START >:D
app.listen(PORT, () => {
    console.log(`🔮 Server summond successfully on http://localhost:${PORT}`);
});