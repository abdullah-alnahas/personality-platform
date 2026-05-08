import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HubIcon from "@mui/icons-material/Hub";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LinkIconOriginal from "@mui/icons-material/Link";
import SvgIcon from "@mui/material/SvgIcon";

const TikTokIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.1a8.16 8.16 0 0 0 5 1.6V6.45a4.85 4.85 0 0 1-2.07.24z" />
    </SvgIcon>
);

const SocialIcon = ({ platform }) => {
    switch (platform?.toLowerCase()) {
        case "facebook":
            return <FacebookIcon />;
        case "x":
        case "twitter":
            return <TwitterIcon />;
        case "youtube":
            return <YouTubeIcon />;
        case "instagram":
            return <InstagramIcon />;
        case "telegram":
            return <TelegramIcon />;
        case "linkedin":
            return <LinkedInIcon />;
        case "whatsapp":
            return <WhatsAppIcon />;
        case "tiktok":
            return <TikTokIcon />;
        case "linktree":
            return <HubIcon />;
        case "phone":
            return <PhoneIcon />;
        case "email":
        case "mail":
            return <EmailIcon />;
        default:
            return <LinkIconOriginal />;
    }
};

export default SocialIcon;
