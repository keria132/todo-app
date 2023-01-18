export function addTask(taskInfo: any) {
    return {
        type: "ADD_TASK",
        payload: taskInfo
    }
};
