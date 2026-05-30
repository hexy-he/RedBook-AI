import { useState } from 'react'
import EditorPage from './components/EditorPage'
import AskSheet from './components/AskSheet'
import { draft } from './data/mockData'

export default function App() {
  const [title, setTitle] = useState(draft.title)
  const [body, setBody] = useState(draft.body)
  const [sheetOpen, setSheetOpen] = useState(false)
  // 手机容器元素：作为底部抽屉的挂载点，把抽屉关在手机框内而非整个视口
  const [phoneEl, setPhoneEl] = useState(null)

  return (
    <div className="flex min-h-full items-center justify-center sm:py-6">
      {/* 移动端 H5：手机视口容器（桌面预览时居中显示为一台手机） */}
      {/* transform:translateZ(0) 让本容器成为 fixed 定位的包含块，使内部抽屉相对手机框定位 */}
      <div
        id="phone"
        ref={setPhoneEl}
        className="relative h-[100dvh] w-full max-w-[440px] overflow-hidden bg-white [transform:translateZ(0)] sm:h-[920px] sm:rounded-[44px] sm:border-[10px] sm:border-black sm:shadow-2xl"
      >
        <EditorPage
          title={title}
          body={body}
          onChangeTitle={setTitle}
          onChangeBody={setBody}
          onAsk={() => setSheetOpen(true)}
        />

        <AskSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title={title}
          body={body}
          mountPoint={phoneEl}
        />
      </div>
    </div>
  )
}
