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
const PORT = process.env.PORT || 5000;

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

//SERVER START >:D
app.listen(PORT, () => {
    console.log(`🔮 Server summond successfully on http://localhost:${PORT}`);
});