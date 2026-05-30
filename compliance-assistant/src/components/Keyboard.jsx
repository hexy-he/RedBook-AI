import { useRef, useEffect } from "react";
import SimpleKeyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function Keyboard({ onInput, initialValue = "" }) {
  const keyboard = useRef(null);

  // 当 initialValue 变化时更新键盘
  useEffect(() => {
    if (keyboard.current && initialValue !== undefined) {
      keyboard.current.setInput(initialValue);
    }
  }, [initialValue]);

  const onChange = (input) => {
    onInput && onInput(input);
  };

  return (
    <div className="max-w-lg mx-auto">
      <SimpleKeyboard
        ref={keyboard}
        value={initialValue}
        onChange={onChange}
        layout={{
          default: [
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "{shift} z x c v b n m {backspace}",
            "{numbers} {space} {enter}",
          ],
          shift: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{shift} Z X C V B N M {backspace}",
            "{numbers} {space} {enter}",
          ],
          numbers: [
            "1 2 3 4 5 6 7 8 9 0",
            "- / : ; ( ) $ & @",
            "{shift} . , ? ! ' {backspace}",
            "{abc} {space} {enter}",
          ],
        }}
        display={{
          "{numbers}": "123",
          "{enter}": "换行",
          "{abc}": "ABC",
        }}
        theme="simple-keyboard hg-theme-default"
      />
      <style>{`
        .hg-theme-default {
          background-color: #D1D5DB;
          border-radius: 0;
          padding: 8px;
          font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
          user-select: none;
          -webkit-user-select: none;
        }
        .hg-theme-default .hg-button {
          height: 42px;
          border-radius: 6px;
          background: #ffffff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
          font-size: 18px;
          color: #1a1a1a;
          border: none;
          margin: 2px;
        }
        .hg-theme-default .hg-button:active {
          background-color: #e8e8e8;
        }
        .hg-theme-default .hg-button.hg-functionBtn {
          background-color: #A9A9AD;
          color: white;
          font-size: 15px;
        }
        .hg-theme-default .hg-button.hg-standardBtn {
          max-width: none;
        }
        .hg-theme-default .hg-button[data-skbtn="{space}"] {
          flex-grow: 4;
          min-width: 120px;
        }
        .simple-keyboard {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
