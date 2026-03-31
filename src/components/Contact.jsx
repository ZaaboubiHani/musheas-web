import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import { PrimaryGoldButton, GoldButton } from "./Header";
import { useTranslation } from "react-i18next";
import { useMessages } from "../providers/MessageProvider";
import { useState } from "react";

export default function Contact() {
  const { t } = useTranslation();
  const { createMessage } = useMessages();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    createMessage({
      name: form.name,
      email: form.email,
      message: form.message,
    });
    setOpen(true);

    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Box component="section" id="contact" sx={{ py: 7 }}>
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
            {t("contact.title")}
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
            {t("contact.subtitle")}
          </Typography>
        </Box>

        {/* Grid */}
        <Grid container spacing={3}>
          {/* Company box */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ContactBox>
              <Typography variant="h3">{t("contact.companyTitle")}</Typography>

              <KeyValue t={t} />
            </ContactBox>
          </Grid>

          {/* Form box */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ContactBox>
              <Typography variant="h3"> {t("contact.formTitle")}</Typography>

              <Stack component="form" spacing={2}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Input
                      placeholder={t("contact.namePlaceholder")}
                      value={form.name}
                      onChange={handleChange("name")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Input
                      placeholder="Email"
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                    />
                  </Grid>
                </Grid>

                <Input
                  placeholder={t("contact.messagePlaceholder")}
                  multiline
                  minRows={4}
                  value={form.message}
                  onChange={handleChange("message")}
                />

                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  <PrimaryGoldButton onClick={handleSubmit}>
                    {t("contact.send")}
                  </PrimaryGoldButton>
                  <GoldButton href="#contact"> {t("contact.copy")}</GoldButton>
                </Stack>
              </Stack>
            </ContactBox>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={t("requestDialog.snackbar.sent")}
      />
    </Box>
  );
}

function ContactBox({ children }) {
  return (
    <Box
      sx={{
        height: "100%",
        p: 3,
        borderRadius: 4,
        border: "1px solid rgba(210,178,107,.14)",
        background:
          "linear-gradient(180deg, rgba(15,42,46,.92), rgba(10,30,34,.92))",
        boxShadow: "0 20px 55px rgba(0,0,0,.35)",
        "& h3": {
          fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
          fontSize: 20,
          mb: 1.5,
          color: "primary.main",
        },
        "& .tiny": {
          fontSize: 12,
          color: "rgba(233,242,241,.62)",
          mt: 2,
          lineHeight: 1.6,
        },
      }}
    >
      {children}
    </Box>
  );
}
function KeyValue({ t }) {
  const rows = [
    ["company", "MUSHEAS"],
    ["name", "Nabil YAHIA"],
    ["role", "R&D Manager & Business Development — Meetings Representative"],
    ["phone", "0674861146"],
    ["email", "musheas.lab@gmail.com"],
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "100px 1fr",
          sm: "120px 1fr",
          md: "150px 1fr",
          lg: "180px 1fr",
        },
        gap: "10px 0px",
        fontSize: 14,
        color: "rgba(233,242,241,.78)",
      }}
    >
      {rows.map(([k, v]) => (
        <Box key={k} sx={{ display: "contents" }}>
          <Typography
            sx={{
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(233,242,241,.62)",
            }}
          >
            {t(`contact.labels.${k}`)}
          </Typography>
          <Typography>{v}</Typography>
        </Box>
      ))}
    </Box>
  );
}
function Input(props) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          background: "rgba(255,255,255,.02)",
        },
        "& fieldset": {
          borderColor: "rgba(210,178,107,.18)",
        },
        "&:hover fieldset": {
          borderColor: "rgba(210,178,107,.35)",
        },
        "&.Mui-focused fieldset": {
          borderColor: "rgba(210,178,107,.45)",
          boxShadow: "0 0 0 4px rgba(210,178,107,.1)",
        },
      }}
    />
  );
}
