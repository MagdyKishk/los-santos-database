import cn from "../../../util/cn";

interface CheckBoxType {
    value: boolean,
    toggleFunc: () => void,
    className?: string
}

export default function Checkbox({value, toggleFunc, className}: CheckBoxType) {
    return (
        <label className="relative inline-flex items-center group cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={toggleFunc}
            />
            <div
                className={cn("w-4 h-4",
                    "bg-neutral-900",
                    "border-2 border-neutral-700",
                    "rounded",
                    "transition-all duration-300",
                    "relative",
                    /* Neon Hover */
                    "group-hover:border-green-500",

                    /* When Checked: Green fill & border, plus a glow */
                    "peer-checked:bg-green-500",
                    "peer-checked:border-green-500",
                    className
                )}
            >
            </div>
        </label>
    )
}