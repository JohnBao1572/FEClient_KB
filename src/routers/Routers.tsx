import React, { useEffect, useState } from 'react'
import MainRouter from './MainRouter'
import { useDispatch, useSelector } from 'react-redux'
import { addAuth, authSelector, AuthState } from '../reduxs/reducers/authReducer'
import { localDataName } from '../constants/appInfos'
import { Layout, Spin } from 'antd'
import AuthRouter from './AuthRouter'
import type { AppProps } from 'next/app'
import { usePathname } from 'next/navigation'


const { Content, Footer, Header } = Layout

const Routers = ({ Component, pageProps }: any) => {

  const [isloading, setIsLoading] = useState(false);

  const auth: AuthState = useSelector(authSelector);
  const dispatch = useDispatch();

  const path = usePathname();
  console.log(path);

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    // const res = localStorage.getItem(localDataName.authData);
    // res && dispatch(addAuth(JSON.parse(res)));
  }

  // Nếu chưa có auth.token thì sẽ vào hàm Auth còn có thì vào hàm Main
  return isloading ? (<Spin />) : path && path.includes('auth') ? (
    // Chưa đăng nhập thì vào đây
    <Layout className='bg-white'>
      <Content>
        <Component pageProps={pageProps} />
      </Content>
    </Layout>
  ) : (
    // Đăng nhập rồi thì vào đây
    <Layout className='bg-white'>
      <Header />
      <Content>
        <Component pageProps={pageProps} />
      </Content>
      <Footer />
    </Layout>
  )
}

export default Routers

