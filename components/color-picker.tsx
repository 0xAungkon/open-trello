"use client"

import { useState } from "react"
import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

const presetColors = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#a855f7", // purple-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
]

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value.startsWith("#") ? value : "#3b82f6")
  const [isOpen, setIsOpen] = useState(false)

  const handleColorSelect = (color: string) => {
    onChange(color)
    setCustomColor(color)
    setIsOpen(false)
  }

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    onChange(color)
  }

  const getCurrentBgClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "#ef4444": "bg-red-500",
      "#f97316": "bg-orange-500",
      "#eab308": "bg-yellow-500",
      "#22c55e": "bg-green-500",
      "#3b82f6": "bg-blue-500",
      "#6366f1": "bg-indigo-500",
      "#a855f7": "bg-purple-500",
      "#ec4899": "bg-pink-500",
      "#06b6d4": "bg-cyan-500",
      "#84cc16": "bg-lime-500",
      "#f59e0b": "bg-amber-500",
      "#8b5cf6": "bg-violet-500",
    }
    return colorMap[color] || "bg-blue-500"
  }

  const currentBgClass = value.startsWith("bg-") ? value : getCurrentBgClass(customColor)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-12 h-8 p-0 cursor-pointer", className)}
          style={{ backgroundColor: value.startsWith("#") ? value : undefined }}
        >
          {value.startsWith("bg-") && <div className={cn("w-full h-full rounded", value)} />}
          {!value.startsWith("#") && !value.startsWith("bg-") && <Palette className="w-4 h-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Preset Colors</p>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "w-8 h-8 rounded border-2 cursor-pointer hover:scale-110 transition-transform",
                    value === color || value === getCurrentBgClass(color) ? "border-gray-900" : "border-gray-300",
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(getCurrentBgClass(color))}
                >
                  {(value === color || value === getCurrentBgClass(color)) && (
                    <Check className="w-4 h-4 text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Custom Color</p>
            <div className="flex space-x-2">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-12 h-8 p-0 border cursor-pointer"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#000000"
                className="flex-1 cursor-text"
              />
              <Button size="sm" onClick={() => handleColorSelect(customColor)} className="cursor-pointer">
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
