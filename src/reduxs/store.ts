import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import { authReducer } from './reducers/authReducer';
import { cartReducer } from './reducers/cartReducer';

const store = configureStore({
    reducer: {
        authReducer,
        cartReducer,
    },
});

export default store
