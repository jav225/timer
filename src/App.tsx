import { useState } from 'react'
import Clock from './components/Clock'
import AddClockMenu, { type ClockPreset } from './components/AddClockMenu'
import './index.css'

const PRESETS: ClockPreset[] = [
  { title: 'yugi', minutes: 50 },
  { title: 'rift', minutes: 50 },
  { title: 'gundam', minutes: 35 },
  { title: 'OP', minutes: 35 },
  { title: 'poke', minutes: 45 },
]

interface ClockEntry {
  id: number
  title: string
  seconds: number
}

export default function App() {
  const [clocks, setClocks] = useState<ClockEntry[]>([])
  const [nextId, setNextId] = useState(1)

  const addClock = (title: string, seconds: number) => {
    const id = nextId
    setClocks((c) => [...c, { id, title, seconds }])
    setNextId(id + 1)
  }

  return (
    <div className="app">
      <h1 className="title">Tiempo</h1>

      <div className="clocks">
        {clocks.map(({ id, title, seconds }) => (
          <Clock
            key={id}
            title={title}
            defaultSeconds={seconds}
            onRemove={() => setClocks((c) => c.filter((x) => x.id !== id))}
          />
        ))}
      </div>

      {clocks.length === 0 && <p className="empty-hint">Tap + to add a clock</p>}

      <AddClockMenu presets={PRESETS} onAdd={addClock} />
    </div>
  )
}
