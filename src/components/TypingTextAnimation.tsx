import { motion } from "framer-motion";

interface Props {
  text: string;
  delay?: number;
  className?: string;
  skipAnimations?: boolean;
}

export default function TypingTextAnimation({
  text,
  delay = 0,
  className,
  skipAnimations = false,
}: Props) {
  return (
    <motion.span className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={skipAnimations ? {} : { opacity: 0, y: 100 }}
          animate={skipAnimations ? {} : { opacity: 1, y: 0 }}
          exit={
            skipAnimations
              ? {}
              : { opacity: 0, y: -100, transition: { delay: 0 } }
          }
          transition={
            skipAnimations
              ? { duration: 0 }
              : { duration: 0.5, delay: index * 0.05 + delay }
          }
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
