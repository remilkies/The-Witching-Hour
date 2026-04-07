import React from "react";
import "../App.css";

type ProgressBar = {
  progress: number; // expects a number between 0 and 100
};

export default function ProgressBar({ progress }: ProgressBar) {
  return (
    <div className="progressBarContainer">
      <div
        className="progressBarFill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}