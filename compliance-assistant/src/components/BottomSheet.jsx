import { motion, AnimatePresence } from "framer-motion";

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoint = 0.66,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      ></div>

      <AnimatePresence>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] max-w-lg mx-auto"
          style={{ height: `${snapPoint * 100}vh` }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
