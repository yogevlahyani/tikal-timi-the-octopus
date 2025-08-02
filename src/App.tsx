import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import AnimationsToggle from "./components/AnimationsToggle";
import WelcomePage from "./pages/Welcome";
import BeansPage from "./pages/Beans";
import { Button } from "./components/ui/button";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[url(/background.jpg)] bg-cover">
      <div className="bg-linear-to-b from-gray-50/20 from-0% via-gray-50 via-15% to-gray-50 to-90%">
        <LayoutGroup>
          <AnimatePresence mode="wait">
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary
                  fallbackRender={({ error, resetErrorBoundary }) => (
                    <div>
                      There was an error!{" "}
                      <Button onClick={() => resetErrorBoundary()}>
                        Try again
                      </Button>
                      <pre style={{ whiteSpace: "normal" }}>
                        {error.message}
                      </pre>
                    </div>
                  )}
                  onReset={reset}
                >
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/beans" element={<BeansPage />} />
                  </Routes>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
            <AnimationsToggle className="fixed bottom-4 right-4" />
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}

export default App;
