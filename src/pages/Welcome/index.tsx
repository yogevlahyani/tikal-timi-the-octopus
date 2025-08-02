import { motion } from "framer-motion";
import TypingTextAnimation from "../../components/TypingTextAnimation";
import { Button } from "@/components/ui/button";
import { Bean, Glasses, HelpingHand } from "lucide-react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import Timi from "@/components/Timi";

function WelcomePage() {
  const [skipAnimations] = useLocalStorage("skipAnimations", false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={skipAnimations ? {} : { opacity: 0 }}
        animate={skipAnimations ? {} : { opacity: 1 }}
        exit={skipAnimations ? {} : { opacity: 0 }}
        transition={skipAnimations ? { duration: 0 } : { duration: 0.5 }}
        className="flex flex-col items-center space-y-4 text-center"
      >
        <TypingTextAnimation
          text="Hey there!"
          delay={skipAnimations ? 0 : 1}
          className="text-2xl font-bold"
          skipAnimations={skipAnimations}
        />
        <TypingTextAnimation
          text="My name is Timi and I am starving for orange jelly beans 🫘!"
          delay={skipAnimations ? 0 : 2}
          className="text-lg"
          skipAnimations={skipAnimations}
        />
      </motion.div>
      <Timi className="h-64" />
      <motion.div
        className="flex flex-row gap-4"
        initial={skipAnimations ? {} : { opacity: 0, y: -50 }}
        animate={skipAnimations ? {} : { opacity: 1, y: 0 }}
        exit={
          skipAnimations
            ? {}
            : { opacity: 0, y: -50, transition: { duration: 0.5 } }
        }
        transition={
          skipAnimations ? { duration: 0 } : { duration: 0.5, delay: 5 }
        }
      >
        <Button variant="default" onClick={() => navigate("/beans")}>
          <Bean /> Show me the beans!
        </Button>
        <Button variant="outline" onClick={() => navigate("/discovery")}>
          <Glasses /> Beans Discovery
        </Button>
        <Button variant="default" onClick={() => navigate("/suggestions")}>
          <HelpingHand /> Help Feed Timi
        </Button>
      </motion.div>
    </div>
  );
}

export default WelcomePage;
