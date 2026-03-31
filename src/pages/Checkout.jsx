import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useCart } from "../providers/CartProvider";
import { useRequests } from "../providers/RequestProvider";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "../providers/SnackbarProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import ScienceIcon from "@mui/icons-material/Science";
import WilayaSelect from "../components/WilayaSelect";
import CommuneSelect from "../components/CommuneSelect";
import wilayas from "../wilayas.json";

export default function Checkout() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { items, cartTotal, clearCart } = useCart();
  const { createRequest } = useRequests();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [requestOrigin, setRequestOrigin] = useState("client");
  const [requestType, setRequestType] = useState("samples");

  useEffect(() => {
    if (location.state?.requestType) {
      setRequestType(location.state.requestType);
    }
  }, [location]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    wilaya: "",
    commune: "",
    address: "",
    clientNote: "",
  });

  const [errors, setErrors] = useState({});

  // Check if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      showSnackbar(t("checkout.emptyCart"), "warning");
      navigate("/");
    }
  }, [items, navigate, showSnackbar, t, orderComplete]);

  const formatPrice = (value) => {
    if (!value && value !== 0) return null;
    return new Intl.NumberFormat(i18n.language === "fr" ? "fr-DZ" : "en-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getUnitLabel = (unitValue) => {
    const units = {
      kg: "kg",
      g: "g",
      lb: "lb",
      oz: "oz",
      piece: t("products.piece") || "pièce",
      dozen: t("products.dozen") || "douzaine",
      liter: "L",
      ml: "ml",
      gallon: t("products.gallon") || "gallon",
      box: t("products.box") || "boîte",
      pack: t("products.pack") || "paquet",
    };
    return units[unitValue] || unitValue;
  };

  const getItemPrice = (item) => {
    const price =
      item.discountPrice &&
      item.discountPrice > 0 &&
      item.discountPrice < item.price
        ? item.discountPrice
        : item.price;
    return price;
  };

  const getItemTotal = (item) => {
    const price = getItemPrice(item);
    return price * item.quantity;
  };

  // Calculate total for clients (simple subtotal)
  const calculateTotal = () => {
    return cartTotal;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = t("checkout.required");
    if (!formData.lastName) newErrors.lastName = t("checkout.required");
    if (!formData.email) {
      newErrors.email = t("checkout.required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("checkout.invalidEmail");
    }
    if (!formData.phone) newErrors.phone = t("checkout.required");
    if (!formData.wilaya) newErrors.wilaya = t("checkout.required");
    if (!formData.commune) newErrors.commune = t("checkout.required");
    if (!formData.address) newErrors.address = t("checkout.required");

    // Company-specific validations
    if (requestOrigin === "company") {
      if (!formData.company) newErrors.company = t("checkout.required");
      if (!formData.position) newErrors.position = t("checkout.required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRequestOriginChange = (event, newOrigin) => {
    if (newOrigin !== null) {
      setRequestOrigin(newOrigin);
      // Clear company-specific fields when switching to client
      if (newOrigin === "client") {
        setFormData((prev) => ({
          ...prev,
          company: "",
          position: "",
        }));
      }
    }
  };

  const handleRequestTypeChange = (event) => {
    setRequestType(event.target.value);
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      showSnackbar(t("checkout.fillAllFields"), "warning");
      return;
    }

    setLoading(true);

    try {
      // Prepare request data according to the schema
      const requestData = {
        type: requestType,
        requestOrigin: requestOrigin,
        products: items.map((item) => ({
          productId: item._id,
          name: item.name[i18n.language],
          description: item.description?.[i18n.language] || "",
          badge: item.badge?.[i18n.language] || "",
          imageUrl: item.imageUrls?.[0] || "",
          quantity: item.quantity,
          unit: item.unit,
          price: getItemPrice(item),
          discountPrice: item.discountPrice,
        })),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        wilaya: formData.wilaya,
        commune: formData.commune,
        address: formData.address,
        clientNote: formData.clientNote,
      };

      // Add company-specific fields
      if (requestOrigin === "company") {
        requestData.position = formData.position;
        requestData.company = formData.company;
      }

      // Add total amount only for client requests
      if (requestOrigin === "client") {
        requestData.totalAmount = calculateTotal();
      }

      // Send to backend
      const response = await createRequest(requestData);

      // Get the order number from the response
      const newOrderNumber =
        response.data?._id ||
        `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setOrderNumber(newOrderNumber);

      // Clear cart and show success
      clearCart();
      setOrderComplete(true);
      showSnackbar(t("checkout.orderSuccess"), "success");
    } catch (error) {
      console.error("Error creating request:", error);
      showSnackbar(t("checkout.orderError"), "error");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            textAlign: "center",
            background:
              "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
            borderRadius: 4,
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: "#4caf50",
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
              color: "#d2b26b",
              mb: 2,
            }}
          >
            {t("checkout.orderConfirmed")}
          </Typography>
          <Typography
            sx={{
              color: "rgba(233,242,241,.8)",
              mb: 1,
            }}
          >
            {t("checkout.orderNumber")}: <strong>{orderNumber}</strong>
          </Typography>
          <Typography
            sx={{
              color: "rgba(233,242,241,.6)",
              mb: 4,
            }}
          >
            {t("checkout.confirmationSent")}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                borderColor: "rgba(210,178,107,.28)",
                color: "text.primary",
              }}
            >
              {t("checkout.continueShopping")}
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      component="section"
      sx={{ py: { xs: 4, sm: 6, md: 8 }, minHeight: "100vh" }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: "rgba(210,178,107,.8)",
              border: "1px solid rgba(210,178,107,.18)",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
              fontSize: { xs: 28, sm: 32, md: 36 },
              color: "primary.main",
            }}
          >
            {t("checkout.title")}
          </Typography>
        </Stack>

        {/* Request Type Selector */}
        <Paper
          sx={{
            p: 2,
            mb: 4,
            background:
              "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
            borderRadius: 2,
          }}
        >
          <FormControl fullWidth>
            <InputLabel sx={{ color: "rgba(233,242,241,.7)" }}>
              {t("checkout.requestType") || "Type de demande"}
            </InputLabel>
            <Select
              value={requestType}
              onChange={handleRequestTypeChange}
              label={t("checkout.requestType") || "Type de demande"}
              sx={{
                color: "rgba(233,242,241,.9)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(210,178,107,.28)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(210,178,107,.5)",
                },
              }}
            >
              <MenuItem value="samples">
                <Box display="flex" alignItems="center" gap={1}>
                  <ScienceIcon sx={{ fontSize: 20 }} />
                  <span>{t("checkout.samples") || "Échantillons"}</span>
                </Box>
              </MenuItem>
              <MenuItem value="tds">
                <Box display="flex" alignItems="center" gap={1}>
                  <DescriptionIcon sx={{ fontSize: 20 }} />
                  <span>{t("checkout.tds") || "TDS (Fiche technique)"}</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Request Origin Toggle */}
        <Paper
          sx={{
            p: 2,
            mb: 4,
            background:
              "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ToggleButtonGroup
            value={requestOrigin}
            exclusive
            onChange={handleRequestOriginChange}
            aria-label="request origin"
            sx={{
              "& .MuiToggleButton-root": {
                borderColor: "rgba(210,178,107,.18)",
                color: "rgba(233,242,241,.7)",
                px: 4,
                py: 1,
                "&.Mui-selected": {
                  backgroundColor: "rgba(210,178,107,.1)",
                  color: "#d2b26b",
                  "&:hover": {
                    backgroundColor: "rgba(210,178,107,.15)",
                  },
                },
              },
            }}
          >
            <ToggleButton value="client">
              <PersonIcon sx={{ mr: 1 }} />
              {t("checkout.client") || "Client"}
            </ToggleButton>
            <ToggleButton value="company">
              <BusinessIcon sx={{ mr: 1 }} />
              {t("checkout.company") || "Company"}
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>

        {/* Cart Items Section */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            background:
              "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#d2b26b",
              fontWeight: 600,
              mb: 2,
            }}
          >
            {t("checkout.orderSummary")}
          </Typography>

          <Stack spacing={2}>
            {items.map((item) => (
              <Stack key={item.cartItemId} direction="row" spacing={2}>
                {item.imageUrls?.[0] && (
                  <Box
                    component="img"
                    src={item.imageUrls[0]}
                    alt={item.name.en}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "contain",
                      borderRadius: 1,
                      backgroundColor: "rgba(0,0,0,.2)",
                    }}
                  />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                    {item.name[i18n.language]}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(233,242,241,.6)" }}
                  >
                    {item.quantity} × {getUnitLabel(item.unit)}
                  </Typography>
                </Box>
                {requestOrigin === "client" && (
                  <Typography sx={{ color: "#d2b26b", fontWeight: 500 }}>
                    {formatPrice(getItemTotal(item))}
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>

          {/* Price Summary - Only for clients */}
          {requestOrigin === "client" && (
            <>
              <Divider sx={{ borderColor: "rgba(210,178,107,.15)", my: 2 }} />
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {t("checkout.total")}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 20, fontWeight: "bold", color: "#d2b26b" }}
                  >
                    {formatPrice(calculateTotal())}
                  </Typography>
                </Stack>
              </Stack>
            </>
          )}
        </Paper>

        {/* Form Section */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            background:
              "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
            borderRadius: 2,
          }}
        >
          <Stack spacing={3}>
            <Typography
              variant="h6"
              sx={{
                color: "#d2b26b",
                fontWeight: 600,
              }}
            >
              {t("checkout.contactInfo")}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t("checkout.firstName")}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t("checkout.lastName")}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t("checkout.email")}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t("checkout.phone")}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                />
              </Grid>

              {/* Company-specific fields */}
              {requestOrigin === "company" && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={t("checkout.company")}
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      error={!!errors.company}
                      helperText={errors.company}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={t("checkout.position")}
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      error={!!errors.position}
                      helperText={errors.position}
                      required
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Typography
              variant="h6"
              sx={{
                color: "#d2b26b",
                fontWeight: 600,
                mt: 2,
              }}
            >
              {t("checkout.shippingAddress")}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <WilayaSelect
                  value={formData.wilaya}
                  onChange={handleInputChange}
                  error={!!errors.wilaya}
                  helperText={errors.wilaya}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <CommuneSelect
                  wilaya={wilayas.find((w) => w.name === formData.wilaya)}
                  value={formData.commune}
                  onChange={handleInputChange}
                  error={!!errors.commune}
                  helperText={errors.commune}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t("checkout.address")}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label={t("checkout.orderNotes")}
              name="clientNote"
              multiline
              rows={3}
              value={formData.clientNote}
              onChange={handleInputChange}
              placeholder={t("checkout.notesPlaceholder")}
            />

            <Button
              variant="contained"
              onClick={handleSubmitOrder}
              disabled={loading}
              sx={{
                mt: 2,
                backgroundColor: "#d2b26b",
                color: "#0a1e22",
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#c4a25a",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                t("checkout.placeOrder")
              )}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
