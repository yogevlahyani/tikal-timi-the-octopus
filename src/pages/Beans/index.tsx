import { Suspense } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@uidotdev/usehooks";
import Timi from "@/components/Timi";
import { Bean } from "lucide-react";
import Beans from "@/components/Beans";

function BeansPage() {
  const [skipAnimations] = useLocalStorage("skipAnimations", false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Timi className="h-32 fixed left-0 top-10" />
      <motion.div
        initial={skipAnimations ? {} : { opacity: 0 }}
        animate={skipAnimations ? {} : { opacity: 1 }}
        exit={skipAnimations ? {} : { opacity: 0 }}
        transition={skipAnimations ? { duration: 0 } : { duration: 0.5 }}
        className="flex flex-col items-center space-y-4 text-center w-full max-w-4xl mx-auto p-4 min-h-screen pt-48"
      >
        <Suspense
          fallback={
            <Bean className="h-8 w-32 text-orange-500 animate-bounce" />
          }
        >
          <Beans />
        </Suspense>
      </motion.div>
    </div>
  );
}

export default BeansPage;
