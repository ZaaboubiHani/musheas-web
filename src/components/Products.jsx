import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Skeleton,
} from "@mui/material";
import { GoldButton } from "./Header";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../providers/ProductProvider";
import { useCart } from "../providers/CartProvider";
import { useTranslation } from "react-i18next";
import { useSection } from "../providers/SectionProvider";
import { useSnackbar } from "../providers/SnackbarProvider";

export default function Products() {
  const { t, i18n } = useTranslation();
  const { randomProducts, randomProductsLoading, fetchRandomProducts } =
    useProducts();
  const { addToCart } = useCart();
  const { section } = useSection();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchRandomProducts(4);
  }, []);

  const handleAddToCartAndCheckout = (product, type) => {
    addToCart(product, 1);
    showSnackbar(
      t("products.addedToCart", { name: product.name[i18n.language] }),
      "success",
    );
    navigate("/checkout", {
      state: {
        requestType: type,
        requestOrigin: product.productType === "b2b" ? "company" : "client",
      },
    });
  };

  const handleRequestOnly = (product, type) => {
    // Navigate to checkout with product data WITHOUT adding to cart
    navigate(`/checkout/product/${product._id}`, {
      state: {
        requestType: type,
        requestOrigin: product.productType === "b2b" ? "company" : "client",
        singleProduct: product, // Pass the product data
        quantity: 1, // Default quantity
      },
    });
  };

  return (
    <Box component="section" id="products" sx={{ pb: 8 }}>
      <Container maxWidth="lg">
        {/* Section Head */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ md: "flex-end" }}
          justifyContent="space-between"
          gap={2}
          mb={4}
          className="animate-fade-in-up"
          sx={{ opacity: 0 }}
        >
          <Box>
            <Typography
              component="h2"
              sx={{
                fontFamily:
                  'var(--font-serif, "Literata", ui-serif, Georgia, "Times New Roman", serif)',
                fontSize: { xs: 26, md: 30 },
                letterSpacing: "0.03em",
                color: "primary.main",
              }}
            >
              {section?.productsTitle?.[i18n.language]}
            </Typography>
            <Typography
              sx={{
                mt: 0.75,
                fontSize: 14,
                maxWidth: "60ch",
                lineHeight: 1.65,
                color: "rgba(233,242,241,.68)",
              }}
            >
              {section?.productsSubtitle?.[i18n.language]}
            </Typography>
          </Box>
          <GoldButton href="#contact" sx={{ flexShrink: 0 }}>
            {t("products.quote")}
          </GoldButton>
        </Stack>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {randomProductsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <ProductSkeleton />
                </Grid>
              ))
            : randomProducts.map((product, index) => (
                <Grid
                  key={product._id}
                  size={{ xs: 12, sm: 6, md: 3 }}
                  className="animate-fade-in-up"
                  sx={{ opacity: 0, animationDelay: `${index * 80}ms` }}
                >
                  <ProductCard
                    {...product}
                    onClick={() => navigate(`/products/${product._id}`)}
                    onRequestSamples={() =>
                      handleRequestOnly(product, "samples")
                    }
                    onRequestTds={() =>
                      handleRequestOnly(product, "tds")
                    }
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
    <Box
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(210,178,107,.1)",
        background:
          "linear-gradient(180deg, rgba(15,46,51,.8), rgba(10,30,34,.8))",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Skeleton
          variant="text"
          width="65%"
          height={24}
          sx={{ bgcolor: "rgba(210,178,107,.08)" }}
        />
        <Skeleton
          variant="text"
          width="90%"
          sx={{ bgcolor: "rgba(210,178,107,.06)" }}
        />
        <Skeleton
          variant="text"
          width="45%"
          sx={{ bgcolor: "rgba(210,178,107,.06)" }}
        />
      </Box>
      <Skeleton
        variant="rectangular"
        height={140}
        sx={{ bgcolor: "rgba(210,178,107,.05)", mx: 2, mb: 2, borderRadius: 2 }}
        animation="wave"
      />
      <Stack direction="row" gap={1} px={2} pb={2}>
        <Skeleton
          variant="rectangular"
          height={36}
          sx={{ flex: 1, borderRadius: 2, bgcolor: "rgba(210,178,107,.06)" }}
        />
        <Skeleton
          variant="rectangular"
          height={36}
          sx={{ flex: 1, borderRadius: 2, bgcolor: "rgba(210,178,107,.06)" }}
        />
      </Stack>
    </Box>
  );
}

