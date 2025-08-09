"use client"

import { useState } from "react"
import { Calendar, Tag, Users, Flag, CheckSquare, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProject } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
}

export interface FilterState {
  labels: string[]
  members: string[]
  priority: string[]
  dueDate: string
  status: string[]
}

export function FilterModal({ isOpen, onClose, onApplyFilters }: FilterModalProps) {
  const { state } = useProject()
  const [filters, setFilters] = useState<FilterState>({
    labels: [],
    members: [],
    priority: [],
    dueDate: "all",
    status: [],
  })

  const handleLabelToggle = (labelId: string) => {
    setFilters((prev) => ({
      ...prev,
      labels: prev.labels.includes(labelId) ? prev.labels.filter((id) => id !== labelId) : [...prev.labels, labelId],
    }))
  }

  const handleMemberToggle = (memberId: string) => {
    setFilters((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }))
  }

  const handlePriorityToggle = (priority: string) => {
    setFilters((prev) => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter((p) => p !== priority)
        : [...prev.priority, priority],
    }))
  }

  const handleStatusToggle = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status) ? prev.status.filter((s) => s !== status) : [...prev.status, status],
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleClear = () => {
    const clearedFilters = {
      labels: [],
      members: [],
      priority: [],
      dueDate: "all",
      status: [],
    }
    setFilters(clearedFilters)
    onApplyFilters(clearedFilters)
  }

  const priorities = [
    { value: "urgent", label: "Urgent", color: "bg-red-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "low", label: "Low", color: "bg-green-500" },
  ]

  const statuses = [
    { value: "todo", label: "To Do" },
    { value: "inprogress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn("max-w-2xl", state.settings?.darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white")}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Filter Cards</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Labels Filter */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Labels
            </h4>
            <div className="flex flex-wrap gap-2">
              {state.labels.map((label) => (
                <div key={label.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.labels.includes(label.id)}
                    onCheckedChange={() => handleLabelToggle(label.id)}
                  />
                  <Badge
                    className={cn("text-white cursor-pointer", label.color)}
                    onClick={() => handleLabelToggle(label.id)}
                  >
                    {label.name}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Members Filter */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Assigned Members
            </h4>
            <div className="space-y-2">
              {state.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.members.includes(member.id)}
                    onCheckedChange={() => handleMemberToggle(member.id)}
                  />
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleMemberToggle(member.id)}
                  >
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <span>{member.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Flag className="w-4 h-4 mr-2" />
              Priority
            </h4>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => (
                <div key={priority.value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.priority.includes(priority.value)}
                    onCheckedChange={() => handlePriorityToggle(priority.value)}
                  />
                  <Badge
                    variant="outline"
                    className={cn(
                      "cursor-pointer",
                      filters.priority.includes(priority.value) ? priority.color + " text-white" : "",
                    )}
                    onClick={() => handlePriorityToggle(priority.value)}
                  >
                    {priority.label}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Due Date Filter */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Due Date
            </h4>
            <Select
              value={filters.dueDate}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, dueDate: value }))}
            >
              <SelectTrigger className={cn("w-48", state.settings?.darkMode ? "bg-gray-800 border-gray-600" : "")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={state.settings?.darkMode ? "bg-gray-800 border-gray-600" : ""}>
                <SelectItem value="all">All Cards</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="week">Due This Week</SelectItem>
                <SelectItem value="month">Due This Month</SelectItem>
                <SelectItem value="none">No Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <CheckSquare className="w-4 h-4 mr-2" />
              Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.status.includes(status.value)}
                    onCheckedChange={() => handleStatusToggle(status.value)}
                  />
                  <Badge variant="outline" className="cursor-pointer" onClick={() => handleStatusToggle(status.value)}>
                    {status.label}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleClear} className="cursor-pointer bg-transparent">
              Clear All
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose} className="cursor-pointer bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleApply} className="cursor-pointer">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
