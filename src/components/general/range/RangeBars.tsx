import cn from "../../../util/cn";

interface RangeBarsProps {
    bars: number;
    percentage: number;
    className: string;
}

export default function RangeBars({ bars, percentage, className }: RangeBarsProps) {
    return (
        <div className={cn("flex items-center gap-1", className)}>
        {Array.from({ length: bars }).map((_, index) => (
            <div
                key={index}
                className={cn(
                    "h-2 flex-1 rounded-full",
                    ((index + 1) / bars) <= percentage
                    ? "bg-green-500"
                    : "bg-neutral-900"
            )}
            />))}
        </div>
    );
}
