import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { PrimaryGoldButton, GoldButton } from "./Header";
import { useTranslation } from "react-i18next";
import { useMessages } from "../providers/MessageProvider";
import { useState } from "react";

export default function Contact() {
  const { t } = useTranslation();
  const { createMessage } = useMessages();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handleChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    createMessage({ name: form.name, email: form.email, message: form.message });
    setOpen(true);
    setForm({ name: "", email: "", message: "" });
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "10px" },
    "& .MuiInputLabel-root": { color: "rgba(233,242,241,.5)" },
    "& .MuiOutlinedInput-input": { color: "rgba(233,242,241,.88)" },
    "& textarea": { color: "rgba(233,242,241,.88)" },
  };

  return (
    <Box component="section" id="contact" sx={{ pb: 8 }}>
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
            {t("contact.title")}
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
            {t("contact.subtitle")}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Company box */}
          <Grid size={{ xs: 12, md: 5 }}
            className="animate-fade-in-up"
            sx={{ opacity: 0, animationDelay: "0.08s" }}>
            <ContactBox>
              <Typography variant="h3">{t("contact.companyTitle")}</Typography>
              <KeyValue t={t} />
            </ContactBox>
          </Grid>

          {/* Form */}
          <Grid size={{ xs: 12, md: 7 }}
            className="animate-fade-in-up"
            sx={{ opacity: 0, animationDelay: "0.14s" }}>
            <ContactBox>
              <Typography variant="h3">{t("contact.formTitle")}</Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField fullWidth label={t("contact.labels.name")} value={form.name} onChange={handleChange("name")} required sx={inputSx} />
                  <TextField fullWidth label={t("contact.labels.email")} type="email" value={form.email} onChange={handleChange("email")} required sx={inputSx} />
                  <TextField fullWidth label={t("contact.labels.message")} multiline rows={2} value={form.message} onChange={handleChange("message")} required sx={inputSx} />
                  <PrimaryGoldButton type="submit" sx={{ py: 1.4, borderRadius: "12px", fontSize: 14 }}>
                    {t("contact.send")}
                  </PrimaryGoldButton>
                </Stack>
              </Box>
            </ContactBox>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          variant="filled"
          sx={{ backgroundColor: "rgba(210,178,107,.95)", color: "#0a1e22", fontWeight: 600 }}
        >
          {t("contact.sent")}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function ContactBox({ children }) {
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
        gap: 2,
        transition: "border-color 0.25s ease",
        "&:hover": { borderColor: "rgba(210,178,107,.22)" },
        "& h3": {
          fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
          fontSize: { xs: 18, md: 20 },
          color: "primary.main",
          fontWeight: 700,
          m: 0,
        },
      }}
    >
      {children}
    </Box>
  );
}

function KeyValue({ t }) {
  const rows = [
    { key: t("contact.labels.company"), val: t("contact.companyValue") },
    { key: t("contact.labels.name"), val: t("contact.nameValue") },
    { key: t("contact.labels.role"), val: t("contact.roleValue") },
    { key: t("contact.labels.phone"), val: t("contact.phoneValue") },
    { key: t("contact.labels.email"), val: t("contact.emailValue") },
  ];

  return (
    <Stack spacing={2}>
      {rows.map((row, i) => (
        <Stack key={i} spacing={0.25}>
          <Typography sx={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(210,178,107,.7)", fontWeight: 600 }}>
            {row.key}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "rgba(233,242,241,.78)", lineHeight: 1.5 }}>
            {row.val}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
