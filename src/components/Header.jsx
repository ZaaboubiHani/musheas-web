import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: `linear-gradient(
      180deg,
      rgba(8, 22, 24, 0.82),
      rgba(8, 22, 24, 0.55)
    )`,
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(210, 178, 107, 0.12)",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            py={2}
            gap={2}
          >
            {/* Brand */}
            <Stack direction="row" alignItems="center" gap={1}>
              <Logo />
              <Typography
                sx={{
                  fontFamily: 'ui-serif, "Times New Roman", Georgia, serif',
                  fontWeight: 700,
                  fontSize: 20,
                  color: "primary.main",
                }}
              >
                MUSHEAS
              </Typography>
            </Stack>

            {/* Menu */}
            {!isMobile && (
              <Stack
                direction="row"
                gap={2}
                sx={{
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {[
                  "header.about",
                  "header.products",
                  "header.project",
                  "header.contact",
                ].map((key) => (
                  <Button
                    key={key}
                    href={`#${key}`}
                    sx={{
                      color: "text.primary",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(210,178,107,0.08)",
                      },
                    }}
                  >
                    {t(key)}
                  </Button>
                ))}

                <LanguageSwitcher></LanguageSwitcher>
              </Stack>
            )}

            {/* CTA */}
            <Stack direction="row" gap={1}>
              {!isMobile && (
                <>
                  <GoldButton href="#contact">
                    {t("header.requestCatalog")}
                  </GoldButton>
                  <PrimaryGoldButton href="#products">
                    {t("header.samples")}
                  </PrimaryGoldButton>
                </>
              )}

              {isMobile && (
                <IconButton
                  onClick={() => setOpen(true)}
                  sx={{
                    border: "1px solid rgba(210,178,107,0.18)",
                    borderRadius: 2,
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Container>
      </AppBar>

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

function Logo() {
  return (
    <Box sx={{ width: 34, height: 34 }}>
      <svg viewBox="0 0 64 64" width="34" height="34" fill="none">
        <path
          d="M12 28c0-10 9-18 20-18s20 8 20 18H12z"
          stroke="rgba(210,178,107,.95)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M28 28v16c0 4 3 7 7 7s7-3 7-7V28"
          stroke="rgba(210,178,107,.95)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M24 46c3 2 5 3 8 3s5-1 8-3"
          stroke="rgba(210,178,107,.75)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
}

export function GoldButton({ children, ...props }) {
  return (
    <Button
      variant="outlined"
      {...props}
      sx={{
        borderColor: "rgba(210,178,107,0.28)",
        backgroundColor: "rgba(210,178,107,0.12)",
        color: "text.primary",
        borderRadius: 2,
        transition: "all 0.3s ease",
        px: 2,
        "&:hover": {
          backgroundColor: "rgba(210,178,107,0.16)",
          borderColor: "rgba(210,178,107,0.42)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {children}
    </Button>
  );
}

export function PrimaryGoldButton({ children, ...props }) {
  return (
    <Button
      {...props}
      sx={{
        background:
          "linear-gradient(135deg, rgba(210,178,107,.92), rgba(184,144,63,.92))",
        color: "#102125",
        borderRadius: 2,
        px: 2,
        transition: "all 0.3s ease",
        boxShadow: "0 16px 40px rgba(210,178,107,.18)",
        "&:hover": {
          transform: "translateY(-1px) scale(1.01)",
        },
      }}
    >
      {children}
    </Button>
  );
}

export function MobileDrawer({
  open,
  onClose,
}) {
  const { t } = useTranslation();
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Stack
        p={3}
        gap={2}
        width={260}
        sx={{
          height: "100%", // make it fill the drawer
          background: `linear-gradient(
            180deg,
            rgba(8, 22, 24, 0.95),
            rgba(8, 22, 24, 0.75)
          )`,
          backdropFilter: "blur(6px)", // optional blur like the AppBar
        }}
      >
        {[
          "header.about",
          "header.products",
          "header.project",
          "header.contact",
        ].map((item) => (
          <Button
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={onClose}
            sx={{
              color: "text.primary",
            }}
          >
            {t(item)}
          </Button>
        ))}

        <LanguageSwitcher></LanguageSwitcher>

        <GoldButton href="#contact" onClick={onClose}>
          {t("header.requestCatalog")}
        </GoldButton>
        <PrimaryGoldButton href="#products" onClick={onClose}>
          {t("header.samples")}
        </PrimaryGoldButton>
      </Stack>
    </Drawer>
  );
}
