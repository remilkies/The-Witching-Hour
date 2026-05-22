import React, { useState, useEffect} from "react";
import "../App.css";


import clockBody from "../assets/clockBody.png";
import handImg from "../assets/minuteHand.png";
import hourHand from "../assets/hourHand.png";
import clockOrigin from "../assets/clockOrigin.png";

//Once the user's hashed password is verified, they must prove their humanity under pressure by timing the exact moment the hand strikes the witching hour.

// Bots are really bad at timing-based, dynamic visual interactions WHICH MEANS highly secure, custom bot-trap.(hopefully also ai proof)
interface WitchingHourProps { 

  //this is a locked door, the parent (aka app) passes the key (onSeccess) to the clock, the clock's only job is to hold onto that key and say "Riddle me this mortal, can you overcome my trials? If you can, I'll give you the key to unlock the door and enter the witching hour..."
  onSuccess: () => void; //the key function to call when the user successfully completes the clock puzzle
  isActive: boolean; //so the auth trap doesn't immidetly start
}

// UMMONING CIRCLE - invite props into the component itself or react thinks it doesn't exist
export default function WitchingHourAuth({ onSuccess, isActive }: WitchingHourProps) {

  //React has the meory of a goldfish, every time the screen updates, it forgets everything. useState FORCES react to rember things.
  //and he's what it needs to rember
  const [targetHour, setTargetHour] = useState(12); //what number they need to hit
  const [targetAngle, setTargetAngle] = useState(360); //exactly where that is in degrees
  const [currentAngle, setCurrentAngle] = useState(0);//where the hand is currectly/ MAIN AUTHENTICATION HAND
  const [hourAngle, setHourAngle] = useState(0);

  const [isTicking, setIsTicking] = useState(false); //wether the trap is running hehehe
  const [authStatus, setAuthStatus] = useState<'idle' | 'failed' | 'success'>('idle'); //aaaand the unlimate verdict of the trial

  const [successCount, setSuccessCount] = useState(0); //track how many times a user has succesfully passed the ritual (because i mean and i want them to do it more than once >:D)


//REAL WORLD TIME TELLING CLOCK SPELL 
useEffect(() => {
  if (!isActive) {
    const updateRealTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();

      //to clculate the real world angles of the hands :D
      const realHourAngle = (hours * 30) + (minutes * 0.5);
      const realMinuteAngle = minutes * 6;

      setHourAngle(realHourAngle);
      setCurrentAngle(realMinuteAngle);

    };

    updateRealTime(); //runs IMMIDIETLY
    const timeInterval = setInterval(updateRealTime, 60000) //60000ms = every minute

    return () => clearInterval(timeInterval);
  }
}, [isActive]); //only run once dependancy



  //THE RITUAL SETUP
  const generateNewTrap = () => {
    //360 deg circle, divide by 12hours, each hour is 30 deg apaert. Shoutout maths core i guess

    //if the random number is 3, the target is 90deg, we subtract 120deg (4hrs) so the hand starts pointing at the 11. It gives them a few seconds of pure panic before it strikes 3.

    const newTarget = Math.floor(Math.random() * 12) + 1; // Random hour between 1 and 12 
    const targetDeg = newTarget * 30; // Convert hour to degrees (30 degrees per hour)

    //start 4 hours behind target to buld suspense (and so you don't sit there watching a clock hand for 4 hours)
    const startDeg = targetDeg - 120;

    setTargetHour(newTarget);
    setTargetAngle(targetDeg);
    setCurrentAngle(startDeg);
    setAuthStatus('idle');
    setIsTicking(true);
  };

  //start the ritual trap on load >:D
  // useEffect(() => {
  //   generateNewTrap();
  // }, []); //empty dependancy "only run this spell one time when the user first walks into the room", set up first trap >:D


  //TRIGGER TRAP RITUAL ONLY WHEN ACTIVATED
  useEffect(() => {
    if (isActive) {
      generateNewTrap();
    }
  }, [isActive]); //run once on the condition of isActive in the dependancy

  const handleFail = () => { //flash MEANECING RED, wait 1.5s, and reset the trap
    setIsTicking(false);
    setAuthStatus('failed');
    //hehe but i am mean enough to punish your failure
    setSuccessCount(0); //reset the sucess count on fail, they have to get 3 in a row to unlock the site, so if they mess up even once, they have to start the ritual from scratch >:D

    setTimeout(() => {
      generateNewTrap();
    }, 1500); 
  };

  //ticking heartbeat
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isTicking) {
      timer = setInterval(() => { //the heart beats every 20ms, shoving the clock hand foreward by 2deg
        setCurrentAngle((prevAngle) => {
          const nextAngle = prevAngle + 1.5; //SPEEEEEEEED OF THE HAND FOR HARCORE SPEED MODE

          //auto-fail if the hand passes the target by more that 15 degrees :P
          if (nextAngle > targetAngle + 15) {
            handleFail();
            return prevAngle; //stop moving
          }
          return nextAngle;
        });
      }, 20); //20ms fir a smooooth buttery sweep
    }

    //THE CLEAN UP SPELL: Kills the heartbeat when the trap resets or a user fails, preventing memory leaks and ensuring the clock doesn't keep ticking in the background after a failed attempt and start moving at the speed of light when the next trap starts >:D

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTicking, targetAngle]);

  //THE STRAP IS SPRUNG
  const handleVerifyClick = () => {
    if (!isTicking) return;
    setIsTicking(false); //STOP THE COUNT

    //calculate how far off they were
    const difference = Math.abs(currentAngle - targetAngle); //calc dist between the hand and target (const value: doesn't matter if they clicked a little early or a little late, it just checks the gap).

    //margin of error of 12 degrees, because who needs precision when dealing with witchcraft?
    if (difference <= 12) {
      const newCount = successCount + 1;
      setSuccessCount(newCount);

      if (newCount >= 3){
      setAuthStatus('success');
      setTimeout(() => {
        onSuccess(); //call the sucess callback and unlock site after a short DRAMATIC PAUSE
      }, 1500);
    } else {
      setAuthStatus('success');
      setTimeout(() => {
        generateNewTrap();
      }, 1000); //i'll give you a second to breathe before the next round, i'm not that mean :P
    }
   } else {
      handleFail();
    }
  };



  return (
    <div className={`auth-container 
   ${isActive ? 'ritual-mode' : 'wall-mode'} ${authStatus === 'failed' ? 'flash-red' : ''}`}>
{isActive && (
  <div className="auth-header">
        <h1>PROVE YOU ARE THE HUMAN YOU CLAIM</h1>
        <p>Click VERIFY when the hand strikes <strong>{targetHour}</strong>...</p>
        <p className="ritual-progress">
          Rituals Completed: {successCount} / 3
        </p>
      </div>
)}
      

      <div className={`auth-clock-wrapper ${authStatus === 'failed' ? 'shake-anim' : ''}`}>
        <img src={clockBody} alt="Clock Face" className="auth-clock-body" />

        <div className="auth-clock-hands">

        <img
              src={hourHand}
              className="auth-hour-hand" alt="hour hand"
              style={{ transform: `rotate(${hourAngle}deg)` }}
            />
            
          <img
            src={handImg} className="auth-minute-hand"
            alt="witching hand"
            style={{ 
              transform: `rotate(${currentAngle}deg)`,
              filter: authStatus === 'success' ? 'drop-shadow(0 0 10px #F0DBBE)' : 'none'
          }}
          />

      <img src={clockOrigin} alt="Center Gem" className="auth-clock-origin" />
        </div>
      </div>

{isActive && (
  <div className="auth-controls">
        <button
          className="verify-btn"
          onClick={handleVerifyClick}
          disabled={!isTicking}
          >
            {authStatus === 'success' && successCount >= 3 ? 'ACCESS GRANTED' : 'VERIFY'}
          </button>
      </div>
)}
      

    </div>
  );
};