"use client"

import { useState, useEffect, useRef } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function DatePicker({ value, onChange, className = "" }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState<Date>(value ? new Date(value + "T00:00:00") : new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00")
      if (!isNaN(d.getTime())) setViewDate(d)
    }
  }, [value])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const days: Array<{ day: number; month: number; year: number; current: boolean }> = []

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, month: month - 1, year, current: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, month, year, current: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, month: month + 1, year, current: false })
  }

  function selectDate(day: number, m: number, y: number) {
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    onChange(dateStr)
    setOpen(false)
  }

  function goToPrevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }

  function goToNextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  function goToToday() {
    const today = new Date()
    setViewDate(today)
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    onChange(dateStr)
    setOpen(false)
  }

  function isSelected(day: number, m: number, y: number): boolean {
    if (!value) return false
    const normalizedValue = value.length === 10 ? value : value.split("T")[0]
    return normalizedValue === `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  function isToday(day: number, m: number, y: number): boolean {
    const today = new Date()
    return day === today.getDate() && m === today.getMonth() && y === today.getFullYear()
  }

  const displayValue = value ? (() => {
    const d = new Date(value + "T00:00:00")
    if (isNaN(d.getTime())) return value
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  })() : ""

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 hover:border-zinc-600 transition-colors"
      >
        <CalendarIcon size={16} className="text-zinc-500 shrink-0" />
        <span className={displayValue ? "text-white" : "text-zinc-500"}>
          {displayValue || "Select date"}
        </span>
        {value && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onChange("") }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onChange("") } }}
            className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={14} />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 p-4 w-[300px]">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-white font-semibold text-sm">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayLabels.map(d => (
              <span key={d} className="text-zinc-500 text-xs font-medium text-center py-1">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map(({ day, month: m, year: y, current }, idx) => {
              const selected = isSelected(day, m, y)
              const today = isToday(day, m, y)
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectDate(day, m, y)}
                  disabled={!current}
                  className={`
                    h-8 w-8 flex items-center justify-center rounded-lg text-sm transition-colors
                    ${!current ? "text-zinc-700 cursor-default" : "cursor-pointer hover:bg-zinc-800 text-zinc-300"}
                    ${selected ? "bg-orange-500 text-white hover:bg-orange-600 font-semibold" : ""}
                    ${today && !selected ? "border border-zinc-600 text-white font-semibold" : ""}
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
            <button
              type="button"
              onClick={goToToday}
              className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
