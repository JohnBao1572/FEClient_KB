
import { createSlice } from "@reduxjs/toolkit";
import { StringLiteral } from "typescript";
import { localDataName } from "../../constants/appInfos";


// export interface AuthState {
//     token: string;
//     _id: string;
//     name: string;
//     rule: number;
// };

// const initialState = {
//     token: '',
//     _id: '',
//     name: '',
//     rule: 0
// };

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
