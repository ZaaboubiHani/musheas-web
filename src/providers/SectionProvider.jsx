import React, { createContext, useContext, useEffect, useState } from "react";

import Api from "../api/api.source";

const SectionContext = createContext(null);

export function SectionProvider({ children }) {
  const axios = Api.instance.getAxios();

  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchSection = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/site-section");
      setSection(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  /* ---------------- UPDATE ---------------- */

  const updateSection = async (payload) => {
    const { data } = await axios.put("/site-section", payload);
    setSection(data.data);
    return data;
  };

  
  return (
    <SectionContext.Provider
      value={{
        section,
        loading,
        fetchSection,
        updateSection,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
}

export const useSection = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error(
      "useSection must be used inside SectionProvider"
    );
  }
  return context;
};
