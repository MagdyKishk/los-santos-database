import { create } from "zustand";
import useOnline from "../../online";
import { BaseUpgrade, BusinessConfig, BusinessState } from "../../../types/store.type";

export function createBusinessStore<T extends BaseUpgrade>(
    formatedName: string,
    image: string,
    description: string,
    config: BusinessConfig<T>,
    initialUpgrades: T
) {
    type State = BusinessState<T>;
    type Store = State & {
        toggleActive: () => void;
        startProduction: () => void;
        updateProduction: () => void;
        editSupplies: (newValue: number) => void;
        editValue: (newValue: number) => void;
        toggleUpgrade: (key: keyof T, on?: boolean) => void;
        saveToLocalStorage: () => void;
        loadFromLocalStorage: () => void;
        initBusiness: () => void;
    };

    return create<Store>((set, get) => ({
        businessName: formatedName.toLowerCase().replace(/ /gi, ""),
        formatedName: formatedName,
        image: image,
        description: description,
        isActive: false,
        supplies: 100,
        currentValue: 0,
        maxValue: config.initialValues.maxValue,
        valuePerHours: 0,
        finishConvertingTime: 0,
        finishFillingTime: 0,
        remainingConvertingTime: 0,
        remainingFillingTime: 0,
        maxTimeToConvert: config.initialValues.maxTimeToConvert,
        maxTimeToFill: config.initialValues.maxTimeToFill,
        lastUpdate: 0,
        CheckingInterval: null,
        updateEvery: 1,
        upgrades: initialUpgrades,

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
            const state = get();
            const productionProgress = state.currentValue / state.maxValue;
            const newFinishFillingTime = Date.now() + state.maxTimeToFill * (1 - productionProgress);
            const newFinishConvertingTime = Date.now() + state.maxTimeToConvert * (state.supplies / 100);

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
                        }));
                    }
                }, 1000 * state.updateEvery),
            });
        },

        updateProduction: () => {
            set((state) => {
                const now = Date.now();

                if (!useOnline.getState().isOnline) {
                    const offlineDelta = now - state.lastUpdate;
                    return {
                        finishConvertingTime: state.finishConvertingTime + offlineDelta,
                        finishFillingTime: state.finishFillingTime + offlineDelta,
                        lastUpdate: now,
                    };
                }

                const remainingConvertingTime = state.finishConvertingTime - now;
                const remainingFillingTime = state.finishFillingTime - now;

                let newSupplies = (remainingConvertingTime / state.maxTimeToConvert) * 100;
                newSupplies = Math.max(0, Math.min(100, newSupplies));

                let productionFraction = 1 - (remainingFillingTime / state.maxTimeToFill);
                productionFraction = Math.max(0, Math.min(1, productionFraction));
                const newCurrentValue = productionFraction * state.maxValue;

                const newValuePerHour = (state.maxValue / state.maxTimeToFill * 1000 * 60 * 60);

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

        toggleUpgrade: (key: keyof T, on?: boolean) => {
            const state = get();
            const newUpgrades = { ...state.upgrades } as T;

            newUpgrades[key].on = (on == undefined ? !newUpgrades[key].on : on)

            const { maxValue, maxTimeToConvert, maxTimeToFill } = config.getUpgradedValues(newUpgrades);

            const newRemainingToFill = maxTimeToFill * (1 - (state.currentValue / maxValue));
            const newRemainingToConvert = maxTimeToConvert * (state.supplies / 100);

            set((state) => ({
                ...state,
                upgrades: newUpgrades,
                maxValue,
                maxTimeToConvert,
                maxTimeToFill,
                finishFillingTime: Date.now() + newRemainingToFill,
                finishConvertingTime: Date.now() + newRemainingToConvert,
                remainingFillingTime: newRemainingToFill,
                remainingConvertingTime: newRemainingToConvert,
            }));
        },

        editSupplies: (Value: number) => {
            const state = get();
            const newSupplies = Math.min(100, Math.max(0, Value));
            const newTimeToConvert = Date.now() + ((newSupplies / 100) * state.maxTimeToConvert);

            set(state => ({
                ...state,
                supplies: newSupplies,
                finishConvertingTime: newTimeToConvert,
                lastUpdate: Date.now(),
            }));
        },

        editValue: (Value: number) => {
            const state = get();
            const newCurrentValue = Math.min(state.maxValue, Math.max(0, Value));
            const newTimeToFill = Date.now() + ((1 - (newCurrentValue / state.maxValue)) * state.maxTimeToFill);

            set(state => ({
                ...state,
                currentValue: newCurrentValue,
                finishFillingTime: newTimeToFill,
                lastUpdate: Date.now(),
            }));
        },

        saveToLocalStorage: () => {
            const state = get();
            localStorage.setItem(`${state.businessName}_data`, JSON.stringify(state));
        },

        loadFromLocalStorage: () => {
            try {
                const { businessName } = get(); // Destructure only needed properties

                if (!businessName) {
                    console.warn("Business name is not set; skipping local storage load.");
                    return;
                }

                const data = localStorage.getItem(`${businessName}_data`);
                if (!data) return; // No data, nothing to load

                const parsedData = JSON.parse(data);

                const filteredData = Object.fromEntries(
                    Object.entries(parsedData).filter(([, val]) => val !== undefined)
                );

                set((state) => ({
                    ...state,
                    ...filteredData,
                    CheckingInterval: null,
                }));
            } catch (error) {
                console.error(`Error loading from localStorage:`, error);
            }
        },

        initBusiness: () => {
            get().loadFromLocalStorage();
            const state = get();
            if (state.isActive) {
                state.updateProduction();
            }
            if (state.isActive && !state.CheckingInterval) {
                state.startProduction();
            }
        },
    }));
}