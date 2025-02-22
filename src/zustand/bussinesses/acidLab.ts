import { BaseUpgrade } from "../../types/store.type";
import { createBusinessStore } from "./mc/create";


interface AcidLabUpgrades extends BaseUpgrade {
    hasEquipmentUpgrade: {on: boolean, name: string};
    hasCustomName: {on: boolean, name: string};
}

const useAcidLab = createBusinessStore<AcidLabUpgrades>(
    'Acid Lab',
    'acid-lab.jpg',
    'Modifies and delivers vehicles for customers. Also allows for mini-heists called Robbery Contracts for extra income.',
    {
        initialValues: {
            maxValue: 237_600,
            maxTimeToConvert: 7_200_000,
            maxTimeToFill: 21_600_000,
        },
        getUpgradedValues: (upgrades) => {
            const maxValue = upgrades.hasEquipmentUpgrade.on
                ? upgrades.hasCustomName.on ? 351_000 : 335_200
                : upgrades.hasCustomName.on ? 249_440 : 237_600;

            return {
                maxValue,
                maxTimeToConvert: 7_200_000,
                maxTimeToFill: upgrades.hasEquipmentUpgrade.on
                    ? 14_400_000
                    : 21_600_000,
            };
        }
    },
    {
        hasEquipmentUpgrade: {on: false, name: "Equipment Upgrade"},
        hasCustomName: {on: false, name: "Custom Name"},
    }
);

export default useAcidLab;