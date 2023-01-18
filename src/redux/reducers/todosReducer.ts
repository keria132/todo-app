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
            return {
                projects: [...state.projects, action.payload]
            };
        case 'DELETE_PROJECTS':
            //If payload null delete all projects
            if(action.payload === null) return{
                projects: []
            }
            //If not, delete project by filter payload index
            return {
                projects: [state.projects.filter((project: any, index: number) => {
                    return index === action.payload ? false : true
                })]
            };
        case 'ADD_TASK':
            return {
                projects: state.projects.map((project: any, index: number) => {
                    if(action.payload.taskProjectIndex === index){
                        return {
                            ...project,
                            tasks: [...project.tasks, action.payload.task]
                        }
                    }
                    return project
                })
            };
        case 'DELETE_TASK':
            return {
                projects: state.projects.map((project: any, index: number) => {
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
            };
        default:
            return state
    }
}

export default todosReducer;