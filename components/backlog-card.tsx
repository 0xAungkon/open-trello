"use client"

import { Calendar, MessageSquare, Paperclip, CheckSquare, AlertCircle, MoveRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProject, type Card as CardType } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

interface BacklogCardProps {
  card: CardType
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
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow border-l-4 h-full",
        getPriorityColor(card.priority),
        state.settings?.darkMode && "bg-gray-800 text-white border-gray-600",
      )}
      onClick={() => dispatch({ type: "SELECT_CARD", card })}
    >
      <CardHeader className="pb-3">
        {epic && (
          <div className="flex items-center mb-2">
            <div className={cn("w-2 h-2 rounded-full mr-2", epic.color)} />
            <span className="text-xs text-gray-600 font-medium">{epic.title}</span>
          </div>
        )}
        <CardTitle className="text-base line-clamp-2">{card.title}</CardTitle>
        {card.description && <p className="text-sm text-gray-600 line-clamp-2">{card.description}</p>}
      </CardHeader>

      <CardContent className="pt-0">
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.labels.slice(0, 3).map((label) => (
              <Badge key={label.id} className={cn("text-xs text-white", label.color)}>
                {label.name}
              </Badge>
            ))}
            {card.labels.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{card.labels.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <Badge variant="outline" className="capitalize text-xs">
              {card.priority}
            </Badge>

            {card.dueDate && (
              <div className={cn("flex items-center space-x-1", isOverdue ? "text-red-600" : "text-gray-500")}>
                <Calendar className="w-3 h-3" />
                <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                {isOverdue && <AlertCircle className="w-3 h-3" />}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
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

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {card.members.slice(0, 2).map((member) => (
                <Avatar key={member.id} className="w-5 h-5">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {card.members.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{card.members.length - 2}
                </Badge>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                  <MoveRight className="w-3 h-3" />
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
                    Move to {list.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
