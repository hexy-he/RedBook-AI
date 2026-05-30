import { ArrowBigUp, Delete, Globe2, Mic, Smile } from 'lucide-react'
import { useState } from 'react'

const letterRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'delete'],
]

const symbolRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '¥', '&', '@', '"'],
  ['#+=', '.', ',', '?', '!', "'", 'delete'],
]

export default function IOSKeyboard({ onInput, onDelete, onEnter, onSpace }) {
  const [shifted, setShifted] = useState(false)
  const [symbols, setSymbols] = useState(false)
  const rows = symbols ? symbolRows : letterRows

  const press = (key) => {
    if (key === 'shift') {
      setShifted((value) => !value)
      return
    }
    if (key === 'delete') {
      onDelete()
      return
    }
    if (key === '123') {
      setSymbols(true)
      return
    }
    if (key === 'abc') {
      setSymbols(false)
      return
    }
    onInput(shifted && /^[a-z]$/.test(key) ? key.toUpperCase() : key)
    if (shifted && !symbols) setShifted(false)
  }

  return (
    <div className="select-none bg-[#D1D5DD] px-[7px] pb-3 pt-3">
      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-[7px]">
            {row.map((key) => (
              <Key
                key={key}
                label={renderLabel(key, shifted)}
                wide={key === 'shift' || key === 'delete' || key === '#+='}
                muted={key === 'shift' || key === 'delete' || key === '#+='}
                onClick={() => press(key)}
              />
            ))}
          </div>
        ))}

        <div className="flex gap-[7px]">
          <Key label={symbols ? 'ABC' : '123'} muted fixed className="w-[47px]" textClassName="text-[19px]" onClick={() => press(symbols ? 'abc' : '123')} />
          <Key label={<Smile size={24} strokeWidth={2.1} />} muted fixed className="w-[47px]" onClick={() => onInput('😊')} />
          <Key label="空格" className="flex-1" textClassName="text-[19px] font-normal" onClick={onSpace} />
          <Key label="换行" muted fixed className="w-[101px]" textClassName="text-[19px] font-normal" onClick={onEnter} />
        </div>

        <div className="relative h-[42px]">
          <button className="absolute left-[55px] top-1 rounded-full p-1 text-[#4F5660]" aria-label="切换输入法">
            <Globe2 size={28} strokeWidth={1.9} />
          </button>
          <button className="absolute right-[70px] top-0 rounded-full p-1 text-[#4F5660]" aria-label="语音输入">
            <Mic size={31} strokeWidth={1.9} />
          </button>
          <div className="absolute bottom-[2px] left-1/2 h-[5px] w-[138px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  )
}

function Key({ label, onClick, wide = false, fixed = false, muted = false, className = '', textClassName = 'text-[28px]' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex h-[49px] items-center justify-center rounded-[8px] leading-none text-black shadow-[0_1px_0_rgba(0,0,0,.35)] active:brightness-95',
        textClassName,
        muted ? 'bg-[#B8BEC9]' : 'bg-white',
        wide || fixed ? 'shrink-0' : 'min-w-0 flex-1',
        wide ? 'w-[52px]' : '',
        className,
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function renderLabel(key, shifted) {
  if (key === 'shift') return <ArrowBigUp size={27} strokeWidth={2.2} />
  if (key === 'delete') return <Delete size={28} strokeWidth={2.1} />
  if (key === '#+=') return '#+='
  return shifted && /^[a-z]$/.test(key) ? key.toUpperCase() : key
}
