import { useEffect } from "react";
import cn from "../../util/cn";
import useTaskSchedular from "../../zustand/taskSchedular/useTaskSchedular";
import AddTaskMenu from "./AddTaskMenu";
import CurrentTask from "./CurrentTask";

interface TaskSchedularProps {
    className?: string,
}
export default function TaskSchedular({ className }: TaskSchedularProps) {
    const { currentTasks, toggleOptionalTasksMenu, optionalTasksMenuOpen, loadToLocalStorage } = useTaskSchedular();

    useEffect(() => {
        loadToLocalStorage()
    }, [loadToLocalStorage])

    return (
        <div className={cn(
            "flex flex-col",
            "p-4",
            "bg-neutral-900",
            "rounded-md",
            className
        )}>
            <h1 className={cn(
                "text-center pb-4 font-semibold tracking-wide",
                "border-b border-neutral-800",
                "text-xl"
            )}>Task Schedular</h1>
            <div className={cn(
                "overflow-y-auto scrollbar-hide",
                "my-2 gap-2",
                "flex flex-col"
            )}>
                {
                    currentTasks.length ? 
                        currentTasks.map(task => <CurrentTask task={task} key={task.id} />) : 
                    <p className="text-center text-sm text-neutral-400">There are no tasks yet. Click 'Add Task' to create one.</p>
                }
            </div>
            <button
                className={cn(
                    "w-full p-2 mt-auto",
                    "rounded-full",
                    "text-center text-sm font-semibold tracking-wide capitalize",
                    "bg-neutral-800 hover:bg-neutral-700 transition-colors duration-300",
                    "cursor-pointer"
                )}
                onClick={toggleOptionalTasksMenu}
            >
                Add Task
            </button>
            {optionalTasksMenuOpen && <AddTaskMenu />}
        </div>
    )
}