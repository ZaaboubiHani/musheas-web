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
  ListItemText,
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
  TextField,
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
import { useSection } from "../providers/SectionProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../providers/CartProvider";
import Swal from "sweetalert2";
import { useSnackbar } from "../providers/SnackbarProvider";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { section } = useSection();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  const handleNavigation = (hashKey) => {
    if (location.pathname !== "/") {
      navigate(`/#${hashKey}`);
    } else {
      const element = document.getElementById(hashKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: `linear-gradient(
      180deg,
      rgba(8, 22, 24, 0.82),
      rgba(8, 22, 24, 0.55)
    )`,
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(210, 178, 107, 0.12)",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            py={2}
            gap={2}
          >
            {/* Brand */}
            <Stack direction="row" alignItems="center" gap={1}>
              <Logo />
              <Typography
                sx={{
                  fontFamily: 'ui-serif, "Times New Roman", Georgia, serif',
                  fontWeight: 700,
                  fontSize: 20,
                  color: "primary.main",
                }}
              >
                MUSHEAS
              </Typography>
            </Stack>

            {/* Menu */}
            {!isMobile && (
              <Stack
                direction="row"
                gap={2}
                sx={{
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {[
                  "header.about",
                  "header.products",
                  "header.project",
                  "header.contact",
                ].map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleNavigation(key.replace("header.", ""))}
                    sx={{
                      color: "text.primary",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(210,178,107,0.08)",
                      },
                    }}
                  >
                    {t(key)}
                  </Button>
                ))}

                <LanguageSwitcher></LanguageSwitcher>
              </Stack>
            )}

            {/* CTA and Cart */}
            <Stack direction="row" gap={1}>
              {/* Cart Icon */}
              <IconButton
                onClick={() => setCartOpen(true)}
                sx={{
                  border: "1px solid rgba(210,178,107,0.18)",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <MuiBadge
                  badgeContent={cartCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#d2b26b",
                      color: "#0a1e22",
                      fontWeight: "bold",
                    },
                  }}
                >
                  <ShoppingCartIcon sx={{ color: "rgba(210,178,107,.8)" }} />
                </MuiBadge>
              </IconButton>

              {isMobile && (
                <IconButton
                  onClick={() => setOpen(true)}
                  sx={{
                    border: "1px solid rgba(210,178,107,0.18)",
                    borderRadius: 2,
                  }}
                >
                  <MenuIcon />
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
    <Box sx={{ width: 34, height: 34 }}>
      <svg viewBox="0 0 64 64" width="34" height="34" fill="none">
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
        borderColor: "rgba(210,178,107,0.28)",
        backgroundColor: "rgba(210,178,107,0.12)",
        color: "text.primary",
        borderRadius: 2,
        transition: "all 0.3s ease",
        px: 2,
        "&:hover": {
          backgroundColor: "rgba(210,178,107,0.16)",
          borderColor: "rgba(210,178,107,0.42)",
          transform: "translateY(-1px)",
        },
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
        background:
          "linear-gradient(135deg, rgba(210,178,107,.92), rgba(184,144,63,.92))",
        color: "#102125",
        borderRadius: 2,
        px: 2,
        transition: "all 0.3s ease",
        boxShadow: "0 16px 40px rgba(210,178,107,.18)",
        "&:hover": {
          transform: "translateY(-1px) scale(1.01)",
        },
      }}
    >
      {children}
    </Button>
  );
}

export function MobileDrawer({ open, onClose }) {
  const { t } = useTranslation();
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Stack
        p={3}
        gap={2}
        width={260}
        sx={{
          height: "100%",
          background: `linear-gradient(
            180deg,
            rgba(8, 22, 24, 0.95),
            rgba(8, 22, 24, 0.75)
          )`,
          backdropFilter: "blur(6px)",
        }}
      >
        {[
          "header.about",
          "header.products",
          "header.project",
          "header.contact",
        ].map((item) => (
          <Button
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={onClose}
            sx={{
              color: "text.primary",
            }}
          >
            {t(item)}
          </Button>
        ))}

        <LanguageSwitcher></LanguageSwitcher>

        <GoldButton href="#contact" onClick={onClose}>
          {t("header.requestCatalog")}
        </GoldButton>
        <PrimaryGoldButton href="#products" onClick={onClose}>
          {t("header.samples")}
        </PrimaryGoldButton>
      </Stack>
    </Drawer>
  );
}

