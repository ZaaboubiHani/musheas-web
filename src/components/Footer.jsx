import { Box, Container, Stack, Typography, Button, IconButton } from "@mui/material";
import { GoldButton } from "./Header";
import { useTranslation } from "react-i18next";
import { useSection } from "../providers/SectionProvider";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import TikTokIcon from "@mui/icons-material/MusicNote"; // or use a custom TikTok icon
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();
  const { section } = useSection();

  const socialLinks = section?.socialLinks || {};

  // Define icon mapping and URLs
  const socialItems = [
    { key: "facebook", icon: <FacebookIcon />, url: socialLinks.facebook, baseUrl: "https://facebook.com/" },
    { key: "instagram", icon: <InstagramIcon />, url: socialLinks.instagram, baseUrl: "https://instagram.com/" },
    { key: "linkedin", icon: <LinkedInIcon />, url: socialLinks.linkedin, baseUrl: "https://linkedin.com/in/" },
    { key: "twitter", icon: <TwitterIcon />, url: socialLinks.twitter, baseUrl: "https://twitter.com/" },
    { key: "tiktok", icon: <TikTokIcon />, url: socialLinks.tiktok, baseUrl: "https://tiktok.com/@" },
    { key: "email", icon: <EmailIcon />, url: socialLinks.email, baseUrl: "mailto:" },
    { key: "phone", icon: <PhoneIcon />, url: socialLinks.phone, baseUrl: "tel:" },
  ];

  // Filter out items with empty URLs
  const activeSocialLinks = socialItems.filter(item => item.url && item.url !== "");

  return (
    <Box
      component="footer"
      sx={{
        py: "22px",
        pb: "36px",
        color: "rgba(233,242,241,.62)",
        borderTop: "1px solid rgba(210,178,107,.12)",
        background:
          "linear-gradient(180deg, rgba(8,22,24,.25), rgba(8,22,24,.55))",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left */}
          <Typography sx={{ fontSize: 14 }}>
            © {year} MUSHEAS — {t("footer.slogan")}
          </Typography>

          {/* Social Links - Right side */}
          {activeSocialLinks.length > 0 && (
            <Stack direction="row" spacing={1}>
              {activeSocialLinks.map((item) => (
                <IconButton
                  key={item.key}
                  component="a"
                  href={item.key === "email" || item.key === "phone" 
                    ? `${item.baseUrl}${item.url}` 
                    : `${item.baseUrl}${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "rgba(233,242,241,.62)",
                    "&:hover": {
                      color: "#d2b26b",
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}