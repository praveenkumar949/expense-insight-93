import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import App from "./App.tsx";
import LoadingScreen from "./components/LoadingScreen";
import "./index.css";

const Root = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <Root />
  </ThemeProvider>
);
