export interface BaseUpgrade {
    [key: string]: {on: boolean, name: string};
}

export interface BusinessConfig<T extends BaseUpgrade> {
    initialValues: {
        maxValue: number;
        maxTimeToConvert: number;
        maxTimeToFill: number;
    };
    getUpgradedValues: (upgrades: T) => {
        maxValue: number;
        maxTimeToConvert: number;
        maxTimeToFill: number;
    };
}

export interface BusinessState<T extends BaseUpgrade> {
    businessName: string,
    formatedName: string,
    image: string,
    description: string,
    isActive: boolean;
    supplies: number;
    currentValue: number;
    maxValue: number;
    valuePerHours: number;
    finishConvertingTime: number;
    finishFillingTime: number;
    remainingConvertingTime: number;
    remainingFillingTime: number;
    maxTimeToConvert: number;
    maxTimeToFill: number;
    lastUpdate: number;
    CheckingInterval: number | null;
    updateEvery: number;
    upgrades: T;
}