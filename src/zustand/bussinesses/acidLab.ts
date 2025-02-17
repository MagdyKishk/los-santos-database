import { create } from "zustand";
import useOnline from "../online";

interface AcidLabStore {
    isActive: boolean

    supplies: number,

    currentValue: number,
    maxValue: number,

    valuePerHours: number,

    finishConvertingTime: number,
    finishFillingTime: number,

    remainingConvertingTime: number,
    remainingFillingTime: number,

    maxTimeToConvert: number;
    maxTimeToFill: number;

    lastUpdate: number;

    CheckingInterval: number | null;
    updateEvery: number;

    hasEquipmentUpgrade: boolean,
    hasCustomName: boolean,

    toggleActive: () => void;
    startProduction: () => void;
    updateProduction: () => void;

    editSupplies: (newValue: number) => void;
    editValue: (newValue: number) => void;

    toggleEquipmentUpgrade: (on?: boolean) => void;
    toggleCustomName: (on?: boolean) => void;

    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
    initBusiness: () => void;
}

const useAcidLab = create<AcidLabStore>((set, get) => ({
    isActive: false,
 
    supplies: 100,

    currentValue: 0,
    maxValue: 237_600,

    valuePerHours: 0,

    finishConvertingTime: 0,
    finishFillingTime: 0,

    remainingConvertingTime: 0,
    remainingFillingTime: 0,

    maxTimeToConvert: 7_200_000,
    maxTimeToFill: 21_600_000,

    lastUpdate: 0,

    CheckingInterval: null,
    updateEvery: 1,

    hasEquipmentUpgrade: false,
    hasCustomName: false,

    toggleActive: () => {
        const state = get();
        if (state.isActive) {
            if (state.CheckingInterval) clearInterval(state.CheckingInterval);
            set({
                isActive: false,
                CheckingInterval: null,
                valuePerHours: 0
            });
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
                } else {
                    set((state) => ({
                        ...state,
                        valuePerHours: 0,
                    }))
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

            const newValuePerHour = (state.maxValue / state.maxTimeToFill * 1000 * 60 * 60) 

            return {
                supplies: newSupplies,
                currentValue: newCurrentValue,
                lastUpdate: now,
                remainingConvertingTime: Math.max(0, remainingConvertingTime),
                remainingFillingTime: Math.max(0, remainingFillingTime),
                valuePerHours: newValuePerHour,
            };
        });
    },

    toggleEquipmentUpgrade: (on) => {
        const currentState = get();
        const { hasEquipmentUpgrade, hasCustomName, currentValue } = currentState;

        const newHasEquipmentUpgrade = on == undefined ? !hasEquipmentUpgrade : on;

        const newMaxValue = newHasEquipmentUpgrade
            ? hasCustomName ? 351_000 : 335_200
            : hasCustomName ? 249_440 : 237_600;

        const newMaxTtimeToFill = newHasEquipmentUpgrade ? 14_400000: 21_600000

        const newTimeToFill = Date.now() + (newMaxTtimeToFill * (1 - (currentValue / newMaxValue)));

        set((state) => ({
            ...state,
            maxValue: newMaxValue,
            maxTimeToFill: newMaxTtimeToFill,
            finishFillingTime: newTimeToFill,
            hasEquipmentUpgrade: newHasEquipmentUpgrade
        }))
        currentState.saveToLocalStorage()
    },
    toggleCustomName: (on?: boolean) => {
        const currentState = get();
        const { hasCustomName, hasEquipmentUpgrade, maxTimeToFill, currentValue } = currentState;
        
        const newHasCustomName = on === undefined ? !hasCustomName : on;
        
        const newMaxValue = newHasCustomName
        ? hasEquipmentUpgrade ? 351_000 : 249_440
        : hasEquipmentUpgrade ? 335_200 : 237_600;
        
        const newTimeToFill = Date.now() + (maxTimeToFill * (1 - (currentValue / newMaxValue)));
        
        set((state) => ({
            ...state,
            maxValue: newMaxValue,
            finishFillingTime: newTimeToFill,
            hasCustomName: newHasCustomName,
        }));
        currentState.saveToLocalStorage()
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
            maxValue,

            finishConvertingTime,
            finishFillingTime,

            remainingConvertingTime,
            remainingFillingTime,

            maxTimeToConvert,
            maxTimeToFill,

            lastUpdate,

            updateEvery,

            hasEquipmentUpgrade,
            hasCustomName,
        } = useAcidLab.getState();

        const data = {
            isActive,
            supplies,

            currentValue,
            maxValue,

            finishConvertingTime,
            finishFillingTime,

            remainingConvertingTime,
            remainingFillingTime,

            maxTimeToConvert,
            maxTimeToFill,

            lastUpdate,

            updateEvery,

            hasEquipmentUpgrade,
            hasCustomName,
        };

        localStorage.setItem("acidlab_data", JSON.stringify(data));
    },
    loadFromLocalStorage: () => {
        try {
            const data = localStorage.getItem("acidlab_data");
            if (data) {
                const {
                    isActive,
                    supplies,

                    currentValue,
                    maxValue,

                    finishConvertingTime,
                    finishFillingTime,

                    remainingConvertingTime,
                    remainingFillingTime,

                    maxTimeToConvert,
                    maxTimeToFill,

                    lastUpdate,

                    updateEvery,

                    hasEquipmentUpgrade,
                    hasCustomName,
                } = JSON.parse(data);
                set((state) => ({
                    ...state,
                    isActive: isActive != undefined ? isActive : state.isActive,
                    supplies: supplies != undefined ? supplies : state.supplies,
                    currentValue: currentValue != undefined ? currentValue : state.currentValue,
                    maxValue: maxValue != undefined ? maxValue : state.maxValue,
                    finishConvertingTime: finishConvertingTime != undefined ? finishConvertingTime : state.finishConvertingTime,
                    finishFillingTime: finishFillingTime != undefined ? finishFillingTime : state.finishFillingTime,
                    remainingConvertingTime: remainingConvertingTime != undefined ? remainingConvertingTime : state.remainingConvertingTime,
                    remainingFillingTime: remainingFillingTime != undefined ? remainingFillingTime : state.remainingFillingTime,
                    maxTimeToConvert: maxTimeToConvert != undefined ? maxTimeToConvert : state.maxTimeToConvert,
                    maxTimeToFill: maxTimeToFill != undefined ? maxTimeToFill : state.maxTimeToFill,
                    lastUpdate: lastUpdate != undefined ? lastUpdate : state.lastUpdate,
                    updateEvery: updateEvery != undefined ? updateEvery : state.updateEvery,
                    hasEquipmentUpgrade: hasEquipmentUpgrade != undefined ? hasEquipmentUpgrade : state.hasEquipmentUpgrade,
                    hasCustomName: hasCustomName != undefined ? hasCustomName : state.hasCustomName,
                }));
            }
        } catch (error) {
            console.error("Error loading acidlab_data:", error);
        }
    },

    initBusiness: () => {
        get().loadFromLocalStorage();
        const {
            isActive,
            updateProduction,
            startProduction,
        } = get();
        if (isActive) {
            updateProduction();
        }
        if (isActive && !get().CheckingInterval) {
            startProduction();
        }
    },
}))

export default useAcidLab;