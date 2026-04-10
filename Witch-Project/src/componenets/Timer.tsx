import React, { useState, useEffect } from "react";
import "../App.css";


import clock from "../assets/clockBody.png";
import hourHand from "../assets/hourHand.png";
import minuteHand from "../assets/minuteHand.png";
import clockOrigin from "../assets/clockOrigin.png";

export default function Timer() {
// Get the current time
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const intervalId = setInterval(() => {
        setTime(new Date());
      }, 1000); // Update every second

      return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

  const seconds = time.getSeconds();
const minutes = time.getMinutes();
const hours = time.getHours(); // Convert to 12-hour format

const minuteDegrees = (minutes * 6) + (seconds * 0.1);
const hourDegrees = ((hours % 12) * 30) + (minutes * 0.5);

  return (
    <div className="timer-container">

      <div className="clock-container">

        <img src={clock} className="clock-face" />

      <div className="clock-hands">
        <img
          src={hourHand}
          className="hour-hand" alt="hour hand"
          style={{ transform: `rotate(${hourDegrees}deg)` }}
        />

        <img 
          src={minuteHand}
          className="minute-hand"
          style={{ transform: `rotate(${minuteDegrees}deg)` }}
        />
        <img src={clockOrigin} className="clock-origin" />
        </div>



      </div>

    </div>
  );
}
