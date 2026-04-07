import React from "react";
import "../App.css";

type ProgressBarProps = {
  progress: number; // expects a number between 0 and 100
};



export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="progressBarContainer">
      <div
        className="progressBarFill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}