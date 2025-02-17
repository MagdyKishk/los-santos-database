import { create } from "zustand";
import useOnline from "../online";

interface CocaineStore {
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
    hasStaffUpgrade: boolean,

    toggleActive: () => void;
    startProduction: () => void;
    updateProduction: () => void;

    editSupplies: (newValue: number) => void;
    editValue: (newValue: number) => void;

    toggleEquipmentUpgrade: (on?: boolean) => void;
    toggleStaffUpgrade: (on?: boolean) => void;

    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
    initBusiness: () => void;
}

const useCocaine = create<CocaineStore>((set, get) => ({
    isActive: false,
 
    supplies: 100,

    currentValue: 0,
    maxValue: 300_000,

    valuePerHours: 0,

    finishConvertingTime: 0,
    finishFillingTime: 0,

    remainingConvertingTime: 0,
    remainingFillingTime: 0,

    maxTimeToConvert: 6_000_000,
    maxTimeToFill: 30_000_000,

    lastUpdate: 0,

    CheckingInterval: null,
    updateEvery: 1,

    hasEquipmentUpgrade: false,
    hasStaffUpgrade: false,

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
        const { hasEquipmentUpgrade, hasStaffUpgrade, currentValue } = currentState;

        const newHasEquipmentUpgrade = on == undefined ? !hasEquipmentUpgrade : on;

        const newMaxValue = newHasEquipmentUpgrade
            ? hasStaffUpgrade ? 420_000 : 360_000
            : hasStaffUpgrade ? 360_000 : 300_000;

        const newMaxTtimeToFill = newHasEquipmentUpgrade
            ? hasStaffUpgrade ? 18_000_000 : 24_000_000
            : hasStaffUpgrade ? 24_000_000 : 30_000_000
        
        const newMaxTimeToConvert = newHasEquipmentUpgrade
            ? hasStaffUpgrade ? 7_200_000 : 9_600_000
            : hasStaffUpgrade ? 4_800_000 : 6_000_000

        const newRemainginToFill = (newMaxTtimeToFill * (1 - (currentValue / newMaxValue))); 
        const newRemainginToConvert = (newMaxTimeToConvert * (currentState.supplies / 100));
        
        const newTimeToFill = Date.now() + newRemainginToFill;
        const newTimeToConvert = Date.now() + newRemainginToConvert;

        set((state) => ({
            ...state,
            maxValue: newMaxValue,
            maxTimeToFill: newMaxTtimeToFill,
            maxTimeToConvert: newMaxTimeToConvert,
            finishFillingTime: newTimeToFill,
            finishConvertingTime: newTimeToConvert,
            hasEquipmentUpgrade: newHasEquipmentUpgrade,
            remainingFillingTime: newRemainginToFill,
            remainingConvertingTime: newRemainginToConvert,
        }))
        currentState.saveToLocalStorage()
    },
    toggleStaffUpgrade: (on?: boolean) => {
        const currentState = get();
        const { hasStaffUpgrade, hasEquipmentUpgrade, currentValue } = currentState;
        
        const newHasStaffpgrade = on === undefined ? !hasStaffUpgrade : on;
        
        const newMaxValue = newHasStaffpgrade
            ? hasEquipmentUpgrade ? 420_000 : 360_000
            : hasEquipmentUpgrade ? 360_000 : 300_000;
        
        const newMaxTtimeToFill = newHasStaffpgrade
            ? hasEquipmentUpgrade ? 18_000_000 : 24_000_000
            : hasEquipmentUpgrade ? 24_000_000 : 30_000_000;
        
        const newMaxTimeToConvert = newHasStaffpgrade
            ? hasEquipmentUpgrade ? 7_200_000 : 4_800_000
            : hasEquipmentUpgrade ? 9_600_000 : 6_000_000;
        
        const newRemainginToFill = (newMaxTtimeToFill * (1 - (currentValue / newMaxValue))); 
        const newRemainginToConvert = (newMaxTimeToConvert * (currentState.supplies / 100));
        
        const newTimeToFill = Date.now() + newRemainginToFill;
        const newTimeToConvert = Date.now() + newRemainginToConvert;

        set((state) => ({
            ...state,
            maxValue: newMaxValue,
            maxTimeToFill: newMaxTtimeToFill,
            maxTimeToConvert: newMaxTimeToConvert,
            finishFillingTime: newTimeToFill,
            finishConvertingTime: newTimeToConvert,
            hasStaffUpgrade: newHasStaffpgrade,
            remainingFillingTime: newRemainginToFill,
            remainingConvertingTime: newRemainginToConvert,
        }))
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
            hasStaffUpgrade,
        } = get();

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
            hasStaffUpgrade,
        };

        localStorage.setItem("cocaine_data", JSON.stringify(data));
    },
    loadFromLocalStorage: () => {
        try {
            const data = localStorage.getItem("cocaine_data");
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
                    hasStaffpgrade,
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
                    hasStaffUpgrade: hasStaffpgrade != undefined ? hasStaffpgrade : state.hasStaffUpgrade,
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

export default useCocaine;