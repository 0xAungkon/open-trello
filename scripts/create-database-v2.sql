-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS checklist_items CASCADE;
DROP TABLE IF EXISTS card_members CASCADE;
DROP TABLE IF EXISTS card_labels CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS labels CASCADE;
DROP TABLE IF EXISTS epics CASCADE;
DROP TABLE IF EXISTS lists CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  background_image TEXT DEFAULT '/images/mountain-background.jpg',
  background_type VARCHAR(50) DEFAULT 'url',
  dark_mode BOOLEAN DEFAULT false,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_members table (for sharing projects)
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create lists table
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create epics table
CREATE TABLE epics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  color VARCHAR(50) NOT NULL DEFAULT 'bg-indigo-500',
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create labels table
CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50) NOT NULL DEFAULT 'bg-blue-500',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  list_id UUID REFERENCES lists(id) ON DELETE SET NULL,
  epic_id UUID REFERENCES epics(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  due_date DATE,
  priority VARCHAR(50) DEFAULT 'medium',
  archived BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create card_labels table (many-to-many)
CREATE TABLE card_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(card_id, label_id)
);

-- Create card_members table (many-to-many)
CREATE TABLE card_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(card_id, user_id)
);

-- Create checklist_items table
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attachments table
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(100),
  size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_lists_project_id ON lists(project_id);
CREATE INDEX idx_cards_project_id ON cards(project_id);
CREATE INDEX idx_cards_list_id ON cards(list_id);
CREATE INDEX idx_cards_epic_id ON cards(epic_id);
CREATE INDEX idx_epics_project_id ON epics(project_id);
CREATE INDEX idx_labels_project_id ON labels(project_id);
CREATE INDEX idx_checklist_items_card_id ON checklist_items(card_id);
CREATE INDEX idx_comments_card_id ON comments(card_id);
CREATE INDEX idx_attachments_card_id ON attachments(card_id);

-- Insert sample data for testing
INSERT INTO users (id, name, email, password_hash) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Demo User', 'demo@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm'); -- password: demo123

INSERT INTO projects (id, name, description, owner_id) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Demo Project', 'A sample project to get you started', '550e8400-e29b-41d4-a716-446655440000');

INSERT INTO lists (id, project_id, title, position) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'To Do', 0),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'In Progress', 1),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Review', 2),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Done', 3);

INSERT INTO labels (id, project_id, name, color) VALUES 
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Design', 'bg-purple-500'),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'Backend', 'bg-green-500'),
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', 'Frontend', 'bg-orange-500'),
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', 'Bug', 'bg-red-500');

INSERT INTO epics (id, project_id, title, description, color, progress) VALUES 
('550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440001', 'User Authentication', 'Complete user authentication system', 'bg-indigo-500', 25),
('550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440001', 'Dashboard Features', 'Build main dashboard functionality', 'bg-emerald-500', 0);

INSERT INTO cards (id, project_id, list_id, epic_id, title, description, priority) VALUES 
('550e8400-e29b-41d4-a716-44665544000c', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-44665544000a', 'Design login page', 'Create wireframes and mockups for the login page', 'high'),
('550e8400-e29b-41d4-a716-44665544000d', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-44665544000a', 'Implement authentication API', 'Build REST API endpoints for user authentication', 'medium'),
('550e8400-e29b-41d4-a716-44665544000e', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-44665544000a', 'Set up database schema', 'Create user tables and relationships', 'medium');

-- Link cards to labels
INSERT INTO card_labels (card_id, label_id) VALUES 
('550e8400-e29b-41d4-a716-44665544000c', '550e8400-e29b-41d4-a716-446655440006'),
('550e8400-e29b-41d4-a716-44665544000d', '550e8400-e29b-41d4-a716-446655440007'),
('550e8400-e29b-41d4-a716-44665544000e', '550e8400-e29b-41d4-a716-446655440007');

-- Link cards to users
INSERT INTO card_members (card_id, user_id) VALUES 
('550e8400-e29b-41d4-a716-44665544000c', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-44665544000d', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-44665544000e', '550e8400-e29b-41d4-a716-446655440000');
