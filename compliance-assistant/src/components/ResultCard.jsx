import { Target, Lightbulb } from "lucide-react";

export default function ResultCard({ rule, direction }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-5 max-w-[92%]">
      <div className="border-b border-dashed border-line pb-4 mb-4">
        <div className="flex items-center gap-2 text-[16px] font-semibold text-text-primary mb-2">
          <Target className="w-5 h-5 text-xhs-red" />
          <span>命中哪条规则</span>
        </div>
        <div className="text-[15px] text-text-regular leading-[1.72]">
          {rule}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-[16px] font-semibold text-text-primary mb-2">
          <Lightbulb className="w-5 h-5 text-xhs-red" />
          <span>改进方向</span>
        </div>
        <div className="text-[15px] text-text-regular leading-[1.72]">
          {direction}
        </div>
      </div>
    </div>
  );
}
