import { useEffect, useState } from "react";
import formatMoney from "../../util/formatMoney";
import { formatTime } from "../../util/formatTime";
import BussinessContainer from "./BussinessContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import InputNumberField from "../general/input/InputField";
import RangeBars from "../general/range/RangeBars";
import Checkbox from "../general/input/Checkbox";
import SettingsContainer from "../general/settings/SettingsContainer";
import useMethLab from "../../zustand/bussinesses/mc/methLab";

export default function MethLab() {
    const [openSettings, setOpenSettings] = useState<boolean>(false)
    const {
        isActive,

        formatedName,
        image,
        description,
        
        supplies,
        
        currentValue,
        maxValue,
        
        toggleActive,
        initBusiness,
        
        remainingConvertingTime,
        remainingFillingTime,
        valuePerHours
    } = useMethLab();

    useEffect(() => {
        initBusiness()
    }, [initBusiness])

    return (
        <BussinessContainer
            isActive={isActive}
            toggleActive={toggleActive}
            bussinessName={formatedName}
            bussinessImage={image}
            bussinessDescription={description}
            valuePerHour={valuePerHours}
        >
            <div className="mt-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <p className="w-15 font-semibold text-sm">
                        Supplies
                    </p>
                    <RangeBars bars={5} percentage={supplies / 100} className="flex-1" />
                    <p className="w-22 text-sm jetbrains-mono">
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
                    <p className="w-22 text-sm jetbrains-mono">
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
                <MethSettings closeSettings={() => setOpenSettings(false)} />
            }
        </BussinessContainer>
    )
}

export function MethSettings({ closeSettings }: { closeSettings: () => void }) {
    const {
        supplies,
        currentValue,
        maxValue,
        editSupplies,
        editValue,
        upgrades,
        toggleUpgrade
    } = useMethLab();
    const [editProductValue, setEditProductValue] = useState<number>(Number(currentValue.toFixed(2)));
    const [editSupplyValue, setEditSupplyValue] = useState<number>(Number(supplies.toFixed(2)));
    const upgradesEntries = Object.entries(upgrades)

    return (
        <SettingsContainer closeSettings={closeSettings} label="Cocaine Lookup">
            {
                !!upgradesEntries.length &&
                <div className="mb-2">
                    {
                        upgradesEntries.map(([upgrade, value], index) =>
                            <div className="flex items-center gap-2" key={index}>
                                <Checkbox value={value.on} toggleFunc={() => toggleUpgrade(upgrade)} />
                                <p>{value.name}</p>
                            </div>
                        )
                    }
                </div>
            }

            {/* Supply Input */}
            <div className="flex gap-1">
                <InputNumberField
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
                <InputNumberField
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
        </SettingsContainer>
    );
}