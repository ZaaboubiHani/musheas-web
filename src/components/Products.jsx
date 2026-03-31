import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  Skeleton,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { GoldButton } from "./Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../providers/ProductProvider";
import { useCart } from "../providers/CartProvider";
import { useTranslation } from "react-i18next";
import { useSection } from "../providers/SectionProvider";
import { useSnackbar } from "../providers/SnackbarProvider";

export default function Products() {
  const { t, i18n } = useTranslation();
  const { products, productsLoading, fetchProducts } = useProducts();
  const { addToCart } = useCart();
  const { section } = useSection();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCartAndCheckout = (product, type) => {
    // Add product to cart with quantity 1
    addToCart(product, 1);
    
    // Show success message
    showSnackbar(
      t("products.addedToCart", { name: product.name[i18n.language] }),
      "success"
    );
    
    // Navigate to checkout with the selected type
    navigate("/checkout", { state: { requestType: type } });
  };

  return (
    <Box component="section" id="products" sx={{ py: 7 }}>
      <Container maxWidth="lg">
        {/* Section Head */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ md: "flex-end" }}
          justifyContent="space-between"
          gap={2}
          mb={3}
        >
          <Box>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
                fontSize: 28,
                letterSpacing: "0.03em",
                color: "primary.main",
              }}
            >
              {section?.productsTitle[i18n.language]}
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
              {section?.productsSubtitle[i18n.language]}
            </Typography>
          </Box>

          <GoldButton href="#contact">{t("products.quote")}</GoldButton>
        </Stack>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <ProductSkeleton />
                </Grid>
              ))
            : products.map((product) => (
                <Grid key={product._id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <ProductCard
                    {...product}
                    onClick={() => navigate(`/products/${product._id}`)}
                    onRequestSamples={() => handleAddToCartAndCheckout(product, "samples")}
                    onRequestTds={() => handleAddToCartAndCheckout(product, "tds")}
                  />
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}

function ProductSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: 2,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Skeleton variant="rectangular" height={140} />
      <CardContent>
        <Stack spacing={1}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="40%" />
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProductCard({
  name,
  description,
  categoryName,
  badge,
  imageUrls,
  price,
  discountPrice,
  unit,
  onRequestTds,
  onRequestSamples,
  ...props
}) {
  const { t, i18n } = useTranslation();

  // Helper function to format price in DZD
  const formatPrice = (value) => {
    if (!value && value !== 0) return null;
    return new Intl.NumberFormat(i18n.language === 'fr' ? 'fr-DZ' : 'en-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper function to get unit label in current language
  const getUnitLabel = (unitValue) => {
    const unitLabels = {
      kg: { en: "kg", fr: "kg" },
      g: { en: "g", fr: "g" },
      lb: { en: "lb", fr: "lb" },
      oz: { en: "oz", fr: "oz" },
      piece: { en: "piece", fr: "pièce" },
      dozen: { en: "dozen", fr: "douzaine" },
      liter: { en: "liter", fr: "litre" },
      ml: { en: "ml", fr: "ml" },
      gallon: { en: "gallon", fr: "gallon" },
      box: { en: "box", fr: "boîte" },
      pack: { en: "pack", fr: "paquet" },
    };
    return unitLabels[unitValue]?.[i18n.language] || unitValue;
  };

  const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < price;
  const formattedPrice = formatPrice(price);
  const formattedDiscountPrice = hasDiscount ? formatPrice(discountPrice) : null;

  return (
    <Box
      {...props}
      sx={{
        height: "100%",
        borderRadius: { xs: 2, sm: 4 },
        border: "1px solid rgba(210,178,107,.14)",
        cursor: "pointer",
        background:
          "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
        boxShadow: "0 20px 55px rgba(0,0,0,.35)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top */}
      <Box p={{ xs: 1.5, sm: 2 }}>
        {/* Row 1: Name + Badge */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1}
        >
          <Typography
            sx={{
              fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
              fontSize: { xs: 14, sm: 16, md: 18 },
              letterSpacing: "0.02em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
              wordBreak: "break-word",
            }}
          >
            {name[i18n.language]}
          </Typography>

          {badge?.[i18n.language] && (
            <Badge 
              sx={{ 
                flexShrink: 0,
                fontSize: { xs: 10, sm: 12 }
              }}
            >
              {badge[i18n.language]}
            </Badge>
          )}
        </Stack>

        {/* Row 2: Description */}
        <Typography
          sx={{
            mt: 0.5,
            fontSize: { xs: 11, sm: 12, md: 13 },
            lineHeight: 1.4,
            color: "rgba(233,242,241,.7)",
            display: "-webkit-box",
            WebkitLineClamp: { xs: 2, sm: 3 },
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
          }}
        >
          {description[i18n.language]}
        </Typography>

        {/* Price Section - Mobile Responsive */}
        {price && (
          <Box sx={{ mt: 1 }}>
            <Stack 
              direction="row" 
              alignItems="baseline" 
              flexWrap="wrap"
              spacing={0.5}
              sx={{ gap: { xs: 0.5, sm: 1 } }}
            >
              {hasDiscount ? (
                <>
                  <Typography
                    sx={{
                      fontSize: { xs: 16, sm: 18, md: 20 },
                      fontWeight: "bold",
                      color: "#d2b26b",
                      fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formattedDiscountPrice}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: 12, sm: 13, md: 14 },
                      color: "rgba(233,242,241,.5)",
                      textDecoration: "line-through",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formattedPrice}
                  </Typography>
                </>
              ) : (
                <Typography
                  sx={{
                    fontSize: { xs: 16, sm: 18, md: 20 },
                    fontWeight: "bold",
                    color: "#d2b26b",
                    fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
                    whiteSpace: "nowrap",
                  }}
                >
                  {formattedPrice}
                </Typography>
              )}
              {unit && (
                <Typography
                  sx={{
                    fontSize: { xs: 10, sm: 11, md: 12 },
                    color: "rgba(233,242,241,.6)",
                    whiteSpace: "nowrap",
                  }}
                >
                  / {getUnitLabel(unit)}
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* Row 3: Category */}
        {categoryName?.[i18n.language] && (
          <Typography
            sx={{
              mt: 0.75,
              fontSize: { xs: 10, sm: 11, md: 12 },
              color: "rgba(210,178,107,.9)",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            #{categoryName[i18n.language]}
          </Typography>
        )}
      </Box>

      {/* Image */}
      {imageUrls?.[0] && (
        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: { xs: 100, sm: 120, md: 150 },
          }}
        >
          <Box
            component="img"
            src={imageUrls[0]}
            alt={name.en}
            sx={{
              width: "100%",
              maxHeight: { xs: 100, sm: 130, md: 150 },
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
        </Box>
      )}

      {/* Actions */}
      <Stack 
        direction="row" 
        gap={{ xs: 0.75, sm: 1.2 }} 
        px={{ xs: 1.5, sm: 2 }} 
        pb={{ xs: 1.5, sm: 2 }} 
        mt={1.5}
      >
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onRequestTds();
          }}
          sx={{
            fontSize: { xs: 11, sm: 12 },
            py: { xs: 0.5, sm: 0.75 },
          }}
        >
          {t("products.tds")}
        </ActionButton>

        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onRequestSamples();
          }}
          sx={{
            fontSize: { xs: 11, sm: 12 },
            py: { xs: 0.5, sm: 0.75 },
          }}
        >
          {t("products.samples")}
        </ActionButton>
      </Stack>
    </Box>
  );
}

function Badge({ children }) {
  return (
    <Box
      sx={{
        display: "inline-block",
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        border: "1px solid rgba(210,178,107,.18)",
        background: "rgba(210,178,107,.06)",
        px: 1.1,
        py: 0.7,
        borderRadius: "999px",
        whiteSpace: "nowrap",
        lineHeight: "normal",
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
        flex: 1,
        fontSize: 12,
        color: "rgba(233,242,241,.85)",
        border: "1px solid rgba(210,178,107,.14)",
        background: "rgba(255,255,255,.02)",
        px: 1.5,
        py: 1.2,
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": {
          background: "rgba(210,178,107,.08)",
          borderColor: "rgba(210,178,107,.28)",
        },
      }}
    >
      {children}
    </Box>
  );
}