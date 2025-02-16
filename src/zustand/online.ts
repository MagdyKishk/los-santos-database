import { create } from "zustand";

interface OnlineStore {
    isOnline: boolean,
    toggleIsOnline: () => void;
}

const useOnline = create<OnlineStore>((set) => ({
    isOnline: true,

    toggleIsOnline: () => {
        set((state) => ({ ...state, isOnline: !state.isOnline }))
    },
}))

export default useOnline;