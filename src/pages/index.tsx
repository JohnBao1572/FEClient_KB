import handleAPI from '@/apis/handleAPI'
import HeaderComponent from '@/components/HeaderComponent'
import { authSelector } from '@/reduxs/reducers/authReducer'
import { Button } from 'antd'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
// import Login from './auth/login';

const HomePage = () => {
  const auth = useSelector(authSelector);

  useEffect(() =>{
    getCategories();
  }, [])

  const getCategories = async () =>{
    const api = `/products//get-categories`;
    
    try {
      const res = await handleAPI({url: api});

      console.log(res.data.data);
    } catch (error) {
      
    }
  }

  return(
    <div className="row">
      <div className="col">
        <Button onClick={getCategories}>lay danh muc</Button>
      </div>
    </div>
  )
}

export default HomePage
