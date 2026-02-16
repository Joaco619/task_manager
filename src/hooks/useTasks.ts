import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Task, Category, FilterState, priorityOrder } from '../types';
import { defaultCategories, defaultTasks } from '../data/initialData';

export function useTasks() {
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', defaultTasks);
    const [categories, setCategories] = useLocalStorage<Category[]>('categories', defaultCategories);
    const [filters, setFilters] = useLocalStorage<FilterState>('filters', {
        searchQuery: '',
        selectedCategories: [],
        selectedPriorities: [],
        showCompleted: true,
        sortBy: 'createdAt-desc',
    });

    // Task CRUD operations
    const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
        const newTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const toggleTaskStatus = (id: string) => {
        setTasks((prev) =>
            prev.map((task) => {
                if (task.id === id) {
                    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                    return {
                        ...task,
                        status: newStatus,
                        completedAt: newStatus === 'completed' ? Date.now() : undefined,
                    };
                }
                return task;
            })
        );
    };

    const moveTask = (taskId: string, newCategoryId: string) => {
        updateTask(taskId, { categoryId: newCategoryId });
    };

    // Category CRUD operations
    const addCategory = (category: Omit<Category, 'id'>) => {
        const newCategory: Category = {
            ...category,
            id: crypto.randomUUID(),
        };
        setCategories((prev) => [...prev, newCategory]);
    };

    const updateCategory = (id: string, updates: Partial<Category>) => {
        setCategories((prev) =>
            prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
        );
    };

    const deleteCategory = (id: string) => {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        // Move tasks from deleted category to the first available category
        if (categories.length > 1) {
            const remainingCategory = categories.find((cat) => cat.id !== id);
            if (remainingCategory) {
                setTasks((prev) =>
                    prev.map((task) =>
                        task.categoryId === id ? { ...task, categoryId: remainingCategory.id } : task
                    )
                );
            }
        }
    };

    // Filter operations
    const updateFilters = (updates: Partial<FilterState>) => {
        setFilters((prev) => ({ ...prev, ...updates }));
    };

    const resetFilters = () => {
        setFilters({
            searchQuery: '',
            selectedCategories: [],
            selectedPriorities: [],
            showCompleted: true,
            sortBy: 'createdAt-desc',
        });
    };

    // Filtered and sorted tasks
    const filteredTasks = useMemo(() => {
        let result = [...tasks];

        // Filter by search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(
                (task) =>
                    task.title.toLowerCase().includes(query) ||
                    task.description.toLowerCase().includes(query)
            );
        }

        // Filter by categories
        if (filters.selectedCategories.length > 0) {
            result = result.filter((task) => filters.selectedCategories.includes(task.categoryId));
        }

        // Filter by priorities
        if (filters.selectedPriorities.length > 0) {
            result = result.filter((task) => filters.selectedPriorities.includes(task.priority));
        }

        // Filter by status
        if (!filters.showCompleted) {
            result = result.filter((task) => task.status === 'pending');
        }

        // Sort tasks
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case 'createdAt-desc':
                    return b.createdAt - a.createdAt;
                case 'createdAt-asc':
                    return a.createdAt - b.createdAt;
                case 'priority-desc':
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'priority-asc':
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        return result;
    }, [tasks, filters]);

    // Group tasks by category
    const tasksByCategory = useMemo(() => {
        const grouped = new Map<string, Task[]>();

        categories.forEach((category) => {
            grouped.set(category.id, []);
        });

        filteredTasks.forEach((task) => {
            const categoryTasks = grouped.get(task.categoryId) || [];
            categoryTasks.push(task);
            grouped.set(task.categoryId, categoryTasks);
        });

        return grouped;
    }, [filteredTasks, categories]);

    return {
        tasks,
        categories,
        filters,
        filteredTasks,
        tasksByCategory,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        moveTask,
        addCategory,
        updateCategory,
        deleteCategory,
        updateFilters,
        resetFilters,
    };
}
