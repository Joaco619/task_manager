import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Category, Priority, Task } from '../types';
import './TaskInput.css';

interface TaskInputProps {
    categories: Category[];
    onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const TaskInput: FC<TaskInputProps> = ({ categories, onAdd }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
    const [priority, setPriority] = useState<Priority>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        onAdd({
            title: title.trim(),
            description: description.trim(),
            categoryId,
            priority,
            status: 'pending',
        });

        // Reset form
        setTitle('');
        setDescription('');
        setPriority('medium');
        setIsExpanded(false);
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setIsExpanded(false);
    };

    return (
        <motion.div className="task-input-container">
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.button
                        key="add-button"
                        className="task-input-trigger"
                        onClick={() => setIsExpanded(true)}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Agregar nueva tarea</span>
                    </motion.button>
                ) : (
                    <motion.form
                        key="form"
                        className="task-input-form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="task-input-header">
                            <h3>Nueva Tarea</h3>
                            <button
                                type="button"
                                className="task-input-close"
                                onClick={handleCancel}
                                aria-label="Cerrar"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <input
                            type="text"
                            className="task-input-field"
                            placeholder="Título de la tarea"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                            required
                        />

                        <textarea
                            className="task-input-field task-input-textarea"
                            placeholder="Descripción (opcional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />

                        <div className="task-input-row">
                            <div className="task-input-group">
                                <label htmlFor="category">Categoría</label>
                                <select
                                    id="category"
                                    className="task-input-select"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="task-input-group">
                                <label htmlFor="priority">Prioridad</label>
                                <select
                                    id="priority"
                                    className="task-input-select"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Priority)}
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                    <option value="urgent">Urgente</option>
                                </select>
                            </div>
                        </div>

                        <div className="task-input-actions">
                            <button
                                type="button"
                                className="task-input-btn task-input-btn-cancel"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="task-input-btn task-input-btn-submit"
                                disabled={!title.trim()}
                            >
                                Crear Tarea
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
