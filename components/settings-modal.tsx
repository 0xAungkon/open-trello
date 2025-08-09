"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Settings, Plus, Trash2, Upload, Moon, Sun } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useProject } from "@/contexts/project-context"
import { cn } from "@/lib/utils"
import { ColorPicker } from "@/components/color-picker"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { state, dispatch } = useProject()
  const [projectName, setProjectName] = useState(state.settings.projectName)
  const [backgroundUrl, setBackgroundUrl] = useState(state.settings.backgroundImage)
  const [isDarkMode, setIsDarkMode] = useState(state.settings.darkMode || false)
  const [newListTitle, setNewListTitle] = useState("")
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState("bg-blue-500")
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update local state when settings change
  useEffect(() => {
    setProjectName(state.settings.projectName)
    setBackgroundUrl(state.settings.backgroundImage)
    setIsDarkMode(state.settings.darkMode || false)
  }, [state.settings])

  const handleSaveSettings = () => {
    dispatch({
      type: "UPDATE_SETTINGS",
      settings: {
        projectName,
        backgroundImage: backgroundUrl,
        backgroundType: "url",
        darkMode: isDarkMode,
      },
    })
  }

  const handleToggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked)
    dispatch({
      type: "UPDATE_SETTINGS",
      settings: { darkMode: checked },
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setBackgroundUrl(result)
        dispatch({
          type: "UPDATE_SETTINGS",
          settings: {
            backgroundImage: result,
            backgroundType: "upload",
          },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddList = () => {
    if (newListTitle.trim()) {
      dispatch({ type: "ADD_LIST", title: newListTitle.trim() })
      setNewListTitle("")
    }
  }

  const handleDeleteList = (listId: string) => {
    dispatch({ type: "DELETE_LIST", listId })
  }

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      dispatch({
        type: "ADD_LABEL",
        label: { name: newLabelName.trim(), color: newLabelColor },
      })
      setNewLabelName("")
    }
  }

  const handleDeleteLabel = (labelId: string) => {
    dispatch({ type: "DELETE_LABEL", labelId })
  }

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberEmail.trim()) {
      dispatch({
        type: "ADD_MEMBER",
        member: {
          name: newMemberName.trim(),
          email: newMemberEmail.trim(),
          avatar: "/placeholder.svg?height=32&width=32",
        },
      })
      setNewMemberName("")
      setNewMemberEmail("")
    }
  }

  const handleDeleteMember = (memberId: string) => {
    dispatch({ type: "DELETE_MEMBER", memberId })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-4xl max-h-[90vh] overflow-y-auto",
          isDarkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-900",
        )}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Project Settings</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className={cn("grid w-full grid-cols-4", isDarkMode ? "bg-gray-800" : "bg-gray-100")}>
            <TabsTrigger
              value="general"
              className={cn(
                "cursor-pointer",
                isDarkMode ? "text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700" : "",
              )}
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="lists"
              className={cn(
                "cursor-pointer",
                isDarkMode ? "text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700" : "",
              )}
            >
              Board Lists
            </TabsTrigger>
            <TabsTrigger
              value="labels"
              className={cn(
                "cursor-pointer",
                isDarkMode ? "text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700" : "",
              )}
            >
              Labels
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className={cn(
                "cursor-pointer",
                isDarkMode ? "text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700" : "",
              )}
            >
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName" className="mb-2 block">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className={cn("cursor-text", isDarkMode ? "bg-gray-800 border-gray-600" : "")}
                />
              </div>

              <div>
                <Label htmlFor="backgroundUrl" className="mb-2 block">
                  Background Image
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="backgroundUrl"
                    value={backgroundUrl}
                    onChange={(e) => setBackgroundUrl(e.target.value)}
                    placeholder="Enter image URL..."
                    className={cn("cursor-text", isDarkMode ? "bg-gray-800 border-gray-600" : "")}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">Toggle between light and dark theme</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch checked={isDarkMode} onCheckedChange={handleToggleDarkMode} />
                  <Moon className="h-4 w-4" />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveSettings} className="cursor-pointer">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={onClose} className="cursor-pointer bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lists" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="New list title..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddList()}
                  className={cn("cursor-text", isDarkMode ? "bg-gray-800 border-gray-600" : "")}
                />
                <Button onClick={handleAddList} className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Add List
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Current Lists</h4>
                {state.lists.map((list) => (
                  <div
                    key={list.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      isDarkMode ? "bg-gray-800" : "bg-gray-50",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{list.title}</span>
                      <Badge variant="secondary">{list.cards.length} cards</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteList(list.id)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="labels" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Label name..."
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className={cn("cursor-text", isDarkMode ? "bg-gray-800 border-gray-600" : "")}
                />
                <ColorPicker value={newLabelColor} onChange={setNewLabelColor} className="flex-shrink-0" />
                <Button onClick={handleAddLabel} className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Current Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {state.labels.map((label) => (
                    <div key={label.id} className="flex items-center space-x-1">
                      <Badge className={cn("text-white", label.color)}>{label.name}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 cursor-pointer"
                        onClick={() => handleDeleteLabel(label.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Member name..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className={cn("cursor-text", isDarkMode ? "bg-gray-800 border-gray-600" : "")}
                />
                <Input
                  placeholder="Email..."
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className={cn("cursor-text", isDarkMode ? "bg-gray-800 border-gray-600" : "")}
                />
                <Button onClick={handleAddMember} className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Team Members</h4>
                {state.members.map((member) => (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      isDarkMode ? "bg-gray-800" : "bg-gray-50",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMember(member.id)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
