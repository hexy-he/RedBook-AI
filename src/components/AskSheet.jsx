import { useEffect, useRef, useState } from 'react'
import { Sheet } from 'react-modal-sheet'
import { motion } from 'framer-motion'
import AskLogo from './AskLogo'
import IntentChips from './IntentChips'
import ResultCard from './ResultCard'
import InputBar from './InputBar'
import ThinkingDots from './ThinkingDots'
import Typewriter from './Typewriter'
import { runComplianceCheck, sendComplianceQuestion } from '@/lib/complianceApi'

const assistantActions = [
  {
    id: 'compliance',
    label: '检查是否符合社区规范，发布后能否过审',
  },
  {
    id: 'polish',
    label: '润色语言，获得更多曝光',
    disabled: true,
    badge: '待开放',
  },
]

// 页面 B：「问一问」合规预检半屏弹层
export default function AskSheet({ isOpen, onClose, title, body, mountPoint }) {
  // phase: 'intent'（待对齐意图）| 'thinking'（AI 处理中）| 'answered'（已出建议）
  const [phase, setPhase] = useState('intent')
  const [selectedId, setSelectedId] = useState(null)
  const [intentData, setIntentData] = useState({
    greeting: '发布前，我还能帮你做这些事',
    options: assistantActions,
  })
  const [activeIntent, setActiveIntent] = useState('')
  const [messages, setMessages] = useState([]) // {role, kind, ...}
  const scrollRef = useRef(null)

  // 打开时重置为初始意图对齐轮
  useEffect(() => {
    if (isOpen) {
      setPhase('intent')
      setSelectedId(null)
      setActiveIntent('')
      setIntentData({
        greeting: '发布前，我还能帮你做这些事',
        options: assistantActions,
      })
      setMessages([{ role: 'ai', kind: 'opening' }])
    }
  }, [isOpen, title, body])

  // 新消息自动滚到底部
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // 确认意图 → 检索规则并调用 LLM 生成结果
  const confirmIntent = async (label, id = null) => {
    if (phase !== 'intent') return handleFollowup(label)
    if (intentData.options.find((option) => option.id === id)?.disabled) return
    setSelectedId(id)
    setActiveIntent(label)
    setPhase('thinking')
    setMessages((m) => [
      ...m,
      { role: 'user', kind: 'text', text: label },
      { role: 'ai', kind: 'thinking' },
    ])
    try {
      const result = await runComplianceCheck({ title, body, intent: label })
      setMessages((m) => [
        ...m.filter((x) => x.kind !== 'thinking'),
        { role: 'ai', kind: 'result', result },
      ])
      setPhase('answered')
    } catch (error) {
      setMessages((m) => [
        ...m.filter((x) => x.kind !== 'thinking'),
        {
          role: 'ai',
          kind: 'reply',
          text: `预检失败：${error.message}。请确认本地服务正常，或稍后重试。`,
        },
      ])
      setPhase('answered')
    }
  }

  // 多轮追问 → 继续结合草稿、意图和规则知识库回答
  const handleFollowup = async (text) => {
    setPhase('thinking')
    setMessages((m) => [
      ...m,
      { role: 'user', kind: 'text', text },
      { role: 'ai', kind: 'thinking' },
    ])
    try {
      const reply = await sendComplianceQuestion({
        title,
        body,
        intent: activeIntent,
        message: text,
      })
      setMessages((m) => [
        ...m.filter((x) => x.kind !== 'thinking'),
        { role: 'ai', kind: 'reply', text: reply.text },
      ])
      setPhase('answered')
    } catch (error) {
      setMessages((m) => [
        ...m.filter((x) => x.kind !== 'thinking'),
        { role: 'ai', kind: 'reply', text: `追问失败：${error.message}` },
      ])
      setPhase('answered')
    }
  }

  const onSend = (text) => {
    if (phase === 'intent') confirmIntent(text)
    else if (phase === 'answered') handleFollowup(text)
  }

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      mountPoint={mountPoint ?? undefined}
      snapPoints={[0.66]}
      initialSnap={0}
      disableScrollLocking={false}
    >
      <Sheet.Container>
        <Sheet.Header />
        <div className="pb-1 text-center text-[17px] font-semibold text-ink">
          <span className="inline-flex items-center gap-1.5">
            <AskLogo size={20} />
            问一问
          </span>
        </div>

        <Sheet.Content disableDrag>
          <div className="flex h-full flex-col">
            {/* 对话内容区：min-h-0 保证在 flex 列里能正确滚动，而不是把底部输入框撑出可视区 */}
            <div ref={scrollRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pt-3">
              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} opening={intentData} />
              ))}

              {/* 意图选项：仅在意图对齐轮显示 */}
              {phase === 'intent' && messages.some((m) => m.kind === 'opening') && (
                <div className="mb-4 mt-1">
                  <IntentChips
                    options={intentData.options}
                    selectedId={selectedId}
                    onSelect={(opt) => confirmIntent(opt.label, opt.id)}
                    disabled={phase !== 'intent' || intentData.options.length === 0}
                  />
                </div>
              )}
            </div>

            {/* 底部输入框 */}
            <div
              className="border-t border-line bg-white px-4 pt-3"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
            >
              <InputBar
                onSend={onSend}
                disabled={phase === 'thinking'}
                placeholder={phase === 'intent' ? '也可以直接说说你的想法…' : '继续追问…'}
              />
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  )
}

// 单条消息渲染
function Bubble({ msg, opening }) {
  if (msg.role === 'user') {
    return (
      <div className="mb-4 flex justify-end">
        <div className="max-w-[80%] rounded-[16px_4px_16px_16px] bg-[#EAF3FF] px-4 py-2.5 text-[15.5px] leading-[1.6] text-ink-regular">
          {msg.text}
        </div>
      </div>
    )
  }

  // AI 侧
  if (msg.kind === 'opening') {
    return (
      <div className="mb-5 mt-3">
        <div className="text-[26px] font-bold leading-[1.35] text-ink">{opening.greeting}</div>
        {opening.sub && <div className="mt-2.5 text-[16px] text-ink-sub">{opening.sub}</div>}
      </div>
    )
  }
  if (msg.kind === 'thinking') {
    return <div className="mb-4">{<ThinkingDots />}</div>
  }
  if (msg.kind === 'result') {
    return (
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ResultCard result={msg.result} />
      </motion.div>
    )
  }
  if (msg.kind === 'reply') {
    return (
      <div className="mb-4">
        <div className="max-w-[88%] rounded-[4px_16px_16px_16px] bg-fill-chip px-[18px] py-4 text-[15.5px] leading-[1.7] text-ink-regular">
          <Typewriter text={msg.text} />
        </div>
      </div>
    )
  }
  return null
}
