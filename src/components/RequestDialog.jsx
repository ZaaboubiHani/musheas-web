import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PrimaryGoldButton, GoldButton } from "./Header";
import { useRequests } from "../providers/RequestProvider";
import { useState } from "react";
import { Globals } from "../api/api.source";
import { useTranslation } from "react-i18next";
export default function RequestDialog({
  open,
  onClose,
  product,
  type,
  quantity,
  unit,
}) {
  const { createRequest } = useRequests();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    position: "",
    phone: "",
    email: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createRequest({
        ...form,
        name: product?.name?.fr || product?.name?.en || undefined,
        description: product?.description?.fr || product?.description?.en || undefined,
        badge: product?.badge?.fr || product?.badge?.en || undefined,
        type,
        quantity,
        unit,
        imageUrl:
          product?.imageUrls[0]?.replace(Globals.apiUrl + "/", "") || undefined,
        createdAt: new Date().toISOString(),
      });

      setSnackbar({
        open: true,
        message: t("requestDialog.snackbar.success"),
        severity: "success",
      });

      onClose();

      // Optional: reset form
      setForm({
        firstName: "",
        lastName: "",
        company: "",
        position: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("requestDialog.snackbar.error"),
        severity: "error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          brequestRadius: 4,
          brequest: "1px solid rgba(210,178,107,.14)",
          background:
            "linear-gradient(180deg, rgba(15,42,46,.96), rgba(10,30,34,.96))",
          boxShadow: "0 30px 70px rgba(0,0,0,.45)",
          mx: { xs: 0, sm: 0 },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
            fontSize: 22,
            letterSpacing: "0.03em",
            color: "primary.main",
          }}
        >
          {t("requestDialog.title")}
        </Typography>

        <IconButton onClick={onClose} sx={{ color: "rgba(233,242,241,.6)" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2.5, sm: 3 },
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.6,
            mb: 3,
            color: "rgba(233,242,241,.72)",
            maxWidth: "55ch",
          }}
        >
          {t("requestDialog.subtitle")}
        </Typography>

        <Stack component="form" spacing={2.2} onSubmit={handleSubmit}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                placeholder={t("requestDialog.fields.firstName")}
                value={form.firstName}
                onChange={handleChange("firstName")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                placeholder={t("requestDialog.fields.lastName")}
                value={form.lastName}
                onChange={handleChange("lastName")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Input
                placeholder={t("requestDialog.fields.company")}
                value={form.company}
                onChange={handleChange("company")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Input
                placeholder={t("requestDialog.fields.position")}
                value={form.position}
                onChange={handleChange("position")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                placeholder={t("requestDialog.fields.phone")}
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                placeholder={t("requestDialog.fields.email")}
                type="email"
                value={form.email}
                onChange={handleChange("email")}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.5} gap={1.5} pt={1} flexWrap="wrap">
            <PrimaryGoldButton type="submit">
              {t("requestDialog.actions.submit")}
            </PrimaryGoldButton>
            <GoldButton onClick={onClose}>
              {t("requestDialog.actions.cancel")}
            </GoldButton>
          </Stack>

          <Typography
            sx={{
              fontSize: 12,
              color: "rgba(233,242,241,.6)",
              lineHeight: 1.6,
              mt: 1,
            }}
          >
            {t("requestDialog.privacy")}
          </Typography>
        </Stack>
      </DialogContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ brequestRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

/* Shared Input (same style as Contact page) */
function Input(props) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          brequestRadius: 3,
          background: "rgba(255,255,255,.02)",
        },
        "& fieldset": {
          brequestColor: "rgba(210,178,107,.18)",
        },
        "&:hover fieldset": {
          brequestColor: "rgba(210,178,107,.35)",
        },
        "&.Mui-focused fieldset": {
          brequestColor: "rgba(210,178,107,.45)",
          boxShadow: "0 0 0 4px rgba(210,178,107,.1)",
        },
      }}
    />
  );
}
