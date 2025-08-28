import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Todo } from './types';

interface TodoState {
  todos: Todo[];
  selected: Set<string>;
  lastDeleted: Todo | null;
  add: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  update: (id: string, todo: Partial<Omit<Todo, 'id'>>) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  undoRemove: () => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  completeSelected: () => void;
  removeSelected: () => void;
}

function toISO(date: Date = new Date()) {
  return date.toISOString();
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      selected: new Set(),
      lastDeleted: null,
      add: (data) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...data,
              id: nanoid(),
              completed: false,
              createdAt: toISO(),
              updatedAt: toISO(),
            },
          ],
        })),
      update: (id, data) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: toISO() } : t
          ),
        })),
      toggle: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id
              ? { ...t, completed: !t.completed, updatedAt: toISO() }
              : t
          ),
        })),
      remove: (id) =>
        set((state) => {
          const removed = state.todos.find((t) => t.id === id) || null;
          window.setTimeout(() => set({ lastDeleted: null }), 5000);
          return {
            todos: state.todos.filter((t) => t.id !== id),
            selected: new Set([...state.selected].filter((s) => s !== id)),
            lastDeleted: removed,
          };
        }),
      undoRemove: () =>
        set((state) =>
          state.lastDeleted
            ? {
                todos: [...state.todos, state.lastDeleted],
                lastDeleted: null,
              }
            : {}
        ),
      toggleSelect: (id) =>
        set((state) => {
          const selected = new Set(state.selected);
          selected.has(id) ? selected.delete(id) : selected.add(id);
          return { selected };
        }),
      clearSelection: () => set({ selected: new Set() }),
      completeSelected: () =>
        set((state) => ({
          todos: state.todos.map((t) =>
            state.selected.has(t.id) ? { ...t, completed: true } : t
          ),
          selected: new Set(),
        })),
      removeSelected: () =>
        set((state) => ({
          todos: state.todos.filter((t) => !state.selected.has(t.id)),
          selected: new Set(),
        })),
    }),
    {
      name: 'todo-store',
      partialize: (state) => ({ todos: state.todos, selected: state.selected }),
      serialize: {
        replacer: (_key, value) => (value instanceof Set ? [...value] : value),
        reviver: (key, value) => (key === 'selected' ? new Set(value) : value),
      },
    }
  )
);
