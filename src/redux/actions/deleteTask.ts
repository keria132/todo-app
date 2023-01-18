export function deleteTask(taskInfo: any) {
    return {
        type: "DELETE_TASK",
        payload: taskInfo
    }
};
