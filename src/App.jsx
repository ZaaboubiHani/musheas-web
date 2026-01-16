
import { useTranslation } from "react-i18next";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { SiteSettingsProvider } from "./providers/SiteSettingsProvider";
import ThemedApp from "./ThemedApp";

function App() {
   const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
  });

  const cacheLtr = createCache({
    key: "muiltr",
    stylisPlugins: [],
  });

  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  document.documentElement.dir = isRTL ? "rtl" : "ltr";

  return (
    <CacheProvider value={isRTL ? cacheRtl : cacheLtr}>
      <SiteSettingsProvider>
        <ThemedApp isRTL={isRTL} />
      </SiteSettingsProvider>
    </CacheProvider>
  );
}

export default App;

