"use client"

import { useState } from "react"
import { useDrop } from "react-dnd"
import { MoreHorizontal, Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BoardCard } from "@/components/board-card"
import { useProject, type List } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

interface BoardListProps {
  list: List
}

export function BoardList({ list }: BoardListProps) {
  const { state, dispatch } = useProject()
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(list.title)

  const [{ isOver }, drop] = useDrop({
    accept: "card",
    drop: (item: { id: string; listId: string }, monitor) => {
      if (!monitor.didDrop()) {
        dispatch({
          type: "MOVE_CARD",
          cardId: item.id,
          sourceListId: item.listId,
          targetListId: list.id,
          targetIndex: list.cards.length,
        })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  })

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      dispatch({
        type: "ADD_CARD",
        listId: list.id,
        card: {
          title: newCardTitle.trim(),
          description: "",
          listId: list.id,
          labels: [],
          members: [],
          priority: "medium",
          checklist: [],
          comments: [],
          attachments: [],
        },
      })
      setNewCardTitle("")
      setIsAddingCard(false)
    }
  }

  const handleUpdateTitle = () => {
    if (editTitle.trim() && editTitle !== list.title) {
      dispatch({ type: "UPDATE_LIST", listId: list.id, title: editTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleDeleteList = () => {
    dispatch({ type: "DELETE_LIST", listId: list.id })
  }

  return (
    <div
      ref={drop}
      className={cn(
        "flex-shrink-0 w-64 md:w-72 rounded-lg p-3 md:p-4 h-fit max-h-full overflow-y-auto",
        isOver ? "border-2 border-blue-300" : "",
        state.settings?.darkMode
          ? "bg-gray-800/95 text-white border border-gray-600"
          : "bg-gray-50 border border-gray-200",
      )}
    >
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyPress={(e) => e.key === "Enter" && handleUpdateTitle()}
            className={cn(
              "text-sm font-semibold cursor-text",
              state.settings?.darkMode ? "bg-gray-700 border-gray-600" : "",
            )}
            autoFocus
          />
        ) : (
          <div className="flex items-center space-x-2">
            <h3 className={cn("font-semibold", state.settings?.darkMode ? "text-white" : "text-gray-900")}>
              {list.title}
            </h3>
            <Badge variant="secondary">{list.cards.length}</Badge>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={state.settings?.darkMode ? "bg-gray-800 border-gray-600" : ""}>
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)} className="cursor-pointer">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Title
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteList} className="text-red-600 cursor-pointer">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 mb-4">
        {list.cards
          .filter((card) => !card.archived)
          .map((card, index) => (
            <BoardCard key={card.id} card={card} index={index} />
          ))}
      </div>

      {isAddingCard ? (
        <div className="space-y-2">
          <Input
            placeholder="Enter a title for this card..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddCard()}
            className={cn("cursor-text", state.settings?.darkMode ? "bg-gray-700 border-gray-600" : "")}
            autoFocus
          />
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleAddCard} className="cursor-pointer">
              Add Card
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAddingCard(false)
                setNewCardTitle("")
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start cursor-pointer",
            state.settings?.darkMode
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100",
          )}
          onClick={() => setIsAddingCard(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a card
        </Button>
      )}
    </div>
  )
}
