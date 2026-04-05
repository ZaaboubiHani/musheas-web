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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpaIcon from "@mui/icons-material/Spa";
import ScienceIcon from "@mui/icons-material/Science";

import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../providers/ProductProvider";
import { useCart } from "../providers/CartProvider";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useSnackbar } from "../providers/SnackbarProvider";
import { ProductCard } from "../components/Products";

export default function ProductDetails() {
  const { id } = useParams();
  const {
    products,
    fetchProducts,
    randomProducts,
    fetchRandomProducts,
    loading,
  } = useProducts();
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { t, i18n } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!products?.length) fetchProducts();
    // Fetch random products for "you might also like" section
    fetchRandomProducts();
  }, []);

  useEffect(() => {
    if (products?.length) {
      const found = products.find((p) => p._id === id);
      setProduct(found);
      setActiveImage(0);

      // Get current quantity from cart if exists
      if (found) {
        const cartQuantity = getItemQuantity(found._id);
        setSelectedQuantity(cartQuantity > 0 ? cartQuantity : 1);
      } else {
        setSelectedQuantity(1);
      }
    }
  }, [products, id, getItemQuantity]);

  // Filter out current product from random products
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
    if (availableQuantity && selectedQuantity < availableQuantity) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (selectedQuantity > 0 && selectedQuantity <= availableQuantity) {
      addToCart(product, selectedQuantity);

      // Show success message
      const effectivePrice =
        discountPrice && discountPrice > 0 && discountPrice < price
          ? discountPrice
          : price;
      const totalPrice = effectivePrice * selectedQuantity;
      showSnackbar(
        t("products.addedToCart", {
          name: name[i18n.language],
          quantity: selectedQuantity,
          price: isRegular ? formatPrice(totalPrice) : "",
        }),
        "success",
      );
    }
  };

  const handleUpdateCart = () => {
    const currentCartQuantity = getItemQuantity(product._id);
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

  // Format price in DZD
  const formatPrice = (value) => {
    if (!value && value !== 0) return null;
    return new Intl.NumberFormat(i18n.language === "fr" ? "fr-DZ" : "en-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format unit display
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

  const handleAddToCartAndCheckout = (product, type) => {
    // Add product to cart with selected quantity
    addToCart(product, selectedQuantity || 1);

    // Show success message
    showSnackbar(
      t("products.addedToCart", { name: product.name[i18n.language] }),
      "success",
    );

    // Navigate to checkout with the selected type
    navigate("/checkout", {
      state: {
        requestType: type,
        requestOrigin: productType === "b2b" ? "company" : "client",
      },
    });
  };

  // Get icon for key benefits based on content
  const getBenefitIcon = (index) => {
    const icons = [
      <EmojiEventsIcon sx={{ color: "#d2b26b", fontSize: 20 }} />,
      <CheckCircleIcon sx={{ color: "#d2b26b", fontSize: 20 }} />,
      <SpaIcon sx={{ color: "#d2b26b", fontSize: 20 }} />,
      <ScienceIcon sx={{ color: "#d2b26b", fontSize: 20 }} />,
    ];
    return icons[index % icons.length];
  };

  return (
    <>
      <Box component="section" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Stack spacing={1.2} mb={{ xs: 3, sm: 4 }}>
            <Typography
              sx={{
                fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
                fontSize: { xs: 24, sm: 28, md: 32 },
                letterSpacing: "0.03em",
                color: "primary.main",
                wordBreak: "break-word",
              }}
            >
              {name[i18n.language]}
            </Typography>

            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              {badge?.[i18n.language] && <Badge>{badge[i18n.language]}</Badge>}
              {isB2B && (
                <Chip
                  label={t("products.b2bProduct") || "B2B Product"}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(210,178,107,.15)",
                    color: "#d2b26b",
                    fontSize: { xs: 10, sm: 11 },
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    "& .MuiChip-label": {
                      px: 1.5,
                    },
                  }}
                />
              )}
            </Stack>
          </Stack>

          <Grid container spacing={{ xs: 3, md: 5 }}>
            {/* Image - Left column */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  borderRadius: 4,
                  border: "1px solid rgba(210,178,107,.14)",
                  background:
                    "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
                  p: { xs: 2, sm: 3 },
                }}
              >
                {/* Main image */}
                <Box
                  component="img"
                  src={imageUrls?.[activeImage]}
                  alt={name.en}
                  sx={{
                    width: "100%",
                    maxHeight: { xs: 240, sm: 280, md: 320 },
                    objectFit: "contain",
                    transition: ".3s",
                  }}
                />

                {/* Thumbnails */}
                {imageUrls?.length > 1 && (
                  <Stack
                    direction="row"
                    spacing={1.2}
                    mt={2}
                    justifyContent="center"
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    {imageUrls.map((img, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={img}
                        alt={`${name.en} ${index + 1}`}
                        onClick={() => setActiveImage(index)}
                        sx={{
                          width: { xs: 48, sm: 58 },
                          height: { xs: 48, sm: 58 },
                          objectFit: "contain",
                          borderRadius: 1.5,
                          cursor: "pointer",
                          border:
                            activeImage === index
                              ? "1px solid rgba(210,178,107,.6)"
                              : "1px solid rgba(210,178,107,.18)",
                          opacity: activeImage === index ? 1 : 0.65,
                          transition: ".2s",
                          "&:hover": {
                            opacity: 1,
                          },
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Grid>

            {/* Content - Right column */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={{ xs: 2.5, sm: 3 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 11, sm: 12 },
                    color: "rgba(210,178,107,.9)",
                    fontWeight: 500,
                    wordBreak: "break-word",
                  }}
                >
                  #{categoryName?.[i18n.language]}
                </Typography>

                {/* Price Section - Only show for regular products */}
                {isRegular && price && (
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="baseline"
                      spacing={1.5}
                      flexWrap="wrap"
                      sx={{ gap: 1 }}
                    >
                      {hasDiscount ? (
                        <>
                          <Typography
                            sx={{
                              fontSize: { xs: 28, sm: 32, md: 36 },
                              fontWeight: "bold",
                              color: "#d2b26b",
                              fontFamily:
                                'ui-serif, Georgia, "Times New Roman", serif',
                            }}
                          >
                            {formattedDiscountPrice}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: 16, sm: 18, md: 20 },
                              color: "rgba(233,242,241,.5)",
                              textDecoration: "line-through",
                            }}
                          >
                            {formattedPrice}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: { xs: 28, sm: 32, md: 36 },
                            fontWeight: "bold",
                            color: "#d2b26b",
                            fontFamily:
                              'ui-serif, Georgia, "Times New Roman", serif',
                          }}
                        >
                          {formattedPrice}
                        </Typography>
                      )}
                      {unit && (
                        <Typography
                          sx={{
                            fontSize: { xs: 14, sm: 16 },
                            color: "rgba(233,242,241,.6)",
                          }}
                        >
                          / {getUnitLabel(unit)}
                        </Typography>
                      )}
                    </Stack>

                    {hasDiscount && (
                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: { xs: 12, sm: 13 },
                          color: "#4caf50",
                          fontWeight: 500,
                        }}
                      >
                        {t("products.onSale") || "En promotion"}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* B2B Price Info */}

                {/* Available Quantity Display */}
                {availableQuantity !== undefined && unit && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: 0.5,
                      backgroundColor: "rgba(210,178,107,.08)",
                      borderRadius: 2,
                      px: { xs: 1.2, sm: 1.5 },
                      py: { xs: 0.6, sm: 0.8 },
                      width: "fit-content",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 20, sm: 24 },
                        fontWeight: 600,
                        color: "rgba(210,178,107,.95)",
                        lineHeight: 1,
                      }}
                    >
                      {availableQuantity}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 12, sm: 14 },
                        color: "rgba(210,178,107,.8)",
                        textTransform: "lowercase",
                      }}
                    >
                      {getUnitLabel(unit)} {t("products.available")}
                    </Typography>
                  </Box>
                )}

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: { xs: 14, sm: 15 },
                    lineHeight: 1.7,
                    color: "rgba(233,242,241,.75)",
                    wordBreak: "break-word",
                  }}
                >
                  {description[i18n.language]}
                </Typography>

                {/* Key Benefits Section */}
                {keyBenefits && keyBenefits.length > 0 && (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: 15, sm: 16 },
                        fontWeight: 600,
                        color: "#d2b26b",
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <EmojiEventsIcon sx={{ fontSize: 20 }} />
                      {t("products.keyBenefits") || "Key Benefits"}
                    </Typography>
                    <Stack spacing={1.5}>
                      {keyBenefits.map((benefit, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                          }}
                        >
                          {getBenefitIcon(index)}
                          <Typography
                            sx={{
                              fontSize: { xs: 13, sm: 14 },
                              color: "rgba(233,242,241,.8)",
                              lineHeight: 1.5,
                            }}
                          >
                            {benefit?.[i18n.language] || benefit?.en || ""}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Quantity Selector and Add to Cart - Only for regular products with stock */}
                {isRegular && availableQuantity > 0 && (
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={2}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: "rgba(233,242,241,.8)",
                        }}
                      >
                        {t("products.quantity")}:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "rgba(255,255,255,.05)",
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
                            "&:hover": {
                              backgroundColor: "rgba(210,178,107,.1)",
                            },
                            "&.Mui-disabled": {
                              color: "rgba(210,178,107,.3)",
                            },
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            fontSize: 18,
                            fontWeight: 500,
                            color: "rgba(233,242,241,.9)",
                            minWidth: 40,
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
                            "&:hover": {
                              backgroundColor: "rgba(210,178,107,.1)",
                            },
                            "&.Mui-disabled": {
                              color: "rgba(210,178,107,.3)",
                            },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: "rgba(233,242,241,.6)",
                        }}
                      >
                        {getUnitLabel(unit)}
                      </Typography>
                    </Stack>

                    {/* Add to Cart Button */}
                    <Button
                      variant="contained"
                      onClick={isInCart ? handleUpdateCart : handleAddToCart}
                      disabled={availableQuantity === 0}
                      startIcon={<ShoppingCartIcon />}
                      sx={{
                        backgroundColor: "#d2b26b",
                        color: "#0a1e22",
                        fontWeight: 600,
                        fontSize: { xs: 14, sm: 15 },
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        transition: ".2s",
                        width: "fit-content",
                        "&:hover": {
                          backgroundColor: "#c4a25a",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "rgba(210,178,107,.3)",
                          color: "rgba(10,30,34,.5)",
                        },
                      }}
                    >
                      {isInCart
                        ? t("products.updateCart") || "Mettre à jour le panier"
                        : t("products.addToCart") || "Ajouter au panier"}
                    </Button>

                    {/* Show current cart status */}
                    {isInCart && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "rgba(210,178,107,.7)",
                          fontStyle: "italic",
                        }}
                      >
                        {t("products.currentlyInCart", {
                          quantity: currentCartQuantity,
                        }) ||
                          `${currentCartQuantity} ${getUnitLabel(unit)} déjà dans le panier`}
                      </Typography>
                    )}
                  </Stack>
                )}

                {isRegular && availableQuantity === 0 && (
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "rgba(210,178,107,.7)",
                      fontStyle: "italic",
                    }}
                  >
                    {t("products.outOfStock")}
                  </Typography>
                )}

                {/* Accordion Sections for How to Use and Ingredients */}
                {(howToUse?.[i18n.language] ||
                  ingredients?.[i18n.language]) && (
                  <Box sx={{ mt: 1 }}>
                    {howToUse?.[i18n.language] && (
                      <Accordion
                        sx={{
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          px: 2,
                          "&:before": {
                            display: "none",
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon sx={{ color: "#d2b26b" }} />
                          }
                          sx={{
                            px: 0,
                            "& .MuiAccordionSummary-content": {
                              margin: "8px 0",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: 15, sm: 16 },
                              fontWeight: 600,
                              color: "#d2b26b",
                            }}
                          >
                            {t("products.howToUse") || "How to Use"}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
                          <Typography
                            sx={{
                              fontSize: { xs: 13, sm: 14 },
                              color: "rgba(233,242,241,.8)",
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
                          "&:before": {
                            display: "none",
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon sx={{ color: "#d2b26b" }} />
                          }
                          sx={{
                            px: 0,
                            "& .MuiAccordionSummary-content": {
                              margin: "8px 0",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: 15, sm: 16 },
                              fontWeight: 600,
                              color: "#d2b26b",
                            }}
                          >
                            {t("products.ingredients") || "Ingredients"}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
                          <Typography
                            sx={{
                              fontSize: { xs: 13, sm: 14 },
                              color: "rgba(233,242,241,.8)",
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

                <Divider sx={{ borderColor: "rgba(210,178,107,.15)" }} />

                <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
                  <ActionButton
                    onClick={() => {
                      handleAddToCartAndCheckout(product, "tds");
                    }}
                  >
                    {t("products.tds")}
                  </ActionButton>

                  <ActionButton
                    onClick={() => {
                      handleAddToCartAndCheckout(product, "samples");
                    }}
                  >
                    {t("products.samples")}
                  </ActionButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* You Might Also Like Section */}
      {similarProducts.length > 0 && (
        <Box
          component="section"
          sx={{
            py: { xs: 4, sm: 6 },
            backgroundColor: "rgba(8,22,24,.35)",
            borderTop: "1px solid rgba(210,178,107,.08)",
            borderBottom: "1px solid rgba(210,178,107,.08)",
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={{ xs: 3, sm: 4 }}>
              <Typography
                sx={{
                  fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
                  fontSize: { xs: 22, sm: 26, md: 28 },
                  letterSpacing: "0.03em",
                  color: "#d2b26b",
                  textAlign: "center",
                }}
              >
                {t("products.youMightAlsoLike") || "You Might Also Like"}
              </Typography>

              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {similarProducts.map((similarProduct) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={similarProduct._id}>
                    <ProductCard
                      {...similarProduct}
                      onClick={() => navigate(`/products/${similarProduct._id}`)}
                      onRequestSamples={() =>
                        handleAddToCartAndCheckout(similarProduct, "samples")
                      }
                      onRequestTds={() =>
                        handleAddToCartAndCheckout(similarProduct, "tds")
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Container>
        </Box>
      )}
    </>
  );
}

/* Reused UI elements */

function Badge({ children }) {
  return (
    <Box
      sx={{
        fontSize: { xs: 10, sm: 11 },
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        border: "1px solid rgba(210,178,107,.18)",
        background: "rgba(210,178,107,.06)",
        px: { xs: 1, sm: 1.2 },
        py: { xs: 0.5, sm: 0.7 },
        borderRadius: "999px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

function ActionButton({ children, ...props }) {
  return (
    <Box
      component="button"
      {...props}
      sx={{
        fontSize: { xs: 12, sm: 13 },
        color: "rgba(233,242,241,.9)",
        border: "1px solid rgba(210,178,107,.18)",
        background: "rgba(255,255,255,.02)",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1, sm: 1.3 },
        borderRadius: 2,
        cursor: "pointer",
        transition: ".2s",
        flex: { xs: 1, sm: "auto" },
        "&:hover": {
          background: "rgba(210,178,107,.1)",
          borderColor: "rgba(210,178,107,.35)",
        },
      }}
    >
      {children}
    </Box>
  );
}
