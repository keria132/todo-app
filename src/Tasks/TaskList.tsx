import React, { useRef, forwardRef, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { addTask } from '../redux/actions/addTask';
import { deleteTask } from '../redux/actions/deleteTask';
import { editTask } from '../redux/actions/editTask';
import "./TaskList.scss";

//TYPES
type Project = {
    name: string,
    description: string,
    id: number,
    tasks: Task[]
}

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

//COMPONENT
function TaskList(){

    const params = useParams();
    const editTaskModal = useRef<HTMLDivElement>(null);
    
    const projectIndex: number = Number(params.projectIndex);
    //Redux hooks
    const dispatch = useDispatch();
    const projectsStore: Project[] = useSelector((state: any) => state).todos.projects
    console.log("Projects from Redux state: ", projectsStore)
    console.log("Projects from localstore: ", JSON.parse(localStorage.getItem('projects')!))

    if(projectIndex === undefined){
        throw new Error("Project index is undefined!")
    }
    const taskList: Task[] = projectsStore[projectIndex].tasks;
    // const [tasks, setTasks] = useState(localTasks); 

    function handleNewTask(e: Event){
        const target = e.target as HTMLButtonElement;
        const action = target.getAttribute("action");
        const taskIndex = editTaskModal.current!.getAttribute("data-taskIndex")
        //Check if heading and description input fields are not empty
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
        
        const startDate: Date = (target.parentElement!.children[1].children[1] as HTMLInputElement).value == '' ? new Date() : new Date( (target.parentElement!.children[1].children[1] as HTMLInputElement).value );
        const endDate: Date | null = (target.parentElement!.children[1].children[3] as HTMLInputElement).value == '' ? null : new Date( (target.parentElement!.children[1].children[3] as HTMLInputElement).value )

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

        if(action == "add"){
            dispatch(addTask({
                taskProjectIndex: projectIndex,
                task: newTask
            }))
        }else{
            dispatch(editTask({
                taskProjectIndex: projectIndex,
                task: newTask,
                taskIndex: taskIndex
            }))
        }
        
    }

    function handleEditTask(e: Event){
        const target = e.target as HTMLParagraphElement;
        const taskIndex = Number(target.parentElement!.parentElement!.getAttribute("data-index")!);
        const date = new Date(taskList[taskIndex].taskStartDate);
        const formatDate = date.getFullYear() + "-" + (date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getDate()
        editTaskModal.current!.children[0].children[0].children[1].children[0].innerHTML = taskList[taskIndex].taskPriority;
        (editTaskModal.current!.children[0].children[1].children[1] as HTMLInputElement).value = formatDate;
        (editTaskModal.current!.children[0].children[2] as HTMLInputElement).value = taskList[taskIndex].taskHeading;
        editTaskModal.current!.children[0].children[3].innerHTML = taskList[taskIndex].taskDescription;
        editTaskModal.current!.children[0].children[9].setAttribute("action", "edit");
        editTaskModal.current!.setAttribute("data-taskIndex", String(taskIndex))
        editTaskModal.current!.style.display = "block";
        
        // console.log(editTaskModal.current!.children[0].children[9])
    }

    function handleDeleteTask(e: Event){
        const target = e.target as HTMLParagraphElement;
        const taskIndex: number = Number(target.parentElement?.parentElement?.getAttribute("data-index"));
        const newTaskList = taskList.filter((task: Task, index: number) => {
            if(index === taskIndex){
                return false
            }
            return true
        })
        console.log("new tasklist", newTaskList)
        //Delete task from Redux store
        dispatch(deleteTask({
            taskProjectIndex: projectIndex,
            taskIndex: taskIndex
        }))
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
                    console.log("Open task modal");
                    editTaskModal.current!.children[0].children[9].setAttribute("action", "add");
                    editTaskModal.current!.style.display = "block";
                }}>
                    Create task
                </button>

                <TaskModal newTask={handleNewTask} taskList={taskList} ref={editTaskModal}/>
            </div>

            <div className="tasks-column tasks-queue">
                <h2 className="tasks-column__heading">Queue:</h2>

                {taskList.map((task: Task, index: number) => {
                    // console.log(taskList);
                    return <Task key={index} taskIndex={index} taskHeading={task.taskHeading} taskPriority={task.taskPriority} deleteTask={handleDeleteTask} editTask={handleEditTask}/>
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

const Task = (props: { taskIndex: number, taskHeading: string, taskPriority: string, deleteTask: (e: any) => void, editTask: (e: any) => void }) => {

    return (
        <div className="tasks-column-task" data-index={props.taskIndex}>
            <h3 className="tasks-column-task__name">{props.taskHeading}</h3>
            <div className='tasks-column-task-buttons'>
                <p className="tasks-column-task-buttons__priority">{props.taskPriority}</p>
                <p className="tasks-column-task-buttons__edit" onClick={(e) => {props.editTask(e)}} style={{color: "lightgreen"}}>&#9998;</p>
                <p onClick={(e) => {props.deleteTask(e)}} style={{color: "red"}}>&#10006;</p>
            </div>
        </div>
    )
}
//props: {newTask: (e: any) => void}, modalRef
const TaskModal = forwardRef<HTMLDivElement, {newTask: (e: any) => void, taskList: Task[]}>((props, ref) => {
    return(
        <div className="tasks-header-modal" ref={ref}>

            <div className="tasks-header-modal-content">

                <div className="tasks-header-modal-content-top">
                    <p className="tasks-header-modal-content-top__taskNum">{"№" + (props.taskList.length+1)}</p>
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

                <textarea className="tasks-header-modal-content__description"></textarea>

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
                    (ref as any).current.style.display = "none";
                }}>
                    Cancel
                </button>

                <button className="tasks-header-modal-content__done" onClick={(e) => {
                    props.newTask(e);
                    //Close modal
                    (ref as any).current.style.display = "none";
                }}>Done</button>

            </div>
        </div>
    )
})




export default TaskList