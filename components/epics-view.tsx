"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BacklogEpic } from "@/components/backlog-epic"
import { useProject } from "@/contexts/project-context"

export function EpicsView() {
  const { state, dispatch } = useProject()
  const [searchQuery, setSearchQuery] = useState("")

  const activeEpics = state.epics.filter((epic) => !epic.archived)

  // Sort epics: completed ones (100%) at the bottom
  const sortedEpics = activeEpics.sort((a, b) => {
    if (a.progress === 100 && b.progress !== 100) return 1
    if (a.progress !== 100 && b.progress === 100) return -1
    return 0
  })

  const filteredEpics = sortedEpics.filter(
    (epic) =>
      epic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      epic.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddEpic = () => {
    dispatch({
      type: "SELECT_EPIC",
      epic: { id: "", title: "", description: "", color: "bg-indigo-500", progress: 0, cards: [] },
    })
  }

  return (
    <div className="flex-1 p-3 md:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Epics</h2>
            <p className="text-gray-600">Manage and track your project epics</p>
          </div>
          <Button onClick={handleAddEpic}>
            <Plus className="w-4 h-4 mr-2" />
            Add Epic
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search epics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Badge variant="secondary" className="text-sm">
            {filteredEpics.length} epics
          </Badge>
        </div>
      </div>

      {filteredEpics.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No epics found</p>
          <Button onClick={handleAddEpic}>
            <Plus className="w-4 h-4 mr-2" />
            Create your first epic
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEpics.map((epic) => (
            <BacklogEpic key={epic.id} epic={epic} />
          ))}
        </div>
      )}
    </div>
  )
}
