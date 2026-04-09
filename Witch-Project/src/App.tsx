import React, { useState } from "react";
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

  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);

  //maximum 5 quests at a time, because we don't want to overwhelm our players with too many quests, that would be mean
  const canAddMoreTasks = tasks.length < 5;


  const totalTasks = tasks.length;

  //filter through the list and only keep the completed quests
  const completedTasks = tasks.filter(task => task.isCompleted).length;

  // Cheak if totalTasks is 0 to avaoid NaN returns
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

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
      
      {!isQuestLogOpen && (
        <div>
        <img className="questMenuIcon" src={QuestHeader} alt="Quest Log Icon" onClick={() => setIsQuestLogOpen(true)} style={{width: "150px"}}/>
        </div>
      )}
  
{isQuestLogOpen && (

<div className="questLog">
<div className="questContainer">
        <img className="questContainerHeader" src={QuestHeader} alt="Quest Log Header"  />
        <div className="questContent">
          <h1>Quest Log</h1>

          <ul style={{ listStyle: 'none', padding: 0 }}>
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
<div className="timer-shelf-container">

<Timer />

<div className="shelfContainer">
<img className="mainShelf" src={mainShelf} alt="Main Shelf" />
</div>

</div>

<div className="footer">
<p>Brought to you by REMByte</p>
</div>
    </>
  )
};
