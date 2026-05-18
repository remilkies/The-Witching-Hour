// defineing The Grimoire Rules: In MongoDB, these are called Schemas.
// Think of a Schema as a "Cookie Cutter." Since MongoDB is "NoSQL" (it doesn't have strict columns like Excel), it’s very easy to accidentally save messy data. A Schema forces every "User" or "Task" to follow a specific structure so your frontend doesn't break.

const mongoose = require('mongoose');
const router = require('../routes/witch');

// The User Schema
// We need to tell the database what a "User" looks like.
const Witch = new mongoose.Schema({

    //authentication TECHNICALLY only requires one unique identifier ( username) and one secret (password). So TECHNICALLY no email necessary :D
    username: {
        type: String,
        required: true,
        unique: true //NO TWO WITCHES CAN HAVE THE SAME NAME, BE YOUR OWN PERSON >:D
    },

    // store hashed password o7
    password: {
        type: String,
        required: true
    },

    questLog: {
        type: String,
        required: false,
    },
    // WITHING HOUR STATS >:D
    pp: { type: Number, default: 0 },
    wp: { type: Number, default: 0 },

    //DAILY QUESTS AND WHAT'S FINISHED >:D
    dailyTasks: [String],
    completedTasks: [String],

    //MIDNIGHT REST TRAP HEH
    lastLoginDate: { type: String, default: new Date().toDateString() },

    //MIDNIGHT ELIXER (incase they want to cheat (they being me) and drink it multiple times a day, we need to track when they last drank it)
    hasMidnightElixir: { type: Boolean, default: true },
    elixirUsedDate: { type: String, default: ""},
});


module.exports = mongoose.model('User', Witch);