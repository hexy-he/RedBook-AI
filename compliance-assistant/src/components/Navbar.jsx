export default function Navbar({ title = "写长文", showLogo = false }) {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl">
      <span className="text-[22px] text-text-primary font-light">‹</span>

      {showLogo ? (
        <div className="flex items-center gap-2">
          <svg
            width="22"
            height="22"
            viewBox="0 0 1254 1254"
            aria-label="问一问 logo"
          >
            <path
              d="M627 180a447 447 0 1 0 0 894 447 447 0 0 0 0-894zm0 90a357 357 0 1 1 0 714 357 357 0 0 1 0-714z"
              fill="#017AFC"
            />
          </svg>
          <span className="text-[17px] font-semibold text-text-primary">
            问一问
          </span>
        </div>
      ) : (
        <span className="text-[17px] font-semibold text-text-primary">
          {title}
        </span>
      )}

      {showLogo ? (
        <div className="flex flex-col gap-1">
          <div className="w-5 h-[2px] bg-text-primary rounded"></div>
          <div className="w-5 h-[2px] bg-text-primary rounded"></div>
          <div className="w-5 h-[2px] bg-text-primary rounded"></div>
        </div>
      ) : (
        <button className="bg-xhs-red text-white text-[15px] font-medium px-4 py-2 rounded-full">
          一键排版
        </button>
      )}
    </div>
  );
}
