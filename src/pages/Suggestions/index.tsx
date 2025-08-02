import { motion } from "framer-motion";
import { useLocalStorage } from "@uidotdev/usehooks";
import Timi from "@/components/Timi";
import { useNavigate } from "react-router-dom";
import Recommendations from "@/components/Recommendations";

function SuggestionsPage() {
  const [skipAnimations] = useLocalStorage("skipAnimations", false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div
        className="h-32 fixed left-0 top-10 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Timi className="h-full" />
      </motion.div>
      <motion.div
        initial={skipAnimations ? {} : { opacity: 0 }}
        animate={skipAnimations ? {} : { opacity: 1 }}
        exit={skipAnimations ? {} : { opacity: 0 }}
        transition={skipAnimations ? { duration: 0 } : { duration: 0.5 }}
        className="flex flex-col items-center space-y-4 text-center w-full max-w-4xl mx-auto p-4 min-h-screen pt-48"
      >
        <motion.h1
          initial={skipAnimations ? {} : { opacity: 0, y: -50 }}
          animate={skipAnimations ? {} : { opacity: 1, y: 0 }}
          exit={skipAnimations ? {} : { opacity: 0, y: -50 }}
          transition={skipAnimations ? {} : { duration: 1.5 }}
          className="text-3xl font-bold"
        >
          Suggestions for Timi
        </motion.h1>
        <Recommendations />
      </motion.div>
    </div>
  );
}

export default SuggestionsPage;
