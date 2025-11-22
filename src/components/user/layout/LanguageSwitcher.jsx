import { Button, ButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ButtonGroup size="small" variant="outlined">
      <Button
        onClick={() => changeLanguage("vi")}
        color={i18n.language === "vi" ? "primary" : "inherit"}
      >
        VI
      </Button>
      <Button
        onClick={() => changeLanguage("en")}
        color={i18n.language === "en" ? "primary" : "inherit"}
      >
        EN
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;