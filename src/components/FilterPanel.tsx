import { FC } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FilterState, Priority, SortOption } from '../types';
import './FilterPanel.css';

interface FilterPanelProps {
    filters: FilterState;
    onUpdateFilters: (updates: Partial<FilterState>) => void;
    onReset: () => void;
}

const priorityOptions: { value: Priority; label: string }[] = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' },
];

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'createdAt-desc', label: 'Más recientes' },
    { value: 'createdAt-asc', label: 'Más antiguas' },
    { value: 'priority-desc', label: 'Mayor prioridad' },
    { value: 'priority-asc', label: 'Menor prioridad' },
    { value: 'title-asc', label: 'A-Z' },
    { value: 'title-desc', label: 'Z-A' },
];

export const FilterPanel: FC<FilterPanelProps> = ({
    filters,
    onUpdateFilters,
    onReset,
}) => {
    const togglePriority = (priority: Priority) => {
        const newPriorities = filters.selectedPriorities.includes(priority)
            ? filters.selectedPriorities.filter((p) => p !== priority)
            : [...filters.selectedPriorities, priority];
        onUpdateFilters({ selectedPriorities: newPriorities });
    };

    const hasActiveFilters =
        filters.searchQuery ||
        filters.selectedPriorities.length > 0 ||
        !filters.showCompleted;

    return (
        <motion.div
            className="filter-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="filter-header">
                <div className="filter-header-title">
                    <FontAwesomeIcon icon={faSlidersH} />
                    <h2>Filtros</h2>
                </div>
                {hasActiveFilters && (
                    <button className="filter-reset-btn" onClick={onReset}>
                        Limpiar
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="filter-section">
                <label className="filter-label">Buscar</label>
                <div className="filter-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        type="text"
                        placeholder="Buscar tareas..."
                        value={filters.searchQuery}
                        onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
                    />
                    {filters.searchQuery && (
                        <button
                            className="filter-search-clear"
                            onClick={() => onUpdateFilters({ searchQuery: '' })}
                            aria-label="Limpiar búsqueda"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    )}
                </div>
            </div>



            {/* Priorities */}
            <div className="filter-section">
                <label className="filter-label">Prioridad</label>
                <div className="filter-chips">
                    {priorityOptions.map((option) => (
                        <button
                            key={option.value}
                            className={`filter-chip ${filters.selectedPriorities.includes(option.value) ? 'active' : ''
                                }`}
                            onClick={() => togglePriority(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Show Completed */}
            <div className="filter-section">
                <label className="filter-checkbox">
                    <input
                        type="checkbox"
                        checked={filters.showCompleted}
                        onChange={(e) => onUpdateFilters({ showCompleted: e.target.checked })}
                    />
                    <span>Mostrar completadas</span>
                </label>
            </div>

            {/* Sort */}
            <div className="filter-section">
                <label className="filter-label" htmlFor="sort-select">
                    Ordenar por
                </label>
                <select
                    id="sort-select"
                    className="filter-select"
                    value={filters.sortBy}
                    onChange={(e) => onUpdateFilters({ sortBy: e.target.value as SortOption })}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </motion.div>
    );
};
