import { ArrowRight } from "lucide-react";

export default function IntentOptions({ options, selectedIndex, onSelect }) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`inline-flex items-center gap-4 bg-fill-chip text-text-regular text-[16px] px-5 py-3.5 rounded-xl border-2 transition-all ${
            selectedIndex === index
              ? "border-ask-blue bg-blue-50 text-ask-blue"
              : "border-transparent hover:bg-[#EDEDEF]"
          }`}
        >
          <span className="flex-1 text-left">{option}</span>
          <span
            className={`${
              selectedIndex === index ? "text-ask-blue" : "text-text-secondary"
            }`}
          >
            <ArrowRight size={18} />
          </span>
        </button>
      ))}
    </div>
  );
}
