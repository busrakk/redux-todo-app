import React, { useState } from "react";
import Loading from "./Loading"
import Error from "./Error"

import { useDispatch, useSelector } from "react-redux";
import { addTodoAsync } from "../redux/todos/todosSlice";

const Form = () => {

  const [title, setTitle] = useState('')
  const isLoading = useSelector(state => state.todos.addNewTodoIsLoading)
  const error = useSelector((state) => state.todos.addNewTodoError)

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {

    if(!title) return;

    e.preventDefault()

    // asenkron işlem olduğu için bekletmek gerekiyor
    await dispatch(addTodoAsync({ title }))

    setTitle('') // form içini boşaltma
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
      <input
        disabled={isLoading}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
      />
      { isLoading && <Loading />}
      { error && <Error message={error} /> }
    </form>
  );
};

export default Form;
