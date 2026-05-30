import { Send } from "lucide-react";

export default function InputBar({ value, onChange, onSend }) {
  const hasText = value.trim().length > 0;

  return (
    <div
      className={`flex items-center gap-3 bg-fill-input border border-line rounded-full px-4 py-3 ${
        hasText ? "has-text" : ""
      }`}
    >
      <button className="w-6 h-6 rounded-full border-2 border-[#C8C8CC] flex items-center justify-center text-[#9A9AA0] flex-shrink-0">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="6" y1="10" x2="6" y2="14" />
          <line x1="10" y1="6" x2="10" y2="18" />
          <line x1="14" y1="9" x2="14" y2="15" />
          <line x1="18" y1="11" x2="18" y2="13" />
        </svg>
      </button>

      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === "Enter" && hasText && onSend()}
        placeholder="问点什么…"
        className="flex-1 bg-transparent outline-none text-[16px] text-text-primary placeholder:text-text-placeholder"
      />

      <button
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          hasText ? "bg-xhs-red text-white" : "bg-[#E2E2E6] text-white"
        }`}
        onClick={onSend}
        disabled={!hasText}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="6 11 12 5 18 11" />
        </svg>
      </button>
    </div>
  );
}
