import { requireAuth } from "@/lib/auth"
import { getUserProjects } from "@/lib/database"
import { ProjectsClient } from "@/components/projects-client"

export default async function ProjectsPage() {
  const user = await requireAuth()
  const projects = await getUserProjects(user.id)

  return <ProjectsClient user={user} initialProjects={projects} />
}
