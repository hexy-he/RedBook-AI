import { motion } from 'framer-motion'

// AI 思考中的三点动画气泡
export default function ThinkingDots() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-[4px_16px_16px_16px] bg-fill-chip px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-ink-ph"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  )
}
