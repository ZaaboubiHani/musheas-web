import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Chip,
  Fade,
} from "@mui/material";
import { PrimaryGoldButton, GoldButton } from "./Header";
import { useTranslation } from "react-i18next";
import { useSection } from "../providers/SectionProvider";

export default function Hero() {
  const { t, i18n } = useTranslation();
  const { section } = useSection();

  return (
    <Box component="section" id="about" sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch" mt={1}>
          {/* LEFT – MAIN HERO */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid rgba(210,178,107,.16)",
                background: "linear-gradient(180deg, rgba(15,42,46,.88), rgba(11,36,40,.94))",
                boxShadow: "0 24px 60px rgba(0,0,0,.5)",
                minHeight: { xs: 340, md: 420 },
              }}
            >
              {/* Ambient background */}
              <Box
                aria-hidden
                className="hero-media-bg"
                sx={{ position: "absolute", inset: 0 }}
              />

              {/* Content */}
              <Stack
                position="relative"
                p={{ xs: 3.5, md: 5 }}
                height="100%"
                minHeight={{ xs: 340, md: 420 }}
                justifyContent="center"
                spacing={2.5}
              >
                {/* Tagline */}
                <Typography
                  className="animate-fade-in-up"
                  sx={{
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(233,242,241,.8)",
                    animationDelay: "0.1s",
                    opacity: 0,
                  }}
                >
                  {section?.heroTagline?.[i18n.language]}
                </Typography>

                {/* Title */}
                <Typography
                  component="h1"
                  className="animate-fade-in-up"
                  sx={{
                    fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, "Times New Roman", serif)',
                    fontWeight: 700,
                    lineHeight: 1.08,
                    letterSpacing: "0.01em",
                    fontSize: { xs: 32, sm: 38, md: "clamp(34px, 3.2vw, 52px)" },
                    animationDelay: "0.2s",
                    opacity: 0,
                  }}
                >
                  {t("hero.title.before")}{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    {t("hero.title.mycology")}
                  </Box>{" "}
                  {t("hero.title.middle")}{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    {t("hero.title.biotech")}
                  </Box>
                  .
                </Typography>

                {/* Description */}
                <Typography
                  className="animate-fade-in-up"
                  sx={{
                    fontSize: { xs: 14, md: 15 },
                    lineHeight: 1.7,
                    maxWidth: "52ch",
                    color: "rgba(233,242,241,.82)",
                    animationDelay: "0.3s",
                    opacity: 0,
                  }}
                >
                  {section?.heroDescription?.[i18n.language]}
                </Typography>

                {/* CTAs */}
                <Stack
                  direction="row"
                  gap={1.5}
                  flexWrap="wrap"
                  mt={0.5}
                  className="animate-fade-in-up"
                  sx={{ animationDelay: "0.4s", opacity: 0 }}
                >
                  <PrimaryGoldButton href="#products" sx={{ px: 3, py: 1.2 }}>
                    {t("hero.explore")}
                  </PrimaryGoldButton>
                  <GoldButton href="#contact" sx={{ px: 3, py: 1.2 }}>
                    {t("hero.contact")}
                  </GoldButton>
                </Stack>

                {/* Footer note */}
                <Typography
                  className="animate-fade-in-up"
                  sx={{
                    mt: 1,
                    fontSize: 12,
                    color: "rgba(233,242,241,.55)",
                    letterSpacing: "0.04em",
                    animationDelay: "0.5s",
                    opacity: 0,
                  }}
                >
                  {section?.herofooter?.[i18n.language]}
                </Typography>

                {/* Algerian made badge */}
                <Box
                  className="animate-fade-in-up"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderRadius: "999px",
                    border: "1px solid rgba(210,178,107,0.2)",
                    background: "linear-gradient(90deg, rgba(210,178,107,0.1), transparent)",
                    px: 2,
                    py: 1,
                    width: "fit-content",
                    animationDelay: "0.6s",
                    opacity: 0,
                  }}
                >
                 <span className={`fi fi-dz fis`} style={{ fontSize: "1.2rem" }}></span>
                  <Typography sx={{ fontSize: 13, color: "rgba(233,242,241,.88)", fontWeight: 500 }}>
                    {t("hero.algerianMade") || "Made in Algeria"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* RIGHT – FEATURES CARD */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              className="animate-fade-in-up"
              sx={{
                height: "100%",
                minHeight: { xs: "auto", md: 420 },
                borderRadius: 4,
                p: { xs: 2.5, md: 3 },
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                border: "1px solid rgba(210,178,107,.14)",
                background: "linear-gradient(180deg, rgba(15,42,46,.94), rgba(10,30,34,.94))",
                boxShadow: "0 24px 60px rgba(0,0,0,.45)",
                animationDelay: "0.25s",
                opacity: 0,
              }}
            >
              {/* Pills */}
              <Stack direction="row" gap={1} flexWrap="wrap">
                {section?.pills?.map((pill) => (
                  <Chip
                    key={pill[i18n.language]}
                    label={pill[i18n.language]}
                    sx={{
                      fontSize: 11,
                      height: 26,
                      borderRadius: "999px",
                      border: "1px solid rgba(210,178,107,.2)",
                      background: "rgba(210,178,107,.07)",
                      color: "rgba(233,242,241,.85)",
                      letterSpacing: "0.03em",
                    }}
                  />
                ))}
              </Stack>

              {/* Deliver title */}
              <Typography
                sx={{
                  fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
                  color: "primary.main",
                  fontSize: { xs: 17, md: 19 },
                  letterSpacing: "0.02em",
                  lineHeight: 1.3,
                }}
              >
                {section?.deliverTitle?.[i18n.language]}
              </Typography>

              {/* Deliver text */}
              <Typography
                sx={{
                  fontSize: 13,
                  lineHeight: 1.68,
                  color: "rgba(233,242,241,.75)",
                }}
              >
                {section?.deliverText?.[i18n.language]}
              </Typography>

              {/* Mini feature grid */}
              <Grid container spacing={1.5} sx={{ mt: "auto" }}>
                {section?.features?.map((feature, i) => (
                  <Grid size={{ xs: 6 }} key={feature.title[i18n.language]}>
                    <MiniCard
                      title={feature.title[i18n.language]}
                      text={feature.description[i18n.language]}
                      delay={i * 60}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function MiniCard({ title, text, delay = 0 }) {
  return (
    <Stack
      sx={{
        p: 1.8,
        minHeight: 108,
        borderRadius: 3,
        border: "1px solid rgba(210,178,107,.12)",
        background: "rgba(255,255,255,.02)",
        gap: 1,
        transition: "all 0.25s ease",
        "&:hover": {
          border: "1px solid rgba(210,178,107,.24)",
          background: "rgba(210,178,107,.04)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d2b26b, #b8903f)",
          boxShadow: "0 4px 12px rgba(210,178,107,.25)",
        }}
      />
      <Typography
        sx={{
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: "rgba(233,242,241,.9)",
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontSize: 12, color: "rgba(233,242,241,.65)", lineHeight: 1.5 }}>
        {text}
      </Typography>
    </Stack>
  );
}
