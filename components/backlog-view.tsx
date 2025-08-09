"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BacklogCard } from "@/components/backlog-card"
import { useProject } from "@/contexts/project-context"

export function BacklogView() {
  const { state, dispatch } = useProject()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterEpic, setFilterEpic] = useState<string>("all-epics")
  const [filterPriority, setFilterPriority] = useState<string>("all-priorities")

  const filteredCards = state.backlogCards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEpic = filterEpic === "all-epics" || card.epicId === filterEpic
    const matchesPriority = filterPriority === "all-priorities" || card.priority === filterPriority

    return matchesSearch && matchesEpic && matchesPriority
  })

  const handleAddCard = () => {
    const newCard = {
      title: "New backlog item",
      description: "",
      listId: "",
      labels: [],
      members: [],
      priority: "medium" as const,
      checklist: [],
      comments: [],
      attachments: [],
    }

    dispatch({ type: "ADD_CARD", listId: "", card: newCard })
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Backlog</h2>
            <p className="text-gray-600">Manage and prioritize your upcoming work</p>
          </div>
          <Button onClick={handleAddCard}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search backlog items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterEpic} onValueChange={setFilterEpic}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Epic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-epics">All Epics</SelectItem>
              {state.epics.map((epic) => (
                <SelectItem key={epic.id} value={epic.id}>
                  {epic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-priorities">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="secondary">{filteredCards.length} items</Badge>
        </div>
      </div>

      <div className="space-y-3">
        {filteredCards.map((card) => (
          <BacklogCard key={card.id} card={card} />
        ))}

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No backlog items found</p>
            <Button onClick={handleAddCard}>
              <Plus className="w-4 h-4 mr-2" />
              Add your first item
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
