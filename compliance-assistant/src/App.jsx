import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Toolbar from "./components/Toolbar";
import BottomSheet from "./components/BottomSheet";
import IntentOptions from "./components/IntentOptions";
import ResultCard from "./components/ResultCard";
import InputBar from "./components/InputBar";
import Keyboard from "./components/Keyboard";
import { sampleDraft, intentOptions, resultsByIntent } from "./data/demoData";

function App() {
  const [isOpen, setOpen] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [title, setTitle] = useState(sampleDraft.title);
  const [body, setBody] = useState(sampleDraft.body);
  const [activeField, setActiveField] = useState("title");
  const titleInputRef = useRef(null);
  const bodyInputRef = useRef(null);
  const contentRef = useRef(null);
  const [showKeyboard, setShowKeyboard] = useState(true);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // 使用 useCallback 避免每次渲染创建新函数
  const handleKeyboardInput = useCallback((input) => {
    if (activeField === "title") {
      setTitle(input);
    } else {
      setBody(input);
    }
  }, [activeField]);

  const handleIntentSelect = (index) => {
    setSelectedIntent(index);
    setShowResult(false);
    setShowKeyboard(false);

    setTimeout(() => {
      setShowResult(true);
    }, 800);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setInputValue("");
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIntent(null);
    setShowResult(false);
    setInputValue("");
    setShowKeyboard(true);
  };

  return (
    <div className="h-screen bg-bg-page flex flex-col overflow-hidden">
      <div className="flex-shrink-0 max-w-lg mx-auto w-full px-4 py-6">
        <Navbar />
      </div>

      <div
        ref={contentRef}
        className="flex-1 min-h-0 max-w-lg mx-auto w-full px-4 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onClick={() => setActiveField("title")}
          onFocus={() => setActiveField("title")}
          className="w-full text-[22px] font-semibold text-text-primary leading-[1.4] mb-4 outline-none border-none bg-transparent"
          placeholder="添加标题..."
        />

        <textarea
          ref={bodyInputRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onClick={() => setActiveField("body")}
          onFocus={() => setActiveField("body")}
          className="w-full text-[16px] text-text-regular leading-[1.85] outline-none border-none bg-transparent resize-none pb-8"
          placeholder="开始写笔记..."
          rows={20}
        />
      </div>

      <div className="flex-shrink-0 w-full bg-white">
        <div className="max-w-lg mx-auto">
          <Toolbar onAskClick={() => setOpen(true)} />
        </div>
        {showKeyboard && (
          <Keyboard
            onInput={handleKeyboardInput}
            initialValue={activeField === "title" ? title : body}
          />
        )}
      </div>

      <BottomSheet isOpen={isOpen} onClose={handleClose}>
        <div className="flex flex-col h-full">
          <div className="sheet-handle"></div>
          <div className="sheet-title">问一问</div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="greeting">我已读完你的笔记</div>
            <div className="text-[16px] text-text-secondary mt-2 mb-4">
              先确认下，你最想让读者 get 到的是什么？
            </div>

            <IntentOptions
              options={intentOptions}
              selectedIndex={selectedIntent}
              onSelect={handleIntentSelect}
            />

            {showResult && selectedIntent !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <ResultCard
                  rule={resultsByIntent[selectedIntent].rule}
                  direction={resultsByIntent[selectedIntent].direction}
                />
              </motion.div>
            )}

            {showResult && selectedIntent !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <InputBar
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSend={handleSend}
                />
              </motion.div>
            )}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export default App;
