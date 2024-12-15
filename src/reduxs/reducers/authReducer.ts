
import { createSlice } from "@reduxjs/toolkit";
import { StringLiteral } from "typescript";
import { localDataName } from "../../constants/appInfos";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: {
            accesstoken:'',
            _id: '',
        }
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload;
            
        },

        removeAuth: (state, _action) => {
            state.data = {
                accesstoken: '',
                _id: '',
            };
           
        },

    },
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;

export const authSelector = (state:any) => state.authReducer.data;
