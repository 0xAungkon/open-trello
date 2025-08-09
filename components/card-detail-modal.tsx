"use client"

import { useState } from "react"
import { Calendar, Tag, Users, MessageSquare, Paperclip, CheckSquare, Plus, Trash2, Flag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  const completedItems = card.checklist.filter((item) => item.completed).length
  const totalItems = card.checklist.length
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {epic && <div className={cn("w-3 h-3 rounded-full", epic.color)} />}
            <Input
              value={card.title}
              onChange={(e) => handleUpdateCard({ title: e.target.value })}
              className="text-lg font-semibold border-none p-0 h-auto"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <Textarea
                placeholder="Add a more detailed description..."
                value={card.description}
                onChange={(e) => handleUpdateCard({ description: e.target.value })}
                rows={4}
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
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteChecklistItem(item.id)}>
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
              />
              <Button onClick={handleAddChecklistItem}>
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
                  />
                  <Button onClick={handleAddComment}>Comment</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Members
              </h4>
              <div className="flex flex-wrap gap-2">
                {card.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{member.name}</span>
                  </div>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Labels
              </h4>
              <div className="flex flex-wrap gap-1">
                {card.labels.map((label) => (
                  <Badge key={label.id} className={cn("text-xs text-white", label.color)}>
                    {label.name}
                  </Badge>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
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
              />
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Flag className="w-4 h-4 mr-2" />
                Priority
              </h4>
              <Select value={card.priority} onValueChange={(value: any) => handleUpdateCard({ priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                <SelectTrigger>
                  <SelectValue placeholder="Select epic..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Epic</SelectItem>
                  {state.epics.map((epic) => (
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
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Attachment
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  dispatch({ type: "DELETE_CARD", cardId: card.id, listId: card.listId })
                  handleClose()
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Card
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
