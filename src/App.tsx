import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/pages/sign-in";
import Main from "./components/pages/main";
import { useConvexAuth } from "convex/react";
import AppLoading from "./components/AppLoading";
import { t } from "./lib/i18n";

export default function App() {
  const { isLoading } = useConvexAuth();

  if (isLoading) {
    return <AppLoading fullScreen message={t("common.loading")} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/*" element={<Main />} />
      </Routes>
    </Router>
  );
}
