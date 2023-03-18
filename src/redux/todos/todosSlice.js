import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

export const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
        activeFilter: 'all',
        addNewTodo : {
            isLoading: false,
            error: null,
        }
    },
    reducers: {
        changeActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
        }, 
        clearCompleted: (state) => {
            const filtered = state.items.filter(item => item.completed === false)
            state.items = filtered;
        }
    },
    extraReducers: {
        // get todos
        [getTodosAsync.pending]: (state, action) => { // ilk istek başladığında
            state.isLoading = true
        },
        [getTodosAsync.fulfilled]: (state, action) => { // işlem başarılı olduğunda
            state.items = action.payload;
            state.isLoading = false
        },
        [getTodosAsync.rejected]: (state, action) => { // hata olduğunda
            state.isLoading = false;
            state.error = action.error.message;
        },
        // add todo
        [addTodoAsync.pending]: (state, action) => {
            state.addNewTodo.isLoading = true
        },
        [addTodoAsync.fulfilled]: (state, action) => {
            state.items.push(action.payload)
            state.addNewTodo.isLoading = false
        },
        [addTodoAsync.rejected]: (state, action) => { // hata olduğunda
            state.addNewTodo.isLoading = false;
            state.addNewTodo.error = action.error.message;
        },
        // toggle todo
        [toggleTodoAsync.fulfilled]: (state, action) => {
            const { id, completed } = action.payload;
            const index = state.items.findIndex((item) => item.id === id);
            state.items[index].completed = completed
        },
        // remove todo
        [removeTodoAsync.fulfilled]: (state, action) => {
            // 1. yol
            // const id = action.payload;
            // const filtered = state.items.filter((item) => item.id !== id)
            // state.items = filtered
            /////////////////////////
            // 2. yol
            const id = action.payload;
            const index = state.items.findIndex((item) => item.id === id);
            state.items.splice(index, 1);
        }
    }
})

export const selectTodos = (state) => state.todos.items;

export const selectFilteredTodos = (state) => {
    if (state.todos.activeFilter === 'all'){
        return state.todos.items;
    }

    return state.todos.items.filter((todo) => 
     state.todos.activeFilter === 'active' 
     ? todo.completed === false 
     : todo.completed === true
    )
}

export const selectActiveFilter = (state) => state.todos.activeFilter;

export const { changeActiveFilter, clearCompleted } = todosSlice.actions
export default todosSlice.reducer;