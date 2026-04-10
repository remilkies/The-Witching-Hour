import React, { useState, useEffect, use } from "react";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";


import dreamcatcher from "./assets/dreamcatcher.png";
import ProgressBar from "./componenets/ProgressBar";
import Timer from "./componenets/Timer";

import addTaskIcon from "./assets/addTaskIcon.png";
import QuestHeader from "./assets/questContainerHeader.png";
import mainShelf from "./assets/mainShelf.png";

// 1. THE RULEBOOK: Telling the typescript EXACTLY what a "task" looks like.
type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
};

// 2. THE MEMORY
export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]); // <Task[]> is a "type annotation" that tells typescript that this state variable will be an array of "Task" objects and only items that perfectly match the 'Task' rulebook above 
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [pp, setPp] = useState(0); //Productivity Points
  const [wp, setWp] = useState(0); // Wellness Points

  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [completedWellnessTasks, setCompletedWellnessTasks] = useState<string[]>([]);

  //DEV MODE INITIATED: 5 SECOND TIMER FOR TESTING PURPOSES
  const WORK_LIMIT_SECONDS = 45 * 60; // change to (45 * 60)
  const BREAK_LIMIT_SECONDS = 15 * 60; // change to (15 * 60)

  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(BREAK_LIMIT_SECONDS);

  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);

  //maximum 5 quests at a time, because we don't want to overwhelm our players with too many quests, that would be mean
  const canAddMoreTasks = tasks.length < 5;


  const totalTasks = tasks.length;

  //filter through the list and only keep the completed quests
  const completedTasks = tasks.filter(task => task.isCompleted).length;

  // Cheak if totalTasks is 0 to avaoid NaN returns
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  useEffect(() => {
    const interval = setInterval(() => {

      if (!isBreakModalOpen){ // Only count work seconds if the break modal is not open
        setWorkSeconds((prev) => prev + 1);
      } else if (isBreakModalOpen && breakSecondsLeft > 0){ // Only count down break seconds if the modal is open and there is time left{
        setBreakSecondsLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreakModalOpen, breakSecondsLeft]);

  useEffect(() => {
    if (workSeconds >= WORK_LIMIT_SECONDS) {
      setIsBreakModalOpen(true);
      setIsQuestLogOpen(false); // Force close quest log when break starts
      setBreakSecondsLeft(BREAK_LIMIT_SECONDS); // Reset break timer
      setCompletedWellnessTasks([])
      setWorkSeconds(0); // Reset work seconds for the next round
    }
  }, [workSeconds]);

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
      if (task.id === taskId) {
        //TRIGGER VICTORY CONFETTI WHOOP WHOOP
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task; //keep the other tasks unchanged
    });
    setTasks(updatedTasks);
  };

  const handleFinishBreak = () => {
    setPp((prev) => prev + 45);

    const bonusWp = 15 + completedWellnessTasks.length * 15;
    setWp ((prev) => prev + bonusWp); // Each completed wellness task gives 15 bonus wellness points

    setIsBreakModalOpen(false); //BANISH THE MODAL. YOU CAN WORK NOW :D
  };

  const toggleWellnessTask = (taskName: string) => {
    if (completedWellnessTasks.includes(taskName)) {
      setCompletedWellnessTasks(completedWellnessTasks.filter(t => t !== taskName));
    } else {
      setCompletedWellnessTasks([...completedWellnessTasks, taskName]);
    }
  };

  // const questContainerHeader = document.querySelector('.questContainerHeader'); THIS IS HOW YOU WOULD SELECT AN ELEMENT IN A NORMAL JAVASCRIPT FILE, BUT IN REACT, WE HANDLE THIS WITH STATE AND CONDITIONAL RENDERING
  //5. THE GLORIOUS RENDERING
  return (
    <>


      {/* CONDITIONAL REMDERERING USING THE && (AND) OPERRATOR - If totalTasks > 0 is TRUE, then remder bar */}
      {totalTasks > 0 && <ProgressBar progress={progress} />} 

      {isQuestLogOpen && (
        <div className="click-catcher-backdrop" onClick={() => setIsQuestLogOpen(false)}
        />
      )}

      {isBreakModalOpen && (
        <div className="click-catcher-backdrop">
          <div className="wellnessModalContainer">
          <div className="wellnessModal">
            <h1>STOP WORKING</h1>
            <h2>YOU HAVE BEEN WORKING TOO LONG</h2>
            <p>For your own well-being, step away from the keyboard. <br/> Your Quest Log will unlock in: <strong>{breakSecondsLeft} seconds.</strong></p>

            <div className="wellnessTasks">
              <h3>Optional Wellness Tasks (Complete for Bonus Wellness Points!)</h3>
              <ul style={{ listStyle: 'none'}}>
                {["Drink a glass of Water + 15 WP", "Streatch your goblin spine + 15 WP","Touch Grass + 15 WP", "Look at a tree + 15 WP", "Get some sun + 15 WP"].map((task) => (
                  <li key={task} onClick={() => toggleWellnessTask(task)} style={{ cursor: 'pointer', padding: '10px', textDecoration: completedWellnessTasks.includes(task) ? 'line-through' : 'none', color: completedWellnessTasks.includes(task) ? '#996E8D' : '#342333' }} >
                    {completedWellnessTasks.includes(task) ? "[x] " : "[ ] "} {task}
                  </li>
                ))}
              </ul>
          </div>
          <p>Base Reward:  <strong>45 PP + 15 WP</strong><br />
          Bonus Wellness Reward: <strong>+{completedWellnessTasks.length * 15} WP</strong>
          </p>

          <button className="finishBreak-btn" onClick={handleFinishBreak}
          disabled={breakSecondsLeft > 0 && completedWellnessTasks.length < 3} //button locked unitl shit hits 0, boohoo, touch grass
          style={{cursor: (breakSecondsLeft > 0 && completedWellnessTasks.length < 3) ? 'not-allowed' : 'pointer'

          }}
          >
            {(breakSecondsLeft > 0 && completedWellnessTasks.length < 3) ? "Wait for time OR do 3 quests" : "I DID THE THINGS, LET ME BACK IN"}</button>
        </div>
        </div>
        </div>
      )}

      {!isQuestLogOpen && (
        <div>
          <img className="questMenuIcon" src={QuestHeader} alt="Quest Log Icon" onClick={() => setIsQuestLogOpen(true)} style={{ width: "150px" }} />
        </div>
      )}

      {isQuestLogOpen && (

        <div className="questLog">
          <div className="questContainer">
            <img className="questContainerHeader" src={QuestHeader} alt="Quest Log Header" />
            <div className="questContent">
              <h1>Quest Log</h1>
            <p>PP: {pp} | WP: {wp}</p>
              <ul style={{ listStyle: 'none'}}>
                {tasks.map((task) => (
                  <li key={task.id} onClick={() => handleCompleteTask(task.id)} style={{ cursor: 'pointer', padding: '10px', textDecoration: task.isCompleted ? 'line-through' : 'none', color: task.isCompleted ? '#996E8D' : '#342333' }} >
                    {task.isCompleted ? "[x] " : "[ ] "} {task.title}
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
            <Timer />
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
