// store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice from './store/reducers/userReducer';
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({
    user: userSlice
});

const persistConfig = {
    key : 'root',
    storage,
    // whitelist: ['user']
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {
            serializableCheck: {
                ignoredActions: [FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
            }
        }
    )
});

export default store;
