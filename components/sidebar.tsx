"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Archive,
  ChevronRight,
  Calendar,
  BarChart3,
  Settings,
  ArchiveIcon,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProject } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentView: "board" | "backlog" | "epics" | "archive"
  onViewChange: (view: "board" | "backlog" | "epics" | "archive") => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { state, dispatch } = useProject()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const activeEpics = state.epics.filter((epic) => !epic.archived)
  const archivedCount =
    state.epics.filter((epic) => epic.archived).length +
    [...state.lists.flatMap((list) => list.cards), ...state.backlogCards].filter((card) => card.archived).length

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300 flex-shrink-0 border-r",
        "hidden md:flex", // Hide on mobile, show on medium screens and up
        isCollapsed ? "w-16" : "w-64",
        state.settings.darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900",
      )}
    >
      <div className={cn("p-4 border-b", state.settings.darkMode ? "border-gray-700" : "border-gray-200")}>
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="font-semibold">Navigation</h2>}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="cursor-pointer">
            <ChevronRight className={cn("w-4 h-4 transition-transform", isCollapsed ? "rotate-0" : "rotate-180")} />
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={currentView === "board" ? "default" : "ghost"}
          className={cn(
            "w-full justify-start cursor-pointer",
            state.settings.darkMode && currentView !== "board" ? "hover:bg-gray-800 text-gray-200" : "",
          )}
          onClick={() => onViewChange("board")}
        >
          <LayoutDashboard className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Board</span>}
        </Button>

        <Button
          variant={currentView === "backlog" ? "default" : "ghost"}
          className={cn(
            "w-full justify-start cursor-pointer",
            state.settings.darkMode && currentView !== "backlog" ? "hover:bg-gray-800 text-gray-200" : "",
          )}
          onClick={() => onViewChange("backlog")}
        >
          <Archive className="w-4 h-4" />
          {!isCollapsed && (
            <>
              <span className="ml-2">Backlog</span>
              <Badge variant="secondary" className="ml-auto">
                {state.backlogCards.filter((card) => !card.archived).length}
              </Badge>
            </>
          )}
        </Button>

        <Button
          variant={currentView === "epics" ? "default" : "ghost"}
          className={cn(
            "w-full justify-start cursor-pointer",
            state.settings.darkMode && currentView !== "epics" ? "hover:bg-gray-800 text-gray-200" : "",
          )}
          onClick={() => onViewChange("epics")}
        >
          <Target className="w-4 h-4" />
          {!isCollapsed && (
            <>
              <span className="ml-2">Epics</span>
              <Badge variant="secondary" className="ml-auto">
                {activeEpics.length}
              </Badge>
            </>
          )}
        </Button>

        <Button
          variant={currentView === "archive" ? "default" : "ghost"}
          className={cn(
            "w-full justify-start cursor-pointer",
            state.settings.darkMode && currentView !== "archive" ? "hover:bg-gray-800 text-gray-200" : "",
          )}
          onClick={() => onViewChange("archive")}
        >
          <ArchiveIcon className="w-4 h-4" />
          {!isCollapsed && (
            <>
              <span className="ml-2">Archive</span>
              <Badge variant="secondary" className="ml-auto">
                {archivedCount}
              </Badge>
            </>
          )}
        </Button>

        {!isCollapsed && (
          <div className="pt-4 space-y-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start cursor-pointer",
                state.settings.darkMode ? "hover:bg-gray-800 text-gray-200" : "",
              )}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start cursor-pointer",
                state.settings.darkMode ? "hover:bg-gray-800 text-gray-200" : "",
              )}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start cursor-pointer",
                state.settings.darkMode ? "hover:bg-gray-800 text-gray-200" : "",
              )}
              onClick={() => dispatch({ type: "TOGGLE_SETTINGS", show: true })}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </nav>
    </div>
  )
}
