import { configureStore, createSlice } from '@reduxjs/toolkit'

let suserName = createSlice({
    name: 'userName',
    initialState: 'kim'
})

let suserPoint = createSlice({
    name: 'userPoint',
    initialState: -5
})

export default configureStore({
    reducer: {
        suserName : suserName.reducer,
        suserPoint : suserPoint.reducer
    }
})