// util
import cn from "./util/cn"

// components
import BussinessManager from "./components/businesses/BussinessManager"
import TaskSchedular from "./components/taskSchedular/TaskSchedular"

function App() {

    return (
        <div className={cn(
            "flex flex-col lg:flex-row gap-4",
            "h-screen w-screen p-4",
            "bg-neutral-950",
            "overflow-hidden",
            "text-neutral-200"
        )}>
            <BussinessManager className="w-full lg:w-2/3 h-2/3 lg:h-full" />
            <TaskSchedular className="w-full lg:w-1/3 h-1/3 lg:h-full" />
        </div>
    )
}

export default App
