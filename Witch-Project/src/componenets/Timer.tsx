import React, { useState, useEffect } from "react";
import "../App.css";


import clockBody from "../assets/clockBody.png";
import hourHand from "../assets/hourHand.png";
import minuteHand from "../assets/minuteHand.png";
import clockOrigin from "../assets/clockOrigin.png";

import alarm1 from "/alarm.mp3";
import alarm2 from "/alarm2.mp3";
import alarm3 from "/alarm3.mp3";

export default function Timer( {isPaused }: {isPaused: boolean}) {
  const [timerMinutes, setTimerMinutes] = useState(45);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isSetting, setIsSetting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [toastMsg, setToastMsg] = useState('');

  const clockRef = React.useRef<HTMLDivElement>(null);//INSERT SOUNDS TO -PLAY WHEN TIMER GOES OFF
  const alarmSounds = [alarm1, alarm2, alarm3];

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds((s) => s - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes((m) => m - 1);
          setTimerSeconds(59);
        } else {
          setIsRunning(false);
          setToastMsg('Time is up! Great Work <3');
          setTimeout(() => setToastMsg(''), 10000);
          const randomSound = alarmSounds[Math.floor(Math.random() * alarmSounds.length)];
          const audio = new Audio(randomSound);
          audio.play();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerMinutes, timerSeconds]);

  useEffect(() => {
    if (isPaused) {
      setIsRunning(false);
    }
  }, [isPaused])

  // DRAG THAT MATH
  const handleDrag = (e: MouseEvent | React.MouseEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    let angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    let newMinutes = Math.round((angle / 360) * 60);
    if (newMinutes === 60) newMinutes = 0;

    setTimerMinutes(newMinutes);
    setTimerSeconds(0);
  };

  //GLOBAL MOUSE TRACKING
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isSetting) handleDrag(e);
    };

    const onMouseUp = () => {
      // Stop dragging when mouse is released but wait for confirm click o7
      setIsDragging(false);
    };



    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  // button stuff
  const handleConfirmAndStart = () => {
    setIsSetting(false);
    setIsRunning(true);
    setToastMsg(`Timer set for ${timerMinutes} minutes >:D`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  //calculating the nagles
  const currentMinuteAngle = isSetting
    ? timerMinutes * 6
    : currentTime.getMinutes() * 6 + currentTime.getSeconds() * 0.1;

  const currentHourAngle = (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5;

  return (
      <div className="timer-container">

        <div className={`toast-notification ${toastMsg ? 'show' : ''}`}>
          {toastMsg}
        </div>

        <div className="digital-display">
          <h1>
            {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
          </h1>
          <p className="status-text">
            {isSetting ? "Setting Timer..." : isRunning ? "Timer Running" : "Timer Paused"}
          </p>
        </div>

        <div className="clock-wrapper" ref={clockRef} onMouseDown={(e) => {
          if (!isRunning) {
            setIsSetting(true);
            setIsDragging(true);
            handleDrag(e);
          }
        }}
        >


          <img src={clockBody} alt="Clock Face" className="clock-body" />

          <div className="clock-hands">
            <img
              src={hourHand}
              className="hour-hand" alt="hour hand"
              style={{ transform: `rotate(${currentHourAngle}deg)` }}
            />

            <img
              src={minuteHand}
              className={`minute-hand ${!isSetting ? 'rewind-anim' : ''}`} alt="minute hand"
              style={{ transform: `rotate(${currentMinuteAngle}deg)` }}
            />

            <img src={clockOrigin} alt="Center Gem" className="clock-origin" />
          </div>
          </div>

          <div className="controls-row">
            {isSetting ? (
              <button className="confirm-btn" onClick={handleConfirmAndStart}>Confirm & Start Timer</button>
            ) : (
              <button className="play-pause-btn" onClick={handlePauseResume}>
                {isRunning ? '⏸ Pause Timer' : '▶ Resume Timer'}
              </button>
            )}
            </div>
        </div>
      );
};
