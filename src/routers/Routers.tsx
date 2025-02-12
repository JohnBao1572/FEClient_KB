
import HeaderComponent from '@/components/HeaderComponent';
import { usePathname } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Layout, Spin } from 'antd';
import { useRouter } from 'next/router';
import { addAuth, authSelector } from '@/reduxs/reducers/authReducer';
import { localDataNames } from '@/constants/appInfos';
import handleAPI from '@/apis/handleAPI';
import { syncProducts } from '@/reduxs/reducers/cartReducer';

const Routers = ({ Component, pageProps }: any) => {
	const [isLoading, setIsLoading] = useState(false);

	const path = usePathname();
	const dispatch = useDispatch();
	const auth = useSelector(authSelector);
	const router = useRouter();

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		getDatabaseDatas();
	}, [auth]);

	useEffect(() => {
		if (auth.accesstoken && path.includes('/auth')) {
			router.push('/');
		}
	}, [auth, path]);

	const getData = async () => {
		const res = localStorage.getItem(localDataNames.authData);
		res && dispatch(addAuth(JSON.parse(res)));
	};

	const getDatabaseDatas = async () => {
		setIsLoading(true);
		try {
			if (auth._id) {
				await getCardInDatabase();
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getCardInDatabase = async () => {
		const api = `/carts`;
		try {
			const res = await handleAPI({ url: api });

			if (res.data && res.data.data.length > 0) {
				dispatch(syncProducts(res.data.data));
			}
		} catch (error) {}
	};

	return isLoading ? (
		<Spin />
	) : path.includes('/auth') ? (
		<Layout className='bg-white'>
			<Component pageProps={pageProps} />
		</Layout>
	) : (
		<Layout className='bg-white'>
			<HeaderComponent />
			<Component pageProps={pageProps} />
		</Layout>
	);
};

export default Routers;
