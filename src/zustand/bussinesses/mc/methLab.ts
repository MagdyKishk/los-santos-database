import { BaseUpgrade } from "../../../types/store.type";
import { createBusinessStore } from "./create";

interface CocaineUpgrades extends BaseUpgrade {
    hasEquipmentUpgrade: {on: boolean, name: string};
    hasStaffUpgrade: {on: boolean, name: string};
}

const useMethLab = createBusinessStore<CocaineUpgrades>(
    'Meth Lab',
    'meth-lab.jpg',
    'Produces methamphetamine for high payouts. A solid MC business that requires frequent restocking to maintain steady earnings.',
    {
        initialValues: {
            maxValue: 446_250,
            maxTimeToFill: 21_600_000,
            maxTimeToConvert: 9_000_000,
        },
        getUpgradedValues: (upgrades) => {
            const maxValue = upgrades.hasEquipmentUpgrade.on
                ? upgrades.hasStaffUpgrade.on ? 446_250 : 395_250
                : upgrades.hasStaffUpgrade.on ? 395_250 : 344_240;

            const maxTimeToFill = upgrades.hasStaffUpgrade.on
                ? upgrades.hasEquipmentUpgrade.on ? 21_600_000 : 28_800_000
                : upgrades.hasEquipmentUpgrade.on ? 28_800_000 :  36_000_000;

            const maxTimeToConvert = upgrades.hasStaffUpgrade.on
                ? upgrades.hasEquipmentUpgrade.on ? 9_000_000 : 6_000_000
                : upgrades.hasEquipmentUpgrade.on ? 12_000_000 : 7_500_000;

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

export default useMethLab;