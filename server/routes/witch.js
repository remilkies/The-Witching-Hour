//tell them to do something every time the

const express = require('express');
const router = express.Router();
const Witch = require('../models/Witch');
const bcrypt = require('bcrypt'); //for password hashing: npm install bcrypt jsonweb
const jwt = require('jsonwebtoken'); //for token generation

//ADD THE ROUTES HERE
//router.post('/', async (req, res) => {// write method that goeing to extract values from the font end
//     try{

//     const newWitch = new Witch(req.body);
//     const saved = await newWitch.save();

//     res.status(201).json(saved);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }

//     }
// );

router.post('/register', async (req, res) => {// write method that goeing to extract values from the font end
    try{

    const { username, password } = req.body;
    const existingWitch = await Witch.findOne({ username });
    if (existingWitch) {
        return res.status(400).json({ message: 'That name is already claimed by anouther Witch T-T' });
    }

    const salt = await bcrypt.genSalt(10); //THE COST FACTOR (How many times should the cauldren is stirred while throwing random ingredients in it) (the higher the number, the more secure but also the longer it takes to hash-- for development, 10 is a good balance)

// .eg.
// Whitch A registers with with the password "asbovesobelow". The server generates a random salt and puts it in the couldren with the password.

//Whitch B registers with the same password "asbovesobelow". The server generates a different random salt and puts it in the cauldren with the password. Even though they have the same password, their hashed passwords will be different because of the different salts. This makes it much harder for hackers to crack the passwords if they ever get access to the database (God forbid T-T)

const hashedPassword = await bcrypt.hash(password, salt); //the password is thrown into the cauldren and stirred with the salt to create a hashed password

const newWitch = new Witch({
    username: username,
    password: hashedPassword
});

    const savedWitch = await newWitch.save();
    res.status(201).json({ message: "Witch registered successfully",
    witch: savedWitch });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

    }
);



//READ ALL USERS
// router.get('/', async (req, res) => {
//     try{
//         const witches = await Witch.find(); 
//         res.status(200).json(witches);
//     } catch (error) {
//         res.status(500).json({ "YPOU DON DUCKED UP QWEEN": error.message });
//     }
// })

router.post('/login', async (req, res) => {
try{
    const { username, password } = req.body;

    const witch = await Witch.findOne({ username });
    if (!witch) {
        return res.status(404).json({ message: 'Witch not found. Are you an imposter?' });
    }

    const validPassword = await bcrypt.compare(password, witch.password); //compare the password they entered with the hashed password in the database

    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password! The bouncers reject you' });
    }

    //etch ID and username into their secret sacred key
    const token = jwt.sign(
        { _id: witch._id, username: witch.username },
        process.env.JWT_SECRET || "fallback_secret_key",
        { expiresIn: '1h' }
    );

    res.status(200).json({ 
        message: `Witching Hour initiated, Welcome back ${witch.username} `,
        token: token,
        witch: {
            id: witch_id, //so the frontend know the user id >:D
            username: witch.username,
            //aaaand all the stuff that we need to send to the UI to update the stats and quests
            pp: witch.pp, 
            wp: witch.wp, 
            dailyTasks: witch.dailyTasks, 
            completedTasks: witch.completedTasks, 
            hasMidnightElixir: witch.hasMidnightElixir}
     });
} catch (error) {
    res.status(500).json({ "YOU DON DUCKED UP WITCH": error.message });
}
});

//READ ONE USER
router.get('/:id', async (req, res) => {
    try{
        const witch = await Witch.findById(req.params.id); 
        if (!witch) {
            return res.status(404).json({ message: 'Witch not found' });
        }
        res.status(200).json(witch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//put = update the list
router.put('/:id', async (req, res) => {
    try{
        const updatedWitch = await Witch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, //return updated list
                runValidators: true, //rerun schema
            }
        );
        if (!updatedWitch) {
            return res.status(404).json({ message: 'Witch not found' });
        }
        res.status(200).json(updatedWitch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const deletedWitch = await Witch.findByIdAndDelete(req.params.id);
        if (!deletedWitch) {
            return res.status(404).json({ message: 'Witch not found' });
        }
        //confirmation messege
        res.status(200).json({ message: 'Witch deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
module.exports = router;
