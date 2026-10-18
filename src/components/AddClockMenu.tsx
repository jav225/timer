import { useState, type FormEvent } from 'react'

export interface ClockPreset {
  title: string
  minutes: number
}

interface AddClockMenuProps {
  presets: ClockPreset[]
  onAdd: (title: string, seconds: number) => void
}

export default function AddClockMenu({ presets, onAdd }: AddClockMenuProps) {
  const [open, setOpen] = useState(false)
  const [customMode, setCustomMode] = useState(false)
  const [title, setTitle] = useState('')
  const [minutes, setMinutes] = useState('')

  const close = () => {
    setOpen(false)
    setCustomMode(false)
    setTitle('')
    setMinutes('')
  }

  const pickPreset = (preset: ClockPreset) => {
    onAdd(preset.title, preset.minutes * 60)
    close()
  }

  const mins = Number(minutes)
  const canSubmit = title.trim() !== '' && Number.isFinite(mins) && mins > 0

  const submitCustom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    onAdd(title.trim(), Math.round(mins * 60))
    close()
  }

  return (
    <>
      {open && <div className="backdrop" onClick={close} />}
      {open && (
        <div className="add-menu">
          {!customMode ? (
            <>
              {presets.map((preset) => (
                <button
                  key={`${preset.title}-${preset.minutes}`}
                  type="button"
                  className="menu-item"
                  onClick={() => pickPreset(preset)}
                >
                  <span>{preset.title}</span>
                  <span className="menu-time">{preset.minutes} min</span>
                </button>
              ))}
              <div className="separator" />
              <button type="button" className="menu-item" onClick={() => setCustomMode(true)}>
                New…
              </button>
            </>
          ) : (
            <form onSubmit={submitCustom}>
              <label className="field">
                <span>Title</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" autoFocus />
              </label>
              <label className="field">
                <span>Minutes</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="30"
                />
              </label>
              <div className="form-actions">
                <button type="button" className="btn ghost" onClick={close}>
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={!canSubmit}>
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      <button
        type="button"
        className="fab"
        aria-label="Add clock"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </>
  )
}
