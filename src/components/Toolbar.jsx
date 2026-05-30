import { List, Highlighter, Smile, Image as ImageIcon } from 'lucide-react'
import AskLogo from './AskLogo'

// 底部排版工具栏：Aa · 列表 · 标记笔 · 表情 · 图片 · 问一问 · 完成
export default function Toolbar({ onAsk }) {
  const iconCls = 'text-[#3A3A3A]'
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3">
      <div className="flex items-center gap-[22px]">
        <button className="text-[19px] font-semibold text-[#3A3A3A] leading-none">Aa</button>
        <button aria-label="列表">
          <List size={24} className={iconCls} strokeWidth={2} />
        </button>
        <button aria-label="标记笔">
          <Highlighter size={24} className={iconCls} strokeWidth={2} />
        </button>
        <button aria-label="表情">
          <Smile size={24} className={iconCls} strokeWidth={2} />
        </button>
        <button aria-label="图片">
          <ImageIcon size={24} className={iconCls} strokeWidth={2} />
        </button>
        {/* 新增：问一问入口（图片与完成之间） */}
        <button aria-label="问一问" onClick={onAsk} className="active:opacity-60 transition-opacity">
          <AskLogo size={26} />
        </button>
      </div>
      <button className="text-[16px] font-medium text-ink">完成</button>
    </div>
  )
}
