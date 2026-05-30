export default function EditorContent({ title, body }) {
  return (
    <div className="p-4">
      <h1 className="text-[22px] font-semibold text-text-primary leading-[1.4] mb-2">
        {title}
      </h1>
      <div className="text-[16px] text-text-regular leading-[1.85] whitespace-pre-wrap">
        {body}
      </div>
    </div>
  );
}
