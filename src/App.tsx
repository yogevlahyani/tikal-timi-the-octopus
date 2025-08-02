import { AnimatePresence } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import AnimationsToggle from "./components/AnimationsToggle";
import WelcomePage from "./pages/Welcome";
import BeansPage from "./pages/Beans";
import { Button } from "./components/ui/button";
import DiscoveryPage from "./pages/Discovery";
import SuggestionsPage from "./pages/Suggestions";

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
    Component: DiscoveryPage,
  },
  {
    path: "/suggestions",
    Component: SuggestionsPage,
  }
]);

function App() {
  return (
    <div className="min-h-screen bg-[url(/background.jpg)] bg-cover">
      <div className="bg-gradient-to-b from-background/20 from-0% via-background/80 via-15% to-background to-90%">
        <AnimatePresence mode="sync">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                fallbackRender={({ error, resetErrorBoundary }) => (
                  <div>
                    There was an error!{" "}
                    <Button onClick={() => resetErrorBoundary()}>
                      Try again
                    </Button>
                    <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
                  </div>
                )}
                onReset={reset}
              >
                <RouterProvider router={router} />
                <AnimationsToggle className="fixed bottom-4 right-4" />
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
