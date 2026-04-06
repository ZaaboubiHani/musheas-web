import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  Drawer,
  Badge as MuiBadge,
  Divider,
  List,
  ListItem,
  IconButton as MuiIconButton,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../providers/CartProvider";
import Swal from "sweetalert2";
import { useSnackbar } from "../providers/SnackbarProvider";

export default function Header() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  const handleNavigation = (path) => {
    navigate(path);
    if (open) setOpen(false);
  };

  const navLinks = [
    { path: "/", label: t("header.home") || "Home" },
    { path: "/store", label: t("header.store") || "Store" },
    { path: "/b2b", label: t("header.b2b") || "B2B" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: `linear-gradient(180deg, rgba(8,22,24,0.88), rgba(8,22,24,0.60))`,
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(210,178,107,0.12)",
          transition: "background 0.3s ease",
          
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            py={1.5}
            gap={2}
          >
            {/* Brand */}
            <Stack
              direction="row"
              alignItems="center"
              gap={1.5}
              component={Link}
              to="/"
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                transition: "opacity 0.2s ease",
                "&:hover": { opacity: 0.85 },
              }}
            >
              <Logo />
              <Typography
                sx={{
                  fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
                  fontWeight: 700,
                  fontSize: 20,
                  color: "primary.main",
                  letterSpacing: "0.02em",
                }}
              >
                MUSHEAS
              </Typography>
            </Stack>

            {/* Desktop Nav */}
            {!isMobile && (
              <Stack
                direction="row"
                gap={0.5}
                sx={{
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    onClick={() => handleNavigation(link.path)}
                    sx={{
                      color: isActive(link.path)
                        ? "primary.main"
                        : "rgba(233,242,241,0.85)",
                      borderRadius: "10px",
                      px: 2,
                      py: 1,
                      fontSize: 13,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      position: "relative",
                      transition: "all 0.2s ease",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 4,
                        left: "50%",
                        transform: isActive(link.path)
                          ? "translateX(-50%) scaleX(1)"
                          : "translateX(-50%) scaleX(0)",
                        width: "60%",
                        height: "1.5px",
                        background: "rgba(210,178,107,0.7)",
                        transformOrigin: "center",
                        transition: "transform 0.25s ease",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(210,178,107,0.08)",
                        color: "rgba(233,242,241,1)",
                        "&::after": {
                          transform: "translateX(-50%) scaleX(1)",
                        },
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
                <LanguageSwitcher />
              </Stack>
            )}

            {/* Right CTAs */}
            <Stack direction="row" gap={1} alignItems="center">
              {!isMobile && (
                <>
                  <GoldButton onClick={() => handleNavigation("/")}>
                    {t("header.requestCatalog")}
                  </GoldButton>
                  <PrimaryGoldButton onClick={() => handleNavigation("/b2b")}>
                    {t("header.samples")}
                  </PrimaryGoldButton>
                </>
              )}

              {/* Cart */}
              <IconButton
                onClick={() => setCartOpen(true)}
                sx={{
                  border: "1px solid rgba(210,178,107,0.2)",
                  borderRadius: "10px",
                  width: 40,
                  height: 40,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(210,178,107,0.08)",
                    borderColor: "rgba(210,178,107,0.38)",
                    transform: "scale(1.04)",
                  },
                }}
              >
                <MuiBadge
                  badgeContent={cartCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#d2b26b",
                      color: "#0a1e22",
                      fontWeight: "bold",
                      fontSize: 10,
                    },
                  }}
                >
                  <ShoppingCartIcon sx={{ color: "rgba(210,178,107,.85)", fontSize: 20 }} />
                </MuiBadge>
              </IconButton>

              {isMobile && (
                <IconButton
                  onClick={() => setOpen(true)}
                  sx={{
                    border: "1px solid rgba(210,178,107,0.2)",
                    borderRadius: "10px",
                    width: 40,
                    height: 40,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(210,178,107,0.08)",
                    },
                  }}
                >
                  <MenuIcon sx={{ color: "rgba(233,242,241,0.85)", fontSize: 20 }} />
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Container>
      </AppBar>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function Logo() {
  return (
    <Box sx={{ width: 32, height: 32, flexShrink: 0 }}>
      <svg viewBox="0 0 64 64" width="32" height="32" fill="none">
        <path
          d="M12 28c0-10 9-18 20-18s20 8 20 18H12z"
          stroke="rgba(210,178,107,.95)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M28 28v16c0 4 3 7 7 7s7-3 7-7V28"
          stroke="rgba(210,178,107,.95)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M24 46c3 2 5 3 8 3s5-1 8-3"
          stroke="rgba(210,178,107,.75)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
}

export function GoldButton({ children, ...props }) {
  return (
    <Button
      variant="outlined"
      {...props}
      sx={{
        borderColor: "rgba(210,178,107,0.3)",
        backgroundColor: "rgba(210,178,107,0.08)",
        color: "rgba(233,242,241,0.9)",
        borderRadius: "10px",
        transition: "all 0.22s ease",
        px: 2,
        fontSize: 13,
        fontWeight: 500,
        "&:hover": {
          backgroundColor: "rgba(210,178,107,0.14)",
          borderColor: "rgba(210,178,107,0.5)",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(210,178,107,0.12)",
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}

export function PrimaryGoldButton({ children, ...props }) {
  return (
    <Button
      {...props}
      sx={{
        background: "linear-gradient(135deg, rgba(210,178,107,.92), rgba(184,144,63,.92))",
        color: "#102125",
        borderRadius: "10px",
        px: 2,
        fontSize: 13,
        fontWeight: 600,
        transition: "all 0.22s ease",
        boxShadow: "0 4px 18px rgba(210,178,107,.15)",
        "&:hover": {
          background: "linear-gradient(135deg, #d2b26b, #b8903f)",
          transform: "translateY(-1px) scale(1.02)",
          boxShadow: "0 8px 24px rgba(210,178,107,.25)",
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}

export function MobileDrawer({ open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          background: "linear-gradient(180deg, rgba(8,22,24,0.98), rgba(8,22,24,0.95))",
          backdropFilter: "blur(16px)",
          borderLeft: "1px solid rgba(210,178,107,0.12)",
        },
      }}
    >
      <Stack p={3} gap={1} height="100%">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography
            sx={{
              fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
              color: "primary.main",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            MUSHEAS
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "rgba(233,242,241,0.6)", "&:hover": { color: "#d2b26b" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider sx={{ borderColor: "rgba(210,178,107,0.1)", mb: 1 }} />

        {[
          { path: "/", label: t("header.home") || "Home" },
          { path: "/store", label: t("header.store") || "Store" },
          { path: "/b2b", label: t("header.b2b") || "B2B" },
        ].map((link) => (
          <Button
            key={link.path}
            fullWidth
            onClick={() => handleNavigation(link.path)}
            sx={{
              color: "rgba(233,242,241,0.85)",
              justifyContent: "flex-start",
              borderRadius: "10px",
              py: 1.2,
              px: 2,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: 13,
              "&:hover": {
                backgroundColor: "rgba(210,178,107,0.08)",
                color: "#d2b26b",
              },
            }}
          >
            {link.label}
          </Button>
        ))}

        <Box flexGrow={1} />

        <Stack gap={1.5} pb={1}>
          <GoldButton fullWidth onClick={() => handleNavigation("/")}>
            {t("header.requestCatalog")}
          </GoldButton>
          <PrimaryGoldButton fullWidth onClick={() => handleNavigation("/b2b")}>
            {t("header.samples")}
          </PrimaryGoldButton>
          <Box pt={1}>
            <LanguageSwitcher />
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  );
}

function CartDrawer({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const { items, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

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
      kg: "kg", g: "g", lb: "lb", oz: "oz",
      piece: t("products.piece") || "pièce",
      dozen: t("products.dozen") || "douzaine",
      liter: "L", ml: "ml",
      gallon: t("products.gallon") || "gallon",
      box: t("products.box") || "boîte",
      pack: t("products.pack") || "paquet",
    };
    return units[unitValue] || unitValue;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) updateQuantity(productId, newQuantity);
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: t("cart.clearCartTitle") || "Vider le panier ?",
      text: t("cart.clearCartConfirm") || "Êtes-vous sûr de vouloir supprimer tous les articles ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("cart.clear") || "Vider",
      cancelButtonText: t("cart.cancel") || "Annuler",
      confirmButtonColor: "#ff6b6b",
      didOpen: () => {
        const c = document.querySelector(".swal2-container");
        if (c) c.style.zIndex = "10000";
      },
    });
    if (result.isConfirmed) {
      clearCart();
      showSnackbar(t("cart.cartCleared") || "Panier vidé", "success");
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const getItemPrice = (item) =>
    item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price
      ? item.discountPrice
      : item.price;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          background: "linear-gradient(180deg, rgba(8,22,24,0.98), rgba(8,22,24,0.96))",
          backdropFilter: "blur(12px)",
          borderLeft: "1px solid rgba(210,178,107,0.1)",
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, borderBottom: "1px solid rgba(210,178,107,0.1)" }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, serif)',
            fontSize: 20,
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          {t("cart.title") || "Mon Panier"} ({cartCount})
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "rgba(233,242,241,.6)", "&:hover": { color: "#d2b26b" } }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      {items.length === 0 ? (
        <Stack sx={{ flex: 1, alignItems: "center", justifyContent: "center", p: 4 }}>
          <ShoppingCartIcon sx={{ fontSize: 56, color: "rgba(210,178,107,.2)", mb: 2 }} />
          <Typography sx={{ color: "rgba(233,242,241,.55)", textAlign: "center", mb: 3 }}>
            {t("cart.empty") || "Votre panier est vide"}
          </Typography>
          <GoldButton onClick={onClose}>{t("cart.continueShopping") || "Continuer"}</GoldButton>
        </Stack>
      ) : (
        <>
          <List sx={{ flex: 1, overflow: "auto", p: 2 }}>
            {items.map((item, index) => {
              const itemPrice = getItemPrice(item);
              const hasDiscount = item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price;
              return (
                <Box key={item.cartItemId}>
                  <ListItem
                    sx={{
                      flexDirection: "column",
                      alignItems: "stretch",
                      px: 0,
                      py: 2,
                      animation: "fadeInUp 0.3s ease forwards",
                      animationDelay: `${index * 40}ms`,
                      opacity: 0,
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      {item.imageUrls?.[0] && (
                        <Box
                          component="img"
                          src={item.imageUrls[0]}
                          alt={item.name.en}
                          sx={{
                            width: 72,
                            height: 72,
                            objectFit: "contain",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255,255,255,.04)",
                            border: "1px solid rgba(210,178,107,.1)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "rgba(233,242,241,.9)", mb: 0.5, lineHeight: 1.3 }}>
                          {item.name[i18n.language]}
                        </Typography>
                        {item.categoryName?.[i18n.language] && (
                          <Typography sx={{ fontSize: 11, color: "rgba(210,178,107,.65)", mb: 0.5 }}>
                            #{item.categoryName[i18n.language]}
                          </Typography>
                        )}
                        <Typography sx={{ fontSize: 11, color: "rgba(233,242,241,.5)", mb: 1 }}>
                          {t("products.unit")}: {getUnitLabel(item.unit)}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              backgroundColor: "rgba(255,255,255,.04)",
                              borderRadius: "8px",
                              border: "1px solid rgba(210,178,107,.15)",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              sx={{ color: "rgba(210,178,107,.7)", p: 0.5, "&:hover": { color: "#d2b26b" } }}
                            >
                              <RemoveIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                            <Typography sx={{ fontSize: 13, fontWeight: 500, color: "rgba(233,242,241,.9)", minWidth: 26, textAlign: "center" }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              sx={{ color: "rgba(210,178,107,.7)", p: 0.5, "&:hover": { color: "#d2b26b" } }}
                            >
                              <AddIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => removeFromCart(item._id)}
                            sx={{ color: "rgba(210,178,107,.5)", "&:hover": { color: "#ff6b6b" }, transition: ".2s" }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Stack>
                      </Box>
                      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                        <Typography sx={{ fontSize: 15, fontWeight: "bold", color: "#d2b26b" }}>
                          {formatPrice(itemPrice)}
                        </Typography>
                        {hasDiscount && (
                          <Typography sx={{ fontSize: 11, color: "rgba(233,242,241,.4)", textDecoration: "line-through" }}>
                            {formatPrice(item.price)}
                          </Typography>
                        )}
                        <Typography sx={{ fontSize: 10, color: "rgba(233,242,241,.45)", mt: 0.5 }}>
                          {t("cart.total")}: {formatPrice(itemPrice * item.quantity)}
                        </Typography>
                      </Box>
                    </Stack>
                  </ListItem>
                  <Divider sx={{ borderColor: "rgba(210,178,107,.07)" }} />
                </Box>
              );
            })}
          </List>

          <Box sx={{ p: 2.5, borderTop: "1px solid rgba(210,178,107,0.1)", backgroundColor: "rgba(0,0,0,.2)" }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 15, color: "rgba(233,242,241,.75)" }}>
                  {t("cart.subtotal") || "Sous-total"}:
                </Typography>
                <Typography sx={{ fontSize: 22, fontWeight: "bold", color: "#d2b26b", fontFamily: 'var(--font-serif, "Literata", ui-serif, Georgia, serif)' }}>
                  {formatPrice(cartTotal)}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  onClick={handleClearCart}
                  startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    flex: 1,
                    borderColor: "rgba(210,178,107,0.22)",
                    color: "#ff6b6b",
                    borderRadius: "10px",
                    fontSize: 13,
                    "&:hover": { borderColor: "#ff6b6b", backgroundColor: "rgba(255,107,107,0.07)" },
                  }}
                >
                  {t("cart.clear") || "Vider"}
                </Button>
                <PrimaryGoldButton onClick={handleCheckout} sx={{ flex: 1 }}>
                  {t("cart.checkout") || "Commander"}
                </PrimaryGoldButton>
              </Stack>
            </Stack>
          </Box>
        </>
      )}
    </Drawer>
  );
}
