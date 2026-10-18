import { useEffect, useRef, useState } from 'react'

export type StopwatchStatus = 'idle' | 'running' | 'paused'

export function formatStopwatch(ms: number): string {
  const cs = Math.floor((ms % 1000) / 10)
  const totalSeconds = Math.floor(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export function useStopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [status, setStatus] = useState<StopwatchStatus>('idle')
  const [laps, setLaps] = useState<number[]>([])
  const startedAtRef = useRef(0)

  useEffect(() => {
    if (status !== 'running') return
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAtRef.current)
    }, 30)
    return () => window.clearInterval(id)
  }, [status])

  const start = () => {
    if (status === 'idle') setLaps([])
    // Works for both a fresh start and resuming from pause.
    startedAtRef.current = Date.now() - elapsedMs
    setStatus('running')
  }

  const pause = () => {
    setElapsedMs(Date.now() - startedAtRef.current)
    setStatus('paused')
  }

  const reset = () => {
    setElapsedMs(0)
    setLaps([])
    setStatus('idle')
  }

  const lap = () => {
    if (status !== 'running') return
    const now = Date.now() - startedAtRef.current
    setLaps((prev) => [...prev, now])
  }

  const lapTimes = laps.map((t, i) => t - (laps[i - 1] ?? 0))

  return { elapsedMs, status, laps, lapTimes, start, pause, reset, lap }
}

export type StopwatchState = ReturnType<typeof useStopwatch>
