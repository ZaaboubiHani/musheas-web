import { Button, Menu, MenuItem, Stack, Box, Typography } from "@mui/material";
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

  const getFlagClass = (lang) => {
    switch (lang) {
      case "en":
        return "gb"; // United Kingdom
      case "fr":
        return "fr";
      case "ar":
        return "dz"; // Algeria
      default:
        return "";
    }
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
          gap: 1,
        }}
      >
        <span className={`fi fi-${getFlagClass(i18n.language)} fis`} style={{ fontSize: "1.2rem" }}></span>
        <span>{i18n.language.toUpperCase()}</span>
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
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <MenuItem 
          onClick={() => handleSelect("en")}
          sx={{
            gap: 2,
            "&:hover": {
              backgroundColor: "rgba(210,178,107,0.08)",
            },
          }}
        >
          <span className="fi fi-gb fis" style={{ fontSize: "1.2rem" }}></span>
          <Typography>English</Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleSelect("fr")}
          sx={{
            gap: 2,
            "&:hover": {
              backgroundColor: "rgba(210,178,107,0.08)",
            },
          }}
        >
          <span className="fi fi-fr fis" style={{ fontSize: "1.2rem" }}></span>
          <Typography>Français</Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleSelect("ar")}
          sx={{
            gap: 2,
            "&:hover": {
              backgroundColor: "rgba(210,178,107,0.08)",
            },
          }}
        >
          <span className="fi fi-dz fis" style={{ fontSize: "1.2rem" }}></span>
          <Typography>العربية</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
}