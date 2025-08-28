import { useState } from 'react';
import type { Todo } from '../types';
import { useTodoStore } from '../store';
import { TodoForm } from './TodoForm';

interface Props {
  todo: Todo;
}

export function TodoItem({ todo }: Props) {
  const toggle = useTodoStore((s) => s.toggle);
  const remove = useTodoStore((s) => s.remove);
  const toggleSelect = useTodoStore((s) => s.toggleSelect);
  const isSelected = useTodoStore((s) => s.selected.has(todo.id));
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <TodoForm
        id={todo.id}
        initial={todo}
        onSubmit={() => setEditing(false)}
      />
    );
  }

  return (
    <div>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleSelect(todo.id)}
        aria-label="select todo"
      />
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggle(todo.id)}
        aria-label="toggle complete"
      />
      <span>{todo.title}</span>
      {todo.dueDate && <span> (due: {todo.dueDate})</span>}
      <span> [{todo.priority}]</span>
      {todo.tags.length > 0 && <span> {todo.tags.join(', ')}</span>}
      <button onClick={() => setEditing(true)}>Edit</button>
      <button onClick={() => remove(todo.id)}>Delete</button>
    </div>
  );
}
