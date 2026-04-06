import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Divider,
  IconButton,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpaIcon from "@mui/icons-material/Spa";
import ScienceIcon from "@mui/icons-material/Science";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../providers/ProductProvider";
import { useCart } from "../providers/CartProvider";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../providers/SnackbarProvider";
import { ProductCard } from "../components/Products";

export default function ProductDetails() {
  const { id } = useParams();
  const { products, fetchProducts, randomProducts, fetchRandomProducts } =
    useProducts();
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { t, i18n } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!products?.length) fetchProducts();
    fetchRandomProducts();
  }, []);

  useEffect(() => {
    if (products?.length) {
      const found = products.find((p) => p._id === id);
      setProduct(found);
      setActiveImage(0);
      if (found) {
        const cartQuantity = getItemQuantity(found._id);
        setSelectedQuantity(cartQuantity > 0 ? cartQuantity : 1);
      } else {
        setSelectedQuantity(1);
      }
    }
  }, [products, id, getItemQuantity]);

  const similarProducts = randomProducts
    ?.filter((p) => p._id !== id)
    .slice(0, 4);

  if (!product) return null;

  const {
    name,
    description,
    categoryName,
    badge,
    imageUrls,
    quantity: availableQuantity,
    unit,
    price,
    discountPrice,
    productType,
    keyBenefits = [],
    howToUse,
    ingredients,
  } = product;

  const isB2B = productType === "b2b";
  const isRegular = productType === "regular" || !productType;

  const handleIncreaseQuantity = () => {
    if (availableQuantity && selectedQuantity < availableQuantity)
      setSelectedQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (selectedQuantity > 1) setSelectedQuantity((prev) => prev - 1);
  };

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
      piece: t("products.piece"),
      dozen: t("products.dozen"),
      liter: "L",
      ml: "ml",
      gallon: t("products.gallon"),
      box: t("products.box"),
      pack: t("products.pack"),
    };
    return units[unitValue] || unitValue;
  };

  const hasDiscount =
    isRegular && discountPrice && discountPrice > 0 && discountPrice < price;
  const formattedPrice = isRegular ? formatPrice(price) : null;
  const formattedDiscountPrice = hasDiscount
    ? formatPrice(discountPrice)
    : null;
  const currentCartQuantity = getItemQuantity(product._id);
  const isInCart = currentCartQuantity > 0;

  const handleAddToCart = () => {
    if (selectedQuantity > 0 && selectedQuantity <= availableQuantity) {
      addToCart(product, selectedQuantity);
      const effectivePrice = hasDiscount ? discountPrice : price;
      showSnackbar(
        t("products.addedToCart", {
          name: name[i18n.language],
          quantity: selectedQuantity,
          price: isRegular
            ? formatPrice(effectivePrice * selectedQuantity)
            : "",
        }),
        "success",
      );
    }
  };

  const handleUpdateCart = () => {
    if (currentCartQuantity > 0) {
      updateQuantity(product._id, selectedQuantity);
      showSnackbar(
        t("products.cartUpdated", { quantity: selectedQuantity }),
        "info",
      );
    } else {
      handleAddToCart();
    }
  };

  const handleAddToCartAndCheckout = (product, type) => {
    addToCart(product, selectedQuantity || 1);
    showSnackbar(
      t("products.addedToCart", { name: product.name[i18n.language] }),
      "success",
    );
    navigate("/checkout", {
      state: {
        requestType: type,
        requestOrigin: productType === "b2b" ? "company" : "client",
      },
    });
  };

  const handleRequestOnly = (product, type) => {
    // Navigate to checkout with product data WITHOUT adding to cart
    navigate(`/checkout/product/${product._id}`, {
      state: {
        requestType: type,
        requestOrigin: productType === "b2b" ? "company" : "client",
        singleProduct: product, // Pass the product data
        quantity: id === product._id ? selectedQuantity : 1, // Default quantity
      },
    });
  };

  const getBenefitIcon = (index) => {
    const icons = [
      <EmojiEventsIcon sx={{ color: "#d2b26b", fontSize: 18 }} />,
      <CheckCircleIcon sx={{ color: "#d2b26b", fontSize: 18 }} />,
      <SpaIcon sx={{ color: "#d2b26b", fontSize: 18 }} />,
      <ScienceIcon sx={{ color: "#d2b26b", fontSize: 18 }} />,
    ];
    return icons[index % icons.length];
  };

  return (
    <>
      <Box component="section" sx={{ py: { xs: 4, sm: 6, md: 7 } }}>
        <Container maxWidth="lg">
          {/* Back nav */}
          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            mb={4}
            className="animate-fade-in-up"
            sx={{ opacity: 0 }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              size="small"
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
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </IconButton>

            {/* Breadcrumb */}
            <Stack direction="row" alignItems="center" gap={0.75}>
              <Typography
                onClick={() => navigate("/")}
                sx={{
                  fontSize: 13,
                  color: "rgba(233,242,241,.45)",
                  cursor: "pointer",
                  "&:hover": { color: "rgba(233,242,241,.8)" },
                  transition: ".2s",
                }}
              >
                {t("header.home") || "Home"}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "rgba(233,242,241,.3)" }}>
                ›
              </Typography>
              {isB2B ? (
                <Typography
                  onClick={() => navigate("/b2b")}
                  sx={{
                    fontSize: 13,
                    color: "rgba(233,242,241,.45)",
                    cursor: "pointer",
                    "&:hover": { color: "rgba(233,242,241,.8)" },
                    transition: ".2s",
                  }}
                >
                  B2B
                </Typography>
              ) : (
                <Typography
                  onClick={() => navigate("/store")}
                  sx={{
                    fontSize: 13,
                    color: "rgba(233,242,241,.45)",
                    cursor: "pointer",
                    "&:hover": { color: "rgba(233,242,241,.8)" },
                    transition: ".2s",
                  }}
                >
                  {t("header.store") || "Store"}
                </Typography>
              )}
              <Typography sx={{ fontSize: 13, color: "rgba(233,242,241,.3)" }}>
                ›
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "rgba(210,178,107,.85)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 200,
                }}
              >
                {name[i18n.language]}
              </Typography>
            </Stack>
          </Stack>

          <Grid container spacing={{ xs: 3, md: 6 }}>
            {/* Image column */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                className="animate-fade-in-up"
                sx={{
                  borderRadius: 4,
                  border: "1px solid rgba(210,178,107,.14)",
                  background:
                    "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
                  p: { xs: 2.5, sm: 3 },
                  boxShadow: "0 20px 50px rgba(0,0,0,.35)",
                  opacity: 0,
                  animationDelay: "0.1s",
                }}
              >
                {/* Main image */}
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    background: "rgba(255,255,255,.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: { xs: 220, sm: 280, md: 300 },
                  }}
                >
                  <Box
                    component="img"
                    src={imageUrls?.[activeImage]}
                    alt={name.en}
                    sx={{
                      width: "100%",
                      maxHeight: { xs: 220, sm: 280, md: 300 },
                      objectFit: "contain",
                      transition: "opacity 0.25s ease, transform 0.25s ease",
                    }}
                  />
                </Box>

                {/* Thumbnails */}
                {imageUrls?.length > 1 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    mt={2.5}
                    justifyContent="center"
                    flexWrap="wrap"
                    gap={1}
                  >
                    {imageUrls.map((img, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={img}
                        alt={`${name.en} ${index + 1}`}
                        onClick={() => setActiveImage(index)}
                        sx={{
                          width: { xs: 52, sm: 60 },
                          height: { xs: 52, sm: 60 },
                          objectFit: "contain",
                          borderRadius: 2,
                          cursor: "pointer",
                          border:
                            activeImage === index
                              ? "1.5px solid rgba(210,178,107,.7)"
                              : "1.5px solid rgba(210,178,107,.14)",
                          opacity: activeImage === index ? 1 : 0.55,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            opacity: 1,
                            borderColor: "rgba(210,178,107,.45)",
                            transform: "scale(1.04)",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Grid>

            {/* Content column */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack
                spacing={3}
                className="animate-fade-in-up"
                sx={{ opacity: 0, animationDelay: "0.18s" }}
              >
                {/* Header */}
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    mb={1}
                    flexWrap="wrap"
                  >
                    {categoryName?.[i18n.language] && (
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: "rgba(210,178,107,.85)",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                        }}
                      >
                        #{categoryName[i18n.language]}
                      </Typography>
                    )}
                    {badge?.[i18n.language] && (
                      <Box
                        sx={{
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          border: "1px solid rgba(210,178,107,.2)",
                          background: "rgba(210,178,107,.07)",
                          color: "rgba(210,178,107,.9)",
                          px: 1.2,
                          py: 0.4,
                          borderRadius: "999px",
                        }}
                      >
                        {badge[i18n.language]}
                      </Box>
                    )}
                    {isB2B && (
                      <Chip
                        label={t("products.b2bProduct") || "B2B"}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(210,178,107,.12)",
                          color: "#d2b26b",
                          fontSize: 10,
                          height: 22,
                          letterSpacing: "0.06em",
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    component="h1"
                    sx={{
                      fontFamily:
                        'var(--font-serif, "Literata", ui-serif, Georgia, "Times New Roman", serif)',
                      fontSize: { xs: 24, sm: 28, md: 34 },
                      letterSpacing: "0.02em",
                      color: "rgba(233,242,241,.95)",
                      lineHeight: 1.15,
                      wordBreak: "break-word",
                    }}
                  >
                    {name[i18n.language]}
                  </Typography>
                </Box>

                {/* Price */}
                {isRegular && price && (
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="baseline"
                      spacing={1.5}
                      flexWrap="wrap"
                      gap={1}
                    >
                      {hasDiscount ? (
                        <>
                          <Typography
                            sx={{
                              fontSize: { xs: 30, md: 36 },
                              fontWeight: 700,
                              color: "#d2b26b",
                              fontFamily:
                                'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
                            }}
                          >
                            {formattedDiscountPrice}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: 16, md: 18 },
                              color: "rgba(233,242,241,.4)",
                              textDecoration: "line-through",
                            }}
                          >
                            {formattedPrice}
                          </Typography>
                          <Chip
                            label={t("products.onSale") || "Sale"}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(76,175,80,.15)",
                              color: "#4caf50",
                              fontSize: 10,
                              height: 20,
                            }}
                          />
                        </>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: { xs: 30, md: 36 },
                            fontWeight: 700,
                            color: "#d2b26b",
                            fontFamily:
                              'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
                          }}
                        >
                          {formattedPrice}
                        </Typography>
                      )}
                      {unit && (
                        <Typography
                          sx={{ fontSize: 15, color: "rgba(233,242,241,.55)" }}
                        >
                          / {getUnitLabel(unit)}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}

                {/* Availability */}
                {availableQuantity !== undefined && unit && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: 0.75,
                      background: "rgba(210,178,107,.07)",
                      borderRadius: 2,
                      px: 1.75,
                      py: 0.8,
                      width: "fit-content",
                      border: "1px solid rgba(210,178,107,.12)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 600,
                        color: "rgba(210,178,107,.95)",
                        lineHeight: 1,
                      }}
                    >
                      {availableQuantity}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 13, color: "rgba(210,178,107,.75)" }}
                    >
                      {getUnitLabel(unit)} {t("products.available")}
                    </Typography>
                  </Box>
                )}

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "rgba(233,242,241,.72)",
                    wordBreak: "break-word",
                  }}
                >
                  {description[i18n.language]}
                </Typography>

                {/* Key Benefits */}
                {keyBenefits?.length > 0 && (
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      background: "rgba(210,178,107,.04)",
                      border: "1px solid rgba(210,178,107,.1)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#d2b26b",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <EmojiEventsIcon sx={{ fontSize: 18 }} />
                      {t("products.keyBenefits") || "Key Benefits"}
                    </Typography>
                    <Stack spacing={1.5}>
                      {keyBenefits.map((benefit, index) => (
                        <Stack
                          key={index}
                          direction="row"
                          alignItems="flex-start"
                          gap={1.5}
                        >
                          <Box sx={{ flexShrink: 0, mt: 0.25 }}>
                            {getBenefitIcon(index)}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "rgba(233,242,241,.78)",
                              lineHeight: 1.55,
                            }}
                          >
                            {benefit?.[i18n.language] || benefit?.en || ""}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Quantity + Add to Cart */}
                {isRegular && availableQuantity > 0 && (
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={2}
                      flexWrap="wrap"
                    >
                      <Typography
                        sx={{ fontSize: 14, color: "rgba(233,242,241,.75)" }}
                      >
                        {t("products.quantity")}:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          background: "rgba(255,255,255,.04)",
                          borderRadius: 2,
                          border: "1px solid rgba(210,178,107,.18)",
                        }}
                      >
                        <IconButton
                          onClick={handleDecreaseQuantity}
                          disabled={selectedQuantity <= 1}
                          size="small"
                          sx={{
                            color: "rgba(210,178,107,.8)",
                            p: 0.75,
                            "&:hover": { background: "rgba(210,178,107,.1)" },
                            "&.Mui-disabled": {
                              color: "rgba(210,178,107,.25)",
                            },
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Typography
                          sx={{
                            fontSize: 17,
                            fontWeight: 500,
                            color: "rgba(233,242,241,.9)",
                            minWidth: 36,
                            textAlign: "center",
                          }}
                        >
                          {selectedQuantity}
                        </Typography>
                        <IconButton
                          onClick={handleIncreaseQuantity}
                          disabled={selectedQuantity >= availableQuantity}
                          size="small"
                          sx={{
                            color: "rgba(210,178,107,.8)",
                            p: 0.75,
                            "&:hover": { background: "rgba(210,178,107,.1)" },
                            "&.Mui-disabled": {
                              color: "rgba(210,178,107,.25)",
                            },
                          }}
                        >
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                      <Typography
                        sx={{ fontSize: 13, color: "rgba(233,242,241,.5)" }}
                      >
                        {getUnitLabel(unit)}
                      </Typography>
                    </Stack>

                    <Button
                      variant="contained"
                      onClick={isInCart ? handleUpdateCart : handleAddToCart}
                      disabled={availableQuantity === 0}
                      startIcon={<ShoppingCartIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        background: "linear-gradient(135deg, #d2b26b, #b8903f)",
                        color: "#0a1e22",
                        fontWeight: 600,
                        fontSize: 15,
                        py: 1.4,
                        px: 3.5,
                        borderRadius: "12px",
                        width: "fit-content",
                        transition: "all 0.22s ease",
                        boxShadow: "0 4px 18px rgba(210,178,107,.2)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #dbc07a, #c49948)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 28px rgba(210,178,107,.3)",
                        },
                        "&.Mui-disabled": {
                          background: "rgba(210,178,107,.25)",
                          color: "rgba(10,30,34,.5)",
                        },
                      }}
                    >
                      {isInCart
                        ? t("products.updateCart") || "Update Cart"
                        : t("products.addToCart") || "Add to Cart"}
                    </Button>

                    {isInCart && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "rgba(210,178,107,.6)",
                          fontStyle: "italic",
                        }}
                      >
                        {t("products.currentlyInCart", {
                          quantity: currentCartQuantity,
                        }) ||
                          `${currentCartQuantity} ${getUnitLabel(unit)} in cart`}
                      </Typography>
                    )}
                  </Stack>
                )}

                {isRegular && availableQuantity === 0 && (
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "rgba(210,178,107,.6)",
                      fontStyle: "italic",
                    }}
                  >
                    {t("products.outOfStock")}
                  </Typography>
                )}

                {/* Accordion sections */}
                {(howToUse?.[i18n.language] ||
                  ingredients?.[i18n.language]) && (
                  <Box sx={{ mt: 0.5 }}>
                    {howToUse?.[i18n.language] && (
                      <Accordion
                        sx={{
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          border: "1px solid rgba(210,178,107,.1)",
                          borderRadius: "12px !important",
                          mb: 1.5,
                          "&:before": { display: "none" },
                          "&.Mui-expanded": {
                            border: "1px solid rgba(210,178,107,.2)",
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon
                              sx={{ color: "#d2b26b", fontSize: 20 }}
                            />
                          }
                          sx={{ px: 2.5 }}
                        >
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#d2b26b",
                            }}
                          >
                            {t("products.howToUse") || "How to Use"}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2 }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "rgba(233,242,241,.75)",
                              lineHeight: 1.7,
                            }}
                          >
                            {howToUse[i18n.language]}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    {ingredients?.[i18n.language] && (
                      <Accordion
                        sx={{
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          border: "1px solid rgba(210,178,107,.1)",
                          borderRadius: "12px !important",
                          "&:before": { display: "none" },
                          "&.Mui-expanded": {
                            border: "1px solid rgba(210,178,107,.2)",
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon
                              sx={{ color: "#d2b26b", fontSize: 20 }}
                            />
                          }
                          sx={{ px: 2.5 }}
                        >
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#d2b26b",
                            }}
                          >
                            {t("products.ingredients") || "Ingredients"}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2 }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "rgba(233,242,241,.75)",
                              lineHeight: 1.7,
                            }}
                          >
                            {ingredients[i18n.language]}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Box>
                )}

                <Divider sx={{ borderColor: "rgba(210,178,107,.12)" }} />

                {/* Request CTAs */}
                <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
                  <DetailActionButton
                    onClick={() => handleRequestOnly(product, "tds")}
                  >
                    {t("products.tds")}
                  </DetailActionButton>
                  <DetailActionButton
                    onClick={() => handleRequestOnly(product, "samples")}
                  >
                    {t("products.samples")}
                  </DetailActionButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* You Might Also Like */}
      {similarProducts?.length > 0 && (
        <Box
          component="section"
          sx={{
            py: { xs: 5, sm: 7 },
            backgroundColor: "rgba(8,22,24,.3)",
            borderTop: "1px solid rgba(210,178,107,.07)",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              className="animate-fade-in-up"
              sx={{
                fontFamily:
                  'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
                fontSize: { xs: 22, sm: 26, md: 30 },
                letterSpacing: "0.03em",
                color: "#d2b26b",
                textAlign: "center",
                mb: 4,
                opacity: 0,
              }}
            >
              {t("products.youMightAlsoLike") || "You Might Also Like"}
            </Typography>

            <Grid container spacing={3}>
              {similarProducts.map((p, index) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 3 }}
                  key={p._id}
                  className="animate-fade-in-up"
                  sx={{ opacity: 0, animationDelay: `${index * 80}ms` }}
                >
                  <ProductCard
                    {...p}
                    onClick={() => navigate(`/products/${p._id}`)}
                    onRequestSamples={() => handleRequestOnly(p, "samples")}
                    onRequestTds={() => handleRequestOnly(p, "tds")}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
}

function DetailActionButton({ children, ...props }) {
  return (
    <Box
      component="button"
      {...props}
      sx={{
        fontSize: 13,
        color: "rgba(233,242,241,.85)",
        border: "1px solid rgba(210,178,107,.16)",
        background: "rgba(255,255,255,.02)",
        px: 2.5,
        py: 1.2,
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.22s ease",
        flex: { xs: 1, sm: "auto" },
        fontFamily: "inherit",
        "&:hover": {
          background: "rgba(210,178,107,.1)",
          borderColor: "rgba(210,178,107,.34)",
          color: "#d2b26b",
          transform: "translateY(-1px)",
        },
      }}
    >
      {children}
    </Box>
  );
}
