import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Skeleton,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../providers/ProductProvider";
import { useCart } from "../providers/CartProvider";
import { useTranslation } from "react-i18next";
import { useSection } from "../providers/SectionProvider";
import { useSnackbar } from "../providers/SnackbarProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { ProductCard } from "../components/Products";

export default function Store() {
  const { t, i18n } = useTranslation();
  const { products, productsLoading, fetchProducts, pagination } =
    useProducts();
  const { addToCart } = useCart();
  const { section } = useSection();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [sortBy, setSortBy] = useState("newest");
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

  useEffect(() => {
    if (isInitialLoad.current || !productsLoading) {
      isInitialLoad.current = false;
      fetchProducts({ page, limit, productType: "regular" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleAddToCartAndCheckout = (product, type) => {
    addToCart(product, 1);
    showSnackbar(
      t("products.addedToCart", { name: product.name[i18n.language] }),
      "success",
    );
    navigate("/checkout", {
      state: { requestType: type, requestOrigin: "client" },
    });
  };

  const handleRequestOnly = (product, type) => {
    // Navigate to checkout with product data WITHOUT adding to cart
    navigate(`/checkout/product/${product._id}`, {
      state: {
        requestType: type,
        requestOrigin: "client",
        singleProduct: product, // Pass the product data
        quantity: 1, // Default quantity
      },
    });
  };

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
    <Box component="section" sx={{ pt: 6, pb: 10, minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Page hero header */}
        <Box
          className="animate-fade-in-up"
          sx={{
            textAlign: "center",
            mb: 8,
            opacity: 0,
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              background: "rgba(210,178,107,.08)",
              border: "1px solid rgba(210,178,107,.18)",
              borderRadius: "999px",
              px: 2,
              py: 0.75,
              mb: 2.5,
            }}
          >
            <StorefrontIcon sx={{ color: "primary.main", fontSize: 15 }} />
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(210,178,107,.9)",
              }}
            >
              {t("header.store") || "Store"}
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              fontFamily:
                'var(--font-serif, "Literata", ui-serif, Georgia, "Times New Roman", serif)',
              fontSize: { xs: 32, sm: 40, md: 48 },
              fontWeight: 700,
              letterSpacing: "0.03em",
              color: "primary.main",
              mb: 1.5,
            }}
          >
            {section?.productsTitle?.[i18n.language] || t("store.title")}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 14, md: 16 },
              color: "rgba(233,242,241,.65)",
              maxWidth: "52ch",
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            {section?.productsSubtitle?.[i18n.language] || t("store.subtitle")}
          </Typography>
        </Box>

        {/* Controls bar */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
          mb={4}
          p={2}
          className="animate-fade-in-up"
          sx={{
            background: "rgba(255,255,255,.02)",
            borderRadius: 3,
            border: "1px solid rgba(210,178,107,.09)",
            opacity: 0,
            animationDelay: "0.1s",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate("/")}
              size="small"
              sx={{
                color: "rgba(233,242,241,.55)",
                fontSize: 13,
                "&:hover": { color: "rgba(233,242,241,.85)" },
              }}
            >
              {t("common.backToHome")}
            </Button>
            {pagination?.totalCount && (
              <Typography sx={{ color: "rgba(233,242,241,.45)", fontSize: 13 }}>
                {t("store.showingResults", {
                  from: (page - 1) * limit + 1,
                  to: Math.min(page * limit, pagination.totalCount),
                  total: pagination.totalCount,
                })}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" gap={1.5} flexWrap="wrap">
            <StyledSelect
              value={limit}
              onChange={handleLimitChange}
              label={t("store.perPage")}
              minWidth={90}
            >
              {[8, 12, 24, 48].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </StyledSelect>
          </Stack>
        </Stack>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {productsLoading
            ? Array.from({ length: limit }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <PageProductSkeleton />
                </Grid>
              ))
            : sortedProducts.map((product, index) => (
                <Grid
                  key={product._id}
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  className="animate-fade-in-up"
                  sx={{ opacity: 0, animationDelay: `${(index % 12) * 55}ms` }}
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

        {!productsLoading && sortedProducts.length === 0 && (
          <Box textAlign="center" py={10}>
            <StorefrontIcon
              sx={{ fontSize: 52, color: "rgba(210,178,107,.2)", mb: 2 }}
            />
            <Typography sx={{ color: "rgba(233,242,241,.55)" }}>
              {t("store.noProducts")}
            </Typography>
          </Box>
        )}

        {pagination && pagination.totalPages > 1 && (
          <Stack alignItems="center" mt={7}>
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              disabled={productsLoading}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "rgba(233,242,241,.65)",
                  borderColor: "rgba(210,178,107,.22)",
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "rgba(210,178,107,.18)",
                  color: "#d2b26b",
                  borderColor: "rgba(210,178,107,.4)",
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "rgba(210,178,107,.09)",
                },
              }}
            />
          </Stack>
        )}
      </Container>
    </Box>
  );
}

function StyledSelect({ value, onChange, label, minWidth = 110, children }) {
  return (
    <FormControl size="small" sx={{ minWidth }}>
      <InputLabel sx={{ color: "rgba(233,242,241,.55)", fontSize: 13 }}>
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        sx={{
          color: "rgba(233,242,241,.85)",
          fontSize: 13,
          borderRadius: "10px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(210,178,107,.25)",
          },
          "& .MuiSvgIcon-root": { color: "rgba(210,178,107,.6)" },
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
}

function PageProductSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(210,178,107,.08)",
        background:
          "linear-gradient(180deg, rgba(15,46,51,.7), rgba(10,30,34,.7))",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Skeleton
          variant="text"
          width="65%"
          height={22}
          sx={{ bgcolor: "rgba(210,178,107,.08)" }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          width="90%"
          sx={{ bgcolor: "rgba(210,178,107,.06)" }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          width="45%"
          sx={{ bgcolor: "rgba(210,178,107,.06)" }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          width="35%"
          height={28}
          sx={{ bgcolor: "rgba(210,178,107,.08)", mt: 0.5 }}
          animation="wave"
        />
      </Box>
      <Skeleton
        variant="rectangular"
        height={160}
        sx={{ bgcolor: "rgba(210,178,107,.05)", mx: 2, mb: 2, borderRadius: 2 }}
        animation="wave"
      />
      <Stack direction="row" gap={1} px={2} pb={2}>
        <Skeleton
          variant="rectangular"
          height={34}
          sx={{ flex: 1, borderRadius: 2, bgcolor: "rgba(210,178,107,.06)" }}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          height={34}
          sx={{ flex: 1, borderRadius: 2, bgcolor: "rgba(210,178,107,.06)" }}
          animation="wave"
        />
      </Stack>
    </Box>
  );
}
