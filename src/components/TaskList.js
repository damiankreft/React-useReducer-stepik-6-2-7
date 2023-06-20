import React, { useReducer } from 'react';
import tasksData from '../data/tasks-data.json';
import { v4 } from 'uuid';

function createInitialState() {
  const initialTodos = tasksData;

  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    }
    case 'added_todo': {
      return {
        draft: '',
        todos: [
          {
            id: v4(),
            name: state.draft,
            isDone: false,
          },
          ...state.todos,
        ],
      };
    }
    case 'item_updated': {
      return {
        draft: '',
        todos: state.todos,
      };
    }
    case 'item_removed': {
      return {
        draft: '',
        todos: state.todos.filter((t) => t.id != action.itemId),
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TaskList() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  return (
    <>
      <input
        value={state.draft}
        onChange={(e) => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value,
          });
        }}
      />
      <button
        onClick={() => {
          dispatch({ type: 'added_todo' });
        }}
      >
        Dodaj
      </button>
      <ul>
        {state.todos.map((item) => (
          <li
            key={item.id}
            style={{ textDecoration: item.isDone ? 'line-through' : 'none' }}
          >
            {item.name}

            <br />
            <button
              onClick={(e) => {
                item.isDone = !item.isDone;
                dispatch({ type: 'item_updated' });
              }}
            >
              {item.isDone ? 'Oznacz jako niezrobione' : 'Oznacz jako zrobione'}
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'item_removed', itemId: item.id });
              }}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
