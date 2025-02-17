import cn from "../../util/cn";
import useOnline from "../../zustand/online";
import AcidLab from "./AcidLab";
import Bunker from "./Bunker";
import Cocaine from "./Cocaine";

interface BussinessManagerProps {
    className?: string
}

export default function BussinessManager({ className }: BussinessManagerProps) {
    const { isOnline, toggleIsOnline } = useOnline();


    return (
        <div className={cn(
            "h-2/3 md:h-full w-2/3 p-4",
            "bg-neutral-900",
            "rounded-md",
            "flex flex-col",
            className,
        )}>
            <div className="pb-4 px-2 flex items-center border-b border-neutral-800">
                <h1 className={cn(
                    "font-semibold tracking-wide",
                    "text-xl"
                )}>
                    Bussiness Manager
                </h1>
                <button className={cn(
                        "ml-auto px-2 py-1 rounded-full",
                        "flex items-center justify-center",
                        "text-xs",
                        isOnline ? "bg-green-500" : "bg-red-500",
                        "cursor-pointer"
                    )}
                    onClick={toggleIsOnline}
                >
                    {isOnline ? "Pause": "Resume"}
                </button>
            </div>
            <div className={cn(
                "w-full",
                "overflow-y-scroll scrollbar-hide",
                "grid grid-cols-1 xl:grid-cols-2 gap-4 py-4",
            )}>
                <AcidLab />
                <Bunker />
                <Cocaine />
            </div>
        </div>
    )
}