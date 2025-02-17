import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SettingsContainerProps {
    label: string,
    closeSettings: () => void,
    
    children: React.ReactNode
}

export default function SettingsContainer({ label, closeSettings, children }: SettingsContainerProps) {
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div
                onClick={closeSettings}
                className="absolute top-0 left-0 h-full w-full bg-black/60 p-6 rounded-lg shadow-lg max-w-full"
            >
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg w-96 max-w-full relative">
                {/* Close Button */}
                <button
                    className="absolute top-2 right-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    onClick={closeSettings}
                >
                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
                {/* Label */}
                <h2 className="text-lg font-semibold text-white mb-4">{label} Settings</h2>
                {/* Body */}
                <div className="flex flex-col gap-1">
                    {children}
                </div>
            </div>
        </div>
    );
}