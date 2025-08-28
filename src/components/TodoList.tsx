import { useState, useRef, useEffect } from 'react';
import { useTodoStore } from '../store';
import { TodoItem } from './TodoItem';

type Filter = 'all' | 'active' | 'completed';
type Sort = 'created' | 'due' | 'priority';

export function TodoList() {
  const todos = useTodoStore((s) => s.todos);
  const completeSelected = useTodoStore((s) => s.completeSelected);
  const removeSelected = useTodoStore((s) => s.removeSelected);
  const clearSelection = useTodoStore((s) => s.clearSelection);
  const lastDeleted = useTodoStore((s) => s.lastDeleted);
  const undoRemove = useTodoStore((s) => s.undoRemove);

  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('created');
  const [tag, setTag] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const tags = Array.from(new Set(todos.flatMap((t) => t.tags)));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = todos
    .filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter((t) => {
      const text = `${t.title} ${t.description}`.toLowerCase();
      return text.includes(search.toLowerCase());
    })
    .filter((t) => (tag ? t.tags.includes(tag) : true))
    .sort((a, b) => {
      if (sort === 'created') return a.createdAt.localeCompare(b.createdAt);
      if (sort === 'due') return (a.dueDate || '').localeCompare(b.dueDate || '');
      if (sort === 'priority') {
        const order: Record<string, number> = { low: 0, medium: 1, high: 2 };
        return order[a.priority] - order[b.priority];
      }
      return 0;
    });

  return (
    <div>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <input
        ref={searchRef}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="search todo"
      />
      <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
        <option value="created">Created</option>
        <option value="due">Due Date</option>
        <option value="priority">Priority</option>
      </select>
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">All Tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <div>
        {filtered.length === 0 ? (
          <p>No todos</p>
        ) : (
          filtered.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
      <div>
        <button onClick={completeSelected}>Complete Selected</button>
        <button onClick={removeSelected}>Delete Selected</button>
        <button onClick={clearSelection}>Clear Selection</button>
      </div>
      {lastDeleted && (
        <div role="alert">
          <span>Todo deleted.</span>
          <button onClick={undoRemove}>Undo</button>
        </div>
      )}
    </div>
  );
}
