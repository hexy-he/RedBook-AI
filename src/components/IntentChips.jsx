import { ArrowRight } from 'lucide-react'

// 意图选项按钮组（可点选）—— 各选项等宽（占满同宽）、等高
export default function IntentChips({ options, selectedId, onSelect, disabled }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const active = opt.id === selectedId
        const optionDisabled = disabled || opt.disabled
        return (
          <button
            key={opt.id}
            disabled={optionDisabled}
            onClick={() => onSelect(opt)}
            className={[
              'flex w-full items-center gap-3 rounded-[14px] border-[1.5px] px-5 py-[14px] text-[16px] transition-colors',
              active
                ? 'border-ask-blue bg-[#EAF3FF] text-ask-blue'
                : 'border-transparent bg-fill-chip text-ink-regular active:bg-[#EDEDEF]',
              opt.disabled ? 'bg-[#F2F2F3] text-ink-ph active:bg-[#F2F2F3]' : '',
              disabled && !active ? 'opacity-50' : '',
            ].join(' ')}
          >
            <span className="min-w-0 flex-1 text-left">{opt.label}</span>
            {opt.badge ? (
              <span className="flex-none rounded-full bg-[#E8E8EA] px-2 py-0.5 text-[11px] font-medium text-ink-sub">
                {opt.badge}
              </span>
            ) : (
              <ArrowRight size={16} className={`flex-none ${active ? 'text-ask-blue' : 'text-ink-sub'}`} />
            )}
          </button>
        )
      })}
    </div>
  )
}
