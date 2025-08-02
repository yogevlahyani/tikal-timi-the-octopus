import { AnimatePresence, LayoutGroup } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import AnimationsToggle from "./components/AnimationsToggle";
import WelcomePage from "./pages/Welcome";
import BeansPage from "./pages/Beans";
import { Button } from "./components/ui/button";
import DiscoveryPage from "./pages/Discovery";

const router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomePage,
  },
  {
    path: "/beans",
    Component: BeansPage,
  },
  {
    path: "/discovery",
    Component: DiscoveryPage, // Assuming DiscoveryPage is similar to BeansPage
  },
]);

function App() {
  // const location = useLocation();

  return (
    <div className="min-h-screen bg-[url(/background.jpg)] bg-cover">
      <div className="bg-gradient-to-b from-background/20 from-0% via-background/80 via-15% to-background to-90%">
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
                  <RouterProvider router={router} />
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
