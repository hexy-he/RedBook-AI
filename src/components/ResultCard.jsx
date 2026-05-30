import { motion } from 'framer-motion'
import Highlighted from './Highlighted'

// AI 两段式结果卡：命中规则 / 改进方向（分段依次淡入）
export default function ResultCard({ result }) {
  if (result.touched_rules || result.suggestions) {
    return <StructuredResult result={result} />
  }

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
      <Disclaimer />
    </div>
  )
}

function StructuredResult({ result }) {
  const touchedRules = Array.isArray(result.touched_rules) ? result.touched_rules : []
  const suggestions = Array.isArray(result.suggestions) ? result.suggestions : []

  return (
    <div className="max-w-[92%] rounded-2xl border border-line bg-white p-[18px]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-3 text-[16px] font-semibold text-ink">可能触及的规则</div>
        {touchedRules.length ? (
          <div className="space-y-4">
            {touchedRules.map((rule, index) => (
              <div key={`${rule.rule_id}-${index}`}>
                <div className="mb-2">
                  <div className="text-[15.5px] font-semibold leading-[1.6] text-ink">
                    {touchedRules.length > 1 ? `${index + 1}. ` : ''}{rule.rule_name}
                  </div>
                  {formatRuleNumber(rule.rule_id) && (
                    <div className="mt-0.5 text-[12.5px] font-normal leading-[1.5] text-ink-sub">
                      根据《小红书社区规范》第 {formatRuleNumber(rule.rule_id)} 条
                    </div>
                  )}
                </div>
                <div className="text-[15px] leading-[1.72] text-ink-regular">
                  <Highlighted text={rule.reason} marks={rule.marks} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[15px] leading-[1.72] text-ink-regular">
            暂未检索到高度相关的社区规范风险。
          </div>
        )}
      </motion.div>

      <motion.div
        className="mt-[18px] border-t border-dashed border-line pt-[18px]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.35 }}
      >
        <div className="mb-3 text-[16px] font-semibold text-ink">改进方向建议</div>
        <div className="space-y-2 text-[15px] leading-[1.72] text-ink-regular">
          {suggestions.length ? (
            suggestions.map((suggestion, index) => (
              <div key={index}>{index + 1}. {suggestion}</div>
            ))
          ) : (
            <div>1. 补充更具体的事实依据和使用场景，避免空泛或情绪化表达。</div>
          )}
        </div>
      </motion.div>

      <Disclaimer />
    </div>
  )
}

function Disclaimer() {
  return (
    <div className="mt-[18px] text-[12.5px] leading-[1.6] text-ink-sub">
      以上结果仅供发布前参考，不代表最终审核结论；能否通过审核，仍以实际发布后的结果为准。
    </div>
  )
}

function formatRuleId(ruleId) {
  return String(ruleId || '').replace('_', '-')
}

// 从 rule_id（如 xhs_070 / xhs-070）中取出编号数字，用于灰色小字展示
function formatRuleNumber(ruleId) {
  const match = String(ruleId || '').match(/(\d+)/)
  return match ? match[1] : ''
}
