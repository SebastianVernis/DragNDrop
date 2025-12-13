/**
 * Type definitions for the DragNDrop HTML Editor
 */

// Base types
export interface ElementStyle {
  [key: string]: string | number | undefined;
}

export interface ElementAttributes {
  [key: string]: string | number | boolean | undefined;
}

// Component types
export interface ComponentDefinition {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  icon: string;
  defaultProps: ElementStyle;
  allowedChildren?: string[];
  isContainer?: boolean;
}

export type ComponentCategory = 
  | 'layout' 
  | 'text' 
  | 'media' 
  | 'forms' 
  | 'ui' 
  | 'advanced';

// Element tree structure
export interface ElementNode {
  id: string;
  type: string;
  tagName: string;
  textContent?: string;
  innerHTML?: string;
  style: ElementStyle;
  attributes: ElementAttributes;
  children: ElementNode[];
  parent?: string;
}

// Project types
export interface Project {
  id?: number;
  name: string;
  description?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  elementsTree?: ElementNode[];
  canvasSettings?: CanvasSettings;
  templateId?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  status?: ProjectStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface CanvasSettings {
  width: string;
  height: string;
  responsive: boolean;
  viewMode: ViewMode;
  backgroundColor?: string;
  padding?: string;
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

// Template types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  elementsTree?: ElementNode[];
  canvasSettings?: CanvasSettings;
  previewUrl?: string;
}

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
}

// API types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  detail?: string;
  statusCode: number;
}

// Editor state types
export interface EditorState {
  selectedElement: ElementNode | null;
  draggedComponentType: string | null;
  currentProject: Project | null;
  canvasSettings: CanvasSettings;
  isLoading: boolean;
  error: string | null;
}

// Property editor types
export interface PropertySection {
  id: string;
  name: string;
  properties: PropertyDefinition[];
  collapsed?: boolean;
}

export interface PropertyDefinition {
  key: string;
  label: string;
  type: PropertyType;
  defaultValue?: any;
  options?: PropertyOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  description?: string;
}

export type PropertyType = 
  | 'text' 
  | 'number' 
  | 'color' 
  | 'select' 
  | 'checkbox' 
  | 'range' 
  | 'textarea'
  | 'url'
  | 'file';

export interface PropertyOption {
  value: string | number;
  label: string;
}

// Event types
export interface DragEvent extends Event {
  dataTransfer: DataTransfer | null;
}

export interface DropEvent extends DragEvent {
  target: HTMLElement;
}

// Export types
export interface ExportOptions {
  format: 'html' | 'zip' | 'json';
  includeAssets: boolean;
  minify: boolean;
  inlineStyles: boolean;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Constants
export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  'layout',
  'text', 
  'media',
  'forms',
  'ui',
  'advanced'
];

export const VIEW_MODES: ViewMode[] = ['desktop', 'tablet', 'mobile'];

export const PROJECT_STATUSES: ProjectStatus[] = ['draft', 'published', 'archived'];