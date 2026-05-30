// 把 text 中命中 marks 的片段渲染为浅色高亮
export default function Highlighted({ text, marks = [] }) {
  if (!marks.length) return <>{renderLines(text)}</>

  // 按 marks 切分（一次处理，marks 不重叠）
  const escaped = marks.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${escaped.join('|')})`, 'g')
  const parts = text.split(re)

  return (
    <>
      {parts.map((part, i) =>
        marks.includes(part) ? (
          <mark key={i} className="rounded bg-hl px-1 py-[1px] text-[#7A5A00]">
            {part}
          </mark>
        ) : (
          <span key={i}>{renderLines(part)}</span>
        ),
      )}
    </>
  )
}

// 保留换行
function renderLines(str) {
  const lines = str.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ))
}
