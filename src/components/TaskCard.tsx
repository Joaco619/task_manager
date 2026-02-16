import { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faPencil, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Task, Priority } from '../types';
import './TaskCard.css';

interface TaskCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const priorityConfig: Record<Priority, { label: string; color: string }> = {
    low: { label: 'Baja', color: 'var(--priority-low)' },
    medium: { label: 'Media', color: 'var(--priority-medium)' },
    high: { label: 'Alta', color: 'var(--priority-high)' },
    urgent: { label: 'Urgente', color: 'var(--priority-urgent)' },
};

export const TaskCard: FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const priority = priorityConfig[task.priority];

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
        >
            <div className="task-card-drag-handle" {...attributes} {...listeners}>
                <FontAwesomeIcon icon={faGripVertical} />
            </div>

            <div className="task-card-content">
                <div className="task-card-header">
                    <button
                        className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
                        onClick={() => onToggle(task.id)}
                        aria-label={task.status === 'completed' ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                        {task.status === 'completed' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            >
                                <FontAwesomeIcon icon={faCheck} size="xs" />
                            </motion.div>
                        )}
                    </button>

                    <div className="task-card-info">
                        <h3 className="task-title">{task.title}</h3>
                        {task.description && <p className="task-description">{task.description}</p>}
                    </div>
                </div>

                <div className="task-card-footer">
                    <span className="task-priority-badge" style={{ backgroundColor: priority.color }}>
                        {priority.label}
                    </span>

                    <div className="task-actions">
                        <button
                            className="task-action-btn"
                            onClick={() => onEdit(task)}
                            aria-label="Editar tarea"
                        >
                            <FontAwesomeIcon icon={faPencil} />
                        </button>
                        <button
                            className="task-action-btn task-action-delete"
                            onClick={() => onDelete(task.id)}
                            aria-label="Eliminar tarea"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
