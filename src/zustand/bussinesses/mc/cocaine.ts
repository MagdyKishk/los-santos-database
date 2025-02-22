import { BaseUpgrade } from "../../../types/store.type";
import { createBusinessStore } from "./create";

interface CocaineUpgrades extends BaseUpgrade {
    hasEquipmentUpgrade: {on: boolean, name: string};
    hasStaffUpgrade: {on: boolean, name: string};
}

const useCocaine = createBusinessStore<CocaineUpgrades>(
    'Cocaine Lockup',
    'cocaine-lockup.jpg',
    'The most profitable MC business, producing and selling cocaine. Requires resupplying and upgrades to maximize earnings.',
    {
        initialValues: {
            maxValue: 525_000,
            maxTimeToConvert: 7_200_000,
            maxTimeToFill: 18_000_000,
        },
        getUpgradedValues: (upgrades) => {
            const maxValue = upgrades.hasEquipmentUpgrade.on
                ? upgrades.hasStaffUpgrade.on ? 525_000 : 465_000
                : upgrades.hasStaffUpgrade.on ? 465_000 : 405_000;

            const maxTimeToFill = upgrades.hasStaffUpgrade.on
                ? upgrades.hasEquipmentUpgrade.on ? 18_000_000 : 24_000_000
                : upgrades.hasEquipmentUpgrade.on ? 24_000_000 : 30_000_000;

            const maxTimeToConvert = upgrades.hasStaffUpgrade.on
                ? upgrades.hasEquipmentUpgrade.on ? 7_200_000 : 4_800_000
                : upgrades.hasEquipmentUpgrade.on ? 9_600_000 : 9_600_000;

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

export default useCocaine;