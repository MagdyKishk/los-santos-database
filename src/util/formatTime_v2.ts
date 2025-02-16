export default (minSeconds: number, maxSeconds: number) => {
    const formatTime = (seconds: number) => {
        if (seconds < 60) {
            return `${seconds} second${seconds !== 1 ? 's' : ''}`;
        }

        if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const minTime = formatTime(minSeconds);
    const maxTime = formatTime(maxSeconds);

    const unit = maxSeconds >= 3600 ? "hours" : "minutes";

    return `${minTime}${maxSeconds ? " ~ " + maxTime : ""} ${unit}`;
};
