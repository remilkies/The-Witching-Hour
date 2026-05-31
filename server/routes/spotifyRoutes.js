
// GATHER BASIC POSTIONS - the set up phase

const express = require('express'); //express helps us make web routes, querystring helps us formta text nicely for URLs
const router = express.Router();
const querystring = require('querystring');


// ..Grab the spotify sacred keys from env
const Client_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// ========================================
//  ROUTE 1: TRIGGER THE PORTAL TO SPOTIFY
// =========================================

router.get('/login', (req, res) => {
 console.log("🔮 [Spotify Auth] 1. Initiating login ritual...");

    const scopes = [ //BASICALLY WRITING A PERMISSION SLIP "Dear Spotify, please let me read the current song, cheak if it's paused and let me skip.play tracks. Pwetty pwetty pwease <3"
        'user-read-currently-playing',
        'user-read-playback-state',
        'user-modify-playback-state'
    ].join(' ');

    console.log("🔮 [Spotify Auth] 2. Requested scopes:", scopes);
    console.log("🔮 [Spotify Auth] 3> Opening poratl to Spotify's server...");

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: Client_ID,
            scope: scopes,
            redirect_uri: REDIRECT_URI,
            show_dialog: true  //forces the portal to ask for permissions every time, even if the user has already granted them, which is useful for testing and development
        })
    );
});


// ==================================================
// ROUTE 2: HANDLE THE RETURN CALLBACK FROM SPOTIFY
// ===================================================

router.get('/callback', async (req, res) => { //Spotify accpeted the login and teleported you to this specific doorway

    console.log("🔮 [Spotify Auth] 4. Callback endpoint hit! Welcome back from the portal!")
    const code = req.query.code || null; //spotfiy hands us a temp, one-time use secret password (code) right when we walked through the door and we GRB IT AND RUN AWAY

    if (!code) {
        console.log("☠️  [Spotify Auth] ERROR: No code retuned from Spotify (meanie)");
        return res.status(400).json({error: "The Soptify Council refused to grant a code."})
    }

    console.log("🔮 [Spotify Auth] 5. Seceret code aquired! Trading it for permanent tokens now...")

    try {
        //exchange temp code for permission tokens
        const response = await fetch('https://accounts.spotify.com/api/token', { //Turn around and know on the door and say "hey spotify, rember that thing you gave me like 1 second ago/?"
            method: 'POST', //spotify only accepts post requests for this endpoint
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(Client_ID + ':' + CLIENT_SECRET).toString('base64')
            },
            body: querystring.stringify({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code' //plus my secret master password AND GIVE ME PERMANENT KEYS >:D
            })
        });

        console.log("🔮 [Spotify Auth] 6> Fetch request sent. Awaiting High Council response...");

        const data = await response.json(); //SPOTIFY HANDS OVER A LOCKED BOX FOR OUR ACCESS TOKEN (USED TO PLAY MUSIC FOR THE NEXT HOUR) AND REFREASH_TOKEN (USED TO GET A NEW ACCESS TOKEN TOMORROW WITHOUT LOGGING IN AGAIN)

        if (!response.ok) {
            console.error("☠️  [Spotify Auth] ERROR from Spotify:", data);
            throw new Error(data.error_description || 'Token exchange failed');
        }

        // SUCESS, WELCOME TO THE RHYTHM KITCHEN :D
        const { access_token, refresh_token, expires_in } = data;

        console.log("🎵 [Spotify Auth] 7. Welcome to Rhythm Kitchen! Token acquired.");
        console.log("🎵 [Spotify Auth] 8. Teleporting witch back to the Sanctum...");

        // for my own ✨personal use✨, i'm gonna redirect back to my React App dashboard >:D
        // res.redirect(`http://localhost:5173/sanctum?spotify_token=${access_token}&spotify_refresh=${refresh_token}`); //ALWAYS CHEAK WHAT PORT REACT/FRONT END IS RUNNING ON IN CONSOLE

        // NEW SPELL FOR DEEP-LINKING (whatever that it :P - LET'S LEARN ): Redirect to your custom app protocol instead of localhost!
            res.redirect(`witchinghour://sanctum?spotify_token=${access_token}&spotify_refresh=${refresh_token}`)
    } catch(error) {
        console.error("☠️ Spotify Setup Error:", error);
        res.status(500).send("☠️  The ritual has been interrupted: " + error.message);
    }
    
});

// ====================================
//  3. ROUTE 3: THE RESSURECTION SPELL
// ====================================

router.get('/refresh_token', async (req, res) => { //This is the secret spell that lets us get a new access token without having to go through the whole login process again
    console.log("🔮 [Spotify Auth] The access token died! Attempting to revive it...");
    const refresh_token = req.query.refresh_token;

    if (!refresh_token) {
        console.log("☠️  [Spotify Auth] ERROR: No refresh token provided for resurrection spell.");
        return res.status(400).json({error: "No refresh token provided."});
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(Client_ID + ':' + CLIENT_SECRET).toString('base64')
            },
            body: querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("☠️  [Spotify Auth] ERROR from Spotify during ressurection", data);
            throw new Error(data.error_description || 'Token refresh failed');
        }

        console.log("🎵 [Spotify Auth] Resurrection successful! New access token acquired.");

        res.json({
            access_token: data.access_token,
            //somtimes spotify grants a new refresh token but sometimes not soooo if they dont we use the OG one o7
            refresh_token: data.refresh_token || refresh_token
        });
    } catch (error) {
        console.error("☠️ [Spotify Auth] Resurrection spell failed:", error);
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
