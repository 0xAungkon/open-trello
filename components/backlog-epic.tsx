"use client"

import { Calendar, BarChart3, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useProject, type Epic } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

interface BacklogEpicProps {
  epic: Epic
}

export function BacklogEpic({ epic }: BacklogEpicProps) {
  const { state, dispatch } = useProject()

  const epicCards = state.lists.flatMap((list) => list.cards.filter((card) => card.epicId === epic.id))
  const completedCards = epicCards.filter((card) => card.listId === "4").length

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow h-full",
        epic.progress === 100 && "opacity-75 bg-green-50",
      )}
      onClick={() => dispatch({ type: "SELECT_EPIC", epic })}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn("w-3 h-3 rounded-full", epic.color)} />
            <CardTitle className="text-base line-clamp-1">{epic.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              dispatch({ type: "SELECT_EPIC", epic })
            }}
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
        {epic.description && <p className="text-sm text-gray-600 line-clamp-2 mt-2">{epic.description}</p>}
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center">
              <BarChart3 className="w-3 h-3 mr-1" />
              Progress
            </span>
            <Badge variant={epic.progress === 100 ? "default" : "secondary"} className="text-xs">
              {epic.progress}%
            </Badge>
          </div>
          <Progress value={epic.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span>{epicCards.length} cards</span>
            <span>{completedCards} completed</span>
          </div>
        </div>

        {(epic.startDate || epic.endDate) && (
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>
              {epic.startDate && epic.endDate
                ? `${new Date(epic.startDate).toLocaleDateString()} - ${new Date(epic.endDate).toLocaleDateString()}`
                : epic.startDate
                  ? `From ${new Date(epic.startDate).toLocaleDateString()}`
                  : epic.endDate
                    ? `Until ${new Date(epic.endDate).toLocaleDateString()}`
                    : "No dates set"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
