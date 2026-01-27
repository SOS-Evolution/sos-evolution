"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { TarotFrameId } from "@/components/features/tarot/frames";
import { getSystemSettings } from "@/app/admin/settings/actions";

interface ConfigContextType {
    tarotFrame: TarotFrameId;
    refreshSettings: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({
    children,
    initialSettings
}: {
    children: React.ReactNode;
    initialSettings?: any[]
}) {
    const [settings, setSettings] = useState<any[]>(initialSettings || []);

    const tarotFrame = (settings.find(s => s.key === "tarot_frame")?.value as TarotFrameId) || "celestial";

    const refreshSettings = async () => {
        try {
            const data = await getSystemSettings();
            setSettings(data);
        } catch (error) {
            console.error("Error refreshing global settings:", error);
        }
    };

    // Si no se pasaron settings iniciales, cargarlos
    useEffect(() => {
        if (!initialSettings || initialSettings.length === 0) {
            refreshSettings();
        }
    }, [initialSettings]);

    return (
        <ConfigContext.Provider value={{ tarotFrame, refreshSettings }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
}
