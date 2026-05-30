import { useState } from 'react'
import { AudioLines, ArrowUp } from 'lucide-react'

// 底部输入框：左侧语音图标 · 占位「问点什么…」· 右侧发送按钮
export default function InputBar({ onSend, disabled, placeholder = '问点什么…' }) {
  const [value, setValue] = useState('')
  const hasText = value.trim().length > 0

  const submit = () => {
    if (!hasText || disabled) return
    onSend(value.trim())
    setValue('')
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-line bg-fill-input px-3.5 py-2.5">
      <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full border-[1.5px] border-[#C8C8CC] text-[#9A9AA0]">
        <AudioLines size={14} strokeWidth={2} />
      </span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={placeholder}
        enterKeyHint="send"
        className="min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-ph"
      />
      <button
        onClick={submit}
        disabled={!hasText || disabled}
        aria-label="发送"
        className={[
          'flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full transition-colors',
          hasText && !disabled ? 'bg-xhs-red text-white' : 'bg-[#E2E2E6] text-white',
        ].join(' ')}
      >
        <ArrowUp size={18} strokeWidth={2.6} />
      </button>
    </div>
  )
}
