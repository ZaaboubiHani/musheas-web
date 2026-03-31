import { Autocomplete, TextField } from "@mui/material";
import { useState, useMemo } from "react";
import communes from "../communes.json";
import { useTranslation } from "react-i18next";

export default function CommuneSelect({
  wilaya,
  value,
  onChange,
  error,
  helperText,
  disabled,
}) {
  const { t, i18n } = useTranslation();
  
  // Filter communes based on selected wilaya
  const filteredCommunes = useMemo(() => {
    if (!wilaya || !wilaya.code) return [];
    const wilayaCode = String(wilaya.code).padStart(2, "0");
    return communes.filter(c => c.wilaya_code === wilayaCode);
  }, [wilaya]);

  // Get display name based on language
  const getCommuneDisplayName = (commune) => {
    if (!commune) return "";
    if (i18n.language === "ar") return commune.commune_name;
    if (i18n.language === "fr") return commune.commune_name_ascii;
    return commune.commune_name_ascii;
  };

  // Find the selected commune object
  const selectedCommune = useMemo(() => {
    return filteredCommunes.find(c => c.commune_name_ascii === value) || null;
  }, [filteredCommunes, value]);

  return (
    <Autocomplete
      options={filteredCommunes}
      getOptionLabel={(option) => getCommuneDisplayName(option)}
      value={selectedCommune}
      onChange={(event, newValue) => {
        if (newValue) {
          onChange({
            target: {
              name: "commune",
              value: newValue.commune_name_ascii
            }
          });
        } else {
          onChange({
            target: {
              name: "commune",
              value: ""
            }
          });
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={i18n.language === "ar" ? "البلدية" : "Commune"}
          error={error}
          helperText={helperText}
          required
          disabled={disabled}
        />
      )}
      isOptionEqualToValue={(option, value) => 
        option.commune_name_ascii === value?.commune_name_ascii
      }
      filterOptions={(options, { inputValue }) => {
        const searchTerm = inputValue.toLowerCase().trim();
        if (!searchTerm) return options;
        
        return options.filter(option => 
          option.commune_name_ascii.toLowerCase().includes(searchTerm) ||
          option.commune_name?.toLowerCase().includes(searchTerm)
        );
      }}
      noOptionsText={
        disabled 
          ? (t("selectWilayaFirst") || "Please select a wilaya first")
          : (t("noCommunesFound") || "No communes found")
      }
      disabled={disabled || filteredCommunes.length === 0}
      fullWidth
    />
  );
}