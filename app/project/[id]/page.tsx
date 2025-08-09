import { requireAuth } from "@/lib/auth"
import { getProject } from "@/lib/database"
import { redirect } from "next/navigation"
import { ProjectBoard } from "@/components/project-board"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const user = await requireAuth()
  const project = await getProject(params.id, user.id)

  if (!project) {
    redirect("/projects")
  }

  return <ProjectBoard project={project} user={user} />
}
