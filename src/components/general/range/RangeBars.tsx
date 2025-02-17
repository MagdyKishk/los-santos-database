import cn from "../../../util/cn";

interface RangeBarsProps {
    bars: number;
    percentage: number;
    className?: string;
}

export default function RangeBars({ bars, percentage, className }: RangeBarsProps) {
    const filledBars = Math.floor(bars * percentage);
    const remainingPercentage = (percentage * bars) % 1;

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {/* Filled bars */}
            {Array.from({ length: filledBars }).map((_, index) => (
                <div key={index} className="h-2 flex-1 bg-green-500" />
            ))}

            {/* Partial bar (only if there's a remainder) */}
            {remainingPercentage > 0 && (
                <div
                    className="h-2 flex-1"
                    style={{
                        background: `linear-gradient(to right, var(--color-green-500) ${remainingPercentage * 100}%, var(--color-neutral-900) ${remainingPercentage * 100}%)`
                    }}
                />
            )}

            {/* Empty bars */}
            {Array.from({ length: bars - filledBars - (remainingPercentage > 0 ? 1 : 0) }).map((_, index) => (
                <div key={index} className="h-2 flex-1 bg-neutral-900" />
            ))}
        </div>
    );
}
