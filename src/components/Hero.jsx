import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { PrimaryGoldButton, GoldButton } from "./Header";
import { useTranslation } from "react-i18next";
import { useSection } from "../providers/SectionProvider";

export default function Hero() {
  const { t, i18n } = useTranslation();
  const { section } = useSection();

  return (
    <Box component="section" id="about" sx={{ py: { xs: 4, md: 3 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch" mt={2}>
          {/* LEFT – MAIN HERO */}
          <Grid item xs={12} size={{ md: 7 }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",

                border: "1px solid rgba(210,178,107,.16)",
                background:
                  "linear-gradient(180deg, rgba(15,42,46,.85), rgba(11,36,40,.92))",
                boxShadow: "0 20px 55px rgba(0,0,0,.45)",
              }}
            >
              {/* Background media */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `
                    radial-gradient(900px 600px at 35% 35%, rgba(210,178,107,.2), transparent 55%),
                    radial-gradient(800px 500px at 75% 30%, rgba(85,170,180,.18), transparent 60%),
                    linear-gradient(120deg, rgba(6,18,20,.5), rgba(6,18,20,.85)),
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='900'%3E...")
                  `,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "saturate(.95) contrast(1.05)",
                }}
              />

              {/* Content */}
              <Stack
                position="relative"
                p={{ xs: 3, md: 4.5 }}
                height="100%"
                justifyContent="center"
                spacing={2}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(233,242,241,.86)",
                  }}
                >
                  {section?.heroTagline[i18n.language]}
                </Typography>

                <Typography
                  component="h1"
                  sx={{
                    fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "0.02em",
                    fontSize: {
                      xs: 34,
                      md: "clamp(34px, 3.4vw, 56px)",
                    },
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

                <Typography
                  sx={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    maxWidth: "52ch",
                    color: "rgba(233,242,241,.85)",
                  }}
                >
                  {section?.heroDescription[i18n.language]}
                </Typography>

                <Stack direction="row" gap={1.5} flexWrap="wrap" mt={1}>
                  <PrimaryGoldButton href="#products">
                    {t("hero.explore")}
                  </PrimaryGoldButton>
                  <GoldButton href="#contact"> {t("hero.contact")}</GoldButton>
                </Stack>

                <Typography
                  sx={{
                    mt: 1.5,
                    fontSize: 12,
                    color: "rgba(233,242,241,.66)",
                  }}
                >
                  {section?.herofooter[i18n.language]}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* RIGHT – SIDE CARD */}
          <Grid item xs={12} size={{ md: 5 }} mt={2}>
            <Box
              sx={{
                height: "100%",
                borderRadius: 4,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                border: "1px solid rgba(210,178,107,.14)",
                background:
                  "linear-gradient(180deg, rgba(15,42,46,.92), rgba(10,30,34,.92))",
                boxShadow: "0 20px 55px rgba(0,0,0,.45)",
              }}
            >
              {/* Pills */}
              <Stack direction="row" gap={1} flexWrap="wrap">
                {section?.pills.map((pill) => (
                  <Chip
                    key={pill[i18n.language]}
                    label={pill[i18n.language]}
                    sx={{
                      fontSize: 12,
                      borderRadius: "999px",
                      border: "1px solid rgba(210,178,107,.2)",
                      background: "rgba(210,178,107,.08)",
                      color: "rgba(233,242,241,.9)",
                    }}
                  />
                ))}
              </Stack>

              <Typography
                sx={{
                  fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
                  color: "primary.main",
                  fontSize: 18,
                  letterSpacing: "0.03em",
                }}
              >
                {section?.deliverTitle[i18n.language]}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "rgba(233,242,241,.8)",
                }}
              >
                {section?.deliverText[i18n.language]}
              </Typography>

              {/* Mini grid */}
              <Grid container spacing={1.5} mt="auto">
                {section?.features.map((feature) => (
                  <Grid item xs={6} key={feature.title[i18n.language]} size={6}>
                    <MiniCard
                      title={feature.title[i18n.language]}
                      text={feature.description[i18n.language]}
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

function MiniCard({ title, text }) {
  return (
    <Stack
      sx={{
        p: 1.5,
        minHeight: 110,
        borderRadius: 3,
        border: "1px solid rgba(210,178,107,.14)",
        background: "rgba(255,255,255,.02)",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: 8,
          background: "linear-gradient(135deg, #d2b26b, #b8903f)",
          boxShadow: "0 10px 25px rgba(210,178,107,.18)",
        }}
      />
      <Typography
        sx={{
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontSize: 12, color: "rgba(233,242,241,.7)" }}>
        {text}
      </Typography>
    </Stack>
  );
}
