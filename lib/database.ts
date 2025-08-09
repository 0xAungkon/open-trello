import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export interface Project {
  id: string
  name: string
  description?: string
  background_image?: string
  background_type?: string
  dark_mode?: boolean
  owner_id: string
  created_at: string
  updated_at: string
  role?: string // User's role in the project
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: string
  user_name: string
  user_email: string
  user_avatar?: string
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    const projects = await sql`
      SELECT 
        p.*,
        CASE 
          WHEN p.owner_id = ${userId} THEN 'owner'
          ELSE pm.role
        END as role
      FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${userId}
      WHERE p.owner_id = ${userId} OR pm.user_id = ${userId}
      ORDER BY p.updated_at DESC
    `
    return projects
  } catch (error) {
    console.error("Error fetching user projects:", error)
    return []
  }
}

export async function createProject(data: {
  name: string
  description?: string
  owner_id: string
}): Promise<Project | null> {
  try {
    const projects = await sql`
      INSERT INTO projects (name, description, owner_id)
      VALUES (${data.name}, ${data.description || ""}, ${data.owner_id})
      RETURNING *
    `
    return projects[0] || null
  } catch (error) {
    console.error("Error creating project:", error)
    return null
  }
}

export async function getProject(projectId: string, userId: string): Promise<Project | null> {
  try {
    const projects = await sql`
      SELECT 
        p.*,
        CASE 
          WHEN p.owner_id = ${userId} THEN 'owner'
          ELSE pm.role
        END as role
      FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${userId}
      WHERE p.id = ${projectId} 
      AND (p.owner_id = ${userId} OR pm.user_id = ${userId})
    `
    return projects[0] || null
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export async function updateProject(projectId: string, userId: string, data: Partial<Project>): Promise<boolean> {
  try {
    // Check if user has permission to update
    const project = await getProject(projectId, userId)
    if (!project || (project.role !== "owner" && project.role !== "admin")) {
      return false
    }

    await sql`
      UPDATE projects 
      SET 
        name = COALESCE(${data.name}, name),
        description = COALESCE(${data.description}, description),
        background_image = COALESCE(${data.background_image}, background_image),
        background_type = COALESCE(${data.background_type}, background_type),
        dark_mode = COALESCE(${data.dark_mode}, dark_mode),
        updated_at = NOW()
      WHERE id = ${projectId}
    `
    return true
  } catch (error) {
    console.error("Error updating project:", error)
    return false
  }
}

export async function deleteProject(projectId: string, userId: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM projects 
      WHERE id = ${projectId} AND owner_id = ${userId}
    `
    return result.length > 0
  } catch (error) {
    console.error("Error deleting project:", error)
    return false
  }
}

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  try {
    const members = await sql`
      SELECT 
        pm.*,
        u.name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ${projectId}
      ORDER BY pm.role, u.name
    `
    return members
  } catch (error) {
    console.error("Error fetching project members:", error)
    return []
  }
}

export async function addProjectMember(projectId: string, userEmail: string, role = "member"): Promise<boolean> {
  try {
    // First find the user by email
    const users = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `

    if (users.length === 0) {
      return false
    }

    const userId = users[0].id

    // Add the member
    await sql`
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (${projectId}, ${userId}, ${role})
      ON CONFLICT (project_id, user_id) 
      DO UPDATE SET role = ${role}
    `
    return true
  } catch (error) {
    console.error("Error adding project member:", error)
    return false
  }
}

export async function removeProjectMember(projectId: string, userId: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM project_members 
      WHERE project_id = ${projectId} AND user_id = ${userId}
    `
    return true
  } catch (error) {
    console.error("Error removing project member:", error)
    return false
  }
}
