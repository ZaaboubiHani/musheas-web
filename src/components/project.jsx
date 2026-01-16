import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";

export default function Project() {
  const { t } = useTranslation();
  return (
    <Box component="section" id="project" sx={{ py: 7 }}>
      <Container maxWidth="lg">
        {/* Section Head */}
        <Box mb={4}>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
              fontSize: 28,
              letterSpacing: "0.03em",
              color: "primary.main",
            }}
          >
            {t("project.title")}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 14,
              maxWidth: "60ch",
              lineHeight: 1.6,
              color: "rgba(233,242,241,.72)",
            }}
          >
            {t("project.subtitle")}
          </Typography>
        </Box>

        {/* Content */}
        <Grid container spacing={3}>
          {/* Left panel */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Panel>
              <Typography variant="h3">{t("project.leftTitle")}</Typography>

              <Typography>{t("project.leftText")}</Typography>

              <Stack component="ul" spacing={2} mt={2} sx={{ p: 0 }}>
                {t("project.ticks", { returnObjects: true }).map((tick) => (
                  <TickItem title={tick.title} desc={tick.desc} />
                ))}
              </Stack>
            </Panel>
          </Grid>

          {/* Right panel */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Panel>
              <Typography variant="h3"> {t("project.rightTitle")}</Typography>

              <Typography>{t("project.rightText")}</Typography>

              <Grid container spacing={2} mt={1}>
                {t("project.minis", { returnObjects: true }).map((mini) => (
                  <Mini title={mini.title} desc={mini.desc} />
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
        p: 3,
        borderRadius: 4,
        border: "1px solid rgba(210,178,107,.14)",
        background:
          "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
        boxShadow: "0 20px 55px rgba(0,0,0,.35)",
        "& h3": {
          fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
          fontSize: 20,
          letterSpacing: "0.02em",
          mb: 1,
        },
        "& p": {
          fontSize: 14,
          lineHeight: 1.6,
          color: "rgba(233,242,241,.75)",
        },
      }}
    >
      {children}
    </Box>
  );
}

function TickItem({ title, desc }) {
  return (
    <Stack
      component="li"
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        listStyle: "none",
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(210,178,107,.12)",
        background: "rgba(255,255,255,.02)",
      }}
    >
      <Box
        sx={{
          width: 20,
          minWidth: 20,
          height: 20,
          borderRadius: 1,
          display: "grid",
          placeItems: "center",
          background: "rgba(210,178,107,.18)",
          border: "0.5px solid #d2b26b",
          color: "#d2b26b",
          mt: "2px",
        }}
      >
        <CheckIcon sx={{ fontSize: 12 }} />
      </Box>

      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(233,242,241,.7)" }}>
          {desc}
        </Typography>
      </Box>
    </Stack>
  );
}

function Mini({ title, desc }) {
  return (
    <Grid item size={{ xs: 12, md: 6 }}>
      <Stack
        spacing={0.5}
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid rgba(210,178,107,.12)",
          background: "rgba(255,255,255,.02)",
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#d2b26b",
            mb: 0.5,
          }}
        />

        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(233,242,241,.7)" }}>
          {desc}
        </Typography>
      </Stack>
    </Grid>
  );
}
