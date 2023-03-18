import React, { useEffect } from "react";
import Loading from "./Loading";
import { useSelector, useDispatch } from "react-redux";
import { selectFilteredTodos, getTodosAsync, toggleTodoAsync, removeTodoAsync } from "../redux/todos/todosSlice";
import Error from "./Error";

const TodoList = () => {
  const dispatch = useDispatch()

  const filteredTodos = useSelector(selectFilteredTodos)

  const isLoading = useSelector((state) => state.todos.isLoading)
  const error = useSelector((state) => state.todos.error)

  useEffect(() => {
    dispatch(getTodosAsync())
  }, [dispatch])

  const handleDestroy = async (id) => {
    if(window.confirm('Are you sure?')){
      await dispatch(removeTodoAsync(id))
    }
  }

  const handleToggle = async (id, completed) => {
    await dispatch(toggleTodoAsync({ id, data: { completed } }))
  }

  if (isLoading){
    return <Loading />
  }

  if (error){
    return <Error message={error} />
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((item) => (
        <li key={item.id} className={item.completed ? 'completed' : ''}>
          <div className="view">
            <input 
              className="toggle" 
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggle(item.id, !item.completed)}
             />
            <label>{item.title}</label>
            <button 
              className="destroy"
              //onClick={() => dispatch(destroy(item.id))}
              onClick={() => handleDestroy(item.id)}
            ></button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
