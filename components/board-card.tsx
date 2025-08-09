"use client"

import { useDrag, useDrop } from "react-dnd"
import { Calendar, MessageSquare, Paperclip, CheckSquare, AlertCircle, Archive } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProject, type Card } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

interface BoardCardProps {
  card: Card
  index: number
}

export function BoardCard({ card, index }: BoardCardProps) {
  const { state, dispatch } = useProject()

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: { id: card.id, listId: card.listId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
    accept: "card",
    hover: (item: { id: string; listId: string; index: number }) => {
      if (item.id !== card.id) {
        dispatch({
          type: "MOVE_CARD",
          cardId: item.id,
          sourceListId: item.listId,
          targetListId: card.listId,
          targetIndex: index,
        })
        item.index = index
        item.listId = card.listId
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const epic = card.epicId ? state.epics.find((e) => e.id === card.epicId) : null
  const completedChecklist = card.checklist.filter((item) => item.completed).length
  const totalChecklist = card.checklist.length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500"
      case "high":
        return "border-l-orange-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date()

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={cn(
        "bg-white rounded-lg p-3 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-shadow",
        getPriorityColor(card.priority),
        isDragging && "opacity-50",
        isOver && "transform scale-105",
      )}
      onClick={() => dispatch({ type: "SELECT_CARD", card })}
    >
      {epic && (
        <div className="flex items-center mb-2">
          <div className={cn("w-2 h-2 rounded-full mr-2", epic.color)} />
          <span className="text-xs text-gray-600 font-medium">{epic.title}</span>
        </div>
      )}

      <h4 className="font-medium text-gray-900 mb-2">{card.title}</h4>

      {card.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>}

      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.labels.map((label) => (
            <Badge key={label.id} className={cn("text-xs text-white", label.color)}>
              {label.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {card.dueDate && (
            <div className={cn("flex items-center space-x-1", isOverdue ? "text-red-600" : "text-gray-500")}>
              <Calendar className="w-3 h-3" />
              <span>{new Date(card.dueDate).toLocaleDateString()}</span>
              {isOverdue && <AlertCircle className="w-3 h-3" />}
            </div>
          )}

          {totalChecklist > 0 && (
            <div className="flex items-center space-x-1">
              <CheckSquare className="w-3 h-3" />
              <span>
                {completedChecklist}/{totalChecklist}
              </span>
            </div>
          )}

          {card.comments.length > 0 && (
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>{card.comments.length}</span>
            </div>
          )}

          {card.attachments.length > 0 && (
            <div className="flex items-center space-x-1">
              <Paperclip className="w-3 h-3" />
              <span>{card.attachments.length}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {card.members.slice(0, 3).map((member) => (
            <Avatar key={member.id} className="w-6 h-6">
              <AvatarImage src={member.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {card.members.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{card.members.length - 3}
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                <Archive className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch({ type: "MOVE_TO_BACKLOG", cardId: card.id, listId: card.listId })
                }}
              >
                Move to Backlog
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
