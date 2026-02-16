import { FC } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcase, faCircleExclamation, faLightbulb, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Category, Task } from '../types';
import { TaskCard } from './TaskCard';
import './CategoryColumn.css';

// Icon mapping for categories
const iconMap: Record<string, any> = {
    User: faUser,
    Briefcase: faBriefcase,
    AlertCircle: faCircleExclamation,
    Lightbulb: faLightbulb,
    Circle: faCircle,
};

interface CategoryColumnProps {
    category: Category;
    tasks: Task[];
    onToggleTask: (id: string) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
}

export const CategoryColumn: FC<CategoryColumnProps> = ({
    category,
    tasks,
    onToggleTask,
    onEditTask,
    onDeleteTask,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: category.id,
    });

    // Get icon from mapping
    const categoryIcon = iconMap[category.icon] || iconMap.Circle;

    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;

    return (
        <motion.div
            className="category-column"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="category-header" style={{ borderColor: category.color }}>
                <div className="category-header-content">
                    <div className="category-icon" style={{ color: category.color }}>
                        <FontAwesomeIcon icon={categoryIcon} />
                    </div>
                    <h2 className="category-title">{category.name}</h2>
                </div>
                <div className="category-count">
                    <span className="count-pending">{pendingCount}</span>
                    {completedCount > 0 && (
                        <span className="count-completed">+{completedCount}</span>
                    )}
                </div>
            </div>

            <div
                ref={setNodeRef}
                className={`category-tasks ${isOver ? 'drag-over' : ''}`}
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.length === 0 ? (
                        <div className="category-empty">
                            <p>No hay tareas</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={onToggleTask}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                            />
                        ))
                    )}
                </SortableContext>
            </div>
        </motion.div>
    );
};
