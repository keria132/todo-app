import React from 'react';
import { HashRouter , BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectsPage from "./ProjectsPage/ProjectsPage"
import Tasks from './Tasks/Tasks';
import NoPage from './NoPage';
import { connect } from "react-redux";

function App() {
  return (
    <HashRouter>
        <Routes>
            <Route path="">
                <Route index element={<ProjectsPage />} />
                <Route path="/tasks/:projectIndex" element={<Tasks />} />
                <Route path="*" element={<NoPage />} />
            </Route>
        </Routes>
    </HashRouter>
  );
}

export default App;

//


// const mapStateToProps = (state: any) => ({
//     ...state
// });
  
// const mapDispatchToProps = (dispatch: any) => ({
//     editAction: () => dispatch(editAction),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(App);
