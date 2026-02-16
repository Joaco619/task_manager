import { Category, Task } from '../types';

export const defaultCategories: Category[] = [
    {
        id: 'personal',
        name: 'Personal',
        color: '#6366f1',
        icon: 'User',
    },
    {
        id: 'work',
        name: 'Trabajo',
        color: '#8b5cf6',
        icon: 'Briefcase',
    },
    {
        id: 'urgent',
        name: 'Urgente',
        color: '#ef4444',
        icon: 'AlertCircle',
    },
    {
        id: 'ideas',
        name: 'Ideas',
        color: '#ec4899',
        icon: 'Lightbulb',
    },
];

export const defaultTasks: Task[] = [
    {
        id: '1',
        title: 'Revisar emails',
        description: 'Responder emails importantes del día',
        categoryId: 'work',
        priority: 'high',
        status: 'pending',
        createdAt: Date.now() - 3600000,
    },
    {
        id: '2',
        title: 'Comprar víveres',
        description: 'Lista: leche, pan, frutas, verduras',
        categoryId: 'personal',
        priority: 'medium',
        status: 'pending',
        createdAt: Date.now() - 7200000,
    },
    {
        id: '3',
        title: 'Llamar al cliente',
        description: 'Seguimiento del proyecto en curso',
        categoryId: 'urgent',
        priority: 'urgent',
        status: 'pending',
        createdAt: Date.now() - 1800000,
    },
    {
        id: '4',
        title: 'Nueva feature: Dark mode',
        description: 'Implementar modo oscuro en la aplicación',
        categoryId: 'ideas',
        priority: 'low',
        status: 'pending',
        createdAt: Date.now() - 86400000,
    },
    {
        id: '5',
        title: 'Hacer ejercicio',
        description: '30 minutos de cardio',
        categoryId: 'personal',
        priority: 'medium',
        status: 'completed',
        createdAt: Date.now() - 172800000,
        completedAt: Date.now() - 86400000,
    },
];
