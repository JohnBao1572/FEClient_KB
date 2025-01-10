
import { createSlice } from "@reduxjs/toolkit";
import { StringLiteral } from "typescript";
import { localDataName } from "../../constants/appInfos";
import { SubProductModel } from "@/models/Product";
import handleAPI from "@/apis/handleAPI";

export interface CartItemModel{
    createdBy: string;
	count: number;
	subProductId: string;
	size: string;
	color: string;
	price: number;
	qty: number;
	title: string;
	productId: string;
	image: string;
	_id: string;
}

const innitState: CartItemModel[] = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        data: innitState,
    },
    reducers: {
        addProduct: (state, action) => {
            const items: CartItemModel[] = [...state.data];
            const item = action.payload;

            const index = items.findIndex((element) => element._id === item._id);

            if (index !== -1) {
                items[index].count = items[index].count + item.count;
            } else {
                items.push(item)
            }

            state.data = items
        },

        // Đồng bộ giỏ hàng của người dùng đã có auth và thêm sản phẩm vào giỏ hàng trc đó
        syncProducts: (state, action) =>{
            state.data = action.payload;
        },

        removeProduct:(state, action) =>{
            const items = [...state.data];
            const item = action.payload;

            const index = items.findIndex(element => element._id === item._id);
            if(index !== -1){
                items.splice(index, 1);
            }

            state.data = items;
        }
    },
});

export const cartReducer = cartSlice.reducer;
export const { addProduct, syncProducts, removeProduct } = cartSlice.actions;

export const cartSelector = (state: any) => state.cartReducer.data;


