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

export const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
        activeFilter: 'all',
        addNewTodoIsLoading: false,
        addNewTodoError: null,
    },
    reducers: {
        toggle: (state, action) => {
            const {id} = action.payload;
            const item = state.items.find(item => item.id === id)
            item.completed = !item.completed
        },
        destroy: (state, action) => {
            const id = action.payload;
            const filtered = state.items.filter((item) => item.id !== id);
            state.items = filtered;
        },
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
            state.addNewTodoIsLoading = true
        },
        [addTodoAsync.fulfilled]: (state, action) => {
            state.items.push(action.payload)
            state.addNewTodoIsLoading = false
        },
        [addTodoAsync.rejected]: (state, action) => { // hata olduğunda
            state.addNewTodoIsLoading = false;
            state.addNewTodoError = action.error.message;
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

export const { toggle, destroy, changeActiveFilter, clearCompleted } = todosSlice.actions
export default todosSlice.reducer;