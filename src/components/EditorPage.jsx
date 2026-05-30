import { useRef, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import StatusBar from './StatusBar'
import Toolbar from './Toolbar'
import IOSKeyboard from './IOSKeyboard'

// 页面 A：「写长文」编辑界面
export default function EditorPage({ title, body, onChangeTitle, onChangeBody, onAsk }) {
  const [activeField, setActiveField] = useState('body')
  const titleRef = useRef(null)
  const bodyRef = useRef(null)

  const updateActiveField = (field) => {
    setActiveField(field)
  }

  const applyEdit = (transform) => {
    const ref = activeField === 'title' ? titleRef : bodyRef
    const value = activeField === 'title' ? title : body
    const setter = activeField === 'title' ? onChangeTitle : onChangeBody
    const el = ref.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const next = transform(value, start, end)
    setter(next.value)
    requestAnimationFrame(() => {
      ref.current?.focus()
      ref.current?.setSelectionRange(next.cursor, next.cursor)
    })
  }

  const insertText = (text) => {
    applyEdit((value, start, end) => ({
      value: `${value.slice(0, start)}${text}${value.slice(end)}`,
      cursor: start + text.length,
    }))
  }

  const deleteText = () => {
    applyEdit((value, start, end) => {
      if (start !== end) {
        return { value: `${value.slice(0, start)}${value.slice(end)}`, cursor: start }
      }
      if (start === 0) return { value, cursor: 0 }
      return { value: `${value.slice(0, start - 1)}${value.slice(end)}`, cursor: start - 1 }
    })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <StatusBar />

      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-4 py-2">
        <ChevronLeft size={28} className="text-ink" strokeWidth={2.2} />
        <span className="text-[17px] font-semibold text-ink">写长文</span>
        <button className="rounded-full bg-xhs-red px-4 py-1.5 text-[15px] font-medium text-white active:bg-xhs-red-press">
          一键排版
        </button>
      </div>

      {/* 标题 + 正文（可编辑） */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pt-2">
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          onFocus={() => updateActiveField('title')}
          rows={1}
          placeholder="填写标题会有更多赞哦～"
          className="w-full resize-none border-none bg-transparent text-[22px] font-semibold leading-snug text-ink outline-none placeholder:text-ink-ph"
        />
        <textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => onChangeBody(e.target.value)}
          onFocus={() => updateActiveField('body')}
          placeholder="输入正文"
          className="mt-2 h-[360px] w-full resize-none border-none bg-transparent text-[16px] leading-[1.85] text-ink-regular outline-none placeholder:text-ink-ph"
        />
      </div>

      {/* 底部工具栏 */}
      <Toolbar onAsk={onAsk} />
      <IOSKeyboard
        onInput={insertText}
        onDelete={deleteText}
        onSpace={() => insertText(' ')}
        onEnter={() => insertText('\n')}
      />
    </div>
  )
}
