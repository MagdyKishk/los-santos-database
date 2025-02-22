import { create } from "zustand";

interface OnlineStore {
    isOnline: boolean,
    toggleIsOnline: () => void;

    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
}

const useOnline = create<OnlineStore>((set, get) => ({
    isOnline: true,

    toggleIsOnline: () => {
        set((state) => ({ ...state, isOnline: !state.isOnline }))
        get().saveToLocalStorage()
    },

    saveToLocalStorage: () => {
        const state = get();
        localStorage.setItem(`online_data`, JSON.stringify(state));
    },

    loadFromLocalStorage: () => {
        try {
            const data = localStorage.getItem(`online_data`);
            if (data) {
                const parsedData = JSON.parse(data);
                set((state) => ({
                    ...state,
                    ...parsedData,
                }));
            }
        } catch (error) {
            console.error(`Error loading online_data:`, error);
        }
    }
}))

export default useOnline;