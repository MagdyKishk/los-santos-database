// libs
import { create } from "zustand"

// Types
import OptionalTasksType from "../../types/optionalTasks.type";
import ScheduledTask from "../../types/ScheduledTask.type";

// Data
import defaultOptionalTasks from "../../data/OptionalTasks"

interface TaskSchedularStore {
    optionalTasksMenuOpen: boolean,

    toggleOptionalTasksMenu: () => void;
    searchOptionalTasks: (query: string) => void;

    optionalTasks: OptionalTasksType[],
    filteredTasks: OptionalTasksType[],

    currentTasks: ScheduledTask[],
    addTask: (task: OptionalTasksType) => void;
    removeTask: (task: ScheduledTask) => void;

    changeTimes: (taskId: number, direction: string) => void;

    saveToLocalStorage: () => void;
    loadToLocalStorage: () => void;
}

const useTaskSchedular = create<TaskSchedularStore>((set, get) => ({

    // Handle Optional Tasks Menu
    optionalTasksMenuOpen: false,

    toggleOptionalTasksMenu: () => {
        set((state) => ({
            optionalTasksMenuOpen: !state.optionalTasksMenuOpen
        }))
    },

    // Handel Search And Optional Tasks
    searchOptionalTasks: (query: string) => {
        if (query.length === 0) {
            set({filteredTasks: defaultOptionalTasks})
            return
        };

        const currentState = get();
        const newFilteredTasks = currentState.optionalTasks.filter(task => task.name.toLowerCase().includes(query.toLowerCase()));

        set({ filteredTasks: newFilteredTasks })
    },

    optionalTasks: defaultOptionalTasks,
    filteredTasks: defaultOptionalTasks,

    // Handle Current Tasks
    currentTasks: [],

    addTask: (newTask: OptionalTasksType) => {
        const currentState = get();

        // If Task Already Exist
        console.log(currentState.currentTasks)
        if (currentState.currentTasks.find(task => task.id == newTask.id)) return

        // Add newTask to currentTasks
        set((state) => ({
            ...state,
            currentTasks: [
                ...currentState.currentTasks,
                {
                    id: newTask.id,
                    name: newTask.name,
                    icon: newTask.icon,
                    times: 1,
                }
            ]
        }))

        currentState.saveToLocalStorage()
    },

    removeTask: (oldTask: ScheduledTask) => {
        const currentState = get();

        // If Task Doesn't Exist in currentTasks List
        if (!currentState.currentTasks.find(task => task.id == oldTask.id)) return

        set((state) => ({
            ...state,
            currentTasks: currentState.currentTasks.filter( task => task.id !== oldTask.id)
        }))

        currentState.saveToLocalStorage()

    },

    changeTimes: (taskId, direction) => {
        const currentState = get();

        const targetTask = currentState.currentTasks.find(task => task.id == taskId);

        if (!targetTask) return;

        if (targetTask.times <= 1 && direction === "down") {
            currentState.removeTask(targetTask);
            return;
        }

        set((state) => ({
            ...state,
            currentTasks: state.currentTasks.map((task) => {
                if (task.id !== taskId) return task;
                return { ...task, times: direction === "up" ? task.times + 1 : task.times - 1 }
            })
        }))

        currentState.saveToLocalStorage()
    },

    // Handle LocalStorage
    saveToLocalStorage: () => {
        const { currentTasks } = get();
        try {
            localStorage.setItem("taskSchedular", JSON.stringify(currentTasks))
        } catch (err) {
            console.error(err)
        }
    },

    loadToLocalStorage: () => {
        const storedData = localStorage.getItem("taskSchedular")

        if (!storedData) return
        set({
            currentTasks: JSON.parse(storedData)
        })
    },
}))

export default useTaskSchedular;