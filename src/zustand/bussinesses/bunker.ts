import { BaseUpgrade } from "../../types/store.type";
import { createBusinessStore } from "./mc/create";

interface BunkerUpgrades extends BaseUpgrade {
    hasEquipmentUpgrade: {on: boolean, name: string};
    hasStaffUpgrade: {on: boolean, name: string};
}

const useBunker = createBusinessStore<BunkerUpgrades>(
    'Gunrunning (Bunker)',
    'bunker.jpg',
    'Produces and sells illegal weapons. A high-profit, low-maintenance business with strong payouts and passive income potential.',
    {
        initialValues: {
            maxValue: 1_050_000,
            maxTimeToConvert: 6_000_000,
            maxTimeToFill: 61_200_000,
        },
        getUpgradedValues: (upgrades) => ({
            maxValue: upgrades.hasEquipmentUpgrade.on
                ? 1_050_000
                : 900_000,

            maxTimeToConvert: upgrades.hasEquipmentUpgrade.on
                ? upgrades.hasStaffUpgrade.on ? 8_400_000 : 10_200_000
                : upgrades.hasStaffUpgrade.on ? 5_100_000 : 6_000_000,

            maxTimeToFill: upgrades.hasStaffUpgrade.on
                ? 42_000_000
                : 51_000_000,
        })
    },
    {
        hasEquipmentUpgrade: {on: false, name: "Equipment Upgrade"},
        hasStaffUpgrade: {on: false, name: "Staff Upgrade"},
    }
);

export default useBunker