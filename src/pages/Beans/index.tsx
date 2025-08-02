import { motion } from "framer-motion";
import { useLocalStorage } from "@uidotdev/usehooks";
import Timi from "@/components/Timi";

function Beans() {
  const [skipAnimations] = useLocalStorage("skipAnimations", false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Timi className="h-32 fixed left-0 top-10" />
      <motion.div
        initial={skipAnimations ? {} : { opacity: 0 }}
        animate={skipAnimations ? {} : { opacity: 1 }}
        exit={skipAnimations ? {} : { opacity: 0 }}
        transition={skipAnimations ? { duration: 0 } : { duration: 0.5 }}
        className="flex flex-col items-center space-y-4 text-center"
      >
        BEANS!!!!!
      </motion.div>
    </div>
  );
}

export default Beans;
