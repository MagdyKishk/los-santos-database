import cn from "../../util/cn";
import useOnline from "../../zustand/online";
import Checkbox from "../general/input/Checkbox";

interface BussinessContainerProps {
    bussinessName: string;
    bussinessDescription: string;
    bussinessImage: string;

    isActive: boolean;
    toggleActive: () => void;

    children?: React.ReactNode;
}

export default function BussinessContainer({
    bussinessName,
    bussinessDescription,
    bussinessImage,

    isActive,
    toggleActive,

    children,
}: BussinessContainerProps) {
    const { isOnline } = useOnline()

    return (
        <div className={cn(
            "relative",
            "bg-neutral-800",
            "rounded-md overflow-hidden",
            "min-h-fit max-h-96",
            "bg-cover"
            )}
            style={{backgroundImage: `url(${bussinessImage})`}}
        >
            <div className={cn(
                "w-full h-full",
                "bg-gradient-to-r from-neutral-800 via-neutral-800/80 to-transparent",
                "flex flex-col p-4 "
            )}>
                <div className={cn(
                    "w-4/5",
                    "flex flex-col gap-2"
                )}>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            value={isActive}
                            toggleFunc={toggleActive}
                            className={cn(
                                isOnline ? "group-hover:border-green-500" : "group-hover:border-yellow-500",
                                // Glow
                                isOnline
                                ? "group-hover:shadow-[0_0_10px_2px_rgba(34,197,94,0.7)]"
                                : "group-hover:shadow-[0_0_10px_2px_rgba(234,179,8,0.7)]",

                                // Background
                                isOnline? "peer-checked:bg-green-500" : "peer-checked:bg-yellow-500",
                                isOnline? "peer-checked:border-green-500" : "peer-checked:border-yellow-500",
                            )}
                        />
                        <h1 className="text-lg font-bold text-white">{ bussinessName }</h1>
                    </div>
                    <p className="text-xs text-neutral-400">{ bussinessDescription }</p>
                </div>
                <div>
                    {children ?? children}
                </div>
            </div>
        </div>
    )
}