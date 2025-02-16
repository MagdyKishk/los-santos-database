import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faXmark } from "@fortawesome/free-solid-svg-icons";

// Zustand Store
import useTaskSchedular from "../../zustand/taskSchedular/useTaskSchedular";

// Types
import ScheduledTask from "../../types/ScheduledTask.type";

interface TaskProps {
  task: ScheduledTask;
}

export default function CurrentTask({ task }: TaskProps) {
  const { changeTimes, removeTask } = useTaskSchedular();

  return (
    <div
      className="
        relative flex items-center gap-2
        bg-neutral-800
        rounded-lg p-2
        transition-colors
        group
      "
    >
      {/* Task Icon (text-based, e.g., '📝') */}
      <span className="text-xl text-gray-300 hover:text-gray-100 transition-colors">
        {task.icon || '📝'}
      </span>

      {/* Task Name */}
      <p className="text-sm text-white">{task.name}</p>

      {/* Times Up/Down */}
      <div className="ml-auto flex items-center gap-2">
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => changeTimes(task.id, 'up')}
            className="text-neutral-400 hover:text-white h-3 w-3 flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon icon={faCaretUp} />
          </button>
          <span className="text-sm text-white">{task.times}</span>
          <button
            onClick={() => changeTimes(task.id, 'down')}
            className="text-neutral-400 hover:text-white h-3 w-3 flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon icon={faCaretDown} />
          </button>
        </div>
      </div>
      {/* Remove Button */}
      <div className="absolute left-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={() => {removeTask(task)}}>
        <FontAwesomeIcon  icon={faXmark} className="text-xs text-red-500"/>
      </div>
    </div>
  );
}
