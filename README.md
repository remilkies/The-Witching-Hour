# 🌙 The Witching Hour

> A witchy, desktop, lo-fi productivity and survival tool for developers who forget how to be human.

Welcome to **The Witching Hour**. This is a gamified, slightly aggressive, and highly personalized study room built to keep you on track, keep you hydrated, and stop you from berating your console for a syntax error that was 100% caused by dehydration. 

**📜 The Backstory:** Technically, I'm on holiday and supposed to be resting. But my lecturer (shoutout Tsungai, I know you're reading this somewhere) is going to have to pry GitHub Desktop from my cold, dead hands. I absolutely suck at *not* working, so I'm ironically spending my time off coding an app to forcefully stop me from coding for days at a time and forgetting that I belong to a society.

**⚠️ Disclaimer:** This is me learning how to use TypeScript, so the code contains a lot of necessary (and completely unnecessary) comments for my own sanity— and for you to enjoy <3

Crawl out of the darkness of your domain, complete your tasks, and let the dopamine (and the confetti) flow. >:D

## ✨ Features

* **📝 The Dopamine Machine:** A to-do list that doesn't just cross things off—it throws confetti and plays a little victory tune because you deserve it, and a little progress bar to keep track of the amazing work you've done. *Bonus: Includes persistent LocalStorage so your quests survive the night!* <3
* **⏳ The Time Lord:**
  * **Start Your Session:** Drag the clock hands to set custom focus blocks. Don't want to set a timer? No problem. Simply hit the global Play button to start an open-ended session and start earning points while the app tracks your time in the background.
  * **The 45-Minute Hard Limit:** You cannot work for more than 45 minutes straight. When your time is up, the app will literally yell at you with a giant pop-up to go touch grass.
  * **Early Breaks:** Brain melting before the 45 minutes is up? Hit the "Take Early Break" button to instantly freeze your timers and initiate a resting period on your own terms.
  * **Goblin-Proof Resumes:** Let me guess: during your break, you go to make a sandwich, get distracted by a very interesting bug on the floor, and suddenly the app thinks you've been coding for 25 minutes? Not a problem. After a break ends, your timer remains safely frozen in time, and a little toast notification will gently remind you to clock back in when you *actually* sit down with your sandwich.
* **💧 Survival Toggles:** Automated, non-negotiable wellness reminders (STAY HYDTARTED).

* **🛑 Aggressive Wellness Timer & Economy (NEW UPDATE!):**
  * **Gamified Pomodoro:** Work for up to 45 minutes, then get locked out of your task list for a mandatory break.
  * **☕ Take an Early Break:** Brain melting before the 45 minutes is up? Hit the new Early Break button to freeze your active timers and initiate a resting period.
  * **Dynamic Productivity Points (PP):** Earn exactly 1 PP for every single minute you spend working. If you set a custom timer, the points drip in minute-by-minute!
  * **Dynamic IRL Side-Quests (WP):** While locked in the break modal, earn a base reward of 1 WP for *every minute* you spend actively resting. Complete optional real-world tasks (like drinking water, resting your eyes, or stretching your goblin spine) to earn bonus Wellness Point multipliers!
  * **Dynamic Payouts:** Claim your well-earned PP and WP when you finish your break to unlock your screen and get back to the grind.

* **🦇 The 7 PM Curfew Trap:** A background interval tracker constantly watches the clock. If you are working at exactly 19:00, the app instantly locks you out, blasts an alarm, and tells you to go eat dinner and go to sleep.
 
## 🔮 Coming Soon 

* **The Vibe Check (Ambient Audio):**
  * Click the glowing purple fireplace for crackling fire sounds.
  * Click the gothic window for soothing rain ambiance.
  * Click the radio to blast MY mixtapes. (if you really want you can clone this and replace the audio files with your own but.....you're not gonna do that <3) (Radio design inspired by Hazbin Hotel)
* **🐈‍⬛ Mem Mem:** THERE'S A KET. Their name is Mem. Mem doesn't technically *do* anything, but he's adorable and deserves an honourable mention.

## 🪄 Sacred Spells (Under the Hood Logic)

For the curious developers and passing wizards, here is a peek at how the React state management keeps the study room running without phantom time glitches:

* **👻 1. The Ghost Timer (Base 45 Minutes)**
  The app runs a background interval tracking `workSeconds`. When the break modal triggers (`isBreakModalOpen === true`), the timer immediately halts. Why? Because the interval specifically checks `if (!isBreakModalOpen && isSessionActive)`. It literally cannot count up if the modal is open! Once the break concludes, `workSeconds` resets to zero, ensuring the Pomodoro cycle stays perfectly synced.

* **⏳ 2. The Custom Timer Component**
  The visual clock timer relies on a carefully passed prop: `isPaused={isBreakModalOpen || !isSessionActive}`. This means the absolute millisecond a break initiates or the global session is paused, the custom timer freezes in place. The moment the session resumes, the prop updates, and the timer instantly unfreezes to pick up exactly where it left off.

* **🟢 3. The Global Session State & Goblin-Proofing**
  The entire application is governed by the `isSessionActive` state. Initially, the app automatically threw users right back into work mode after a break. But to account for real-life distractions, the `handleFinishBreak` logic explicitly forces `setIsSessionActive(false)` when a break ends. This intentionally suspends the active state and summons a toast notification, forcing the app to wait for explicit user permission (clicking "Play") before tracking productivity again.
 
* **🔊 4. The Audio Unlock Spell (Autoplay Bypass)**
  Modern browsers strictly block audio from playing until the user interacts with the DOM. This would normally ruin our sweet, sweet victory confetti sounds. To bypass this, the moment a user clicks "Start Session", the app secretly triggers an audio object at 1% volume, instantly pauses it, and rewinds it to zero. This tiny, invisible interaction successfully "unlocks" the browser's Audio API, guaranteeing your dopamine sounds fire flawlessly later!

## 🛠️ Built With

* **React** (Because components are magic)
* **TypeScript** (To stop us from putting toy cars in the magic box)
* **Vite** (For lightning-fast development)
* **CSS** (For the spooky-cutsey-cozy aesthetics)

## 🚀 Getting Started

Want to study some spells and run this locally? 

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/remilkies/the-witching-hour.git]
2. **Navigate into the crypt:**
    ```bash
    cd Witch-Project

3. **Summon the dependencies:**
    ```bash
    npm install


4. **Light the black flame candle (Start the dev server):**

    ```bash
    npm run dev
    
  **Or**

4. **build dmg/exe to install application:**
   
  ```bash
  npm run app:build

* **Remember:** You can't code a glass of water. Drink up.
P.S If anyone figures out how to code water, let me know, so my boyfriend can get off my back (love you babe <3)
