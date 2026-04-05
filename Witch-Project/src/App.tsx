import React, { useState } from "react";


// 1. THE RULEBOOK: Telling the typescript EXACTLY what a "task" looks like.
type Task
  = {
    id: number;
    title: string;
    isCompleted: boolean;
  };
// 2. THE MEMORY
  export default function App() {
    const [tasks, setTasks] = useState<Task[]>([]); // <Task[]> is a "type annotation" that tells typescript that this state variable will be an array of "Task" objects and only items that perfectly match the 'Task' rulebook above 
    const [newTaskTitle, setNewTaskTitle] = useState("");

    // 3. THE ACTIONS (add a task >:D)
    const handleAddTask = () => {
      if (newTaskTitle.trim() === "") return; //no empty tasks added

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
      if (task.id === taskId){
        //TRIGGER VICTORY CONFETTI WHOOP WHOOP
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task; //keep the other tasks unchanged
    });
    setTasks(updatedTasks);
  };

  //5. THE GLORIOUS RENDERING
  return(
    <div></div>
  )
  }