"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BoardList } from "@/components/board-list"
import { useProject } from "@/contexts/project-context"

export function Board() {
  const { state, dispatch } = useProject()
  const [newListTitle, setNewListTitle] = useState("")
  const [isAddingList, setIsAddingList] = useState(false)

  const handleAddList = () => {
    if (newListTitle.trim()) {
      dispatch({ type: "ADD_LIST", title: newListTitle.trim() })
      setNewListTitle("")
      setIsAddingList(false)
    }
  }

  return (
    <div className="flex-1 p-3 md:p-6 overflow-hidden">
      <div className="flex space-x-3 md:space-x-6 h-full overflow-x-auto overflow-y-hidden scrollbar-hide pb-4">
        {state.lists.map((list) => (
          <BoardList key={list.id} list={list} />
        ))}

        <div className="flex-shrink-0 w-64 md:w-72">
          {isAddingList ? (
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <Input
                placeholder="Enter list title..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddList()}
                className="mb-2"
                autoFocus
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddList}>
                  Add List
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAddingList(false)
                    setNewListTitle("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400"
              onClick={() => setIsAddingList(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add another list
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
