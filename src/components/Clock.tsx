import { useState } from 'react'
import Timer from './Timer'
import Stopwatch from './Stopwatch'
import { useTimer } from '../hooks/useTimer'
import { useStopwatch } from '../hooks/useStopwatch'

type Tab = 'timer' | 'stopwatch'

export interface ClockProps {
  title?: string
  defaultSeconds?: number
  onRemove?: () => void
}

export default function Clock({ title = 'New title', defaultSeconds = 30 * 60, onRemove }: ClockProps) {
  const [tab, setTab] = useState<Tab>('timer')
  // State lives here (via hooks), so switching tabs doesn't reset it.
  // Each <Clock /> instance owns its own independent timer and stopwatch.
  const timer = useTimer(defaultSeconds)
  const stopwatch = useStopwatch()

  return (
    <div className="clock">
      <div className="clock-header">
        <h2 className="clock-title">{title}</h2>
        {onRemove && (
          <button type="button" className="remove-btn" onClick={onRemove} aria-label={`Remove ${title}`}>
            ×
          </button>
        )}
      </div>

      <nav className="tabs" role="tablist" aria-label="Timer or stopwatch">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'timer'}
          className={tab === 'timer' ? 'tab active' : 'tab'}
          onClick={() => setTab('timer')}
        >
          Timer
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'stopwatch'}
          className={tab === 'stopwatch' ? 'tab active' : 'tab'}
          onClick={() => setTab('stopwatch')}
        >
          Stopwatch
        </button>
      </nav>

      {tab === 'timer' ? <Timer {...timer} /> : <Stopwatch {...stopwatch} />}
    </div>
  )
}
