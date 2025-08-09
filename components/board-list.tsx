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

interface BoardListProps {
  list: List
}

export function BoardList({ list }: BoardListProps) {
  const { dispatch } = useProject()
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
      className={`flex-shrink-0 w-72 bg-gray-50 rounded-lg p-4 ${isOver ? "bg-blue-50 border-2 border-blue-300" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyPress={(e) => e.key === "Enter" && handleUpdateTitle()}
            className="text-sm font-semibold"
            autoFocus
          />
        ) : (
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{list.title}</h3>
            <Badge variant="secondary">{list.cards.length}</Badge>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Title
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteList} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 mb-4">
        {list.cards.map((card, index) => (
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
            autoFocus
          />
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleAddCard}>
              Add Card
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAddingCard(false)
                setNewCardTitle("")
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="ghost" className="w-full justify-start text-gray-600" onClick={() => setIsAddingCard(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add a card
        </Button>
      )}
    </div>
  )
}
