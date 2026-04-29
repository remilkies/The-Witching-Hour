import React, { useState, useEffect } from "react";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import Confetti from "react-confetti";

import ProgressBar from "./componenets/ProgressBar";
import Timer from "./componenets/Timer";

import dreamcatcher from "./assets/dreamcatcher.png";
import addTaskIcon from "./assets/addTaskIcon.png";
import QuestHeader from "./assets/questContainerHeader.png";
import mainShelf from "./assets/mainShelf.png";
import mainPlayBtn from "./assets/mainPlayBtn.png";
import mainPauseBtn from "./assets/mainPauseBtn.png";
import breakIcon from "./assets/breakIcon.png";

import Yippee from "../public/Yippee.mp3";
import alarm from "../public/alarm.mp3";
import Droplet from "../public/waterDroplet.wav";
import eveningAlarm from "../public/alarmGoodnight.mp3";

// 1. THE RULEBOOK: Telling the typescript EXACTLY what a "task" looks like.
type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
};

const WELLNESS_POOLS = {
  red: [
    "Massage",
    "Walk",
    "Streach your goblin spine",
    "Nappy Nap Time",
    "Swim",
    "Pedicure",
    "DO YOU EVEN LIFT BRO??? (workout)",
    "Yoga"
  ],
  orange: [
    "Gratitude",
    "Journal",
    "Meditate",
    "Music",
    "Get Outside",
    "Relax",
    "Give Back",
    "Art",
    "Laugh"
  ],
  yellow: [
    "Read",
    "Forgive",
    "Go Out",
    "Sing",
    "BFF Date",
    "Try Something New",
    "Bubble Bath"
  ],
  green: [
    "Have a Snacky Snack",
    "Unplug",
    "Cook a meal",
    "Bake",
    "Take a break (free space basically, you're welcome",
    "Set Bounderies",
    "Go To Bed Early"
  ],
  blue: [
    "Tidy Up",
    "Drink Water",
    "Deep Breaths",
    "To-Do List",
    "Ask for Help"
  ],
  purple: [
    "Vent",
    "Positive Self Talk",
    "Hot Shower",
    "Dance",
    "Cuddles"
  ]
};

