import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BleManager } from "react-native-ble-plx";

const BleContext = createContext<BleManager | null>(null);

type BleProviderProps = { children: ReactNode; };

export const BleProvider = ({ children }: BleProviderProps) => {
    const [manager] = useState(() => new BleManager());

    useEffect(() => {
        return () => {
            manager.destroy();
        };
    }, [manager]);

    return (
        <BleContext.Provider value={manager}>
            {children}
        </BleContext.Provider>
    );
};

export const useBleManager = () => {
    const ctx = useContext(BleContext);
    if (!ctx) throw new Error("useBleManager must be used within a BleProvider");
    return ctx;
};