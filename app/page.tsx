"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Board } from "@/components/board"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CardDetailModal } from "@/components/card-detail-modal"
import { EpicModal } from "@/components/epic-modal"
import { BacklogView } from "@/components/backlog-view"
import { ArchiveView } from "@/components/archive-view"
import { EpicsView } from "@/components/epics-view"
import { SettingsModal } from "@/components/settings-modal"
import { ProjectProvider, useProject } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

function AppContent() {
  const { state, dispatch } = useProject()
  const [currentView, setCurrentView] = useState<"board" | "backlog" | "epics" | "archive">("board")

  const handleCloseSettings = () => {
    dispatch({ type: "TOGGLE_SETTINGS", show: false })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={cn("flex h-screen overflow-hidden relative", state.settings.darkMode ? "dark" : "")}
        style={{
          backgroundImage: `url(${state.settings.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background overlay */}
        <div
          className={cn(
            "absolute inset-0 backdrop-blur-[1px]",
            state.settings.darkMode ? "bg-black/40" : "bg-black/20",
          )}
        />

        <div className="relative z-10 flex w-full">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 overflow-hidden">
              {currentView === "board" && <Board />}
              {currentView === "backlog" && <BacklogView />}
              {currentView === "epics" && <EpicsView />}
              {currentView === "archive" && <ArchiveView />}
            </main>
          </div>
        </div>
        <CardDetailModal />
        <EpicModal />
        <SettingsModal isOpen={state.showSettings} onClose={handleCloseSettings} />
      </div>
    </DndProvider>
  )
}

export default function Home() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  )
}
