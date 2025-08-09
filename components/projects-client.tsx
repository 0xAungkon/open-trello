"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Settings, Users, Calendar, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User } from "@/lib/auth"
import type { Project } from "@/lib/database"

interface ProjectsClientProps {
  user: User
  initialProjects: Project[]
}

export function ProjectsClient({ user, initialProjects }: ProjectsClientProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setProjects([data.project, ...projects])
        setIsCreateModalOpen(false)
        setNewProjectName("")
        setNewProjectDescription("")
      } else {
        setError(data.error || "Failed to create project")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== projectId))
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600">Manage and organize your work</p>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">
              {projects.length} projects
            </Badge>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    required
                    className="cursor-text"
                  />
                </div>
                <div>
                  <Label htmlFor="projectDescription">Description (Optional)</Label>
                  <Textarea
                    id="projectDescription"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe your project"
                    className="cursor-text"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="cursor-pointer">
                    {isLoading ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Create your first project to get started</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                      <Badge variant={project.role === "owner" ? "default" : "secondary"} className="text-xs">
                        {project.role}
                      </Badge>
                    </div>
                    {project.role === "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteProject(project.id)
                            }}
                            className="text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  {project.description && (
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Team</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Settings className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
