import handleAPI from '@/apis/handleAPI'
import HeadComponents from '@/components/HeadComponents'
import HeaderComponent from '@/components/HeaderComponent'
import { authSelector } from '@/reduxs/reducers/authReducer'
import { Button } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// import Login from './auth/login';

const HomePage = () => {
  const [promotions, setPromotions] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const auth = useSelector(authSelector);

  useEffect(() => {
    data();
  }, [])

  // Nếu cảm thấy bị lặp nhiều (tryCatch) quá thì có thể tạo nó một biến riêng rồi dùng nhiều lần (Không pk viết lại nhiều)
  const data = async () => {
    setIsLoading(true);

    try {
      await getCategories();
      await getPromotions();
    } catch (error: any) {

    } finally {
      setIsLoading(false);
    }
  }

  const getPromotions = async () => {
    const api = `/promotions/get-promotions`;

    const res = await handleAPI({ url: api });
    console.log(res);

    setPromotions(res.data.data);
  }

  const getCategories = async () => {
    const api = `/products/get-categories`;

    const res = await handleAPI({ url: api });
    console.log(res)
  }

  return (
    <>
      <HeadComponents title='BaoThanh Fashion'/>
      <div className="container">
        <div className="row">
          <div className="col">
            <Button onClick={getCategories}>lay danh muc</Button>
            <Button onClick={getPromotions}>lay danh </Button>
          </div>
        </div>
      </div>
    </>

  )
}

export default HomePage
