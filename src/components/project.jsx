import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import { useSection } from "../providers/SectionProvider";

export default function Project() {
  const { t, i18n } = useTranslation();
  const { section } = useSection();

  return (
    <Box component="section" id="project" sx={{ pb: 8 }}>
      <Container maxWidth="lg">
        <Box
          mb={5}
          className="animate-fade-in-up"
          sx={{ opacity: 0 }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, "Times New Roman", serif)',
              fontSize: { xs: 26, md: 30 },
              letterSpacing: "0.03em",
              color: "primary.main",
            }}
          >
            {section?.porjectTitle?.[i18n.language]}
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              fontSize: 14,
              maxWidth: "60ch",
              lineHeight: 1.65,
              color: "rgba(233,242,241,.65)",
            }}
          >
            {section?.porjectText?.[i18n.language]}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}
            className="animate-fade-in-up"
            sx={{ opacity: 0, animationDelay: "0.08s" }}>
            <Panel>
              <Typography variant="h3">{section?.leftTitle?.[i18n.language]}</Typography>
              <Typography>{section?.leftText?.[i18n.language]}</Typography>
              <Stack component="ul" spacing={2} mt={2} sx={{ p: 0 }}>
                {section?.ticks?.map((tick) => (
                  <TickItem
                    key={tick.title?.[i18n.language]}
                    title={tick.title?.[i18n.language]}
                    desc={tick.description?.[i18n.language]}
                  />
                ))}
              </Stack>
            </Panel>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}
            className="animate-fade-in-up"
            sx={{ opacity: 0, animationDelay: "0.14s" }}>
            <Panel>
              <Typography variant="h3">{section?.rightTitle?.[i18n.language]}</Typography>
              <Typography>{section?.rightText?.[i18n.language]}</Typography>
              <Grid container spacing={2} mt={1}>
                {section?.minis?.map((mini) => (
                  <Grid key={mini.title?.[i18n.language]} size={{ xs: 6 }}>
                    <Mini
                      title={mini.title?.[i18n.language]}
                      desc={mini.description?.[i18n.language]}
                    />
                  </Grid>
                ))}
              </Grid>
            </Panel>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function Panel({ children }) {
  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: 4,
        p: { xs: 2.5, md: 3.5 },
        border: "1px solid rgba(210,178,107,.12)",
        background: "linear-gradient(180deg, rgba(15,42,46,.85), rgba(10,30,34,.85))",
        boxShadow: "0 16px 48px rgba(0,0,0,.3)",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        transition: "border-color 0.25s ease",
        "&:hover": {
          borderColor: "rgba(210,178,107,.22)",
        },
        "& h3": {
          fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
          fontSize: { xs: 18, md: 20 },
          color: "primary.main",
          fontWeight: 700,
          m: 0,
        },
        "& p": {
          fontSize: 13,
          color: "rgba(233,242,241,.7)",
          lineHeight: 1.7,
          m: 0,
        },
      }}
    >
      {children}
    </Box>
  );
}

function TickItem({ title, desc }) {
  return (
    <Box
      component="li"
      sx={{
        listStyle: "none",
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(210,178,107,.2), rgba(210,178,107,.08))",
          border: "1px solid rgba(210,178,107,.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mt: 0.2,
        }}
      >
        <CheckIcon sx={{ fontSize: 12, color: "#d2b26b" }} />
      </Box>
      <Stack gap={0.3}>
        {title && (
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "rgba(233,242,241,.88) !important" }}>
            {title}
          </Typography>
        )}
        {desc && (
          <Typography sx={{ fontSize: 12, color: "rgba(233,242,241,.62) !important" }}>
            {desc}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

function Mini({ title, desc }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(210,178,107,.1)",
        background: "rgba(255,255,255,.02)",
        transition: "all 0.22s ease",
        "&:hover": {
          border: "1px solid rgba(210,178,107,.22)",
          background: "rgba(210,178,107,.04)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d2b26b, #b8903f)",
          mb: 1.2,
        }}
      />
      {title && (
        <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(233,242,241,.85)", mb: 0.5 }}>
          {title}
        </Typography>
      )}
      {desc && (
        <Typography sx={{ fontSize: 12, color: "rgba(233,242,241,.6)", lineHeight: 1.55 }}>
          {desc}
        </Typography>
      )}
    </Box>
  );
}
