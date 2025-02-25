/** @format */


import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HomePage from './HomePage';
import { appInfo } from '@/constants/appInfos';
import Login from './auth/login';

import { Empty, Skeleton } from 'antd';
import { PromotionModel } from '@/models/PromotionModels';
import { CategoyModel, ProductModel } from '@/models/Product';
import handleAPI from '@/apis/handleAPI';

const Home = (data: any) => {
	const pageProps = data.pageProps;

	const [promotions, setPromotions] = useState<PromotionModel[]>([]);
	const [categories, setCategories] = useState<CategoyModel[]>([]);
	const [bestSellers, setBestSellers] = useState<ProductModel[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getDatas();
	}, []);

	const getDatas = async () => {
		setIsLoading(true);
		try {
			await getPromotions();
			await getCategories();
			await getProducts();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getPromotions = async () => {
		const res = await handleAPI({ url: `/promotions/get-promotions?limit=5` });

		res && res.data && res.data.data && setPromotions(res.data.data);
	};

	const getCategories = async () => {
		const res = await handleAPI({ url: `/products/get-categories` });
		res && res.data && res.data.data && setCategories(res.data.data);
	};

	const getProducts = async () => {
		const res = await handleAPI({ url: `/products/get-best-seller` });
		res && res.data && res.data.data && setBestSellers(res.data.data);
	};

	return isLoading ? (
		<Skeleton />
	) : (
		<HomePage
			promotions={promotions}
			categories={categories}
			bestSellers={bestSellers}
		/>
	);
};

export default Home;

export const getStaticProps = async () => {
  try {
      const res = await fetch(`${appInfo.baseUrl}/promotions/get-promotions?limit=5`);
      const result = await res.json();

      const resCats = await fetch(`${appInfo.baseUrl}/products/get-categories`);
      const resultCats = await resCats.json();

      const resBestSeller = await fetch(
          `${appInfo.baseUrl}/products/get-best-seller`
      );
      const resultsSeller = await resBestSeller.json();

      return {
          props: {
              promotions: result.data || null,
              categories: resultCats.data || null,
              bestSellers: resultsSeller.data || null,
          },
      };
  } catch (error) {
      return {
          props: {
              promotions: null,
              categories: null,
              bestSellers: null,
          },
      };
  }
};
