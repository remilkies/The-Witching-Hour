
# 🌙 The Witching Hour

> A witchy, lo-fi productivity and survival tool for developers who forget how to be human.

Welcome to **The Witching Hour**. This is a gamified, slightly aggressive, and highly personalized study room built to keep you on track, keep you hydrated, and stop you from berating your console for a syntax error that was 100% caused by dehydration. 

**📜 The Backstory:** Technically, I'm on holiday and supposed to be resting. But my lecturer (shoutout Tsungai, I know you're reading this somewhere) is going to have to pry GitHub Desktop from my cold, dead hands. I absolutely suck at *not* working, so I'm ironically spending my time off coding an app to forcefully stop me from coding for days at a time and forgetting that I belong to a society.

**⚠️ Disclaimer:** This is me learning how to use TypeScript, so the code contains a lot of necessary (and completely unnecessary) comments for my own sanity— and for you to enjoy <3

Crawl out of the darkness of your domain, complete your tasks, and let the dopamine (and the confetti) flow. >:D

## ✨ Features
* **🛡️ The Witching Hour Trial (Creative Authentication):** No boring login forms here. To enter the Inner Sanctum, you must prove your humanity by timing a fast-moving, randomized mechanical clock hand. Miss the target hour? The bouncers reject your spell. Pass the ritual? You get a secure, token-based session.
* **📝 The Dopamine Machine:** A to-do list that doesn't just cross things off—it throws confetti and plays a little victory tune because you deserve it, and a little progress bar to keep track of the amazing work you've done <3
* **⏳ The Time Lord:** Set your project timers. *Note: You cannot work for more than 45 minutes straight. The app will literally yell at you with a giant pop-up to go touch grass (or at least your living room carpet).*
* **💧 Survival Toggles:** Automated, non-negotiable wellness reminders
* **🔮 Rhythm Realm Portal:** Click the radio to connect your Spotify account straight to the Inner Sanctum. This remote-control portal continuously polls the music leylines, broadcasts popup toasts when a new track starts brewing, and effortlessly resurrects dead access tokens right in the background so the rhythm never stops. >:D (Design inspired by Hazbin Hotel <3)

  
* **🛑 Aggressive Wellness Timer & Economy**
* **Gamified Pomodoro:** Work for 45 minutes, then get locked out of your task list for a mandatory 15-minute break. No cheating!
* **Productivity Points (PP):** Earn a base reward of 45 PP just for surviving a continuous focus session.
* **IRL Side-Quests (WP):** While locked in the break modal, earn a base reward of 15 WP for taking that 15-minute break, complete optional real-world tasks (like drinking water, resting your eyes, or stretching your goblin spine) to earn bonus Wellness Points!
* **Dynamic Payouts:** Claim your well-earned PP and WP when the break timer hits zero to unlock your screen and get back to the grind.
  
## Coming Soon 
* **🔮 The Vibe Check (Ambient Audio):** * Click the glowing purple fireplace for crackling fire sounds.
  * Click the gothic window for soothing rain ambiance.
  * **🐈‍⬛ Mem Mem:** KET. Their name is Mem.  Mem doesn't technically *do* anything, but he's adorable and deserves an honourable mention.
    
    ## 🌙 How the Creative Authentication Works
1. **The Threshold:** The user submits their unique username and secret passphrase.
2. **The Password Validation:** The backend pulls the account record, verifies the credentials using `bcrypt.compare()`, and signs a temporary JSON Web Token (JWT).
3. **The Witching Hour Trial:** Instead of instantly granting access, the frontend locks into "Ritual Mode." A randomized target hour is assigned, and a mechanical clock hand begins sweeping forward at high speed.
4. **Verification:** The user must hit "VERIFY" precisely when the hand aligns with the target hour (within a narrow margin of error). Success grants entry to the Inner Sanctum; failure triggers a visual reset sequence and reshuffles the target.

## 🛠️ Built With
## The Visual Spellbook (Frontend):
* **React** (Because components are magic)
* **TypeScript** (To stop us from putting toy cars in the magic box; inside joke just for me teehee)
* **Vite** (For lightning-fast development)
* **CSS** (For the spooky-cutsey-cozy aesthetics)
## The Cloud Domain (Backend & Auth):
* **Node.js & Express.js:** (The bouncers that handle the API portals)
* **MongoDB & Mongoose:** (The sacred cloud grimoire for saving stats)
* **Bcrypt & JWT:** (For stirring salty passwords into the cauldron and keep sessions secure)

  
## 🌙 Application Flow

```text
User Input (Credentials) → React Frontend (/login or /register) → Express Backend (bcrypt & jwt) → MongoDB Database
                                                                                                         ↓
                                                                                               (Data Verified / Saved)
                                                                                                         ↓
                                                                                     Express Backend (Returns JWT & User Data)
                                                                                                         ↓
                                                                                   React Frontend (Triggers Witching Hour Clock)
                                                                                                         ↓
                                                                 User Input (3x Timing Trial) → React Frontend (Local Validation)
                                                                                                         ↓
                                                                                                  (Trial Passed)
                                                                                                         ↓
                                                                                   Visual Rendering (Sanctum Dashboard & Badges)
```

---

## 🔮 Cloning Spell
Want to study some spells and run this locally? 

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/remilkies/the-witching-hour.git]`

2. **Summon the Backend Cauldron:**
  ```bash
  cd server
  npm install
  npm run dev
```

* **Note: You will need to create a .env file in the /server folder with your MONGO_URI and a JWT_SECRET for the database connection ritual to work!**


3. **Navigate into the crypt (Open a second terminal):**
    ```bash
    cd Witch-Project

4. **Summon the dependencies:**
    ```bash
    npm install


5. **Light the black flame candle (Start the dev server):**

    ```bash
    npm run dev
    
  **Or**

5. **build dmg/exe to install application:**
   
  ```bash
  npm run app:build


## 🎧 Opening the Portal to the Rhythm Realm (Spotify Setup)

Want to connect your own magical musical leylines to the Inner Sanctum? Because this app acts as a remote control for your live Spotify session, you will need to register your own local version of the grimoire with the Spotify High Council.

**Note:** You must have an active **Spotify Premium** account and have Spotify playing on a device (desktop or mobile) for the Web API controls to work!

### 📜 Step 1: Petition the High Council (Create an App)
1. Head over to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in.
2. Click **Create App**.
3. Give your app a name (e.g., "Rhythm Kitchen Local") and a short description.
4. For the **Redirect URI**, you *must* enter exactly this coordinate for the local portal to catch the keys:
   `http://127.0.0.1:5001/api/spotify/callback`
5. Check the Web API box, agree to sell your soul, and hit save!

### 🔑 Step 2: Scribe Your Secret Keys
For both the database ritual and the Spotify portal to work, you need a secret .env file.


1. In the `server` folder of this project, create a new file and name it exactly `.env`
2. Add your keys to the file like this:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_string
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   ```

 **Do not share these with anyone!**

* **Remember:** You can't code a glass of water. Drink up.
(P.S If anyone figures out how to code water, let me know <3)
