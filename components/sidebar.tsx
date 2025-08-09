"use client"

import { useState } from "react"
import { LayoutDashboard, Archive, Plus, ChevronRight, Calendar, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProject } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentView: "board" | "backlog"
  onViewChange: (view: "board" | "backlog") => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { state, dispatch } = useProject()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="font-semibold text-gray-900">Navigation</h2>}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
            <ChevronRight className={cn("w-4 h-4 transition-transform", isCollapsed ? "rotate-0" : "rotate-180")} />
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={currentView === "board" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("board")}
        >
          <LayoutDashboard className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Board</span>}
        </Button>

        <Button
          variant={currentView === "backlog" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("backlog")}
        >
          <Archive className="w-4 h-4" />
          {!isCollapsed && (
            <>
              <span className="ml-2">Backlog</span>
              <Badge variant="secondary" className="ml-auto">
                {state.backlogCards.length}
              </Badge>
            </>
          )}
        </Button>

        {!isCollapsed && (
          <>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Epics</h3>
                <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "SELECT_EPIC", epic: null })}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {state.epics.map((epic) => (
                  <Button
                    key={epic.id}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => dispatch({ type: "SELECT_EPIC", epic })}
                  >
                    <div className={cn("w-3 h-3 rounded-full mr-2", epic.color)} />
                    <span className="truncate">{epic.title}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {epic.progress}%
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </>
        )}
      </nav>
    </div>
  )
}
