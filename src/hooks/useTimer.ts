import { useEffect, useRef, useState } from 'react'

const DEFAULT_SECONDS = 30 * 60

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

export function formatClock(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function parseTime(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const parts = trimmed.split(':')
  if (parts.length !== 2 && parts.length !== 3) return null
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return null
  }
  const nums = parts.map(Number)
  let total: number
  if (nums.length === 2) {
    const [m, s] = nums
    if (s > 59) return null
    total = m * 60 + s
  } else {
    const [h, m, s] = nums
    if (m > 59 || s > 59) return null
    total = h * 3600 + m * 60 + s
  }
  return total > 0 ? total : null
}

function playAlarm() {
  try {
    const Ctx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 880
      const t = ctx.currentTime + i * 0.35
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
      osc.start(t)
      osc.stop(t + 0.32)
    }
  } catch {
    // Audio is unavailable (e.g. no user gesture yet); ignore.
  }
}

export function useTimer(initialSeconds: number = DEFAULT_SECONDS) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds)
  const [remainingMs, setRemainingMs] = useState(initialSeconds * 1000)
  const [status, setStatus] = useState<TimerStatus>('idle')
  const endAtRef = useRef(0)

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const error = editing ? (parseTime(draft) === null ? 'Enter a valid time like 10:30 or 1:05:00' : null) : null

  useEffect(() => {
    if (status !== 'running') return
    let done = false
    const id = window.setInterval(() => {
      const remaining = Math.max(0, endAtRef.current - Date.now())
      setRemainingMs(remaining)
      if (!done && remaining <= 0) {
        done = true
        setStatus('finished')
        playAlarm()
      }
    }, 50)
    return () => window.clearInterval(id)
  }, [status])

  const displaySeconds = Math.ceil(remainingMs / 1000)

  const start = () => {
    if (status === 'finished') return
    endAtRef.current = Date.now() + remainingMs
    setStatus('running')
  }

  const pause = () => {
    setRemainingMs(Math.max(0, endAtRef.current - Date.now()))
    setStatus('paused')
  }

  const reset = () => {
    setStatus('idle')
    setRemainingMs(totalSeconds * 1000)
  }

  const addTime = (deltaSeconds: number) => {
    if (editing || status === 'finished') return
    setTotalSeconds((t) => t + deltaSeconds)
    setRemainingMs((r) => r + deltaSeconds * 1000)
    if (status === 'running') endAtRef.current += deltaSeconds * 1000
  }

  const enterEdit = () => {
    if (status === 'running') pause()
    setDraft(formatClock(status === 'finished' ? totalSeconds : displaySeconds))
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
  }

  const commitEdit = () => {
    const parsed = parseTime(draft)
    if (parsed === null) return
    setTotalSeconds(parsed)
    setRemainingMs(parsed * 1000)
    setStatus('idle')
    setEditing(false)
  }

  return {
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
  }
}

export type TimerState = ReturnType<typeof useTimer>
