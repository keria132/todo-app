export function editTask(taskInfo: any) {
    return {
        type: "EDIT_TASK",
        payload: taskInfo
    }
};
