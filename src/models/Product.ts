

export interface CategoyModel {
    _id: string;
    title: string;
    parentId: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
	image?: string;
    _v: number;
}

export interface ProductModel {
	_id: string;
	title: string;
	slug: string;
	description: string;
	categories: string[];
	images: string[];
	supplier: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	isDeleted: boolean;
	subItems: SubProductModel[];
	price: number[];
}

export interface SubProductModel {
	size: string;
	color: string;
	price: number;
	qty: number;
	productId: string;
	images: any[];
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	discount?: number;
	imgURL?: string;
	count: number;
	createdBy: string;
}