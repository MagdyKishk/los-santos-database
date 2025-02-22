import { useEffect } from "react";
import cn from "../../util/cn";
import useOnline from "../../zustand/online";
import AcidLab from "./AcidLab";
import Bunker from "./Bunker";
import Cocaine from "./Cocaine";
import MethLab from "./MethLab";
import CounterFeit from "./CounterFeit";
import WeedFarm from "./WeedFarm";
import DocumentForgery from "./DocumentForgery";

interface BussinessManagerProps {
    className?: string
}

export default function BussinessManager({ className }: BussinessManagerProps) {
    const { isOnline, toggleIsOnline, loadFromLocalStorage } = useOnline();

    useEffect(() => {
        loadFromLocalStorage();
    }, [loadFromLocalStorage])

    return (
        <div className={cn(
            "p-4",
            "bg-neutral-900",
            "rounded-md",
            "flex flex-col",
            "h-full", // Add this to ensure full height
            className,
        )}>
            <div className="pb-4 px-2 flex items-center border-b border-neutral-800">
                <h1 className={cn(
                    "font-semibold tracking-wide",
                    "text-xl"
                )}>
                    Business Manager
                </h1>
                <button className={cn(
                        "ml-auto px-2 py-1 rounded-full",
                        "flex items-center justify-center",
                        "text-xs",
                        isOnline ? "bg-green-500" : "bg-red-500",
                        "hover:opacity-90 transition-opacity", // Add hover effect
                        "cursor-pointer"
                    )}
                    onClick={toggleIsOnline}
                >
                    {isOnline ? "Pause": "Resume"}
                </button>
            </div>
            <div className={cn(
                "w-full flex-1",
                "overflow-y-auto scrollbar-hide",
                "grid grid-cols-1 2xl:grid-cols-2",
                "gap-4 py-4",
                "auto-rows-min",
            )}>
                <AcidLab />
                <Bunker />
                <Cocaine />
                <MethLab />
                <CounterFeit />
                <WeedFarm />
                <DocumentForgery />
            </div>
        </div>
    )
}