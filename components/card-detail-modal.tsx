"use client"

import { useState } from "react"
import {
  Calendar,
  Tag,
  Users,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Plus,
  Trash2,
  Flag,
  Archive,
  RotateCcw,
  X,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useProject } from "@/contexts/project-context"
import { cn } from "@/lib/utils"

export function CardDetailModal() {
  const { state, dispatch } = useProject()
  const [newComment, setNewComment] = useState("")
  const [newChecklistItem, setNewChecklistItem] = useState("")

  const card = state.selectedCard
  const isOpen = !!card

  if (!card) return null

  const epic = card.epicId ? state.epics.find((e) => e.id === card.epicId) : null

  const handleClose = () => {
    dispatch({ type: "SELECT_CARD", card: null })
  }

  const handleUpdateCard = (updates: Partial<typeof card>) => {
    dispatch({
      type: "UPDATE_CARD",
      card: { ...card, ...updates },
    })
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        author: state.members[0], // Current user
        createdAt: new Date().toISOString(),
      }
      handleUpdateCard({ comments: [...card.comments, comment] })
      setNewComment("")
    }
  }

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const item = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false,
      }
      handleUpdateCard({ checklist: [...card.checklist, item] })
      setNewChecklistItem("")
    }
  }

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedChecklist = card.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    )
    handleUpdateCard({ checklist: updatedChecklist })
  }

  const handleDeleteChecklistItem = (itemId: string) => {
    const updatedChecklist = card.checklist.filter((item) => item.id !== itemId)
    handleUpdateCard({ checklist: updatedChecklist })
  }

  const handleToggleMember = (memberId: string) => {
    const isMemberAssigned = card.members.some((m) => m.id === memberId)
    const member = state.members.find((m) => m.id === memberId)

    if (!member) return

    if (isMemberAssigned) {
      handleUpdateCard({ members: card.members.filter((m) => m.id !== memberId) })
    } else {
      handleUpdateCard({ members: [...card.members, member] })
    }
  }

  const handleToggleLabel = (labelId: string) => {
    const isLabelAssigned = card.labels.some((l) => l.id === labelId)
    const label = state.labels.find((l) => l.id === labelId)

    if (!label) return

    if (isLabelAssigned) {
      handleUpdateCard({ labels: card.labels.filter((l) => l.id !== labelId) })
    } else {
      handleUpdateCard({ labels: [...card.labels, label] })
    }
  }

  const completedItems = card.checklist.filter((item) => item.completed).length
  const totalItems = card.checklist.length
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto",
          state.settings?.darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white",
        )}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {epic && <div className={cn("w-3 h-3 rounded-full", epic.color)} />}
            <Input
              value={card.title}
              onChange={(e) => handleUpdateCard({ title: e.target.value })}
              className={cn(
                "text-lg font-semibold border-none p-0 h-auto focus:ring-0 focus:border-none cursor-text",
                state.settings?.darkMode ? "bg-transparent text-white" : "bg-transparent",
              )}
            />
            {card.archived && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Archived
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <Textarea
                placeholder="Add a more detailed description..."
                value={card.description}
                onChange={(e) => handleUpdateCard({ description: e.target.value })}
                rows={4}
                className={cn("cursor-text", state.settings?.darkMode ? "bg-gray-800 border-gray-600" : "")}
              />
            </div>

            {card.checklist.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Checklist
                  </h3>
                  <span className="text-sm text-gray-500">
                    {completedItems}/{totalItems} completed
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>

                <div className="space-y-2">
                  {card.checklist.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox checked={item.completed} onCheckedChange={() => handleToggleChecklistItem(item.id)} />
                      <span className={cn("flex-1", item.completed && "line-through text-gray-500")}>{item.text}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Input
                placeholder="Add checklist item..."
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddChecklistItem()}
                className={cn("cursor-text", state.settings?.darkMode ? "bg-gray-800 border-gray-600" : "")}
              />
              <Button onClick={handleAddChecklistItem} className="cursor-pointer">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Activity
              </h3>

              <div className="space-y-3 mb-4">
                {card.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={state.members[0].avatar || "/placeholder.svg"} />
                  <AvatarFallback>{state.members[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                    className={cn("cursor-text", state.settings?.darkMode ? "bg-gray-800 border-gray-600" : "")}
                  />
                  <Button onClick={handleAddComment} className="cursor-pointer">
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Members
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {card.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{member.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-4 h-4 p-0 cursor-pointer"
                      onClick={() => handleToggleMember(member.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Member
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("w-64", state.settings?.darkMode ? "bg-gray-800 border-gray-600" : "")}>
                  <div className="space-y-2">
                    <h4 className="font-medium">Team Members</h4>
                    {state.members.map((member) => (
                      <div
                        key={member.id}
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100",
                          state.settings?.darkMode ? "hover:bg-gray-700" : "",
                          card.members.some((m) => m.id === member.id) ? "bg-blue-50" : "",
                        )}
                        onClick={() => handleToggleMember(member.id)}
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                        {card.members.some((m) => m.id === member.id) && (
                          <CheckSquare className="w-4 h-4 text-blue-500 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Labels
              </h4>
              <div className="flex flex-wrap gap-1 mb-2">
                {card.labels.map((label) => (
                  <div key={label.id} className="flex items-center space-x-1">
                    <Badge className={cn("text-white", label.color)}>{label.name}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-4 h-4 p-0 cursor-pointer"
                      onClick={() => handleToggleLabel(label.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Label
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("w-64", state.settings?.darkMode ? "bg-gray-800 border-gray-600" : "")}>
                  <div className="space-y-2">
                    <h4 className="font-medium">Available Labels</h4>
                    {state.labels.map((label) => (
                      <div
                        key={label.id}
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100",
                          state.settings?.darkMode ? "hover:bg-gray-700" : "",
                          card.labels.some((l) => l.id === label.id) ? "bg-blue-50" : "",
                        )}
                        onClick={() => handleToggleLabel(label.id)}
                      >
                        <Badge className={cn("text-white", label.color)}>{label.name}</Badge>
                        {card.labels.some((l) => l.id === label.id) && (
                          <CheckSquare className="w-4 h-4 text-blue-500 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Due Date
              </h4>
              <Input
                type="date"
                value={card.dueDate || ""}
                onChange={(e) => handleUpdateCard({ dueDate: e.target.value })}
                className={cn("cursor-text", state.settings?.darkMode ? "bg-gray-800 border-gray-600" : "")}
              />
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Flag className="w-4 h-4 mr-2" />
                Priority
              </h4>
              <Select value={card.priority} onValueChange={(value: any) => handleUpdateCard({ priority: value })}>
                <SelectTrigger className={state.settings?.darkMode ? "bg-gray-800 border-gray-600" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={state.settings?.darkMode ? "bg-gray-800 border-gray-600" : ""}>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="font-medium mb-2">Epic</h4>
              <Select
                value={card.epicId || "none"}
                onValueChange={(value) => handleUpdateCard({ epicId: value === "none" ? undefined : value })}
              >
                <SelectTrigger className={state.settings?.darkMode ? "bg-gray-800 border-gray-600" : ""}>
                  <SelectValue placeholder="Select epic..." />
                </SelectTrigger>
                <SelectContent className={state.settings?.darkMode ? "bg-gray-800 border-gray-600" : ""}>
                  <SelectItem value="none">No Epic</SelectItem>
                  {state.epics
                    .filter((epic) => !epic.archived)
                    .map((epic) => (
                      <SelectItem key={epic.id} value={epic.id}>
                        <div className="flex items-center space-x-2">
                          <div className={cn("w-2 h-2 rounded-full", epic.color)} />
                          <span>{epic.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Paperclip className="w-4 h-4 mr-2" />
                Attachments
              </h4>
              <Button variant="outline" className="w-full bg-transparent cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add Attachment
              </Button>
            </div>

            <div className="pt-4 border-t space-y-2">
              {card.archived ? (
                <Button
                  variant="outline"
                  className="w-full bg-transparent cursor-pointer"
                  onClick={() => {
                    dispatch({ type: "RESTORE_CARD", cardId: card.id, targetListId: card.listId || "1" })
                    handleClose()
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restore Card
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full bg-transparent cursor-pointer"
                  onClick={() => {
                    dispatch({ type: "ARCHIVE_CARD", cardId: card.id, listId: card.listId })
                    handleClose()
                  }}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Card
                </Button>
              )}

              {/* Only show delete button for archived cards */}
              {card.archived && (
                <Button
                  variant="destructive"
                  className="w-full cursor-pointer"
                  onClick={() => {
                    dispatch({ type: "DELETE_CARD", cardId: card.id, listId: card.listId })
                    handleClose()
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Card
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
