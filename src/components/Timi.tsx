import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";

interface Props {
  className?: string;
}

export default function Timi({ className }: Props) {
  return (
    <motion.div
      layoutId="timi"
      initial={false}
      transition={{ duration: 1 }}
      className={className}
    >
      <DotLottieReact src="/timi.lottie" loop autoplay />
    </motion.div>
  );
}
