"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface Card {
  id: string
  title: string
  description: string
  listId: string
  epicId?: string
  labels: Label[]
  members: Member[]
  dueDate?: string
  priority: "low" | "medium" | "high" | "urgent"
  checklist: ChecklistItem[]
  comments: Comment[]
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}

export interface List {
  id: string
  title: string
  cards: Card[]
  position: number
}

export interface Epic {
  id: string
  title: string
  description: string
  color: string
  startDate?: string
  endDate?: string
  progress: number
  cards: string[]
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Member {
  id: string
  name: string
  avatar: string
  email: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Comment {
  id: string
  text: string
  author: Member
  createdAt: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
}

interface ProjectState {
  lists: List[]
  epics: Epic[]
  labels: Label[]
  members: Member[]
  selectedCard: Card | null
  selectedEpic: Epic | null
  backlogCards: Card[]
}

type ProjectAction =
  | { type: "MOVE_CARD"; cardId: string; sourceListId: string; targetListId: string; targetIndex: number }
  | { type: "ADD_CARD"; listId: string; card: Omit<Card, "id" | "createdAt" | "updatedAt"> }
  | { type: "UPDATE_CARD"; card: Card }
  | { type: "DELETE_CARD"; cardId: string; listId: string }
  | { type: "ADD_LIST"; title: string }
  | { type: "UPDATE_LIST"; listId: string; title: string }
  | { type: "DELETE_LIST"; listId: string }
  | { type: "SELECT_CARD"; card: Card | null }
  | { type: "ADD_EPIC"; epic: Omit<Epic, "id"> }
  | { type: "UPDATE_EPIC"; epic: Epic }
  | { type: "DELETE_EPIC"; epicId: string }
  | { type: "SELECT_EPIC"; epic: Epic | null }
  | { type: "MOVE_TO_BACKLOG"; cardId: string; listId: string }
  | { type: "MOVE_FROM_BACKLOG"; cardId: string; targetListId: string }

const initialState: ProjectState = {
  lists: [
    {
      id: "1",
      title: "To Do",
      position: 0,
      cards: [
        {
          id: "1",
          title: "Design user authentication flow",
          description: "Create wireframes and mockups for the login and registration process",
          listId: "1",
          epicId: "1",
          labels: [{ id: "1", name: "Design", color: "bg-purple-500" }],
          members: [
            {
              id: "1",
              name: "Alice Johnson",
              avatar: "/placeholder.svg?height=32&width=32",
              email: "alice@example.com",
            },
          ],
          dueDate: "2024-01-15",
          priority: "high",
          checklist: [
            { id: "1", text: "Research best practices", completed: true },
            { id: "2", text: "Create wireframes", completed: false },
            { id: "3", text: "Design mockups", completed: false },
          ],
          comments: [],
          attachments: [],
          createdAt: "2024-01-01T10:00:00Z",
          updatedAt: "2024-01-01T10:00:00Z",
        },
      ],
    },
    {
      id: "2",
      title: "In Progress",
      position: 1,
      cards: [
        {
          id: "2",
          title: "Implement API endpoints",
          description: "Build REST API for user management and data operations",
          listId: "2",
          epicId: "1",
          labels: [{ id: "2", name: "Backend", color: "bg-green-500" }],
          members: [
            { id: "2", name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32", email: "bob@example.com" },
          ],
          dueDate: "2024-01-20",
          priority: "medium",
          checklist: [],
          comments: [
            {
              id: "1",
              text: "Started working on user endpoints",
              author: {
                id: "2",
                name: "Bob Smith",
                avatar: "/placeholder.svg?height=32&width=32",
                email: "bob@example.com",
              },
              createdAt: "2024-01-02T14:30:00Z",
            },
          ],
          attachments: [],
          createdAt: "2024-01-02T09:00:00Z",
          updatedAt: "2024-01-02T14:30:00Z",
        },
      ],
    },
    {
      id: "3",
      title: "Review",
      position: 2,
      cards: [],
    },
    {
      id: "4",
      title: "Done",
      position: 3,
      cards: [
        {
          id: "3",
          title: "Set up project structure",
          description: "Initialize the project with proper folder structure and dependencies",
          listId: "4",
          epicId: "1",
          labels: [{ id: "3", name: "Setup", color: "bg-blue-500" }],
          members: [
            {
              id: "1",
              name: "Alice Johnson",
              avatar: "/placeholder.svg?height=32&width=32",
              email: "alice@example.com",
            },
          ],
          priority: "medium",
          checklist: [
            { id: "4", text: "Initialize repository", completed: true },
            { id: "5", text: "Set up build tools", completed: true },
            { id: "6", text: "Configure linting", completed: true },
          ],
          comments: [],
          attachments: [],
          createdAt: "2023-12-28T08:00:00Z",
          updatedAt: "2023-12-30T17:00:00Z",
        },
      ],
    },
  ],
  epics: [
    {
      id: "1",
      title: "User Management System",
      description: "Complete user authentication and profile management functionality",
      color: "bg-indigo-500",
      startDate: "2024-01-01",
      endDate: "2024-02-15",
      progress: 33,
      cards: ["1", "2", "3"],
    },
    {
      id: "2",
      title: "Dashboard Analytics",
      description: "Build comprehensive analytics dashboard with charts and reports",
      color: "bg-emerald-500",
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      progress: 0,
      cards: [],
    },
  ],
  labels: [
    { id: "1", name: "Design", color: "bg-purple-500" },
    { id: "2", name: "Backend", color: "bg-green-500" },
    { id: "3", name: "Setup", color: "bg-blue-500" },
    { id: "4", name: "Frontend", color: "bg-orange-500" },
    { id: "5", name: "Bug", color: "bg-red-500" },
    { id: "6", name: "Feature", color: "bg-yellow-500" },
  ],
  members: [
    { id: "1", name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32", email: "alice@example.com" },
    { id: "2", name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32", email: "bob@example.com" },
    { id: "3", name: "Carol Davis", avatar: "/placeholder.svg?height=32&width=32", email: "carol@example.com" },
  ],
  selectedCard: null,
  selectedEpic: null,
  backlogCards: [
    {
      id: "4",
      title: "Mobile responsive design",
      description: "Ensure the application works well on mobile devices",
      listId: "",
      epicId: "1",
      labels: [
        { id: "1", name: "Design", color: "bg-purple-500" },
        { id: "4", name: "Frontend", color: "bg-orange-500" },
      ],
      members: [],
      priority: "low",
      checklist: [],
      comments: [],
      attachments: [],
      createdAt: "2024-01-03T12:00:00Z",
      updatedAt: "2024-01-03T12:00:00Z",
    },
  ],
}

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case "MOVE_CARD": {
      const { cardId, sourceListId, targetListId, targetIndex } = action

      // Find the card
      let card: Card | undefined
      const newLists = state.lists.map((list) => {
        if (list.id === sourceListId) {
          const cardIndex = list.cards.findIndex((c) => c.id === cardId)
          if (cardIndex !== -1) {
            card = list.cards[cardIndex]
            return {
              ...list,
              cards: list.cards.filter((c) => c.id !== cardId),
            }
          }
        }
        return list
      })

      if (!card) return state

      // Update card's listId and add to target list
      const updatedCard = { ...card, listId: targetListId }
      const finalLists = newLists.map((list) => {
        if (list.id === targetListId) {
          const newCards = [...list.cards]
          newCards.splice(targetIndex, 0, updatedCard)
          return { ...list, cards: newCards }
        }
        return list
      })

      return { ...state, lists: finalLists }
    }

    case "ADD_CARD": {
      const newCard: Card = {
        ...action.card,
        id: Date.now().toString(),
        priority: action.card.priority || "medium", // Ensure priority is never empty
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.listId ? { ...list, cards: [...list.cards, newCard] } : list,
        ),
      }
    }

    case "UPDATE_CARD": {
      const updatedCard = { ...action.card, updatedAt: new Date().toISOString() }

      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === updatedCard.listId
            ? {
                ...list,
                cards: list.cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
              }
            : list,
        ),
        backlogCards: state.backlogCards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
        selectedCard: state.selectedCard?.id === updatedCard.id ? updatedCard : state.selectedCard,
      }
    }

    case "DELETE_CARD": {
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.listId ? { ...list, cards: list.cards.filter((card) => card.id !== action.cardId) } : list,
        ),
        selectedCard: state.selectedCard?.id === action.cardId ? null : state.selectedCard,
      }
    }

    case "ADD_LIST": {
      const newList: List = {
        id: Date.now().toString(),
        title: action.title,
        cards: [],
        position: state.lists.length,
      }
      return { ...state, lists: [...state.lists, newList] }
    }

    case "UPDATE_LIST": {
      return {
        ...state,
        lists: state.lists.map((list) => (list.id === action.listId ? { ...list, title: action.title } : list)),
      }
    }

    case "DELETE_LIST": {
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.listId),
      }
    }

    case "SELECT_CARD": {
      return { ...state, selectedCard: action.card }
    }

    case "ADD_EPIC": {
      const newEpic: Epic = {
        ...action.epic,
        id: Date.now().toString(),
      }
      return { ...state, epics: [...state.epics, newEpic] }
    }

    case "UPDATE_EPIC": {
      return {
        ...state,
        epics: state.epics.map((epic) => (epic.id === action.epic.id ? action.epic : epic)),
        selectedEpic: state.selectedEpic?.id === action.epic.id ? action.epic : state.selectedEpic,
      }
    }

    case "DELETE_EPIC": {
      return {
        ...state,
        epics: state.epics.filter((epic) => epic.id !== action.epicId),
        selectedEpic: state.selectedEpic?.id === action.epicId ? null : state.selectedEpic,
      }
    }

    case "SELECT_EPIC": {
      return { ...state, selectedEpic: action.epic }
    }

    case "MOVE_TO_BACKLOG": {
      let card: Card | undefined
      const newLists = state.lists.map((list) => {
        if (list.id === action.listId) {
          const cardIndex = list.cards.findIndex((c) => c.id === action.cardId)
          if (cardIndex !== -1) {
            card = { ...list.cards[cardIndex], listId: "" }
            return {
              ...list,
              cards: list.cards.filter((c) => c.id !== action.cardId),
            }
          }
        }
        return list
      })

      if (!card) return state

      return {
        ...state,
        lists: newLists,
        backlogCards: [...state.backlogCards, card],
      }
    }

    case "MOVE_FROM_BACKLOG": {
      const card = state.backlogCards.find((c) => c.id === action.cardId)
      if (!card) return state

      const updatedCard = { ...card, listId: action.targetListId }

      return {
        ...state,
        backlogCards: state.backlogCards.filter((c) => c.id !== action.cardId),
        lists: state.lists.map((list) =>
          list.id === action.targetListId ? { ...list, cards: [...list.cards, updatedCard] } : list,
        ),
      }
    }

    default:
      return state
  }
}

const ProjectContext = createContext<{
  state: ProjectState
  dispatch: React.Dispatch<ProjectAction>
} | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  return <ProjectContext.Provider value={{ state, dispatch }}>{children}</ProjectContext.Provider>
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
