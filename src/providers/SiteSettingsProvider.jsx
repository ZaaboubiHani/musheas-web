import React, { createContext, useContext, useEffect, useState } from "react";

import Api from "../api/api.source";

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const axios = Api.instance.getAxios();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchSiteSettings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/site-settings");
      setSettings(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  /* ---------------- UPDATE ---------------- */

  const updateSiteSettings = async (payload) => {
    const { data } = await axios.put("/site-settings", payload);
    setSettings(data.data);
    return data;
  };

  
  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        fetchSiteSettings,
        updateSiteSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error(
      "useSiteSettings must be used inside SiteSettingsProvider"
    );
  }
  return context;
};
