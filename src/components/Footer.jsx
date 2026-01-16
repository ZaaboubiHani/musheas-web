import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { GoldButton } from "./Header";
import { useTranslation } from "react-i18next";
export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        py: "22px",
        pb: "36px",
        color: "rgba(233,242,241,.62)",
        borderTop: "1px solid rgba(210,178,107,.12)",
        background:
          "linear-gradient(180deg, rgba(8,22,24,.25), rgba(8,22,24,.55))",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left */}
          <Typography sx={{ fontSize: 14 }}>
            © {year} MUSHEAS — {t("footer.slogan")}
          </Typography>

          {/* Right */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <GoldButton href="#top">{t("footer.backToTop")}</GoldButton>
            <GoldButton href="#products">{t("footer.products")}</GoldButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
