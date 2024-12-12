import React, { useEffect, useState } from 'react'
import MainRouter from './MainRouter'
import { useDispatch, useSelector } from 'react-redux'
import { addAuth, authSelector } from '../reduxs/reducers/authReducer'
import { localDataName } from '../constants/appInfos'
import { Layout, Spin } from 'antd'
import AuthRouter from './AuthRouter'
import type { AppProps } from 'next/app'
import { usePathname } from 'next/navigation'
import HeaderComponent from '@/components/HeaderComponent'


const { Content, Footer, Header } = Layout

const Routers = ({ Component, pageProps }: any) => {

  const [isloading, setIsLoading] = useState(false);

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  const path = usePathname();
  console.log(path);

  useEffect(() => {
    getData();
  }, []);

  

  const getData = async () => {
    const res = localStorage.getItem(localDataName.authData);
    res && dispatch(addAuth(JSON.parse(res)));
  }

  const renderContent = (
    <Content>
      <Component pageProps= {pageProps}/>
    </Content>
  )

  // Nếu chưa có auth.token thì sẽ vào hàm Auth còn có thì vào hàm Main
  return isloading ? (<Spin />) : path && path.includes('auth') ? (
    // Chưa đăng nhập thì vào đây
    <Layout className='bg-white'>
      {renderContent}
    </Layout>
  ) : (
    // Đăng nhập rồi thì vào đây
    <Layout className='bg-white'>
      <HeaderComponent />
      {renderContent}
      <Footer />
    </Layout>
  )
}

export default Routers

