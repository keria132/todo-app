export function deleteProjects(projectIndex?: number | null) {
    return {
        type: "DELETE_PROJECTS",
        payload: projectIndex
    }
};
