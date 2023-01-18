import React, { useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import "./Tasks.scss";
import { useSelector, useDispatch } from 'react-redux'
import { addTask } from '../redux/actions/addTask';
import { deleteTask } from '../redux/actions/deleteTask';

type Task = {
    taskNum: number,
    taskHeading: string,
    taskDescription: string,
    taskStartDate: Date,
    taskEndDate: Date | null,
    taskPriority: string,
    taskFiles: FileList | null,
    taskStatus: string,
    // taskSubtasks: Task[]
}

function Tasks(){

    const params = useParams();
    const projectIndex = Number(params.projectIndex);
    
    console.log(useSelector((state: any) => state.todos))
    const dispatch = useDispatch();
    const localProjects = useSelector((state: any) => state.todos.projects)
    let localTasks: any;

    if(projectIndex != undefined){
        // console.log(localProjects)
        localTasks = localProjects[projectIndex].tasks;
        
    }

    const [tasks, setTasks] = useState(localTasks); 

    const modal = useRef<HTMLDivElement>(null);

    function handleNewTask(e: any){
        const target = e.target as HTMLButtonElement;
        // console.log(target.parentElement!.children[0].children[1].children[0])
        if((target.parentElement!.children[2] as HTMLInputElement).value == ''){
            (target.parentElement!.children[2] as HTMLInputElement).style.border = "1px solid red";
            throw new Error("Enter task name!")
        }
        (target.parentElement!.children[2] as HTMLInputElement).style.border = "none";

        if((target.parentElement!.children[3] as HTMLTextAreaElement).value == ''){
            (target.parentElement!.children[3] as HTMLInputElement).style.border = "1px solid red";
            throw new Error("Enter description!")
        }
        (target.parentElement!.children[3] as HTMLInputElement).style.border = "none";
        

        const startDate = (target.parentElement!.children[1].children[1] as HTMLInputElement).value == '' ? new Date() : new Date( (target.parentElement!.children[1].children[1] as HTMLInputElement).value ),
        endDate = (target.parentElement!.children[1].children[3] as HTMLInputElement).value == '' ? null : new Date( (target.parentElement!.children[1].children[3] as HTMLInputElement).value )

        const newTask: Task = {
            taskNum: Number(target.parentElement!.children[0].children[0].innerHTML.slice(1)),
            taskPriority: target.parentElement!.children[0].children[1].children[0].innerHTML,
            taskStartDate: startDate,
            taskEndDate: endDate,
            taskHeading: (target.parentElement!.children[2] as HTMLInputElement).value,
            taskDescription: (target.parentElement!.children[3] as HTMLTextAreaElement).value,
            taskFiles: (target.parentElement!.children[4] as HTMLInputElement).files,
            taskStatus: "Queue"
        }

        console.log(newTask)

        localProjects[projectIndex].tasks.push(newTask);
        localStorage.setItem('projects', JSON.stringify(localProjects));
        console.log("Storage after new task: ", localStorage);
        console.log("New task list: ", localProjects[projectIndex].tasks);
        dispatch(addTask({
            taskProjectIndex: projectIndex,
            task: newTask
        }))
        setTasks([...tasks, newTask])

        //Close modal
        modal.current!.style.display = "none"
    }

    return(
        <section className="tasks">

            <div className="tasks-header">
                <h2 className="tasks-header__h2">Tasklist:</h2>
                <form className="tasks-header-searchForm">
                    <input className="tasks-header-searchForm__input" type="text"/>
                    <button className="tasks-header-searchForm__button">search</button>
                </form>

                <button className='tasks-header__createButton' onClick={() => {
                    modal.current!.style.display = "block";
                }}>
                    Create task
                </button>

                <div className="tasks-header-modal" ref={modal}>

                    <div className="tasks-header-modal-content">

                        <div className="tasks-header-modal-content-top">
                            <p className="tasks-header-modal-content-top__taskNum">{"№" + (tasks.length+1)}</p>
                            <div className="tasks-header-modal-content-top__priorityMenu">
                                <button className="tasks-header-modal-content-top__priorityMenu__button">!</button>
                                <div className="tasks-header-modal-content-top__priorityMenu__content">
                                    <a href="" onClick={(e) => {
                                        e.preventDefault()
                                        const target = e.target as HTMLElement;
                                        target.parentElement!.parentElement!.children[0].innerHTML = "!";
                                    }}>!</a>
                                    <a href="" onClick={(e) => {
                                        e.preventDefault()
                                        const target = e.target as HTMLElement;
                                        target.parentElement!.parentElement!.children[0].innerHTML = "!!";
                                    }}>!!</a>
                                    <a href="" onClick={(e) => {
                                        e.preventDefault()
                                        const target = e.target as HTMLElement;
                                        target.parentElement!.parentElement!.children[0].innerHTML = "!!!";
                                    }}>!!!</a>
                                </div>
                            </div>
                        </div>

                        <div className="tasks-header-modal-content-dates">
                            <p>Start date</p>
                            <input type="date"></input>

                            <p>Ending date</p>
                            <input type="date"></input>
                        </div>

                        <input className="tasks-header-modal-content__heading" type="text" />

                        <textarea className="tasks-header-modal-content__description">
                            
                        </textarea>

                        <input className="tasks-header-modal-content__file_input" type="file" onChange={(e) => {
                            if (!e.target.files) return;
                            const target = e.target as HTMLElement;
                            const fileName = e.target.files[0].name;
                            target.parentElement!.children[6].innerHTML = fileName
                        }}
                        ></input>
                        
                        <button className="tasks-header-modal-content__file" onClick={(e) => {
                            const target = e.target as HTMLButtonElement;
                            (target.parentElement!.children[4] as HTMLElement).click()
                        }}>Add file</button>

                        <p className="tasks-header-modal-content__fileName">
                        </p>

                        <button className="tasks-header-modal-content__subTask">Add subtask</button>

                        <button className="tasks-header-modal-content__cancel" onClick={() => {
                            modal.current!.style.display = "none"
                        }}>
                            Cancel
                        </button>

                        <button className="tasks-header-modal-content__done" onClick={handleNewTask}>Done</button>

                    </div>
                </div>
            </div>

            <div className="tasks-column tasks-queue">
                <h2 className="tasks-column__heading">Queue:</h2>

                {tasks.map((task: Task, index: number) => {
                    return (
                        <div className="tasks-column-task" key={index} data-index={index}>
                            <h3 className="tasks-column-task__name">{task.taskHeading}</h3>
                            <div className='tasks-column-task-buttons'>
                                <p className="tasks-column-task-buttons__priority">{task.taskPriority}</p>
                                <p onClick={() => {
                                    // modal.current!.style.display = "block"
                                }}>&#9998;</p>
                                <p onClick={(e) => {
                                    const target = e.target as HTMLParagraphElement;
                                    const taskIndex: number = Number(target.parentElement?.parentElement?.getAttribute("data-index"));
                                    const newTaskList = tasks.filter((task: Task, index: number) => {
                                        if(index === taskIndex){
                                            return false
                                        }
                                        return true
                                    })
                                    localProjects[projectIndex].tasks = newTaskList;
                                    localStorage.setItem('projects', JSON.stringify(localProjects));
                                    dispatch(deleteTask({
                                        taskProjectIndex: projectIndex,
                                        taskIndex: taskIndex
                                    }))
                                    setTasks(newTaskList);

                                }}>&#9746;</p>
                                <p>&#9744;</p>
                            </div>
                        </div>
                    )
                })}

            </div>

            <div className="tasks-column tasks-development">
                <h2 className="tasks-column__heading">Development:</h2>
                
            </div>

            <div className="tasks-column tasks-done">
                <h2 className="tasks-column__heading">Done:</h2>

            </div>
            
        </section>       
    )
}


export default Tasks