export function ProductCard({
  name,
  description,
  categoryName,
  badge,
  imageUrls,
  price,
  discountPrice,
  unit,
  productType,
  onRequestTds,
  onRequestSamples,
  ...props
}) {
  const { t, i18n } = useTranslation();

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

  const hasDiscount =
    discountPrice && discountPrice > 0 && discountPrice < price;
  const formattedPrice = formatPrice(price);
  const formattedDiscountPrice = hasDiscount
    ? formatPrice(discountPrice)
    : null;

  return (
    <Box
      {...props}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid rgba(210,178,107,.13)",
        cursor: "pointer",
        background:
          "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
        boxShadow: "0 16px 48px rgba(0,0,0,.3)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition:
          "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        "&:hover": {
          transform: "translateY(-5px) scale(1.01)",
          boxShadow:
            "0 28px 60px rgba(0,0,0,.45), 0 0 0 1px rgba(210,178,107,.2)",
          borderColor: "rgba(210,178,107,.28)",
        },
        "&:hover .product-image": {
          transform: "scale(1.06)",
        },
      }}
    >
      {/* Top info */}
      <Box p={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1}
        >
          <Typography
            sx={{
              fontFamily:
                'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
              fontSize: { xs: 14, sm: 16 },
              letterSpacing: "0.02em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flex: 1,
              wordBreak: "break-word",
              lineHeight: 1.3,
            }}
          >
            {name[i18n.language]}
          </Typography>
          {badge?.[i18n.language] && (
            <PillBadge>{badge[i18n.language]}</PillBadge>
          )}
        </Stack>

        <Typography
          sx={{
            mt: 0.75,
            fontSize: { xs: 11, sm: 12 },
            lineHeight: 1.5,
            color: "rgba(233,242,241,.65)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description[i18n.language]}
        </Typography>

        {price && productType === "regular" && (
          <Stack
            direction="row"
            alignItems="baseline"
            gap={0.75}
            mt={1.25}
            flexWrap="wrap"
          >
            {hasDiscount ? (
              <>
                <Typography
                  sx={{
                    fontSize: { xs: 16, md: 18 },
                    fontWeight: 700,
                    color: "#d2b26b",
                    fontFamily:
                      'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
                    whiteSpace: "nowrap",
                  }}
                >
                  {formattedDiscountPrice}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "rgba(233,242,241,.45)",
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
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 700,
                  color: "#d2b26b",
                  fontFamily:
                    'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
                  whiteSpace: "nowrap",
                }}
              >
                {formattedPrice}
              </Typography>
            )}
            {unit && (
              <Typography
                sx={{
                  fontSize: 11,
                  color: "rgba(233,242,241,.5)",
                  whiteSpace: "nowrap",
                }}
              >
                / {getUnitLabel(unit)}
              </Typography>
            )}
          </Stack>
        )}

        {categoryName?.[i18n.language] && (
          <Typography
            sx={{
              mt: 0.75,
              fontSize: 11,
              color: "rgba(210,178,107,.85)",
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
            px: 2,
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: { xs: 110, md: 140 },
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            className="product-image"
            src={imageUrls[0]}
            alt={name.en}
            sx={{
              width: "100%",
              maxHeight: { xs: 110, md: 140 },
              objectFit: "contain",
              borderRadius: 2,
              transition: "transform 0.4s ease",
            }}
          />
        </Box>
      )}

      {/* Actions */}
      <Stack direction="row" gap={1} px={2} pb={2} mt={1.5}>
        <CardActionButton
          onClick={(e) => {
            e.stopPropagation();
            onRequestTds();
          }}
        >
          {t("products.tds")}
        </CardActionButton>
        <CardActionButton
          onClick={(e) => {
            e.stopPropagation();
            onRequestSamples();
          }}
        >
          {t("products.samples")}
        </CardActionButton>
      </Stack>
    </Box>
  );
}

function PillBadge({ children }) {
  return (
    <Box
      sx={{
        display: "inline-block",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        border: "1px solid rgba(210,178,107,.2)",
        background: "rgba(210,178,107,.07)",
        color: "rgba(210,178,107,.9)",
        px: 1.2,
        py: 0.5,
        borderRadius: "999px",
        whiteSpace: "nowrap",
        lineHeight: "normal",
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

function CardActionButton({ children, ...props }) {
  return (
    <Box
      component="button"
      {...props}
      sx={{
        flex: 1,
        fontSize: 12,
        color: "rgba(233,242,241,.8)",
        border: "1px solid rgba(210,178,107,.13)",
        background: "rgba(255,255,255,.02)",
        px: 1.5,
        py: 1,
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        "&:hover": {
          background: "rgba(210,178,107,.1)",
          borderColor: "rgba(210,178,107,.32)",
          color: "#d2b26b",
          transform: "translateY(-1px)",
        },
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
}
