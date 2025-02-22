import { BaseUpgrade } from "../../../types/store.type";
import { createBusinessStore } from "./create";

interface WeedUpgrades extends BaseUpgrade {
    hasEquipmentUpgrade: {on: boolean, name: string};
    hasStaffUpgrade: {on: boolean, name: string};
}

const useWeedFarm = createBusinessStore<WeedUpgrades>(
    'Weed Farm',
    'weed-farm.jpg',
    'A lower-tier MC business that produces marijuana. Profits are lower, but it provides a steady revenue stream when fully upgraded.',
    {
        initialValues: {
            maxValue: 243_000,
            maxTimeToFill: 28_800_000,
            maxTimeToConvert: 9_000_000,
        },
        getUpgradedValues: (upgrades) => {
            const maxValue = upgrades.hasEquipmentUpgrade.on
                ? upgrades.hasStaffUpgrade.on ? 315_000 : 279_000
                : upgrades.hasStaffUpgrade.on ? 279_000 : 243_000;

            const maxTimeToFill = upgrades.hasStaffUpgrade.on
                ? upgrades.hasEquipmentUpgrade.on ? 19_200_000 : 24_000_000
                : upgrades.hasEquipmentUpgrade.on ? 24_000_000 :  28_800_000;

            const maxTimeToConvert = upgrades.hasStaffUpgrade.on
                ? upgrades.hasEquipmentUpgrade.on ? 12_000_000 : 7_500_000
                : upgrades.hasEquipmentUpgrade.on ? 15_000_000 : 9_000_000;

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

export default useWeedFarm;