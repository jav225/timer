import { formatStopwatch, type StopwatchState } from '../hooks/useStopwatch'
import { PlayIcon, PauseIcon, ResetIcon } from './icons'

export default function Stopwatch({ elapsedMs, status, laps, lapTimes, start, pause, reset, lap }: StopwatchState) {
  return (
    <div className="stopwatch">
      <div className="sw-time">{formatStopwatch(elapsedMs)}</div>

      <div className="controls">
        {status === 'idle' && (
          <button type="button" className="btn primary icon" onClick={start} aria-label="Start">
            <PlayIcon />
          </button>
        )}
        {status === 'running' && (
          <>
            <button type="button" className="btn primary" onClick={lap}>
              Lap
            </button>
            <button type="button" className="btn icon" onClick={pause} aria-label="Pause">
              <PauseIcon />
            </button>
          </>
        )}
        {status === 'paused' && (
          <>
            <button type="button" className="btn primary icon" onClick={start} aria-label="Start">
              <PlayIcon />
            </button>
            <button type="button" className="btn ghost icon" onClick={reset} aria-label="Reset">
              <ResetIcon />
            </button>
          </>
        )}
      </div>

      {laps.length > 0 && (
        <ul className="lap-list">
          {[...lapTimes].reverse().map((t, i) => (
            <li key={i}>
              <span>Lap {laps.length - i}</span>
              <span>{formatStopwatch(t)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
