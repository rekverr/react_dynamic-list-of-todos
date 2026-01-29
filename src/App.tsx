/* eslint-disable max-len */
import React, { useEffect } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { activeTodos, completedTodos, getTodos, getUser } from './api';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('All');
  const [postId, setPostId] = React.useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (status === 'active') {
      activeTodos()
        .then(todosFromServer => {
          setTodos(todosFromServer);
        })
        .finally(() => setIsLoading(false));
    } else if (status === 'completed') {
      completedTodos()
        .then(todosFromServer => {
          setTodos(todosFromServer);
        })
        .finally(() => setIsLoading(false));
    } else {
      getTodos()
        .then(todosFromServer => {
          setTodos(todosFromServer);
        })
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                setStatus={setStatus}
                setQuery={setQuery}
                query={query}
              />
            </div>

            <div className="block">
              {isLoading ? (
                <Loader />
              ) : (
                <TodoList postId={postId} todos={filteredTodos} setPostId={setPostId} />
              )}
            </div>
          </div>
        </div>
      </div>

      {postId !== null && (
        <TodoModal
          postId={postId}
          onClose={() => setPostId(null)}
          todos={todos}
        />
      )}
    </>
  );
};