// 2. THE MEMORY
export default function App() {
  const [showConfetti, setShowConfetti] = useState(false);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("witching-tasks");
    if (savedTasks) return JSON.parse(savedTasks);
    return []; //first time player empty slate
  }); // <Task[]> is a "type annotation" that tells typescript that this state variable will be an array of "Task" objects and only items that perfectly match the 'Task' rulebook above 
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [isSessionActive, setIsSessionActive] = useState(false);

  const [pp, setPp] = useState(() => {
    const savedPp = localStorage.getItem("witching-pp");
    if (savedPp) return JSON.parse(savedPp);
    return savedPp ? parseInt(savedPp) : 0; //first time player starts with 0 points, but if there is a saved value, use that instead
  }); //Productivity Points
  const [wp, setWp] = useState(() => {
    const savedWp = localStorage.getItem("witching-wp");
    return savedWp ? parseInt(savedWp) : 0; //first time player starts with 0 points, but if there is a saved value, use that instead
  }); // Wellness Points

  const handleToggleSession = () => {
    if (!isSessionActive) {
      //THE AUDIO UNLOCK SPELL
      //play a sound to unlock the audio API in browsers, which is required to play sounds later on when completing tasks and stuff. Most browsers block audio from playing until there has been some sort of user interaction (like a click), so we can use this as a way to "unlock" the ability to play sounds when we actually want to use them in the app.
      const unlockAudio = new Audio(alarm);
      unlockAudio.volume = 0.01; // Set volume to a very low level so it's not disruptive 
      unlockAudio.play().then(() => {
        unlockAudio.pause(); // Pause immediately after playing to prevent any sound from being heard
        unlockAudio.currentTime = 0; // Reset the audio to the beginning
      }).catch(err => console.log("Audio unlock bypassed", err));
    }

    setIsSessionActive(!isSessionActive); // This toggles the session state between active and inactive. When the session becomes active, it allows the work timer to start counting and the break timer to function properly. When the session is inactive, it essentially pauses all timers and prevents the break modal from triggering, giving the user control over when they want to start their productivity session.
  };

  useEffect(() => {
    localStorage.setItem("witching-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("witching-pp", pp.toString());
  }, [pp]);

  useEffect(() => {
    localStorage.setItem("witching-wp", wp.toString());
  }, [wp]);

  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);

  const [dailyTasks, setDailyTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem("witching-daily-tasks");
    return saved ? JSON.parse(saved) : [];
  })
  const [completedWellnessTasks, setCompletedWellnessTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem("witching-completed-tasks");
    return saved ? JSON.parse(saved) : [];
  });

  //THE MIDNIGHT QUEST REST & QUEST GENERATOR
  useEffect(() => {  //this a react hook and the epty dependency [] at the very end means this specific spell ONLY runs once: the moment the app first loads
    const today = new Date().toDateString();// grab today's date as a string
    const savedDate = localStorage.getItem("witching-daily-date"); //cheak browsers local memory to see the last datte we rolled out quests

 //if the saved date doesn't match today's date, mimidnight has passed (or it's a bran new user)
    if (savedDate !== today){ // trigger to wipe the board and roll a freash set of quests

      console.log("A new day dawns...rolling new daily quests!");

      //constructing the new daily quests array
      const newQuests = [
        //Math.random() generates a decimal between 0 and 1. Multiply the number by the no. of items in the pool,  
        // and Math.floor() rounds it down to a whole numberand use that number to pick a random task for the array >:D
        WELLNESS_POOLS.red[Math.floor(Math.random() * WELLNESS_POOLS.red.length)],
        WELLNESS_POOLS.yellow[Math.floor(Math.random() * WELLNESS_POOLS.yellow.length)],
        WELLNESS_POOLS.green[Math.floor(Math.random() * WELLNESS_POOLS.green.length)],
        WELLNESS_POOLS.orange[Math.floor(Math.random() * WELLNESS_POOLS.orange.length)],
        WELLNESS_POOLS.blue[Math.floor(Math.random() * WELLNESS_POOLS.blue.length)],
        WELLNESS_POOLS.purple[Math.floor(Math.random() * WELLNESS_POOLS.purple.length)],
      ];

      setDailyTasks(newQuests); //Update live react state so the app shows new tasks immidietly 
      setCompletedWellnessTasks([]); //wipe completed list for the next day and so users can't use yesterday's points to skip today's breaks (haha, nice try devs) o7

      //save everything into localStorage immidietly so if they reload the page 5 seconds later the app remembers today's date and doesn't re-roll their quests again
      //svae the new day's data
      localStorage.setItem("witching-daily-task", JSON.stringify(newQuests));
      localStorage.getItem("witching-completed-tasks", JSON.stringify([]));
      localStorage.getItem("witching-daily-date", today);
    }
  }, []); // useEffect is told to only run the thing once because of empty dependency

  //THE AUTO-SAVE SPELL
  useEffect(() => { //seperate useEffect bc 'completedWellnessTasks' is in the dependancy array at the bottom.
   //take whatever is currently in the completed list and hard-saves it to the browser's memeory
    localStorage.setItem("witching-completed-tasks", JSON.stringify(completedWellnessTasks));
  }, [completedWellnessTasks]); //spell triggers enerytime the user completes or un-completes a quest



  //DEV MODE INITIATED: 5 SECOND TIMER FOR TESTING PURPOSES
  const WORK_LIMIT_SECONDS = 45 * 60; // change to (45 * 60)
  const BREAK_LIMIT_SECONDS = 15 * 60; // change to (15 * 60)

  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(BREAK_LIMIT_SECONDS);

  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);

  const [showWaterToast, setShowWaterToast] = useState(false);

  useEffect(() => {
    const waterInterval = setInterval(() => {
      setShowWaterToast(true);
    }, 30 * 60 * 1000); // Show toast every 30 minutes

    return () => clearInterval(waterInterval);
  }, []);

  useEffect(() => {
    if (showWaterToast) {
      const audio = new Audio(Droplet);
      audio.volume = 0.5; // Set volume to a moderate level
      audio.play();
      const timeout = setTimeout(() => {
        setShowWaterToast(false)
      }, 15000);// Hide toast after 15 seconds

      return () => clearTimeout(timeout);
    }
  }, [showWaterToast]);

  const [showBreakOverToast, setShowBreakOverToast] = useState(false);

  useEffect(()=> {
    if (showBreakOverToast) {
      const timeout = setTimeout(() => {
        setShowBreakOverToast(false)
      }, 100000);// Hide toast after 100 seconds, giving the user ample time to see the notification and claim their points
      return () => clearTimeout(timeout);
    }
  }, [showBreakOverToast]);

  const [isCerfewModalOpen, setIsCerfewModalOpen] = useState(false);
  // This is a little ref that we can use to trigger the 7PM alarm only once, 
  const hasTriggered7PM = React.useRef(false);

  const [isCustomTimerRunning, setIsCustomTimerRunning] = useState(false); // New state to track if the custom timer is running

  useEffect(() => {
    const curfewInterval = setInterval(() => {
      const now = new Date();

      if (now.getHours() === 0) {
        hasTriggered7PM.current = false; // Reset the trigger at midnight
      }

      if (now.getHours() >= 19 && !hasTriggered7PM.current) {
        hasTriggered7PM.current = true; // Set the trigger to prevent multiple alarms

        setIsBreakModalOpen(false);
        setIsQuestLogOpen(false); // Force close quest log when break starts
        setBreakSecondsLeft(BREAK_LIMIT_SECONDS); // LOCK THE QUEST LOG FOR THE NIGHT, GO TO SLEEP, DREAM OF GOBLINS
        setIsCerfewModalOpen(true);
        // setCompletedWellnessTasks([]);

        console.log("THE 7PM WITCHING HOUR HAS ARRIVED >:D");

        const audio = new Audio(eveningAlarm);
        audio.play();
      }
    }, 1000); // Check time every second

    return () => clearInterval(curfewInterval);
  }, []);

  //maximum 5 quests at a time, because we don't want to overwhelm our users with too many quests, that would be mean
  const canAddMoreTasks = tasks.length < 5; //REMEMBER TO TEST IF THE SYSTEM TOAST OVERLAYS EVERYTHING EVEN WHEN IT'S JUST OPEN IN THE BACKGROUND OR MINIMISED >:D PLEEEAAASE, IRLL LOOK SO COOL ?///T-T


  const totalTasks = tasks.length;

  //filter through the list and only keep the completed quests
  const completedTasks = tasks.filter(task => task.isCompleted).length;

  // Cheak if totalTasks is 0 to avaoid NaN returns
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  useEffect(() => {
    const interval = setInterval(() => {

      if (!isBreakModalOpen && isSessionActive) { // Only count work seconds if the break modal is not open and session is active
        setWorkSeconds((prev) => prev + 1);
      } else if (isBreakModalOpen && breakSecondsLeft > 0) { // Only count down break seconds if the modal is open and there is time left{
        setBreakSecondsLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreakModalOpen, breakSecondsLeft, isSessionActive]); // This effect sets up an interval that ticks every second. If the break modal is not open, it increments the work seconds. If the break modal is open and there are break seconds left, it decrements the break seconds. The effect also cleans up the interval when the component unmounts or when any of the dependencies change.

  useEffect(() => {
    if (workSeconds >= WORK_LIMIT_SECONDS) {
      setIsBreakModalOpen(true);
      setIsQuestLogOpen(false); // Force close quest log when break starts
      setBreakSecondsLeft(BREAK_LIMIT_SECONDS); // Reset break timer
      
      setWorkSeconds(0); // Reset work seconds for the next round



      console.log("Work limit reached! Time for a break.");
      const audio = new Audio(alarm);
      audio.play();
    }
  }, [workSeconds]);

  const handleInitiateEarlyBreak = () => {
    setIsBreakModalOpen(true);
    setIsQuestLogOpen(false); // Force close quest log when break starts
    setBreakSecondsLeft(BREAK_LIMIT_SECONDS); // Reset break timer
    
    setWorkSeconds(0); // Reset work seconds for the next round

    console.log("Early break initiated! Take a breather.");

    //Note to self: make sound for early break initiation to give users audio feedback that they successfully initiated the break
    // const audio = new Audio(alarm);
    // audio.play();
  };

  const handleFinishBreak = () => {
    const secondsSpentOnBreak = BREAK_LIMIT_SECONDS - breakSecondsLeft;
    const minutesOnBreak = Math.floor(secondsSpentOnBreak / 60); // Calculate minutes spent on break
    const breakWp = minutesOnBreak > 0 ? minutesOnBreak : 0; // Base wellness points from break time (1 WP per minute, minimum 0)

    const bonusWp = completedWellnessTasks.length * 15;
    setWp((prev) => prev + breakWp + bonusWp); // Add both base WP from break time and bonus WP from completed wellness tasks


    if (!isCustomTimerRunning) {
      const minutesWorked = Math.floor(workSeconds / 60);
      setPp((prev) => prev + minutesWorked); // Add PP based on minutes worked in the session
    }

    setWorkSeconds(0); // Reset work seconds for the next session
    setIsBreakModalOpen(false); //BANISH THE MODAL. YOU CAN WORK NOW :D

    setIsSessionActive(false); // End the session when the break is finished, giving the user a moment to relax before they decide to start another session
    setShowBreakOverToast(true); // Show a toast notification that the break is over and points have been awarded
  };

  useEffect(() => {
    if (isBreakModalOpen && breakSecondsLeft <= 0) {
      handleFinishBreak(); // Automatically finish break when time runs out
    }
  }, [breakSecondsLeft, isBreakModalOpen]);
  // 3. THE ACTIONS (add a task >:D)
  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") return; //no empty tasks added
    if (!canAddMoreTasks) {
      alert("You can only have 5 quests at a time! Complete some quests before adding new ones.");
      return;
    }

    const newTask: Task = {
      id: Date.now(),  //generates a unique id based on the current timestamp
      title: newTaskTitle,
      isCompleted: false,
    };

    //put the new task in the list, keep the old ones too
    setTasks([...tasks, newTask]);
    setNewTaskTitle(""); //Clear the input field
  };

  // 4. THE DOPAMINE HIT
  const handleCompleteTask = (taskId: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && !task.isCompleted) {
        //TRIGGER VICTORY CONFETTI WHOOP WHOOP
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);


        const audio = new Audio(Yippee);
        
        audio.play();

        return { ...task, isCompleted: !task.isCompleted };
      } else if (task.id === taskId && task.isCompleted) {
        // If the task is already completed and we click it again, we can choose to uncomplete it (optional)
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the complete task action

    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  }



  const toggleWellnessTask = (taskId: string) => {
    setCompletedWellnessTasks((prev) =>
      prev.includes(taskId)
    ? prev.filter(id => id !== taskId) // If already completed, remove it from the list
    : [...prev, taskId] // If not completed, add it to the list
    );
    // if (completedWellnessTasks.includes(taskName)) {
    //   setCompletedWellnessTasks(completedWellnessTasks.filter(t => t !== taskName));
    // } else {
    //   setCompletedWellnessTasks([...completedWellnessTasks, taskName]);
    // }
  };

  // const questContainerHeader = document.querySelector('.questContainerHeader'); THIS IS HOW YOU WOULD SELECT AN ELEMENT IN A NORMAL JAVASCRIPT FILE, BUT IN REACT, WE HANDLE THIS WITH STATE AND CONDITIONAL RENDERING
  //5. THE GLORIOUS RENDERING

  //THE BRIDGING SPELL: using fetch to get the islands of front-end and backend to drop the draw bridge and speak to eachother >:D

  const syncToCloud = async () => {
    console.log("🪄 Casting the bridge spell...");

    try{
      const response = await fetch('http://localhost:5001/api/save-progress', {
        method: 'POST', //cause we're sendind data
        headers: {
          'Content-Type': 'application/json', //telling the bouncers HEY JSON IS AT THE DOOR
        },
        body: JSON.stringify({
          //the actual data payload >:D

          //DEV MODE: HARD CODED FOR TESTING
          email: "apprentice@test.com",
          pp: 10,
          wp: 5,
          completedTasks: ["Test the Bridge"]
        })
      });

      //wait for the bouncer's reply and read it
      const data = await response.json();

      if (response.ok){
        console.log("Draw bridge down!", data.message);
      } else {
        console.log("The Bouncers said no:", data);
      }
    } catch (error) {
      console.error("💀 The bridge collapsed:", error);
    }
  };

  return (
    <>


      {/* CONDITIONAL REMDERERING USING THE && (AND) OPERRATOR - If totalTasks > 0 is TRUE, then remder bar */}
      {totalTasks > 0 && <ProgressBar progress={progress} />}

      {showConfetti && <Confetti />}

      {/* HYDRATION TOAST */}
        {showWaterToast && (
          <div className="water-toast">
            <div className="water-toast-header">
            <h3> ݁₊ ⊹ . ݁˖ . ݁Say hiii Drated ݁₊ ⊹ . ݁˖ . ݁</h3>
            <button className="toast-close" onClick={() => setShowWaterToast(false)}>X</button>
            </div>
            <p>Drink some water and stay hydrated! Your goblin brain will thank you :D</p>

            <div className="toast-time-bar"></div>
          </div>
        )}

        {showBreakOverToast && (
          <div className="water-toast">
            <div className="water-toast-header">
            <h3> ݁₊ ⊹ . ݁˖ . ݁Welcome Back ݁₊ ⊹ . ݁˖ . ݁</h3>

            <button className="toast-close" onClick={() => setShowBreakOverToast(false)}>X

            </button>

            </div>
            <p>Break over! Click the Start button to resume your productivity session &lt;3</p>

            <div className="toast-time-bar"></div>
          </div>
        )}
      {isQuestLogOpen && (
        <div className="quest-backdrop" onClick={() => setIsQuestLogOpen(false)}
        />
      )}

      {isBreakModalOpen && (
        <div className="wellness-backdrop">
          <div className="wellnessModalContainer">
            <div className="wellnessModal">
              <h1>STOP WORKING</h1>
              <h2>YOU HAVE BEEN WORKING TOO LONG</h2>
              <p>Taking a break is just as productive as doing work<br/>For your own well-being, step away from the keyboard. <br /> Your Quest Log will unlock in: <strong>{breakSecondsLeft} seconds.</strong></p>

              <div className="wellnessTasks">
                <h3>Optional Wellness Tasks (Complete for Bonus Wellness Points!)</h3>

                <div className="wellness-quests-container">
                  {dailyTasks.map((task) => {
                    const isDone = completedWellnessTasks.includes(task);
                    return (
                      <div key={task} className="wellness-quest-row" style={{textDecoration: completedWellnessTasks.includes(task) ? 'line-through' : 'none', color: completedWellnessTasks.includes(task) ? '#996E8D' : '#342333' }}>
                        <span className={isDone ? "quest-text-done" : "quest-text"} >
                          {task}
                        </span>
                        
                        <button className={`quest-btn ${isDone ? "quest-done" : "quest-pending"}`} onClick={() => toggleWellnessTask(task)} style={{textDecoration: completedWellnessTasks.includes(task) ? 'line-through' : 'none', color: completedWellnessTasks.includes(task) ? '#996E8D' : '#342333' }}>
                          {isDone ? "[X] Claimed +15 WP" : " [ ] Claim +15 WP"}
                        </button>
                      </div>
                    );
                  }
                  // (
                  //   <li key={task} onClick={() => toggleWellnessTask(task)} style={{ cursor: 'pointer', padding: '10px', textDecoration: completedWellnessTasks.includes(task) ? 'line-through' : 'none', color: completedWellnessTasks.includes(task) ? '#996E8D' : '#342333' }} >
                  //     {completedWellnessTasks.includes(task) ? "[x] " : "[ ] "} {task}
                  //   </li>
                  // )
                  )}
                </div>

              </div>

              <p>Base Reward:  <strong>45 PP + 15 WP</strong><br />
                Bonus Wellness Reward: <strong>+{completedWellnessTasks.length * 15} WP</strong>
              </p>

              <button className="finishBreak-btn" onClick={handleFinishBreak}
                disabled={breakSecondsLeft > 0 && completedWellnessTasks.length < 3} //button locked unitl shit hits 0, boohoo, touch grass
                style={{
                  cursor: (breakSecondsLeft > 0 && completedWellnessTasks.length < 3) ? 'not-allowed' : 'pointer'

                }}
              >
                {(breakSecondsLeft > 0 && completedWellnessTasks.length < 3) ? "Wait for time OR do 3 quests" : "I DID THE THINGS, LET ME BACK IN"}</button>
            </div>
          </div>
        </div>
      )}

      {isCerfewModalOpen && (
        <div className="wellness-backdrop">
          <div className="wellnessModalContainer">
            <div className="wellnessModal">
              <h1>STOP WORKING</h1>
              <h2>IT'S NOW 7PM</h2>
              <p>For your own well-being, step away from the keyboard, eat some dinner and have good night's rest</p>
            </div>
          </div>
        </div>
      )}

      {!isQuestLogOpen && (
        <div>
          <img className="questMenuIcon" src={QuestHeader} alt="Quest Log Icon" onClick={() => setIsQuestLogOpen(true)} style={{ width: "150px" }} />
        </div>
      )}

      <div className="global-session-toggle">

<button onClick={syncToCloud}>
  ☁️ Test Cloud Sync
</button>

        <button onClick={handleToggleSession} style={{ background: 'transparent', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <img src={isSessionActive ? mainPauseBtn : mainPlayBtn} alt={isSessionActive ? "Pause Session" : "Start Session"} style={{ width: "60px", height: "auto" }} />
        </button>

        {isSessionActive && (
          <button onClick={handleInitiateEarlyBreak} className="play-pause-btn" style={{ height: "fit-content" }}>
            <img src={breakIcon} alt="Take Break Early" style={{ width: "60px", height: "auto", background: 'transparent'}} />
          </button>
        )}

      </div>

      {isQuestLogOpen && (

        <div className="questLog">
          <div className="questContainer">
            <img className="questContainerHeader" src={QuestHeader} alt="Quest Log Header" />
            <div className="questContent">
              <h1>Quest Log</h1>
              <p>PP: {pp} | WP: {wp}</p>
              <ul style={{ listStyle: 'none' }}>
                {tasks.map((task) => (
                  <li key={task.id} onClick={() => handleCompleteTask(task.id)} style={{ cursor: 'pointer', padding: '10px', textDecoration: task.isCompleted ? 'line-through' : 'none', color: task.isCompleted ? '#996E8D' : '#342333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >

                    <span>
                      {task.isCompleted ? "[x] " : "[ ] "} {task.title}
                    </span>

                    <button className="deleteTask-btn" onClick={(e) => handleDeleteTask(task.id, e)} title="Delete Task">
                      X
                    </button>
                  </li>
                ))}
              </ul>

              <div className="questInput">
                <input type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}

                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTask();
                    }
                  }}

                  placeholder="What we cookin good lookin?" />
                <button className="addTask-btn" onClick={handleAddTask}>
                  <img className="addTask-btn-icon" src={addTaskIcon} alt="Add Quest Icon" /> </button>

              </div>
            </div>

          </div>
        </div>
      )}


      <div className="titleContainer">
        <h1 className="appTitle">The Witching H ur</h1>
        <img className="dreamcatcher" src={dreamcatcher} alt="Dreamcatcher" />
      </div>


      <Container fluid className="timer-shelf-container">
        <Row>

          <Col md={6}>
            <Timer isPaused={isBreakModalOpen || !isSessionActive}
              onMinutePassed={() => setPp((prev) => prev + 1)} // This callback function is passed down to the Timer component and will be called every time a minute passes while the timer is running. It updates the PP (Productivity Points) state by incrementing it by 1 for each minute of focused work completed. The onMinutePassed prop allows the Timer component to communicate back to the App component whenever a minute has passed, enabling the app to reward the user with PP accordingly.
              onTimerActiveChange={setIsCustomTimerRunning}
            />
          </Col>

          <Col md={6}>
            <div className="shelfContainer">
              <img className="mainShelf" src={mainShelf} alt="Main Shelf" />
            </div>
          </Col>

        </Row>
      </Container>

      <div className="footer">
        <p>Brought to you by REMByte</p>
      </div>
    </>
  )
};
