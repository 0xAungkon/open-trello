"use client"

import { useState } from "react"
import { Search, Plus, Filter, Users, Settings, Bell, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FilterModal, type FilterState } from "@/components/filter-modal"
import { useProject } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

export function Header() {
  const { state, dispatch } = useProject()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    labels: [],
    members: [],
    priority: [],
    dueDate: "all",
    status: [],
  })

  const handleOpenSettings = () => {
    dispatch({ type: "TOGGLE_SETTINGS", show: true })
  }

  const handleToggleDarkMode = () => {
    dispatch({
      type: "UPDATE_SETTINGS",
      settings: { darkMode: !state.settings.darkMode },
    })
  }

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters)
    // Implement filter logic here
    console.log("Applied filters:", filters)
  }

  const hasActiveFilters =
    activeFilters.labels.length > 0 ||
    activeFilters.members.length > 0 ||
    activeFilters.priority.length > 0 ||
    activeFilters.status.length > 0 ||
    activeFilters.dueDate !== "all"

  return (
    <>
      <header
        className={cn(
          "backdrop-blur-sm border-b px-4 md:px-6 py-4",
          state.settings.darkMode
            ? "bg-gray-900/95 border-gray-700 text-white"
            : "bg-white/95 border-gray-200 text-gray-900",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <h1 className="text-lg md:text-2xl font-bold">{state.settings.projectName}</h1>
            <Badge
              variant="secondary"
              className={cn(
                "hidden sm:inline-flex",
                state.settings.darkMode ? "bg-gray-700 text-gray-200" : "bg-blue-100 text-blue-800",
              )}
            >
              {state.lists.reduce((total, list) => total + list.cards.length, 0)} cards
            </Badge>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className={cn(
                  "pl-10 w-48 lg:w-64 cursor-text",
                  state.settings.darkMode ? "bg-gray-800 border-gray-600" : "",
                )}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className={cn(
                "hidden lg:flex cursor-pointer relative",
                state.settings.darkMode
                  ? "bg-gray-800 border-gray-600 hover:bg-gray-700"
                  : "bg-white/80 hover:bg-gray-50",
              )}
              onClick={() => setShowFilterModal(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {hasActiveFilters && <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-blue-500" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "hidden md:flex cursor-pointer",
                    state.settings.darkMode
                      ? "bg-gray-800 border-gray-600 hover:bg-gray-700"
                      : "bg-white/80 hover:bg-gray-50",
                  )}
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">Team</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={state.settings.darkMode ? "bg-gray-800 border-gray-600" : ""}>
                {state.members.map((member) => (
                  <DropdownMenuItem key={member.id} className="flex items-center space-x-2 cursor-pointer">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              className={cn(
                "hidden sm:flex cursor-pointer",
                state.settings.darkMode ? "bg-blue-600 hover:bg-blue-700" : "",
              )}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Invite</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={handleToggleDarkMode} className="cursor-pointer">
              {state.settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button variant="ghost" size="sm" className="cursor-pointer">
              <Bell className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={handleOpenSettings} className="cursor-pointer">
              <Settings className="w-4 h-4" />
            </Button>

            <Avatar className="cursor-pointer">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
      />
    </>
  )
}
