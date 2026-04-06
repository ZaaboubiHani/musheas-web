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
  CircularProgress,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
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

  // Track if this is a single product checkout
  const [singleProductCheckout, setSingleProductCheckout] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

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

  // First, check if this is a single product checkout from state
  useEffect(() => {
    // Check if this is a single product checkout from state
    if (location.state?.singleProduct) {
      const product = location.state.singleProduct;
      setSingleProductCheckout({
        product: product,
        quantity: location.state.quantity || 1,
        requestType: location.state.requestType,
        requestOrigin: location.state.requestOrigin,
      });
      setRequestType(location.state.requestType);
      setRequestOrigin(location.state.requestOrigin);
    } else if (location.state?.requestType) {
      setRequestType(location.state.requestType);
      setRequestOrigin(location.state.requestOrigin);
    }
    
    // Mark as initialized after checking for single product
    setIsInitialized(true);
  }, [location]);

  // Only redirect if not a single product checkout and cart is empty - wait for initialization
  useEffect(() => {
    if (isInitialized && !singleProductCheckout && items.length === 0 && !orderComplete) {
      showSnackbar(t("checkout.emptyCart"), "warning");
      navigate("/");
    }
  }, [isInitialized, singleProductCheckout, items.length, navigate, showSnackbar, t, orderComplete]);

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

  const getItemPrice = (item) =>
    item.discountPrice &&
    item.discountPrice > 0 &&
    item.discountPrice < item.price
      ? item.discountPrice
      : item.price;

  const getItemTotal = (item) => getItemPrice(item) * item.quantity;

  // Get items to display (either cart items or single product)
  const getDisplayItems = () => {
    if (singleProductCheckout) {
      return [{
        ...singleProductCheckout.product,
        cartItemId: `temp-${singleProductCheckout.product._id}`,
        quantity: singleProductCheckout.quantity,
      }];
    }
    return items;
  };

  // Get total amount to display
  const getDisplayTotal = () => {
    if (singleProductCheckout && requestOrigin === "client") {
      const item = singleProductCheckout.product;
      const price = getItemPrice(item);
      return price * singleProductCheckout.quantity;
    }
    return cartTotal;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = t("checkout.required");
    if (!formData.lastName) newErrors.lastName = t("checkout.required");
    if (!formData.email) newErrors.email = t("checkout.required");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = t("checkout.invalidEmail");
    if (!formData.phone) newErrors.phone = t("checkout.required");
    if (!formData.wilaya) newErrors.wilaya = t("checkout.required");
    if (!formData.commune) newErrors.commune = t("checkout.required");
    if (!formData.address) newErrors.address = t("checkout.required");
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRequestOriginChange = (event, newOrigin) => {
    if (newOrigin !== null) {
      setRequestOrigin(newOrigin);
      if (newOrigin === "client")
        setFormData((prev) => ({ ...prev, company: "", position: "" }));
    }
  };

  const handleRequestTypeChange = (event) => setRequestType(event.target.value);

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      showSnackbar(t("checkout.fillAllFields"), "warning");
      return;
    }
    setLoading(true);
    try {
      let productsToSubmit;
      
      if (singleProductCheckout) {
        // For single product checkout, use that product
        const product = singleProductCheckout.product;
        productsToSubmit = [{
          productId: product._id,
          name: product.name[i18n.language],
          description: product.description?.[i18n.language] || "",
          badge: product.badge?.[i18n.language] || "",
          imageUrl: product.imageUrls?.[0] || "",
          quantity: singleProductCheckout.quantity,
          unit: product.unit,
          price: getItemPrice(product),
          discountPrice: product.discountPrice,
        }];
      } else {
        // For cart checkout, use cart items
        productsToSubmit = items.map((item) => ({
          productId: item._id,
          name: item.name[i18n.language],
          description: item.description?.[i18n.language] || "",
          badge: item.badge?.[i18n.language] || "",
          imageUrl: item.imageUrls?.[0] || "",
          quantity: item.quantity,
          unit: item.unit,
          price: getItemPrice(item),
          discountPrice: item.discountPrice,
        }));
      }

      const requestData = {
        type: requestType,
        requestOrigin,
        products: productsToSubmit,
        ...formData,
      };
      
      if (requestOrigin === "client") {
        requestData.totalAmount = getDisplayTotal();
      }
      
      const response = await createRequest(requestData);
      const newOrderNumber =
        response.data?._id ||
        `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setOrderNumber(newOrderNumber);
      
      // Only clear cart if this was a cart checkout
      if (!singleProductCheckout) {
        clearCart();
      }
      
      setOrderComplete(true);
      showSnackbar(t("checkout.orderSuccess"), "success");
    } catch (error) {
      console.error("Error creating request:", error);
      showSnackbar(t("checkout.orderError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const cardSx = {
    p: { xs: 2.5, sm: 3.5 },
    mb: 3,
    background:
      "linear-gradient(180deg, rgba(15,46,51,.88), rgba(10,30,34,.92))",
    borderRadius: 4,
    border: "1px solid rgba(210,178,107,.1)",
    boxShadow: "0 12px 40px rgba(0,0,0,.25)",
  };

  const sectionLabelSx = {
    fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
    fontSize: { xs: 16, sm: 18 },
    fontWeight: 700,
    color: "#d2b26b",
    mb: 2.5,
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "10px" },
    "& .MuiInputLabel-root": { color: "rgba(233,242,241,.55)" },
    "& .MuiOutlinedInput-input": { color: "rgba(233,242,241,.9)" },
  };

  // Don't render anything until initialized
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  const displayItems = getDisplayItems();
  const displayTotal = getDisplayTotal();

  if (orderComplete) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Box
          className="animate-fade-in-up"
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: "center",
            background:
              "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
            borderRadius: 4,
            border: "1px solid rgba(210,178,107,.14)",
            boxShadow: "0 24px 60px rgba(0,0,0,.45)",
            opacity: 0,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(76,175,80,.12)",
              border: "1.5px solid rgba(76,175,80,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 44, color: "#4caf50" }} />
          </Box>
          <Typography
            sx={{ ...sectionLabelSx, fontSize: { xs: 22, sm: 26 }, mb: 1.5 }}
          >
            {t("checkout.orderConfirmed")}
          </Typography>
          <Typography
            sx={{ color: "rgba(233,242,241,.7)", mb: 0.5, fontSize: 14 }}
          >
            {t("checkout.orderNumber")}:{" "}
            <strong style={{ color: "#d2b26b" }}>{orderNumber}</strong>
          </Typography>
          <Typography
            sx={{ color: "rgba(233,242,241,.5)", mb: 5, fontSize: 13 }}
          >
            {t("checkout.confirmationSent")}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{
              borderColor: "rgba(210,178,107,.3)",
              color: "rgba(233,242,241,.85)",
              borderRadius: "12px",
              px: 4,
              py: 1.2,
              "&:hover": {
                borderColor: "rgba(210,178,107,.55)",
                background: "rgba(210,178,107,.07)",
              },
            }}
          >
            {t("checkout.continueShopping")}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box component="section" sx={{ py: { xs: 5, sm: 7 }, minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          mb={5}
          className="animate-fade-in-up"
          sx={{ opacity: 0 }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: "rgba(210,178,107,.7)",
              border: "1px solid rgba(210,178,107,.18)",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "#d2b26b",
                borderColor: "rgba(210,178,107,.4)",
                transform: "translateX(-2px)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              fontFamily:
                'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
              fontSize: { xs: 26, sm: 32, md: 36 },
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            {t("checkout.title")}
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {/* Left: Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Request Type */}
            <Paper
              sx={cardSx}
              elevation={0}
              className="animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "0.08s" }}
            >
              <Typography sx={sectionLabelSx}>
                {t("checkout.requestType") || "Request Type"}
              </Typography>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "rgba(233,242,241,.55)" }}>
                  {t("checkout.requestType") || "Type de demande"}
                </InputLabel>
                <Select
                  value={requestType}
                  onChange={handleRequestTypeChange}
                  label={t("checkout.requestType") || "Type de demande"}
                  sx={{
                    color: "rgba(233,242,241,.9)",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(210,178,107,.25)",
                    },
                    "& .MuiSvgIcon-root": { color: "rgba(210,178,107,.6)" },
                  }}
                >
                  <MenuItem value="samples">
                    <Stack direction="row" alignItems="center" gap={1}>
                      <ScienceIcon sx={{ fontSize: 18, color: "#d2b26b" }} />
                      <span>{t("checkout.samples") || "Échantillons"}</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="tds">
                    <Stack direction="row" alignItems="center" gap={1}>
                      <DescriptionIcon
                        sx={{ fontSize: 18, color: "#d2b26b" }}
                      />
                      <span>
                        {t("checkout.tds") || "TDS (Fiche technique)"}
                      </span>
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Origin toggle */}
            <Paper
              sx={{ ...cardSx, display: "flex", justifyContent: "center" }}
              elevation={0}
              className="animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "0.13s" }}
            >
              <ToggleButtonGroup
                value={requestOrigin}
                exclusive
                onChange={handleRequestOriginChange}
                sx={{
                  "& .MuiToggleButton-root": {
                    borderColor: "rgba(210,178,107,.18)",
                    color: "rgba(233,242,241,.65)",
                    borderRadius: "10px !important",
                    px: 4,
                    py: 1.2,
                    fontSize: 14,
                    transition: "all 0.2s ease",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(210,178,107,.12)",
                      color: "#d2b26b",
                      borderColor: "rgba(210,178,107,.35) !important",
                      "&:hover": { backgroundColor: "rgba(210,178,107,.16)" },
                    },
                    "&:hover": { backgroundColor: "rgba(210,178,107,.06)" },
                  },
                }}
              >
                <ToggleButton value="client">
                  <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                  {t("checkout.client") || "Client"}
                </ToggleButton>
                <ToggleButton value="company">
                  <BusinessIcon sx={{ mr: 1, fontSize: 18 }} />
                  {t("checkout.company") || "Company"}
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>

            {/* Contact info */}
            <Paper
              sx={cardSx}
              elevation={0}
              className="animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "0.18s" }}
            >
              <Typography sx={sectionLabelSx}>
                {t("checkout.contactInfo")}
              </Typography>
              <Grid container spacing={2}>
                {[
                  { name: "firstName", label: t("checkout.firstName"), xs: 6 },
                  { name: "lastName", label: t("checkout.lastName"), xs: 6 },
                  {
                    name: "email",
                    label: t("checkout.email"),
                    xs: 6,
                    type: "email",
                  },
                  { name: "phone", label: t("checkout.phone"), xs: 6 },
                  ...(requestOrigin === "company"
                    ? [
                        {
                          name: "company",
                          label: t("checkout.company"),
                          xs: 6,
                        },
                        {
                          name: "position",
                          label: t("checkout.position"),
                          xs: 6,
                        },
                      ]
                    : []),
                ].map(({ name, label, xs, type = "text" }) => (
                  <Grid key={name} size={{ xs: 12, sm: xs }}>
                    <TextField
                      fullWidth
                      type={type}
                      label={label}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      error={!!errors[name]}
                      helperText={errors[name]}
                      required
                      sx={inputSx}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Shipping */}
            <Paper
              sx={cardSx}
              elevation={0}
              className="animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "0.23s" }}
            >
              <Typography sx={sectionLabelSx}>
                {t("checkout.shippingAddress")}
              </Typography>
              <Stack spacing={2}>
                <WilayaSelect
                  value={formData.wilaya}
                  onChange={handleInputChange}
                  error={!!errors.wilaya}
                  helperText={errors.wilaya}
                />
                <CommuneSelect
                  wilaya={wilayas.find((w) => w.name === formData.wilaya)}
                  value={formData.commune}
                  onChange={handleInputChange}
                  error={!!errors.commune}
                  helperText={errors.commune}
                />
                <TextField
                  fullWidth
                  label={t("checkout.address")}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  required
                  sx={inputSx}
                />
                <TextField
                  fullWidth
                  label={t("checkout.orderNotes")}
                  name="clientNote"
                  multiline
                  rows={3}
                  value={formData.clientNote}
                  onChange={handleInputChange}
                  placeholder={t("checkout.notesPlaceholder")}
                  sx={inputSx}
                />
              </Stack>
            </Paper>

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmitOrder}
              disabled={loading}
              className="animate-fade-in-up"
              sx={{
                background: "linear-gradient(135deg, #d2b26b, #b8903f)",
                color: "#0a1e22",
                py: 1.8,
                fontSize: 15,
                fontWeight: 700,
                borderRadius: "12px",
                opacity: 0,
                animationDelay: "0.28s",
                boxShadow: "0 6px 24px rgba(210,178,107,.25)",
                transition: "all 0.22s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #dbc07a, #c49948)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 32px rgba(210,178,107,.35)",
                },
                "&.Mui-disabled": {
                  background: "rgba(210,178,107,.25)",
                  color: "rgba(10,30,34,.4)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#0a1e22" }} />
              ) : (
                t("checkout.placeOrder")
              )}
            </Button>
          </Grid>

          {/* Right: Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              className="animate-fade-in-up"
              sx={{
                ...cardSx,
                mb: 0,
                position: { md: "sticky" },
                top: { md: 90 },
                opacity: 0,
                animationDelay: "0.1s",
              }}
            >
              <Typography sx={sectionLabelSx}>
                {t("checkout.orderSummary")}
              </Typography>
              <Stack
                spacing={2.5}
                divider={
                  <Divider sx={{ borderColor: "rgba(210,178,107,.08)" }} />
                }
              >
                {displayItems.map((item) => (
                  <Stack
                    key={item.cartItemId || item._id}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                  >
                    {item.imageUrls?.[0] && (
                      <Box
                        component="img"
                        src={item.imageUrls[0]}
                        alt={item.name.en}
                        sx={{
                          width: 56,
                          height: 56,
                          objectFit: "contain",
                          borderRadius: "10px",
                          backgroundColor: "rgba(255,255,255,.04)",
                          border: "1px solid rgba(210,178,107,.1)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "rgba(233,242,241,.85)",
                          lineHeight: 1.35,
                        }}
                      >
                        {item.name[i18n.language]}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "rgba(233,242,241,.45)",
                          mt: 0.25,
                        }}
                      >
                        {item.quantity} × {getUnitLabel(item.unit)}
                      </Typography>
                    </Box>
                    {requestOrigin === "client" && (
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: "#d2b26b",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {formatPrice(getItemTotal(item))}
                      </Typography>
                    )}
                  </Stack>
                ))}
              </Stack>

              {requestOrigin === "client" && displayItems.length > 0 && (
                <>
                  <Divider
                    sx={{ borderColor: "rgba(210,178,107,.12)", my: 2.5 }}
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "rgba(233,242,241,.75)",
                      }}
                    >
                      {t("checkout.total")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#d2b26b",
                        fontFamily:
                          'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
                      }}
                    >
                      {formatPrice(displayTotal)}
                    </Typography>
                  </Stack>
                </>
              )}

              {/* Request type indicator */}
              <Box
                sx={{
                  mt: 2.5,
                  pt: 2.5,
                  borderTop: "1px solid rgba(210,178,107,.08)",
                }}
              >
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  <Chip
                    icon={
                      requestType === "samples" ? (
                        <ScienceIcon sx={{ fontSize: 14 }} />
                      ) : (
                        <DescriptionIcon sx={{ fontSize: 14 }} />
                      )
                    }
                    label={
                      requestType === "samples"
                        ? t("checkout.samples") || "Samples"
                        : t("checkout.tds") || "TDS"
                    }
                    size="small"
                    sx={{
                      background: "rgba(210,178,107,.09)",
                      color: "#d2b26b",
                      border: "1px solid rgba(210,178,107,.18)",
                      borderRadius: "8px",
                    }}
                  />
                  <Chip
                    icon={
                      requestOrigin === "company" ? (
                        <BusinessIcon sx={{ fontSize: 14 }} />
                      ) : (
                        <PersonIcon sx={{ fontSize: 14 }} />
                      )
                    }
                    label={
                      requestOrigin === "company"
                        ? t("checkout.company") || "Company"
                        : t("checkout.client") || "Client"
                    }
                    size="small"
                    sx={{
                      background: "rgba(210,178,107,.09)",
                      color: "#d2b26b",
                      border: "1px solid rgba(210,178,107,.18)",
                      borderRadius: "8px",
                    }}
                  />
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}