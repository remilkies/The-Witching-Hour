// defineing The Grimoire Rules: In MongoDB, these are called Schemas.
// Think of a Schema as a "Cookie Cutter." Since MongoDB is "NoSQL" (it doesn't have strict columns like Excel), it’s very easy to accidentally save messy data. A Schema forces every "User" or "Task" to follow a specific structure so your frontend doesn't break.

const mongoose = require('mongoose');

// The User Schema
// We need to tell the database what a "User" looks like.
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    //store hashed password o7
    password: {
        type: String,
        required: true
    },

    //THEIR WITHING HOUR STATS >:D
    pp: { type: Number, default: 0 },
    wp: { type: Number, default: 0 },

    //DAILY QUESTS AND WHAT'S FINISHED >:D
    dailyTasks: [String],
    completedTasks: [String],

    //MIDNIGHT REST TRAP HEH
    lastLoginDate: { type: String, default: new Date().toDateString() }

    //MIDNIGHT ELIXER
    hasMidnightElixir: { type: Boolean, default: true },
    elixirUsedDate: { type: String, default: ""},
});

module.exports = mongoose.model('User', UserSchema);