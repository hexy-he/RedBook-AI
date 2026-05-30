// iOS 状态栏（时间 + 信号/wifi/电池）
export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 select-none">
      <span className="text-[15px] font-semibold text-ink tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5 text-ink">
        {/* 信号 */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.2c2.7 0 5.2 1 7 2.8l-1.4 1.5A7.9 7.9 0 0 0 8.5 4.3 7.9 7.9 0 0 0 2.9 6.5L1.5 5C3.3 3.2 5.8 2.2 8.5 2.2zm0 3.3c1.7 0 3.3.7 4.5 1.8l-1.5 1.5A4.2 4.2 0 0 0 8.5 8.6c-1.1 0-2.2.4-3 1.2L4 8.3a6.4 6.4 0 0 1 4.5-1.8zm0 3.4c.8 0 1.6.3 2.1.9L8.5 12 6.4 9.8c.5-.6 1.3-.9 2.1-.9z" />
        </svg>
        {/* 电池 */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <rect x="24" y="4" width="1.5" height="5" rx="0.75" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}
