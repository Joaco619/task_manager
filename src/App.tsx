import { useState } from 'react';
import {
    DndContext,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { useTasks } from './hooks/useTasks';
import { TaskInput } from './components/TaskInput';
import { FilterPanel } from './components/FilterPanel';
import { CategoryColumn } from './components/CategoryColumn';
import { TaskCard } from './components/TaskCard';
import { Task } from './types';
import './App.css';

function App() {
    const {
        categories,
        filters,
        tasksByCategory,
        addTask,
        deleteTask,
        toggleTaskStatus,
        moveTask,
        updateFilters,
        resetFilters,
        filteredTasks,
    } = useTasks();

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const task = filteredTasks.find((t) => t.id === event.active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeTaskId = active.id as string;
        const overCategoryId = over.id as string;

        // Check if we're dragging over a different category
        const activeTask = filteredTasks.find((t) => t.id === activeTaskId);
        if (activeTask && activeTask.categoryId !== overCategoryId) {
            // Check if over id is a valid category
            const isOverCategory = categories.some((cat) => cat.id === overCategoryId);
            if (isOverCategory) {
                moveTask(activeTaskId, overCategoryId);
            }
        }
    };

    const handleDragEnd = () => {
        setActiveTask(null);
    };

    const handleEditTask = (task: Task) => {
        // For now, we'll just log - you can implement a modal here
        console.log('Edit task:', task);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="app">
                <motion.header
                    className="app-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="app-title gradient-text">Gestor de Tareas</h1>
                    <p className="app-subtitle">
                        Organiza tu día con estilo <FontAwesomeIcon icon={faWandMagicSparkles} />
                    </p>
                </motion.header>

                <main className="app-main">
                    <aside className="app-sidebar">
                        <FilterPanel
                            filters={filters}
                            onUpdateFilters={updateFilters}
                            onReset={resetFilters}
                        />
                    </aside>

                    <div className="app-content">
                        <TaskInput categories={categories} onAdd={addTask} />

                        <div className="app-columns">
                            {categories.map((category) => (
                                <CategoryColumn
                                    key={category.id}
                                    category={category}
                                    tasks={tasksByCategory.get(category.id) || []}
                                    onToggleTask={toggleTaskStatus}
                                    onEditTask={handleEditTask}
                                    onDeleteTask={deleteTask}
                                />
                            ))}
                        </div>
                    </div>
                </main>

                <DragOverlay>
                    {activeTask ? (
                        <div style={{ cursor: 'grabbing' }}>
                            <TaskCard
                                task={activeTask}
                                onToggle={() => { }}
                                onEdit={() => { }}
                                onDelete={() => { }}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}

export default App;
