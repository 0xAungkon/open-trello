"use client"

import { Calendar, MessageSquare, Paperclip, CheckSquare, AlertCircle, MoveRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProject, type Card } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

interface BacklogCardProps {
  card: Card
}

export function BacklogCard({ card }: BacklogCardProps) {
  const { state, dispatch } = useProject()

  const epic = card.epicId ? state.epics.find((e) => e.id === card.epicId) : null
  const completedChecklist = card.checklist.filter((item) => item.completed).length
  const totalChecklist = card.checklist.length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500 bg-red-50"
      case "high":
        return "border-l-orange-500 bg-orange-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-300 bg-gray-50"
    }
  }

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date()

  return (
    <div
      className={cn(
        "bg-white rounded-lg p-4 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-shadow",
        getPriorityColor(card.priority),
      )}
      onClick={() => dispatch({ type: "SELECT_CARD", card })}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {epic && (
            <div className="flex items-center mb-2">
              <div className={cn("w-2 h-2 rounded-full mr-2", epic.color)} />
              <span className="text-xs text-gray-600 font-medium">{epic.title}</span>
            </div>
          )}

          <h4 className="font-medium text-gray-900 mb-2">{card.title}</h4>

          {card.description && <p className="text-sm text-gray-600 mb-3">{card.description}</p>}

          {card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {card.labels.map((label) => (
                <Badge key={label.id} className={cn("text-xs text-white", label.color)}>
                  {label.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <Badge variant="outline" className="capitalize">
              {card.priority}
            </Badge>

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
        </div>

        <div className="flex items-center space-x-2 ml-4">
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
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="sm">
                <MoveRight className="w-4 h-4 mr-2" />
                Move to Board
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {state.lists.map((list) => (
                <DropdownMenuItem
                  key={list.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch({ type: "MOVE_FROM_BACKLOG", cardId: card.id, targetListId: list.id })
                  }}
                >
                  {list.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
