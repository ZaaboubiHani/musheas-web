import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Divider,
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useProducts } from "../providers/ProductProvider";
import { useEffect, useState } from "react";

import { GoldButton } from "../components/Header";
import RequestDialog from "../components/RequestDialog";
import { useTranslation } from "react-i18next";
export default function ProductDetails() {
  const { id } = useParams();
  const { products, fetchProducts } = useProducts();
  const { t, i18n } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [type, setType] = useState();

  useEffect(() => {
    if (!products?.length) fetchProducts();
  }, []);

  useEffect(() => {
    if (products?.length) {
      const found = products.find((p) => p._id === id);
      setProduct(found);
      setActiveImage(0);
    }
  }, [products, id]);

  if (!product) return null;

  const { name, description, categoryName, badge, imageUrls } = product;

  return (
    <Box component="section" sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack spacing={1.2} mb={4}>
          <Typography
            sx={{
              fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
              fontSize: 32,
              letterSpacing: "0.03em",
              color: "primary.main",
            }}
          >
            {name[i18n.language]}
          </Typography>

          <Stack direction="row" alignItems="center" gap={1}>
            <Badge>{badge[i18n.language]}</Badge>
          </Stack>
        </Stack>

        <Grid container spacing={5}>
          {/* Image */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                borderRadius: 4,
                border: "1px solid rgba(210,178,107,.14)",
                background:
                  "linear-gradient(180deg, rgba(15,46,51,.92), rgba(10,30,34,.92))",
                p: 3,
              }}
            >
              {/* Main image */}
              <Box
                component="img"
                src={imageUrls?.[activeImage]}
                alt={name.en}
                sx={{
                  width: "100%",
                  maxHeight: 320,
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
                >
                  {imageUrls.map((img, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={img}
                      alt={`${name.en} ${index + 1}`}
                      onClick={() => setActiveImage(index)}
                      sx={{
                        width: 58,
                        height: 58,
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

          {/* Content */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
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
              <Typography
                sx={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "rgba(233,242,241,.75)",
                }}
              >
                {description[i18n.language]}
              </Typography>

              <Divider sx={{ borderColor: "rgba(210,178,107,.15)" }} />

              <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
                <ActionButton
                  onClick={() => {
                    setType("tds");
                    setOpen(true);
                  }}
                >
                  {t("products.tds")}
                </ActionButton>

                <ActionButton
                  onClick={() => {
                    setType("samples");
                    setOpen(true);
                  }}
                >
                  {t("products.samples")}
                </ActionButton>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <RequestDialog
        open={open}
        type={type}
        product={product}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
}

/* Reused UI elements */

function Badge({ children }) {
  return (
    <Box
      sx={{
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        border: "1px solid rgba(210,178,107,.18)",
        background: "rgba(210,178,107,.06)",
        px: 1.2,
        py: 0.7,
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
        fontSize: 13,
        color: "rgba(233,242,241,.9)",
        border: "1px solid rgba(210,178,107,.18)",
        background: "rgba(255,255,255,.02)",
        px: 2,
        py: 1.3,
        borderRadius: 2,
        cursor: "pointer",
        transition: ".2s",
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
