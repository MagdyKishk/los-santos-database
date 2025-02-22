import { BaseUpgrade } from "../../../types/store.type";
import { createBusinessStore } from "./create";

interface CocaineUpgrades extends BaseUpgrade {
    hasEquipmentUpgrade: {on: boolean, name: string};
    hasStaffUpgrade: {on: boolean, name: string};
}

const useDocumentForgery = createBusinessStore<CocaineUpgrades>(
    'Document Forgery Office',
    'meth-lab.jpg',
    'The least profitable MC business, producing fake documents. Useful only if linked to a nightclub for passive income.',
    {
        initialValues: {
            maxValue: 121_500,
            maxTimeToFill: 18_000_000,
            maxTimeToConvert: 7_500_000,
        },
        getUpgradedValues: (upgrades) => {
            const maxValue = upgrades.hasEquipmentUpgrade.on
                ? upgrades.hasStaffUpgrade.on ? 157_500 : 139_500
                : upgrades.hasStaffUpgrade.on ? 139_500 : 121_500;

            const maxTimeToFill = upgrades.hasStaffUpgrade.on
                ? upgrades.hasEquipmentUpgrade.on ? 10_800_000 : 14_400_000
                : upgrades.hasEquipmentUpgrade.on ? 14_400_000 :  18_000_000;

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

export default useDocumentForgery;