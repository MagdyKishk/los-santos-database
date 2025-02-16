import { create } from "zustand";
import useOnline from "../online";

interface AcidLabStore {
    isActive: boolean

    supplies: number,

    currentValue: number,
    maxValue: number,

    finishConvertingTime: number,
    finishFillingTime: number,

    remainingConvertingTime: number,
    remainingFillingTime: number,

    maxTimeToConvert: number;
    maxTimeToFill: number;

    lastUpdate: number;

    CheckingInterval: number | null;
    updateEvery: number;

    toggleActive: () => void;
    startProduction: () => void;
    updateProduction: () => void;

    editSupplies: (newValue: number) => void;
    editValue: (newValue: number) => void;

    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
    initBusiness: () => void;
}

const useAcidLab = create<AcidLabStore>((set, get) => ({
    isActive: false,
 
    supplies: 100,

    currentValue: 0,
    maxValue: 351000,

    finishConvertingTime: 0,
    finishFillingTime: 0,

    remainingConvertingTime: 0,
    remainingFillingTime: 0,

    maxTimeToConvert: 7200000,
    maxTimeToFill: 13800000,

    lastUpdate: 0,

    CheckingInterval: null,
    updateEvery: 1,

    toggleActive: () => {
        const state = get();
        if (state.isActive) {
            if (state.CheckingInterval) clearInterval(state.CheckingInterval);
            set({ isActive: false, CheckingInterval: null });
            state.saveToLocalStorage();
        } else {
            state.startProduction();
        }
    },

    startProduction: () => {
        const currentState = get();
        const productionProgress = currentState.currentValue / currentState.maxValue;
        const newFinishFillingTime = Date.now() + currentState.maxTimeToFill * (1 - productionProgress);
        const newFinishConvertingTime = Date.now() + currentState.maxTimeToConvert * (currentState.supplies / 100);

        set({
            finishFillingTime: newFinishFillingTime,
            finishConvertingTime: newFinishConvertingTime,
            isActive: true,
            lastUpdate: Date.now(),
            CheckingInterval: window.setInterval(() => {
                if (get().supplies > 0 && get().currentValue < get().maxValue) {
                    get().updateProduction();
                    get().saveToLocalStorage();
                }
            }, 1000 * currentState.updateEvery),
        });
    },

    updateProduction: () => {
        set((state) => {
            const now = Date.now();

            // If offline, delay finish times by the offline duration.
            if (!useOnline.getState().isOnline) {
                const offlineDelta = now - state.lastUpdate;
                return {
                    finishConvertingTime: state.finishConvertingTime + offlineDelta,
                    finishFillingTime: state.finishFillingTime + offlineDelta,
                    lastUpdate: now,
                };
            }

            // Online: calculate remaining time
            const remainingConvertingTime = state.finishConvertingTime - now;
            const remainingFillingTime = state.finishFillingTime - now;

            let newSupplies = (remainingConvertingTime / state.maxTimeToConvert) * 100;
            newSupplies = Math.max(0, Math.min(100, newSupplies));

            let productionFraction = 1 - (remainingFillingTime / state.maxTimeToFill);
            productionFraction = Math.max(0, Math.min(1, productionFraction));
            const newCurrentValue = productionFraction * state.maxValue;

            return {
                supplies: newSupplies,
                currentValue: newCurrentValue,
                lastUpdate: now,
                remainingConvertingTime: Math.max(0, remainingConvertingTime),
                remainingFillingTime: Math.max(0, remainingFillingTime),
            };
        });
    },

    // Handle Edit
    editSupplies: (Value) => {
        const state = get()
        const newSupplies = Math.min(100, Math.max(0, Value));
        const newTimeToConvert = Date.now() + (((newSupplies / 100)) * state.maxTimeToConvert)

        set(state => ({
            ...state,
            supplies: newSupplies,
            finishConvertingTime: newTimeToConvert,
            lastUpdate: Date.now(),
        }))
    },
    editValue: (Value) => {
        const state = get()
        const newCurrentValue = Math.min(state.maxValue, Math.max(0, Value));
        const newTimeToConvert = Date.now() + ((1 - (newCurrentValue / state.maxValue)) * state.maxTimeToFill)

        set(state => ({
            ...state,
            currentValue: Math.min(state.maxValue, Math.max(0, newCurrentValue)),
            finishFillingTime: newTimeToConvert,
            lastUpdate: Date.now(),
        }))
    },

    // Handel localstorage
    saveToLocalStorage: () => {
        const {
            isActive,
            supplies,
            currentValue,
            finishConvertingTime,
            finishFillingTime,
            lastUpdate,
        } = useAcidLab.getState();

        const data = {
            isActive,
            supplies,
            currentValue,
            finishConvertingTime,
            finishFillingTime,
            lastUpdate,
        };

        localStorage.setItem("acidlab_data", JSON.stringify(data));
    },

    loadFromLocalStorage: () => {
        console.log("hi")
        try {
            const data = localStorage.getItem("acidlab_data");
            if (data) {
                const {
                    isActive,
                    supplies,
                    currentValue,
                    finishConvertingTime,
                    finishFillingTime,
                    lastUpdate,
                } = JSON.parse(data);
                set({
                    isActive,
                    supplies,
                    currentValue,
                    finishConvertingTime,
                    finishFillingTime,
                    lastUpdate,
                });
            }
        } catch (error) {
            console.error("Error loading acidlab_data:", error);
        }
    },

    initBusiness: () => {
        get().loadFromLocalStorage();
        const { isActive } = get();
        if (isActive) {
            get().updateProduction();
        }
        if (isActive && !get().CheckingInterval) {
            get().startProduction();
        }
    },
}))

export default useAcidLab;