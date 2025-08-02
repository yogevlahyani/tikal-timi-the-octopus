import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import AnimationsToggle from "./components/AnimationsToggle";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[url(/background.jpg)] bg-cover">
      <div className="bg-linear-to-b from-gray-50/20 from-0% via-gray-50 via-15% to-gray-50 to-90%">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Welcome />} />
          </Routes>
          <AnimationsToggle className="fixed bottom-4 right-4" />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
