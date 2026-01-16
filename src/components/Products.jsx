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
} from "@mui/material";
import { GoldButton } from "./Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestDialog from "./RequestDialog";
import { useProducts } from "../providers/ProductProvider";
import { useTranslation } from "react-i18next";
export default function Products() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const { products, productsLoading, fetchProducts } = useProducts();

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

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
              {t("products.title")}
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
              {t("products.subtitle")}
              {t("products.subtitle")}
            </Typography>
          </Box>

          <GoldButton href="#contact">{t("products.quote")}</GoldButton>
        </Stack>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Grid key={i} item size={{ xs: 12, sm: 6, md: 3 }}>
                  <ProductSkeleton />
                </Grid>
              ))
            : products.map((product) => (
                <Grid key={product._id} item size={{ xs: 12, sm: 6, md: 3 }}>
                  <ProductCard
                    {...product}
                    onClick={() => navigate(`/products/${product._id}`)}
                    onRequestSamples={() => {
                      setSelectedProduct(product);
                      setType("samples");
                      setOpen(true);
                    }}
                    onRequestTds={() => {
                      setSelectedProduct(product);
                      setType("tds");
                      setOpen(true);
                    }}
                  />
                </Grid>
              ))}
        </Grid>
      </Container>
      <RequestDialog
        open={open}
        type={type}
        product={selectedProduct}
        onClose={() => {
          setOpen(false);
        }}
      />
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
  onRequestTds,
  onRequestSamples,
  ...props
}) {
  const { t, i18n } = useTranslation();

  return (
    <Box
      {...props}
      sx={{
        height: "100%",
        borderRadius: 4,
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={1.5}
        p={2}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
              fontSize: 18,
              letterSpacing: "0.02em",
            }}
          >
            {name[i18n.language]}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 13,
              minHeight: 44,
              lineHeight: 1.55,
              color: "rgba(233,242,241,.7)",
            }}
          >
            {description[i18n.language]}
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: 12,
              color: "rgba(210,178,107,.9)",
              fontWeight: 500,
            }}
          >
            #{categoryName[i18n.language]}
          </Typography>
        </Box>

        <Badge>{badge[i18n.language]}</Badge>
      </Stack>

      {/* Image */}
      {imageUrls?.[0] && (
        <Box
          sx={{
            px: 2,
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={imageUrls[0]}
            alt={name.en}
            sx={{
              width: "100%",
              maxHeight: 150,
              objectFit: "contain",
              borderRadius: 2,
            }}
          />
        </Box>
      )}

      {/* Actions */}
      <Stack direction="row" gap={1.2} px={2} pb={2}>
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onRequestTds();
          }}
        >
          {t("products.tds")}
        </ActionButton>

        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onRequestSamples();
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
        display: "inline-block", // makes width and height fit content
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        border: "1px solid rgba(210,178,107,.18)",
        background: "rgba(210,178,107,.06)",
        px: 1.1,
        py: 0.7,
        borderRadius: "999px",
        whiteSpace: "nowrap",
        lineHeight: "normal", // ensures height matches content
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
