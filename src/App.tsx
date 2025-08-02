import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import AnimationsToggle from "./components/AnimationsToggle";
import Beans from "./pages/Beans";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[url(/background.jpg)] bg-cover">
      <div className="bg-linear-to-b from-gray-50/20 from-0% via-gray-50 via-15% to-gray-50 to-90%">
        <LayoutGroup>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Welcome />} />
              <Route path="/beans" element={<Beans />} />
            </Routes>
            <AnimationsToggle className="fixed bottom-4 right-4" />
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}

export default App;
