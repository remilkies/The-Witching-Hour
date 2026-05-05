import React, { useState, useEffect, useRef } from "react";
import "../App.css";


import clockBody from "../assets/clockBody.png";
import handImg from "../assets/minuteHand.png";
import clockOrigin from "../assets/clockOrigin.png";

interface WitchingHourProps { 

  //this is a locked door, the parent (aka app) passes the key (onSeccess) to the clock, the clock's only job is to hold onto that key and say "Riddle me this mortal, can you overcome my trials? If you can, I'll give you the key to unlock the door and enter the witching hour..."
  onSuccess: () => void; //the key function to call when the user successfully completes the clock puzzle
}

export default function WitchingHourAuth({ onSuccess }: WitchingHourProps) {

  //React has the meory of a goldfish, every time the screen updates, it forgets everything. useState FORCES react to rember things.
  //and he's what it needs to rember
  const [targetHour, setTargetHour] = useState(12); //what number they need to hit
  const [targetAngle, setTargetAngle] = useState(360); //exactly where that is in degrees
  const [currentAngle, setCurrentAngle] = useState(0);//where the hand is currectly

  const [isTicking, setIsTicking] = useState(false); //wether the trap is running hehehe
  const [authStatus, setAuthStatus] = useState<'idle' | 'failed' | 'success'>('idle'); //aaaand the unlimate verdict of the trial

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

  //start the ritual trap on first load >:D
  useEffect(() => {
    generateNewTrap();
  }, []); //empty dependancy "only run this spell one time when the user first walks into the room", set up first trap >:D

  //ticking heartbeat
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isTicking) {
      timer = setInterval(() => { //the heart beats every 20ms, shoving the clock hand foreward by 2deg
        setCurrentAngle((prevAngle) => {
          const nextAngle = prevAngle + 2; //SPEEEEEEEED OF THE HAND FOR HARCORE SPEED MODE

          //auto-fail if the hand passes the target by more that 15 degrees :P
          if (nextAngle > targetAngle + 15) {
            handleFail();
            return prevAngle; //stop moving
          }
          return nextAngle;
        });
      }, 20); //20ms fir a smooooth buttery sweep
    }
  }, [isTicking, targetAngle]);

  //THE STRAP IS SPRUNG
  const handleVerifyClick = () => {
    if (!isTicking) return;
    setIsTicking(false); //STOP THE COUNT

    //calculate how far off they were
    const difference = Math.abs(currentAngle - targetAngle); //calc dist between the hand and target (const value: doesn't matter if they clicked a little early or a little late, it just checks the gap).

    //margin of error of 12 degrees, because who needs precision when dealing with witchcraft?
    if (difference <= 12) {
      setAuthStatus('success');
      setTimeout(() => {
        onSuccess(); //call the sucess callback and unlock site after a short DRAMATIC PAUSE
      }, 1500);
    } else {
      handleFail();
    }
  };

  const handleFail = () => { //flash MEANECING RED, wait 1.5s, and reset the trap
    setIsTicking(false);
    setAuthStatus('failed');

    setTimeout(() => {
      generateNewTrap();
    }, 1500); 
  };

  return (
    <div className={`auth-container ${authStatus === 'failed' ? 'flash-red' : ''}`}>

      <div className="auth-header">
        <h1>PROVE YOU ARE THE HUMAN YOU CLAIM</h1>
        <p>Click VERIFY when the hand strikes <strong>{targetHour}</strong>...</p>
      </div>

      <div className={`clock-wrapper ${authStatus === 'failed' ? 'shake-anim' : ''}`}>
        <img src={clockBody} alt="Clock Face" className="clock-body" />

        <div className="clock-hands">
          <img
            src={handImg}
            className="hour-hand"
            alt="witching hand"
            style={{ 
              transform: `rotate(${currentAngle}deg)`,
              filter: authStatus === 'success' ? 'drop-shadow(0 0 10px #F0DBBE' : 'none'
          }}
          />
      <img src={clockOrigin} alt="Center Gem" className="clock-origin" />
        </div>
      </div>

      <div className="auth-controls">
        <button
          className="verify-btn"
          onClick={handleVerifyClick}
          disabled={!isTicking}
          >
            {authStatus === 'success' ? 'ACCESS GRANTED' : 'VERIFY'}
          </button>
      </div>

    </div>
  );
};