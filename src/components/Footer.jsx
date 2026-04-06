import { Box, Container, Typography, Grid, Link } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSection } from "../providers/SectionProvider";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import TikTokIcon from "@mui/icons-material/MusicNote";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();
  const { section } = useSection();

  const socialLinks = section?.socialLinks || {};

  const socialItems = [
    {
      key: "facebook",
      icon: <FacebookIcon sx={{ fontSize: 18 }} />,
      label: socialLinks.facebook?.label || "Facebook",
      url: socialLinks.facebook?.url,
    },
    {
      key: "instagram",
      icon: <InstagramIcon sx={{ fontSize: 18 }} />,
      label: socialLinks.instagram?.label || "Instagram",
      url: socialLinks.instagram?.url,
    },
    {
      key: "linkedin",
      icon: <LinkedInIcon sx={{ fontSize: 18 }} />,
      label: socialLinks.linkedin?.label || "LinkedIn",
      url: socialLinks.linkedin?.url,
    },
    {
      key: "twitter",
      icon: <TwitterIcon sx={{ fontSize: 18 }} />,
      label: socialLinks.twitter?.label || "Twitter",
      url: socialLinks.twitter?.url,
    },
    {
      key: "tiktok",
      icon: <TikTokIcon sx={{ fontSize: 18 }} />,
      label: socialLinks.tiktok?.label || "TikTok",
      url: socialLinks.tiktok?.url,
    },
    {
      key: "email",
      icon: <EmailIcon sx={{ fontSize: 18 }} />,
      label: socialLinks.email?.label || "Email",
      url: socialLinks.email?.url,
    },
    {
      key: "phone",
      icon: <PhoneIcon sx={{ fontSize: 18 }} />,
      label: socialLinks.phone?.label || "Phone",
      url: socialLinks.phone?.url,
    },
  ];

  const activeSocialLinks = socialItems.filter(
    (item) => item.url && item.url !== "",
  );

  // Helper to get the correct href for email and phone
  const getHref = (item) => {
    if (item.key === "email") return `mailto:${item.url}`;
    if (item.key === "phone") return `tel:${item.url}`;
    return item.url;
  };

  return (
    <Box
      component="footer"
      sx={{
        py: "48px",
        color: "rgba(233,242,241,.5)",
        borderTop: "1px solid rgba(210,178,107,.1)",
        background:
          "linear-gradient(180deg, rgba(8,22,24,.2), rgba(8,22,24,.5))",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          {/* Copyright */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                fontSize: 13,
                color: "rgba(233,242,241,.45)",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              © {year} MUSHEAS — {t("footer.slogan")}
            </Typography>
          </Grid>

          {/* Social Links */}
          {activeSocialLinks.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-end" },
                  flexWrap: "wrap",
                  gap: 2.5,
                }}
              >
                {activeSocialLinks.map((item) => (
                  <Link
                    key={item.key}
                    href={getHref(item)}
                    target={item.key === "email" || item.key === "phone" ? "_self" : "_blank"}
                    rel={item.key !== "email" && item.key !== "phone" ? "noopener noreferrer" : undefined}
                    underline="none"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      color: "rgba(233,242,241,.55)",
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#d2b26b",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}