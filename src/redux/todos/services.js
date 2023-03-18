import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// list todo
export const getTodosAsync = createAsyncThunk('/todos/getTodosAsync', async () => {
    const res = await axios(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`);
    return res.data;
   // return await res.json();
})

// add todo
export const addTodoAsync = createAsyncThunk('todos/addTodoAsync', async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`, data);
    return res.data;
})

// update todo
export const toggleTodoAsync = createAsyncThunk('toggle/addTodoAsync', async ({ id, data }) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`, data);
    return res.data;
})

// delete todo
export const removeTodoAsync = createAsyncThunk('remove/addTodoAsync', async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`);
    return id;
})