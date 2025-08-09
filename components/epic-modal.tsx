"use client"

import { useState } from "react"
import * as React from "react"
import { Calendar, BarChart3, Archive } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useProject } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

const epicColors = [
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Emerald", value: "bg-emerald-500" },
]

export function EpicModal() {
  const { state, dispatch } = useProject()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "bg-indigo-500",
    startDate: "",
    endDate: "",
  })

  const epic = state.selectedEpic
  const isOpen = epic !== null
  const isEditing = epic && epic.id

  // Update form data when epic changes
  React.useEffect(() => {
    if (epic && epic.id) {
      setFormData({
        title: epic.title,
        description: epic.description,
        color: epic.color,
        startDate: epic.startDate || "",
        endDate: epic.endDate || "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        color: "bg-indigo-500",
        startDate: "",
        endDate: "",
      })
    }
  }, [epic])

  const handleClose = () => {
    dispatch({ type: "SELECT_EPIC", epic: null })
    setFormData({
      title: "",
      description: "",
      color: "bg-indigo-500",
      startDate: "",
      endDate: "",
    })
  }

  const handleSave = () => {
    if (!formData.title.trim()) return

    if (isEditing && epic) {
      dispatch({
        type: "UPDATE_EPIC",
        epic: {
          ...epic,
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim(),
        },
      })
    } else {
      dispatch({
        type: "ADD_EPIC",
        epic: {
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim(),
          progress: 0,
          cards: [],
        },
      })
    }
    handleClose()
  }

  const handleArchive = () => {
    if (epic && epic.id) {
      dispatch({ type: "ARCHIVE_EPIC", epicId: epic.id })
      handleClose()
    }
  }

  const epicCards = epic ? state.lists.flatMap((list) => list.cards.filter((card) => card.epicId === epic.id)) : []

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Epic" : "Create New Epic"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              placeholder="Epic title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Describe the epic..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Color</label>
            <div className="flex flex-wrap gap-2">
              {epicColors.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    color.value,
                    formData.color === color.value ? "border-gray-900 scale-110" : "border-gray-300 hover:scale-105",
                  )}
                  onClick={() => setFormData({ ...formData, color: color.value })}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Start Date
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          {isEditing && epic && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Epic Progress
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{epic.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${epic.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{epicCards.length} cards</span>
                  <span>{epicCards.filter((card) => card.listId === "4").length} completed</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <div>
              {isEditing && (
                <Button variant="outline" onClick={handleArchive}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Epic
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.title.trim()}>
                {isEditing ? "Update Epic" : "Create Epic"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
