import { combineReducers } from "redux"
// import tasksReducer from "./tasksReducer"
// import projectsReducer from "./projectsReducer"
import todosReducer from "./todosReducer"

// const reducers = combineReducers({
//     projectsList: projectsReducer,
//     tasksList: tasksReducer
// })

const reducers = combineReducers({
    todos: todosReducer
})

export default reducers