import { formatClock, type TimerState } from '../hooks/useTimer'
import { PlayIcon, PauseIcon, ResetIcon } from './icons'

const SIZE = 320
const CENTER = SIZE / 2
const RADIUS = 128
const STROKE = 10
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Timer({
  totalSeconds,
  remainingMs,
  status,
  editing,
  draft,
  setDraft,
  error,
  displaySeconds,
  start,
  pause,
  reset,
  addTime,
  enterEdit,
  cancelEdit,
  commitEdit,
}: TimerState) {
  const fraction = totalSeconds > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / (totalSeconds * 1000))) : 0

  return (
    <div className="timer">
      <div className="dial">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--track)" strokeWidth={STROKE} />
          <circle
            className="progress-ring"
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={status === 'finished' ? 'var(--warm)' : 'var(--accent)'}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        </svg>
        <div className="dial-center">
          {editing ? (
            <>
              <input
                className={error !== null ? 'time-input invalid' : 'time-input'}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit()
                  else if (e.key === 'Escape') cancelEdit()
                }}
                onBlur={() => cancelEdit()}
                aria-label="Custom time"
                autoComplete="off"
              />
              {error !== null && <span className="edit-error" role="alert">{error}</span>}
            </>
          ) : (
            <>
              <button type="button" className="time" onClick={enterEdit} aria-label="Pause and edit time">
                {formatClock(displaySeconds)}
              </button>
              {status === 'finished' && <span className="done-label">Time's up</span>}
            </>
          )}
        </div>
      </div>

      {status === 'idle' && !editing && (
        <div className="chips">
          <button type="button" className="chip" onClick={() => addTime(5 * 60)}>
            +5 min
          </button>
          <button type="button" className="chip" onClick={() => addTime(10 * 60)}>
            +10 min
          </button>
        </div>
      )}

      <div className="separator" />

      <div className="controls">
        {editing ? (
          <>
            <button type="button" className="btn primary" onClick={commitEdit}>
              Done
            </button>
            <button type="button" className="btn ghost" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        ) : status === 'idle' ? (
          <button type="button" className="btn primary icon" onClick={start} aria-label="Start">
            <PlayIcon />
          </button>
        ) : status === 'running' ? (
          <>
            <button type="button" className="btn icon" onClick={pause} aria-label="Pause">
              <PauseIcon />
            </button>
            <button type="button" className="btn ghost icon" onClick={reset} aria-label="Reset">
              <ResetIcon />
            </button>
          </>
        ) : status === 'paused' ? (
          <>
            <button type="button" className="btn primary icon" onClick={start} aria-label="Start">
              <PlayIcon />
            </button>
            <button type="button" className="btn ghost icon" onClick={reset} aria-label="Reset">
              <ResetIcon />
            </button>
          </>
        ) : (
          <button type="button" className="btn primary icon" onClick={reset} aria-label="Reset">
            <ResetIcon />
          </button>
        )}
      </div>
    </div>
  )
}
