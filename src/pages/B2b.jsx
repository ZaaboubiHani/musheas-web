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
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { GoldButton } from "../components/Header";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../providers/ProductProvider";
import { useCart } from "../providers/CartProvider";
import { useTranslation } from "react-i18next";
import { useSection } from "../providers/SectionProvider";
import { useSnackbar } from "../providers/SnackbarProvider";
import StoreIcon from "@mui/icons-material/Store";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function B2b() {
  const { t, i18n } = useTranslation();
  const { products, productsLoading, fetchProducts, pagination } =
    useProducts();
  const { addToCart } = useCart();
  const { section } = useSection();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [sortBy, setSortBy] = useState("newest");

  // Use ref to prevent infinite loop
  const isInitialLoad = useRef(true);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Fetch products - only when page or limit changes, not on every render
  useEffect(() => {
    if (isInitialLoad.current || !productsLoading) {
      isInitialLoad.current = false;
      fetchProducts({
        page,
        limit,
        productType: "b2b",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]); // <-- Only depend on page and limit, NOT fetchProducts

  const handleAddToCartAndCheckout = (product, type) => {
    addToCart(product, 1);
    showSnackbar(
      t("products.addedToCart", { name: product.name[i18n.language] }),
      "success",
    );
    navigate("/checkout", {
      state: {
        requestType: type,
        requestOrigin: "company" ,
      },
    });
  };

  // Sort products client-side
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "name":
        return (a.name[i18n.language] || "").localeCompare(
          b.name[i18n.language] || "",
        );
      case "newest":
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  return (
    <Box component="section" id="products" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={2}
          mb={4}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <StoreIcon sx={{ color: "primary.main", fontSize: 32 }} />
            <Box>
              <Typography
                component="h1"
                sx={{
                  fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
                  fontSize: { xs: 24, sm: 32 },
                  letterSpacing: "0.03em",
                  color: "primary.main",
                }}
              >
                {section?.productsTitle?.[i18n.language] || t("store.title")}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  color: "rgba(233,242,241,.72)",
                }}
              >
                {section?.productsSubtitle?.[i18n.language] ||
                  t("store.subtitle")}
              </Typography>
            </Box>
          </Stack>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{ color: "rgba(233,242,241,.7)" }}
          >
            {t("common.backToHome")}
          </Button>
        </Stack>

        {/* Filters & Controls */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
          mb={3}
          p={2}
          sx={{
            background: "rgba(255,255,255,0.02)",
            borderRadius: 2,
            border: "1px solid rgba(210,178,107,.1)",
          }}
        >
          {/* Results count */}
          <Typography sx={{ color: "rgba(233,242,241,.7)", fontSize: 14 }}>
            {pagination?.totalCount
              ? t("store.showingResults", {
                  from: (page - 1) * limit + 1,
                  to: Math.min(page * limit, pagination.totalCount),
                  total: pagination.totalCount,
                })
              : t("store.loading")}
          </Typography>

          <Stack
            direction="row"
            gap={2}
            flexWrap="wrap"
            justifyContent={{ xs: "stretch", sm: "flex-end" }}
          >
            {/* Items per page */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ color: "rgba(233,242,241,.7)" }}>
                {t("store.perPage")}
              </InputLabel>
              <Select
                value={limit}
                onChange={handleLimitChange}
                label={t("store.perPage")}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(210,178,107,.3)",
                  },
                }}
              >
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={48}>48</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {productsLoading
            ? Array.from({ length: limit }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductSkeleton />
                </Grid>
              ))
            : sortedProducts.map((product) => (
                <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductCard
                    {...product}
                    onClick={() => navigate(`/products/${product._id}`)}
                    onRequestSamples={() =>
                      handleAddToCartAndCheckout(product, "samples")
                    }
                    onRequestTds={() =>
                      handleAddToCartAndCheckout(product, "tds")
                    }
                  />
                </Grid>
              ))}
        </Grid>

        {/* Empty State */}
        {!productsLoading && sortedProducts.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" sx={{ color: "rgba(233,242,241,.7)" }}>
              {t("store.noProducts")}
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Stack alignItems="center" mt={6}>
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              disabled={productsLoading}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "rgba(233,242,241,.7)",
                  borderColor: "rgba(210,178,107,.3)",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "rgba(210,178,107,.2)",
                  color: "#d2b26b",
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "rgba(210,178,107,.1)",
                },
              }}
            />
          </Stack>
        )}

       
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
        height: "100%",
      }}
    >
      <Skeleton variant="rectangular" height={180} />
      <CardContent>
        <Stack spacing={1}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="40%" />
          <Box mt={2}>
            <Skeleton variant="rectangular" height={36} />
          </Box>
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

  const formatPrice = (value) => {
    if (!value && value !== 0) return null;
    return new Intl.NumberFormat(i18n.language === "fr" ? "fr-DZ" : "en-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const hasDiscount =
    discountPrice && discountPrice > 0 && discountPrice < price;

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
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 25px 60px rgba(0,0,0,.45)",
        },
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
                fontSize: { xs: 10, sm: 12 },
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

        {/* Price Section */}

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
            minHeight: { xs: 120, sm: 150, md: 180 },
          }}
        >
          <Box
            component="img"
            src={imageUrls[0]}
            alt={name.en}
            sx={{
              width: "100%",
              maxHeight: { xs: 120, sm: 150, md: 180 },
              objectFit: "contain",
              borderRadius: 1,
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
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

function Badge({ children, sx }) {
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
        ...sx,
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
        transition: "all 0.2s ease",
        "&:hover": {
          background: "rgba(210,178,107,.12)",
          borderColor: "rgba(210,178,107,.35)",
          color: "#d2b26b",
        },
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
}
