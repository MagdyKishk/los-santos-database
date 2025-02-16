interface InputFieldProps {
    label: string;
    type?: "text" | "number";
    placeholder?: string;
    value: number | string;
    onChange: (value: number) => void;
}

export default function InputField({ label, type = "number", placeholder, value, onChange }: InputFieldProps) {
    return (
        <div className="flex items-center gap-2">
            <label className="text-neutral-400 w-20">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md 
                           focus:ring-2 focus:ring-blue-500 text-white"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </div>
    );
}
