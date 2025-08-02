import { motion } from "framer-motion";

function Welcome() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Welcome to the Home Page!</h1>
    </motion.div>
  );
}

export default Welcome;