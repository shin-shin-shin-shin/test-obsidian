import { useState } from 'react';
import { useTodoStore } from '../store';
import type { Priority } from '../types';

interface Props {
  id?: string;
  initial?: {
    title: string;
    description?: string;
    dueDate?: string;
    priority: Priority;
    tags: string[];
  };
  onSubmit?: () => void;
}

export function TodoForm({ id, initial, onSubmit }: Props) {
  const add = useTodoStore((s) => s.add);
  const update = useTodoStore((s) => s.update);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium');
  const [tags, setTags] = useState((initial?.tags ?? []).join(','));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
      dueDate,
      priority,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (id) {
      update(id, data);
      onSubmit?.();
    } else {
      add(data);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setTags('');
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="todo form">
      <label>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Due Date
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </label>
      <label>
        Priority
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label>
        Tags
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tag1,tag2"
        />
      </label>
      <button type="submit">{id ? 'Update' : 'Add'}</button>
    </form>
  );
}
