//The individual rooms wihtin the realm
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

// ====================================
// 1. THE REGISTRATION SPELL (create)
// ====================================

router.post('/register', async (req, res) => {// write method that goeing to extract values from the font end
    try{

    const { username, password } = req.body; //extracr username and password from the frontend
    const existingWitch = await Witch.findOne({ username });
    if (existingWitch) {
        //look into the crystal ball (database) to see if the username is taken
        return res.status(400).json({ message: 'That name is already claimed by anouther Witch T-T' });
    }

    //Genertae salt (some random ahh characters) to mix with the password
    const salt = await bcrypt.genSalt(10); //THE COST FACTOR (How many times should the cauldren is stirred while throwing random ingredients in it) (the higher the number, the more secure but also the longer it takes to hash-- for development, 10 is a good balance)

// .eg.
// Whitch A registers with with the password "asbovesobelow". The server generates a random salt and puts it in the couldren with the password.

//Whitch B registers with the same password "asbovesobelow". The server generates a different random salt and puts it in the cauldren with the password. Even though they have the same password, their hashed passwords will be different because of the different salts. This makes it much harder for hackers to crack the passwords if they ever get access to the database (God forbid T-T)

const hashedPassword = await bcrypt.hash(password, salt); //the password is thrown into the cauldren and stirred with the salt to create a hashed password

//create a brand new Witch object using the schema :D
const newWitch = new Witch({
    username: username,
    password: hashedPassword, // SAVED THE NEW SALTED POTION, NEVER THE RAW INGRIDIENTS
    pp: 0,
    wp: 0,
    achievements: [
        
            {
                title: "Crypt Keeper of the Token",
                description: "Successfully implemented secure JWT and bcrypt authentication potections.",
                longDescription: "The shadows themselves cannot pierce this encryption. By stirring bcrypt salts into the database cauldron and sealing sessions with custom JSON Web Tokens, the sanctum remains safe from rogue elements.",
                iconUrl: "/badges/crypt-keeper.png", //maps to public folder
                dateEarned: new Date()
            },
            {
                
                    title: "Coven Initiate",
                    description: "Signed the Grimoire and offically joined the coven.",
                    longDescription: "By making an account, you have shown your commitment to the craft. The Grimoire recognizes your potential and welcomes you into the coven with open arms.",
                    iconUrl: "/badges/default-badge.png", //maps to public folder
                    dateEarned: new Date()
                
            }
        
    ]
});

//permenantly save this new witch in to MongoDB so the database can foresee their login
    await newWitch.save();

    res.status(201).json({ 
        message: "Witch registered successfully",
        witch: newWitch });

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



// ===================================
// 2. THE LOGIN SPELL (AUTHENTICATE)
// ===================================
router.post('/login', async (req, res) => {
try{
    const { username, password } = req.body;

    //find the witch in the crystal ball (database :P)
    const witch = await Witch.findOne({ username });
    if (!witch) {
        return res.status(404).json({ message: 'Witch not found. Are you an imposter?' });
    }

    //compare the raw password with the potion connected to their witch._id
    const validPassword = await bcrypt.compare(password, witch.password); //compare the password they entered with the hashed password in the database

    if (!validPassword) {

        return res.status(401).json({ message: 'Invalid password! The bouncers reject you' });
    }

    // ? in case a witch has no achievements array yet >:D
const hasSanctumBadge = witch.achievements?.some(badge => badge.title === "Sanctum Walker");

let updatedWitch = witch;

if (!hasSanctumBadge) {
    updatedWitch = await Witch.findByIdAndUpdate(
        witch._id,
        {
            $addToSet:{ //NO DUPLICATES
                achievements: {
                    $each: [ //IN CASE THEY LOGIN MULTIPLE TIMES BEFORE THE FRONTEND CAN UPDATE THEIR ACHIEVEMENTS, WE DONT WANT TO GIVE THEM MULTIPLE CRYPT KEEPER BADGES >:D
                        {
                    title: "Sanctum Walker",
                    description: "Successfully entered the Inner Sanctum.",
                    longDescription: "This place is sacred and so are the people that enter, treat yourself with care and the coven shall reward you with peace.",
                    iconUrl: "/badges/entrance-badge.png", //maps to public folder
                    dateEarned: new Date()
                        },
                    {
                        title: "Sentinal of the Sanctum",
                        description: "Successfully navigated the treacherous path to the Inner Sanctum.",
                        longDescription: "The path to the Inner Sanctum is filled with trials and challenges, but you have proven your worth by navigating it successfully. The coven recognizes your determination and resilience.",
                        iconUrl: "/badges/path-badge.png", //maps to public folder
                        dateEarned: new Date()
                    }
                    ]
                }
            }
        },
        { new: true} //reaturn freashy modified doc
    );
}
    //etch ID and username into their secret sacred key
    const token = jwt.sign(
        { _id: witch._id, username: witch.username },
        process.env.JWT_SECRET || "fallback_secret_key",
        { expiresIn: '1h' }
    );


    res.status(200).json({  //can only send one response per request
        message: `Witching Hour initiated, Welcome back ${updatedWitch.username} `,
        token: token,
        witch: {
            id: updatedWitch._id, //so the frontend know the user id >:D
            username: updatedWitch.username,
            //aaaand all the stuff that we need to send to the UI to update the stats and quests
            pp: updatedWitch.pp, 
            wp: updatedWitch.wp, 
            dailyTasks: updatedWitch.dailyTasks, 
            completedTasks: updatedWitch.completedTasks, 
            hasMidnightElixir: updatedWitch.hasMidnightElixir,
            achievements: updatedWitch.achievements
}
});

} catch (error) {
    res.status(500).json({ message: `YOU DON DUCKED UP WITCH: ${error.message}` });
}
});

// ========================================
// 3. THE AUTO-SAVE-SPELL (UPDATE PROGESS)
// ========================================

router.put('/save-progress', async (req, res) => {

    try {

        //umpack front end payload
        const {username, pp, wp, completedTasks, hasMidnightElixir} = req.body;

        //find the witch by their coven name and update their stats
        const updatedWitch = await Witch.findOneAndUpdate(
            { username: username },
            {
                pp: pp,
                wp: wp,
                completedTasks: completedTasks,
            },
            { new: true } //tells Mongo to gGIVE ME BACK MY FREASHLY UPDATED DATA 
        );

        //if the witch vanished, tell the frontend
        if (!updatedwitch) {
            return res.status(404).json({ message: 'Witch not found in the Oracle! Did you vanish?' });
        }

        //SUCCESS! LET THE ANOUNCE TO THE MASSES AND LET IT BE KNOWN THAT THE DRAWBRIDGE WAS CROSSED
        res.status(200).json({
            message: `Progress saved for ${updatedWitch.username}. The coven is proud of your dedication!`,
            witch: updatedWitch
        });
    } catch (error) {
        res.status(500).json({ message: `The Oracle told to beware: ${error.message}` });
    }
})
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
