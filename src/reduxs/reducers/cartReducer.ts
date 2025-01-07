
import { createSlice } from "@reduxjs/toolkit";
import { StringLiteral } from "typescript";
import { localDataName } from "../../constants/appInfos";
import { SubProductModel } from "@/models/Product";

const innitState: SubProductModel[] = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        data: innitState,
    },
    reducers: {
        addProduct: (state, action) => {
            const items: SubProductModel[] = [...state.data];
            const item = action.payload;

            const index = items.findIndex((element) => element._id === item._id);

            if(index !== -1){
                items[index].count += item.count;
            } else{
                items.push(item)
            }

            state.data = items
        },
    },
});

export const cartReducer = cartSlice.reducer;
export const { addProduct } = cartSlice.actions;

export const cartSelector = (state:any) => state.cartReducer.data;
