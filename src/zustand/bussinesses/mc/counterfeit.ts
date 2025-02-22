import { BaseUpgrade } from "../../../types/store.type";
import { createBusinessStore } from "./create";

interface CounterFeitUpgrades extends BaseUpgrade {
    hasEquipmentUpgrade: {on: boolean, name: string};
    hasStaffUpgrade: {on: boolean, name: string};
}

const useCounterFeit = createBusinessStore<CounterFeitUpgrades>(
    'Counter Feit Cash Factory',
    'counterfeit-cash.jpg',
    'Generates fake money for passive income. Decent mid-tier MC business that works best when combined with other revenue sources.',
    {
        initialValues: {
            maxValue: 283_500,
            maxTimeToFill: 28_800_000,
            maxTimeToConvert: 7_200_000,
        },
        getUpgradedValues: (upgrades) => {
            const maxValue = upgrades.hasEquipmentUpgrade.on
                ? upgrades.hasStaffUpgrade.on ? 367_500 : 325_500
                : upgrades.hasStaffUpgrade.on ? 325_500 : 283_500;

            const maxTimeToFill = upgrades.hasStaffUpgrade.on
                ? upgrades.hasEquipmentUpgrade.on ? 19_200_000 : 24_000_000
                : upgrades.hasEquipmentUpgrade.on ? 24_000_000 :  28_800_000;

            const maxTimeToConvert = upgrades.hasStaffUpgrade.on
                ? upgrades.hasEquipmentUpgrade.on ? 9_600_000 : 6_000_000
                : upgrades.hasEquipmentUpgrade.on ? 12_000_000 : 7_200_000;

            return {
                maxValue,
                maxTimeToConvert,
                maxTimeToFill,
            };
        }
    },
    {
        hasEquipmentUpgrade: {on: false, name: "Equipment Upgrade"},
        hasStaffUpgrade: {on: false, name: "Staff Upgrade"},
    }
);

export default useCounterFeit;