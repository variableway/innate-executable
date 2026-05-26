export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  tags: string[];
  content?: TutorialSection[];
  executableBlocks?: ExecutableBlock[];
  author?: string;
  createdAt: string;
  updatedAt: string;
  source?: 'builtin' | 'local' | 'imported';
  localPath?: string;
}

export interface TutorialSection {
  id: string;
  type: 'text' | 'code' | 'executable' | 'image' | 'video';
  content: string;
  language?: string;
  executable?: boolean;
}

export interface ExecutableBlock {
  id: string;
  code: string;
  language: 'bash' | 'powershell' | 'python' | 'javascript';
  platform?: ('macos' | 'windows' | 'linux')[];
  workingDirectory?: string;
  environment?: Record<string, string>;
  expectedOutput?: string;
}

export interface SeriesTutorial {
  slug: string;
  order: number;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  icon?: string;
  color?: string;
  tutorials: SeriesTutorial[];
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Progress {
  tutorialId: string;
  completed: boolean;
  lastSection?: string;
  completedSections: string[];
  startedAt?: string;
  completedAt?: string;
}

export type TerminalPosition = 'hidden' | 'right' | 'bottom';

export type TerminalEntry =
  | { type: 'command'; text: string }
  | { type: 'stdout'; text: string }
  | { type: 'stderr'; text: string }
  | { type: 'system'; text: string };

// Workspace types
export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  size?: number;
  modifiedAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  path: string;           // root folder path
  createdAt: string;
  updatedAt: string;
}
