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
import { ProjectProvider } from "@/contexts/project-context"
import type { User } from "@/lib/auth"
import type { Project } from "@/lib/database"

interface ProjectBoardProps {
  project: Project
  user: User
}

function ProjectBoardContent() {
  const [currentView, setCurrentView] = useState<"board" | "backlog" | "epics" | "archive">("board")

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen overflow-hidden relative">
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
        <SettingsModal isOpen={false} onClose={() => {}} />
      </div>
    </DndProvider>
  )
}

export function ProjectBoard({ project, user }: ProjectBoardProps) {
  return (
    <ProjectProvider project={project} user={user}>
      <ProjectBoardContent />
    </ProjectProvider>
  )
}
