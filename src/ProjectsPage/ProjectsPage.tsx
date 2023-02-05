import { useState } from 'react'
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { addProject } from '../redux/actions/addProject'
import { deleteProjects } from '../redux/actions/deleteProjects'
import { AnyAction } from "redux"
import './ProjectsPage.scss'

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

function Projects(){

    //REDUX
    console.log("Redux state: ", useSelector((state: any) => state))
    const dispatch = useDispatch();
    const savedProjects = useSelector((state: any) => state.todos.projects)
    

    const [projects, setProjects] = useState(savedProjects);

    // console.log(projects)
    // console.log("localStorage: ", localStorage)

    function handleNewProject(e: React.FormEvent<HTMLButtonElement>){
        let target = e.target as HTMLElement;

        const projectName = (target.parentElement!.children[0] as HTMLInputElement).value;
        const projectDescription = (target.parentElement!.children[1] as HTMLTextAreaElement).value;
        const projectId = projects[projects.length-1] == undefined ? 1 : projects[projects.length-1].id
        
        if(projectName === ''){
            console.log('Enter project name!');
            (target.parentElement!.children[0] as HTMLElement).style.border = "1px solid red"
            return
        }
        (target.parentElement!.children[0] as HTMLElement).style.border = "none"

        if(projectDescription === ''){
            console.log('Enter project description!');
            (target.parentElement!.children[1] as HTMLElement).style.border = "1px solid red"
            return
        }
        (target.parentElement!.children[2] as HTMLElement).style.border = "none"

        const project: Project = {
            name: projectName,
            description: projectDescription,
            id: projectId,
            tasks: []
        }

        let newProjects = [...projects, project]
        localStorage.setItem("projects", JSON.stringify(newProjects))
        //Dispatch to redux store
        dispatch(addProject(project))
        //Close modal
        target.parentElement!.parentElement!.style.display = "none";

        setProjects(newProjects);
        
        
    }

    // dispatch(deleteProjects(null))

    return (
        <section className="projectsPage">
            <div className="projectsPage-header">
                <h1 className='projectsPage-header__h1'>My projects</h1>

                <button className='projectsPage-header__createButton' onClick={(e) => {
                    const target = e.target as any; //HTMLButtonElement doesnt have "style" property
                    console.log(target.parentElement!.children[2])
                    target.parentElement!.children[3].style.display = "block";
                }}>
                    Create new
                </button>

                <button className='projectsPage-header__deleteButton' onClick={(e) => {
                    const target = e.target as any; //HTMLButtonElement doesnt have "style" property
                    const verify = window.confirm("You sure?");
                    if(verify){
                        localStorage.clear();
                        dispatch(deleteProjects(null));
                        setProjects([]);
                    }
                }}>
                    Delete all
                </button>

                <div className="projectsPage-header-modal">

                    <div className="projectsPage-header-modal-content">

                        <input className="projectsPage-header-modal-content__heading" type="text" placeholder="Project name"/>

                        <textarea className="projectsPage-header-modal-content__description" placeholder="Project description">

                        </textarea>

                        <button className="projectsPage-header-modal-content__cancel" onClick={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.parentElement!.parentElement!.style.display = "none"
                        }}>
                            Cancel
                        </button>

                        <button className="projectsPage-header-modal-content__done" onClick={handleNewProject}>Done</button>

                    </div>
                </div>
                
            </div>

            {projects.map((project: Project, index: number) => {
                return (
                    <div className='projectsPage-project' key={index}>
                        <Link to={"/tasks/" + index}><h2 className="projectsPage-project__heading">{project.name}</h2></Link>
                        <div className='projectsPage-project__description'>
                            {project.description}
                        </div>
                    </div>
                )
            })}
        </section>
    )
}



export default Projects