// Cart Drawer Component
// Cart Drawer Component
function CartDrawer({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    clearCart,
  } = useCart();
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

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: t("cart.clearCartTitle") || "Vider le panier ?",
      text:
        t("cart.clearCartConfirm") ||
        "Êtes-vous sûr de vouloir supprimer tous les articles de votre panier ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("cart.clear") || "Vider",
      cancelButtonText: t("cart.cancel") || "Annuler",
      confirmButtonColor: "#ff6b6b",
      customClass: {
        container: "swal2-container-custom",
      },
      didOpen: () => {
        // Set higher z-index for the modal
        const modalContainer = document.querySelector(".swal2-container");
        if (modalContainer) {
          modalContainer.style.zIndex = "10000";
        }
        const modalPopup = document.querySelector(".swal2-popup");
        if (modalPopup) {
          modalPopup.style.zIndex = "10001";
        }
      },
    });

    if (result.isConfirmed) {
      clearCart();
      showSnackbar(
        t("cart.cartCleared") || "Panier vidé avec succès",
        "success",
      );
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const getItemPrice = (item) => {
    const price =
      item.discountPrice &&
      item.discountPrice > 0 &&
      item.discountPrice < item.price
        ? item.discountPrice
        : item.price;
    return price;
  };

  const getItemTotal = (item) => {
    const price = getItemPrice(item);
    return price * item.quantity;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          background: `linear-gradient(180deg, rgba(8, 22, 24, 0.98), rgba(8, 22, 24, 0.95))`,
          backdropFilter: "blur(10px)",
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(210,178,107,0.12)",
        }}
      >
        <Typography
          sx={{
            fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
            fontSize: 20,
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          {t("cart.title") || "Mon Panier"} ({cartCount})
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ color: "rgba(233,242,241,.7)" }} />
        </IconButton>
      </Stack>

      {/* Cart Items */}
      {items.length === 0 ? (
        <Stack
          sx={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <ShoppingCartIcon
            sx={{
              fontSize: 64,
              color: "rgba(210,178,107,.3)",
              mb: 2,
            }}
          />
          <Typography
            sx={{
              color: "rgba(233,242,241,.6)",
              textAlign: "center",
              mb: 2,
            }}
          >
            {t("cart.empty") || "Votre panier est vide"}
          </Typography>
          <GoldButton onClick={onClose}>
            {t("cart.continueShopping") || "Continuer vos achats"}
          </GoldButton>
        </Stack>
      ) : (
        <>
          <List sx={{ flex: 1, overflow: "auto", p: 2 }}>
            {items.map((item) => {
              const itemPrice = getItemPrice(item);
              const itemTotal = getItemTotal(item);
              const hasDiscount =
                item.discountPrice &&
                item.discountPrice > 0 &&
                item.discountPrice < item.price;

              return (
                <Box key={item.cartItemId}>
                  <ListItem
                    sx={{
                      flexDirection: "column",
                      alignItems: "stretch",
                      px: 0,
                      py: 2,
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      {/* Product Image */}
                      {item.imageUrls?.[0] && (
                        <Box
                          component="img"
                          src={item.imageUrls[0]}
                          alt={item.name.en}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: "contain",
                            borderRadius: 1,
                            backgroundColor: "rgba(255,255,255,.05)",
                          }}
                        />
                      )}

                      {/* Product Info */}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "rgba(233,242,241,.9)",
                            mb: 0.5,
                          }}
                        >
                          {item.name[i18n.language]}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "rgba(210,178,107,.7)",
                            mb: 0.5,
                          }}
                        >
                          {item.categoryName?.[i18n.language] &&
                            `#${item.categoryName[i18n.language]}`}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "rgba(233,242,241,.6)",
                            mb: 1,
                          }}
                        >
                          {t("products.unit")}: {getUnitLabel(item.unit)}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          {/* Quantity Controls */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              backgroundColor: "rgba(255,255,255,.05)",
                              borderRadius: 1,
                              border: "1px solid rgba(210,178,107,.18)",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity - 1,
                                )
                              }
                              sx={{
                                color: "rgba(210,178,107,.8)",
                                p: 0.5,
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "rgba(233,242,241,.9)",
                                minWidth: 30,
                                textAlign: "center",
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity + 1,
                                )
                              }
                              sx={{
                                color: "rgba(210,178,107,.8)",
                                p: 0.5,
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* Delete Button */}
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item._id)}
                            sx={{
                              color: "rgba(210,178,107,.6)",
                              "&:hover": {
                                color: "#ff6b6b",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>

                      {/* Price */}
                      <Box sx={{ textAlign: "right" }}>
                        {hasDiscount ? (
                          <>
                            <Typography
                              sx={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#d2b26b",
                              }}
                            >
                              {formatPrice(itemPrice)}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "rgba(233,242,241,.5)",
                                textDecoration: "line-through",
                              }}
                            >
                              {formatPrice(item.price)}
                            </Typography>
                          </>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color: "#d2b26b",
                            }}
                          >
                            {formatPrice(itemPrice)}
                          </Typography>
                        )}
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "rgba(233,242,241,.5)",
                            mt: 0.5,
                          }}
                        >
                          {t("cart.total")}: {formatPrice(itemTotal)}
                        </Typography>
                      </Box>
                    </Stack>
                  </ListItem>
                  <Divider sx={{ borderColor: "rgba(210,178,107,.08)" }} />
                </Box>
              );
            })}
          </List>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid rgba(210,178,107,0.12)",
              backgroundColor: "rgba(0,0,0,.3)",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "rgba(233,242,241,.8)",
                  }}
                >
                  {t("cart.subtotal") || "Sous-total"}:
                </Typography>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#d2b26b",
                  }}
                >
                  {formatPrice(cartTotal)}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={handleClearCart}
                  startIcon={<DeleteIcon />}
                  sx={{
                    flex: 1,
                    borderColor: "rgba(210,178,107,0.28)",
                    color: "#ff6b6b",
                    "&:hover": {
                      borderColor: "#ff6b6b",
                      backgroundColor: "rgba(255,107,107,0.08)",
                    },
                  }}
                >
                  {t("cart.clear") || "Vider le panier"}
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
