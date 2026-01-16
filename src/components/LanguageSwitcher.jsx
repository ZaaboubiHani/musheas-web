import { Button, Menu, MenuItem, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { i18n } = useTranslation();

  const handleSelect = (lang) => {
    i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

  return (
    <Stack>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          color: "text.primary",
          border: "1px solid rgba(210,178,107,0.18)",
          borderRadius: 2,
          px: 1.5,
          minWidth: 64,
        }}
      >
        {i18n.language.toUpperCase()}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            background: "rgba(8, 22, 24, 0.95)",
            border: "1px solid rgba(210,178,107,0.18)",
          },
        }}
      >
        <MenuItem onClick={() => handleSelect("en")}>English</MenuItem>
        <MenuItem onClick={() => handleSelect("fr")}>Français</MenuItem>
      </Menu>
    </Stack>
  );
}
