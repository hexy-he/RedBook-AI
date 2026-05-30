import { motion } from 'framer-motion'
import Highlighted from './Highlighted'

// AI 两段式结果卡：命中规则 / 改进方向（分段依次淡入）
export default function ResultCard({ result }) {
  return (
    <div className="max-w-[92%] rounded-2xl border border-line bg-white p-[18px]">
      {result.segments.map((seg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.55, duration: 0.35 }}
          className={i > 0 ? 'mt-[18px] border-t border-dashed border-line pt-[18px]' : ''}
        >
          <div className="mb-2 text-[16px] font-semibold text-ink">{seg.title}</div>
          <div className="whitespace-pre-line text-[15px] leading-[1.72] text-ink-regular">
            <Highlighted text={seg.body} marks={seg.marks} />
          </div>
          {seg.footnote && (
            <div className="mt-3 text-[13.5px] leading-[1.6] text-ink-sub">{seg.footnote}</div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
