import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: ''
};

const userSlice = createSlice({
    name: 'user', // 여기에 state 데이터가 저장됩니다 호출시 state.user.userId로 호출
    initialState,
    reducers: {
        updateUser : (state, action) => {
            state.userId = action.payload;
        },
        resetUser : (state) => {
            state.userId = initialState.userId;
        }
    },
});

export const { updateUser } = userSlice.actions;
export const { resetUser } = userSlice.actions;

export default userSlice.reducer;