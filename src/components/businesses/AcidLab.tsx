import { useEffect, useState } from "react";
import formatMoney from "../../util/formatMoney";
import { formatTime } from "../../util/formatTime";
import useAcidLab from "../../zustand/bussinesses/acidLab";
import BussinessContainer from "./BussinessContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faTimes } from "@fortawesome/free-solid-svg-icons";
import InputField from "../general/input/InputField";
import RangeBars from "../general/range/RangeBars";
import Checkbox from "../general/input/Checkbox";

export default function AcidLab() {
    const [openSettings, setOpenSettings] = useState<boolean>(false)
    const {
        isActive,
        
        supplies,
        
        currentValue,
        maxValue,
        
        toggleActive,
        initBusiness,
        
        remainingConvertingTime,
        remainingFillingTime,

    } = useAcidLab();

    useEffect(() => {
        initBusiness()
    }, [initBusiness])

    return (
        <BussinessContainer
            isActive={isActive}
            toggleActive={toggleActive}
            bussinessName="Acid Lab"
            bussinessImage="media/acid-lab.jpg"
            bussinessDescription="Modifies and delivers vehicles for customers. Also allows for mini-heists called Robbery Contracts for extra income."
        >
            <div className="mt-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <p className="w-15 font-semibold text-sm">
                        Supplies
                    </p>
                    <RangeBars bars={5} percentage={supplies / 100} className="flex-1" />
                    <p className="w-25 text-sm jetbrains-mono">
                        {supplies.toFixed(2)}%
                    </p>
                    <p className="w-fit jetbrains-mono text-sm">
                        {formatTime(remainingConvertingTime)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="w-15 font-semibold text-sm">
                        Value
                    </p>
                    <RangeBars bars={5} percentage={currentValue/maxValue} className="flex-1" />
                    <p className="w-25 text-sm jetbrains-mono">
                        {formatMoney(currentValue)}/{formatMoney(maxValue)}
                    </p>
                    <p className="w-fit jetbrains-mono text-sm">
                        {formatTime(remainingFillingTime)}
                    </p>
                </div>
            </div>
            {/* Settings Button */}
            <button className="absolute top-2 right-2 p-2">
                <FontAwesomeIcon
                    icon={faGear}
                    className="w-5 h-5 text-white/50 hover:text-white transition-colors cursor-pointer"
                    onClick={() => {
                        setOpenSettings((state) => !state)
                    }}
                />
            </button>
            {openSettings &&
                <AcidLabSettings closeSettings={() => setOpenSettings(false)} />
            }
        </BussinessContainer>
    )
}

export function AcidLabSettings({ closeSettings }: { closeSettings: () => void }) {
    const {
        supplies,
        currentValue,
        maxValue,
        editSupplies,
        editValue,

        hasCustomName,
        toggleCustomName,

        hasEquipmentUpgrade,
        toggleEquipmentUpgrade
    } = useAcidLab();
    const [editProductValue, setEditProductValue] = useState<number>(Number(currentValue.toFixed(2)));
    const [editSupplyValue, setEditSupplyValue] = useState<number>(Number(supplies.toFixed(2)));

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg w-96 max-w-full relative">
                {/* Close Button */}
                <button
                    className="absolute top-2 right-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    onClick={closeSettings}
                >
                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-semibold text-white mb-4">Acid Lab Settings</h2>

                <div className="flex flex-col gap-1">
                    <div className="mb-2">
                        <div className="flex items-center gap-2">
                            <Checkbox value={hasEquipmentUpgrade} toggleFunc={() => toggleEquipmentUpgrade()} />
                            <p>Equipment Upgrade</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox value={hasCustomName} toggleFunc={() => toggleCustomName()} />
                            <p>Custom Name</p>
                        </div>
                    </div>
                    
                    {/* Supply Input */}
                    <div className="flex gap-1">
                        <InputField
                            label="Supplies"
                            placeholder="0 ... 100"
                            value={editSupplyValue}
                            onChange={setEditSupplyValue}
                        />
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
                            onClick={() => editSupplies(editSupplyValue)}
                        >
                            Save
                        </button>
                    </div>

                    {/* Value Input */}
                    <div className="flex gap-1">
                        <InputField
                            label="Value"
                            placeholder={`0 ... ${maxValue}`}
                            value={editProductValue}
                            onChange={setEditProductValue}
                        />
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
                            onClick={() => editValue(editProductValue)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}