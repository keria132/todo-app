import TaskList from "../../Tasks/TaskList";

let projects = localStorage.getItem("projects");

if (projects != null){
    projects = JSON.parse(projects);
}

const initialState: any = {
    projects: projects
}

const todosReducer = (state = initialState, action: any) => {
    switch(action.type){
        case 'ADD_PROJECT':
            const newProjects = [...state.projects, action.payload];
            localStorage.setItem('projects', JSON.stringify(newProjects))
            return {
                projects: newProjects
            };
        case 'DELETE_PROJECTS':
            // projectsStore[projectIndex].tasks = newTaskList;
        // localStorage.setItem('projects', JSON.stringify(projectsStore));
        // console.log("-DELETE- New task list from store: ", projectsStore[projectIndex].tasks);
            //If payload null delete all projects
            if(action.payload === null){
                localStorage.setItem('projects', '[]')
                return{
                    projects: []
                }
            } 
            //If not, delete project by filter payload index
            const editProjects = [state.projects.filter((project: any, index: number) => {
                return index === action.payload ? false : true
            })]
            localStorage.setItem('projects', JSON.stringify(editProjects))
            return {
                projects: editProjects
            };
        case 'ADD_TASK':
            //Add task
            const newTasks = state.projects.map((project: any, index: number) => {
                if(action.payload.taskProjectIndex === index){
                    return {
                        ...project,
                        tasks: [...project.tasks, action.payload.task]
                    }
                }
                return project
            })
            //Set new tasks to localstore and then set the state
            localStorage.setItem('projects', JSON.stringify(newTasks))
            return {
                projects: newTasks
            };
        case 'EDIT_TASK':
            //Edit task
            const editedTasks = state.projects.map((project: any, index: number) => {
                if(action.payload.taskProjectIndex === index){
                    return {
                        ...project,
                        // tasks: [...project.tasks, action.payload.task]
                        tasks: project.tasks.map((task: any, index: number) => {
                            if(action.payload.taskIndex == index){
                                return action.payload.task
                            }
                            return task;
                        })
                    }
                }
                return project
            })
            //Set new tasks to localstore and then set the state
            localStorage.setItem('projects', JSON.stringify(editedTasks))
            return {
                projects: editedTasks
            };
        case 'DELETE_TASK':
            //Delete task
            const editTasks = state.projects.map((project: any, index: number) => {
                if(index === action.payload.taskProjectIndex){
                    return {
                        ...project,
                        tasks: project.tasks.filter((task: any, index: number) => {
                            if(index === action.payload.taskIndex){
                                return false
                            }
                            return true;
                        })
                    }
                }
                return project
            })
            //Set new tasks to localstore and then set the state
            localStorage.setItem('projects', JSON.stringify(editTasks))
            return {
                projects: editTasks
            };
        default:
            return state
    }
}

export default todosReducer;