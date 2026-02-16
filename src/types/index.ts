export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'completed';

export interface Task {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    priority: Priority;
    status: TaskStatus;
    createdAt: number;
    completedAt?: number;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
}

export interface FilterState {
    searchQuery: string;
    selectedCategories: string[];
    selectedPriorities: Priority[];
    showCompleted: boolean;
    sortBy: SortOption;
}

export type SortOption =
    | 'createdAt-desc'
    | 'createdAt-asc'
    | 'priority-desc'
    | 'priority-asc'
    | 'title-asc'
    | 'title-desc';

export const priorityOrder: Record<Priority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
};
