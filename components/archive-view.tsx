"use client"

import { useState } from "react"
import { Search, RotateCcw, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BoardCard } from "@/components/board-card"
import { BacklogEpic } from "@/components/backlog-epic"
import { useProject } from "@/contexts/project-context"

export function ArchiveView() {
  const { state, dispatch } = useProject()
  const [searchQuery, setSearchQuery] = useState("")

  // Get archived cards from all lists and backlog
  const archivedCards = [
    ...state.lists.flatMap((list) => list.cards.filter((card) => card.archived)),
    ...state.backlogCards.filter((card) => card.archived),
  ]

  // Get archived epics
  const archivedEpics = state.epics.filter((epic) => epic.archived)

  const filteredCards = archivedCards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredEpics = archivedEpics.filter(
    (epic) =>
      epic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      epic.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRestoreCardToBoard = (cardId: string) => {
    dispatch({ type: "RESTORE_CARD", cardId, targetListId: "1" })
  }

  const handleRestoreCardToBacklog = (cardId: string) => {
    dispatch({ type: "RESTORE_CARD", cardId, targetListId: "" })
  }

  const handleDeleteCard = (cardId: string, listId: string) => {
    dispatch({ type: "DELETE_CARD", cardId, listId })
  }

  const handleRestoreEpic = (epicId: string) => {
    dispatch({ type: "RESTORE_EPIC", epicId })
  }

  const handleDeleteEpic = (epicId: string) => {
    dispatch({ type: "DELETE_EPIC", epicId })
  }

  return (
    <div className="flex-1 p-3 md:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Archive</h2>
            <p className="text-white/80">Manage archived cards and epics</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search archived items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/95"
          />
        </div>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/95">
          <TabsTrigger value="cards" className="text-sm font-medium">
            Cards ({filteredCards.length})
          </TabsTrigger>
          <TabsTrigger value="epics" className="text-sm font-medium">
            Epics ({filteredEpics.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4 mt-6">
          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white/60" />
              </div>
              <p className="text-white text-lg font-medium mb-2">No archived cards found</p>
              <p className="text-white/70 text-sm">Cards you archive will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredCards.map((card) => (
                <div key={card.id} className="relative group">
                  <div className="opacity-75 hover:opacity-100 transition-opacity">
                    <BoardCard card={card} index={0} />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 w-7 p-0 bg-white shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRestoreCardToBoard(card.id)
                      }}
                      title="Restore to Board"
                    >
                      <FolderOpen className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 w-7 p-0 bg-white shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRestoreCardToBacklog(card.id)
                      }}
                      title="Restore to Backlog"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 w-7 p-0 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCard(card.id, card.listId)
                      }}
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="epics" className="space-y-4 mt-6">
          {filteredEpics.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white/60" />
              </div>
              <p className="text-white text-lg font-medium mb-2">No archived epics found</p>
              <p className="text-white/70 text-sm">Epics you archive will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEpics.map((epic) => (
                <div key={epic.id} className="relative group">
                  <div className="opacity-75 hover:opacity-100 transition-opacity">
                    <BacklogEpic epic={epic} />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 w-7 p-0 bg-white shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRestoreEpic(epic.id)
                      }}
                      title="Restore Epic"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 w-7 p-0 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteEpic(epic.id)
                      }}
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
