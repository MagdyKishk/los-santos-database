import { useEffect, useRef } from "react";
import useTaskSchedular from "../../zustand/taskSchedular/useTaskSchedular";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import cn from "../../util/cn";
import formatTime_v2 from "../../util/formatTime_v2";
import formatMoney from "../../util/formatMoney";

export default function AddTaskMenu() {
    const inputEle = useRef<HTMLInputElement>(null);
    const { toggleOptionalTasksMenu, filteredTasks , addTask, searchOptionalTasks } = useTaskSchedular()

    useEffect(() => {
        inputEle.current?.focus();
    }, []);

    function handleSearch(query: string) {
        searchOptionalTasks(query.trim());
    }

    return (
        <div className={cn(
            "absolute inset-0",
            "w-full h-full",
            "flex items-center justify-center",
            "bg-black/40"
        )}>
            {/* Background Overlay */}
            <div
                onClick={toggleOptionalTasksMenu}
                className={cn(
                    "absolute inset-0",
                    "w-full h-full",
                    "backdrop-blur-sm"
                )}
            />

            {/* Search Box & Task List */}
            <div className="relative z-10 w-full max-w-2xl bg-neutral-900 text-white rounded-lg shadow-lg">
                {/* Search Bar */}
                <div className="flex items-center gap-3 p-3 border-b border-neutral-800">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    <input
                        ref={inputEle}
                        type="text"
                        placeholder="Start typing..."
                        className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {/* Task List */}
                <div className="max-h-[80vh] overflow-y-auto scrollbar-hide p-2">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <button
                                key={task.id}
                                className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-neutral-800 transition-all rounded-md cursor-pointer"
                                onClick={() => {
                                    addTask(task);
                                    toggleOptionalTasksMenu();
                                }}
                            >
                                <span className="text-gray-400">{task.icon}</span>
                                <p className="text-sm">{task.name}</p>
                                <div className="ml-auto text-right">
                                    <p className="text-xs">{formatTime_v2(task.min_time, task.max_time)}</p>
                                    <p className="text-xs text-green-500">{formatMoney(task.min_profit)}~{formatMoney(task.max_profit)}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No tasks found.</p>
                    )}
                </div>
            </div>
        </div>
   ) 
}