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
import { ProjectProvider } from "@/contexts/project-context"

export default function Home() {
  const [currentView, setCurrentView] = useState<"board" | "backlog">("board")

  return (
    <ProjectProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 overflow-hidden">{currentView === "board" ? <Board /> : <BacklogView />}</main>
          </div>
          <CardDetailModal />
          <EpicModal />
        </div>
      </DndProvider>
    </ProjectProvider>
  )
}
