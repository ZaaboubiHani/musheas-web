import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import wilayas from "../wilayas.json";
import { useTranslation } from "react-i18next";

export default function WilayaSelect({
  value,
  onChange,
  error,
  helperText,
  disabled,
}) {
  const { t, i18n } = useTranslation();
  
  // Get display name based on language
  const getWilayaDisplayName = (wilaya) => {
    if (!wilaya) return "";
    if (i18n.language === "ar") return wilaya.ar_name || wilaya.name;
    if (i18n.language === "fr") return wilaya.nameFr || wilaya.name;
    return wilaya.nameEn || wilaya.name;
  };

  // Find the selected wilaya object
  const selectedWilaya = wilayas.find(w => w.name === value) || null;

  return (
    <Autocomplete
      options={wilayas}
      getOptionLabel={(option) => getWilayaDisplayName(option)}
      value={selectedWilaya}
      onChange={(event, newValue) => {
        if (newValue) {
          onChange({
            target: {
              name: "wilaya",
              value: newValue.name
            }
          });
        } else {
          onChange({
            target: {
              name: "wilaya",
              value: ""
            }
          });
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={i18n.language === "ar" ? "الولاية" : "Wilaya"}
          error={error}
          helperText={helperText}
          required
        />
      )}
      isOptionEqualToValue={(option, value) => option.name === value?.name}
      filterOptions={(options, { inputValue }) => {
        const searchTerm = inputValue.toLowerCase().trim();
        if (!searchTerm) return options;
        
        return options.filter(option => 
          option.name.toLowerCase().includes(searchTerm) ||
          option.nameFr?.toLowerCase().includes(searchTerm) ||
          option.ar_name?.toLowerCase().includes(searchTerm) ||
          option.nameEn?.toLowerCase().includes(searchTerm) ||
          option.code?.toString().includes(searchTerm)
        );
      }}
      noOptionsText={t("noWilayasFound") || "No wilayas found"}
      disabled={disabled}
      fullWidth
    />
  );
}